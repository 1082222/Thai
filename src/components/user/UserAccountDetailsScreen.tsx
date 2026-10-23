import React, { useState } from 'react';
import { User, BankAccountDetails } from '../../types';
import { storage, maskAccountNumber } from '../../services/storage';
import { 
  Building2, 
  User as UserIcon, 
  CreditCard, 
  Hash, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  PlusCircle,
  Star,
  Check,
  Info,
  X
} from 'lucide-react';

interface UserAccountDetailsScreenProps {
  user: User;
  onAccountUpdated: (user: User) => void;
}

export const UserAccountDetailsScreen: React.FC<UserAccountDetailsScreenProps> = ({
  user,
  onAccountUpdated,
}) => {
  const accounts: BankAccountDetails[] = user.bankAccounts && user.bankAccounts.length > 0 
    ? user.bankAccounts 
    : (user.accountDetails?.accountNumber 
        ? [{
            id: user.accountDetails.id || 'acc_primary_1',
            accountHolderName: user.accountDetails.accountHolderName || user.fullName,
            bankName: user.accountDetails.bankName,
            accountNumber: user.accountDetails.accountNumber,
            ifscCode: user.accountDetails.ifscCode || 'N/A',
            isPrimary: true,
            createdAt: user.accountDetails.createdAt || user.accountDetails.updatedAt,
            updatedAt: user.accountDetails.updatedAt,
          }]
        : []);

  // Form states
  const [showAddForm, setShowAddForm] = useState(accounts.length === 0);
  const [accountHolderName, setAccountHolderName] = useState(user.fullName || '');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [agreeLocked, setAgreeLocked] = useState(false);

  // Card view state: map of accountId -> boolean (to reveal/mask account number)
  const [revealedAccounts, setRevealedAccounts] = useState<Record<string, boolean>>({});

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [settingPrimaryId, setSettingPrimaryId] = useState<string | null>(null);

  const toggleReveal = (id: string) => {
    setRevealedAccounts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const cleanHolder = accountHolderName.trim();
    const cleanBank = bankName.trim();
    const cleanAcc = accountNumber.trim();
    const cleanConfirm = confirmAccountNumber.trim();
    const cleanIfsc = ifscCode.trim();

    if (!cleanHolder) {
      setMessage({ type: 'error', text: 'Please enter the Account Holder Name.' });
      return;
    }
    if (!cleanBank) {
      setMessage({ type: 'error', text: 'Please enter the Bank Name.' });
      return;
    }
    if (!cleanAcc || cleanAcc.length < 5) {
      setMessage({ type: 'error', text: 'Please enter a valid Account Number / IBAN (minimum 5 digits).' });
      return;
    }
    if (cleanAcc !== cleanConfirm) {
      setMessage({ type: 'error', text: 'Account numbers do not match. Please verify and re-enter.' });
      return;
    }
    if (!agreeLocked) {
      setMessage({ type: 'error', text: 'Please check the box confirming you understand bank details cannot be changed once submitted.' });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = storage.addBankAccount(user.id, {
        accountHolderName: cleanHolder,
        bankName: cleanBank,
        accountNumber: cleanAcc,
        ifscCode: cleanIfsc || 'N/A',
      });

      setLoading(false);

      if (res.success && res.user) {
        setMessage({ 
          type: 'success', 
          text: `Bank account for ${cleanBank} added successfully and secured with anti-fraud lock!` 
        });
        onAccountUpdated(res.user);
        // Reset form
        setBankName('');
        setAccountNumber('');
        setConfirmAccountNumber('');
        setIfscCode('');
        setAgreeLocked(false);
        setShowAddForm(false);
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to add bank account details.' });
      }
    }, 400);
  };

  const handleSetPrimary = (accountId: string) => {
    setMessage(null);
    setSettingPrimaryId(accountId);

    setTimeout(() => {
      const res = storage.setPrimaryBankAccount(user.id, accountId);
      setSettingPrimaryId(null);
      if (res.success && res.user) {
        setMessage({ type: 'success', text: 'Primary payout bank account updated successfully!' });
        onAccountUpdated(res.user);
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to update primary account.' });
      }
    }, 300);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#032242] via-[#094d82] to-[#032242] text-white rounded-3xl p-6 shadow-xl border-2 border-sky-400/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-950/60 flex items-center justify-center text-sky-300 border border-sky-500/40 shadow-inner">
              <Building2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-sky-200">
                BENEFICIARY ACCOUNTS
              </p>
              <h2 className="text-xl font-black text-white tracking-tight">
                My Bank Accounts
              </h2>
            </div>
          </div>
          <span className="text-xs font-bold text-sky-100 bg-sky-950/70 px-3.5 py-1.5 rounded-full border border-sky-500/40 shadow-xs">
            {accounts.length} {accounts.length === 1 ? 'Account' : 'Accounts'} Linked
          </span>
        </div>
      </div>

      {/* Prominent Security & Anti-Fraud Notice */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 text-white rounded-3xl p-5 border-2 border-amber-500/40 shadow-lg relative overflow-hidden">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5">
            <Lock className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <h4 className="font-black text-amber-300 uppercase tracking-wide text-xs">
                IMMUTABLE BANK ACCOUNT POLICY
              </h4>
              <span className="px-2 py-0.5 bg-amber-400/20 text-amber-200 rounded font-black text-[10px] uppercase border border-amber-400/30">
                LOCKED FOR SECURITY
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed text-[11px] sm:text-xs">
              For your fund protection and anti-fraud compliance, <strong className="text-white font-black underline decoration-amber-400">once a bank account is added, its details cannot be changed or edited</strong>. You can link multiple bank accounts to your profile and designate which one receives your withdrawal payouts.
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Messages */}
      {message && (
        <div className={`p-4 rounded-2xl border-2 flex items-center gap-3 text-xs font-bold animate-in fade-in ${
          message.type === 'success'
            ? 'bg-sky-50 border-sky-300 text-sky-900'
            : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-sky-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span className="flex-1">{message.text}</span>
          <button 
            type="button" 
            onClick={() => setMessage(null)}
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Linked Bank Accounts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-sky-700" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              LINKED BENEFICIARY ACCOUNTS ({accounts.length})
            </h3>
          </div>
          {!showAddForm && (
            <button
              type="button"
              onClick={() => {
                setShowAddForm(true);
                setMessage(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-black shadow-sm transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Another Account</span>
            </button>
          )}
        </div>

        {accounts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-sky-300 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto border border-sky-200">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-base">No Bank Account Linked</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Link your bank account to enable instant and secure withdrawal requests of your winnings.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Your First Bank Account</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.map((acc, index) => {
              const accId = acc.id || `acc_${index}`;
              const isRevealed = !!revealedAccounts[accId];
              const isPrimary = !!acc.isPrimary || (accounts.length === 1 && index === 0);

              return (
                <div 
                  key={accId}
                  className={`rounded-3xl p-5 sm:p-6 text-white shadow-lg border-2 transition-all relative overflow-hidden ${
                    isPrimary 
                      ? 'bg-gradient-to-br from-[#032242] via-[#094d82] to-[#032242] border-sky-400/50 ring-2 ring-sky-500/20' 
                      : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/60'
                  }`}
                >
                  {/* Top card header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isPrimary ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40' : 'bg-white/10 text-slate-300'
                      }`}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-black text-white text-sm sm:text-base leading-tight">
                          {acc.bankName}
                        </h4>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          Linked Bank Account
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isPrimary ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400 text-slate-950 rounded-full font-black text-[10px] uppercase shadow-xs">
                          <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
                          PRIMARY PAYOUT
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={settingPrimaryId === accId}
                          onClick={() => handleSetPrimary(accId)}
                          className="px-2.5 py-1 bg-white/10 hover:bg-sky-600 text-white rounded-full font-bold text-[10px] transition-colors flex items-center gap-1 border border-white/20 cursor-pointer"
                        >
                          <Star className="w-3 h-3" />
                          <span>{settingPrimaryId === accId ? 'Setting...' : 'Set as Primary'}</span>
                        </button>
                      )}

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-400/20 text-amber-300 rounded font-black text-[10px] uppercase border border-amber-400/30">
                        <Lock className="w-2.5 h-2.5" />
                        LOCKED
                      </span>
                    </div>
                  </div>

                  {/* Card Content Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                    <div>
                      <span className="text-white/60 block text-[10px] uppercase font-bold">
                        Account Holder
                      </span>
                      <span className="font-black text-white text-sm">
                        {acc.accountHolderName}
                      </span>
                    </div>

                    <div>
                      <span className="text-white/60 block text-[10px] uppercase font-bold">
                        IFSC / Branch Code
                      </span>
                      <span className="font-mono font-bold text-white text-sm">
                        {acc.ifscCode || 'N/A'}
                      </span>
                    </div>

                    {/* Account Number Box */}
                    <div className="col-span-2 bg-black/40 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-white/60 block text-[10px] uppercase font-bold">
                          Account Number / IBAN
                        </span>
                        <span className="font-mono font-black text-base text-amber-300 tracking-wider">
                          {isRevealed ? acc.accountNumber : maskAccountNumber(acc.accountNumber)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleReveal(accId)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors cursor-pointer"
                        title={isRevealed ? 'Mask Number' : 'Reveal Number'}
                      >
                        {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Security Lock Footnote */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-white/70">
                    <span className="flex items-center gap-1 font-semibold text-amber-200/90">
                      <Lock className="w-3 h-3 text-amber-400" />
                      Details are permanently locked & cannot be edited
                    </span>
                    {acc.createdAt && (
                      <span className="text-white/40">
                        Added: {new Date(acc.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add New Bank Account Form */}
      {showAddForm && (
        <form 
          onSubmit={handleAddAccount}
          className="bg-white rounded-3xl p-6 shadow-xl border-2 border-sky-500/40 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  LINK NEW BANK ACCOUNT
                </h3>
                <p className="text-[11px] text-slate-500">
                  Enter bank details carefully. Once saved, details cannot be changed.
                </p>
              </div>
            </div>
            {accounts.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Account Holder Name */}
          <div className="space-y-1">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              ACCOUNT HOLDER FULL NAME *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                placeholder="e.g. Ahmed Al-Harbi"
                className="w-full pl-10 pr-3.5 py-3 bg-sky-50/40 text-slate-900 font-bold text-sm rounded-xl border-2 border-sky-200 focus:border-sky-600 outline-none"
                required
              />
            </div>
          </div>

          {/* Bank Name */}
          <div className="space-y-1">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              BANK NAME *
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. Al Rajhi Bank, Emirates NBD, Bank Muscat"
                className="w-full pl-10 pr-3.5 py-3 bg-sky-50/40 text-slate-900 font-bold text-sm rounded-xl border-2 border-sky-200 focus:border-sky-600 outline-none"
                required
              />
            </div>
          </div>

          {/* Account Number / IBAN */}
          <div className="space-y-1">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              ACCOUNT NUMBER / IBAN *
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. SA8080000123456789012345"
                className="w-full pl-10 pr-3.5 py-3 bg-sky-50/40 text-slate-900 font-mono font-bold text-sm rounded-xl border-2 border-sky-200 focus:border-sky-600 outline-none"
                required
              />
            </div>
          </div>

          {/* Confirm Account Number */}
          <div className="space-y-1">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              RE-ENTER ACCOUNT NUMBER / IBAN *
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={confirmAccountNumber}
                onChange={(e) => setConfirmAccountNumber(e.target.value)}
                placeholder="Re-enter to confirm exact account number"
                className={`w-full pl-10 pr-3.5 py-3 bg-sky-50/40 text-slate-900 font-mono font-bold text-sm rounded-xl border-2 outline-none ${
                  confirmAccountNumber && confirmAccountNumber !== accountNumber 
                    ? 'border-rose-400 focus:border-rose-600' 
                    : confirmAccountNumber && confirmAccountNumber === accountNumber
                    ? 'border-sky-500 focus:border-sky-600'
                    : 'border-sky-200 focus:border-sky-600'
                }`}
                required
              />
            </div>
            {confirmAccountNumber && confirmAccountNumber !== accountNumber && (
              <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Account numbers do not match.
              </p>
            )}
            {confirmAccountNumber && confirmAccountNumber === accountNumber && (
              <p className="text-[11px] text-sky-600 font-bold flex items-center gap-1 mt-1">
                <Check className="w-3.5 h-3.5" />
                Account numbers match!
              </p>
            )}
          </div>

          {/* IFSC / Branch / SWIFT Code */}
          <div className="space-y-1">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              IFSC / BRANCH / SWIFT CODE
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                placeholder="e.g. RJHI0001 / NBOK0001 (Optional)"
                className="w-full pl-10 pr-3.5 py-3 bg-sky-50/40 text-slate-900 font-mono font-bold text-sm rounded-xl border-2 border-sky-200 focus:border-sky-600 outline-none"
              />
            </div>
          </div>

          {/* Security & Immutability Confirmation Checkbox */}
          <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeLocked}
                onChange={(e) => setAgreeLocked(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 mt-0.5 cursor-pointer"
              />
              <span className="text-xs text-slate-800 font-medium leading-relaxed">
                <strong className="text-amber-950 font-bold block">
                  I verify that these bank details are 100% correct.
                </strong>
                I understand that for anti-fraud security, <span className="underline decoration-amber-500 font-bold">these bank details cannot be edited or modified</span> once submitted.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {accounts.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="w-1/3 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !agreeLocked}
              className={`flex-1 py-4 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                !agreeLocked || loading
                  ? 'bg-slate-400 cursor-not-allowed opacity-75'
                  : 'bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 hover:from-sky-500 hover:to-sky-700 shadow-sky-900/20'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'LOCKING & SAVING...' : 'SECURELY SAVE BANK ACCOUNT'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Security Guarantee Banner */}
      <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 flex items-center gap-3 text-xs text-sky-900">
        <ShieldCheck className="w-5 h-5 text-sky-700 flex-shrink-0" />
        <span className="leading-relaxed">
          All linked bank accounts are stored with AES-standard cryptographic protection on your secure offline database. Withdrawals are processed exclusively to your verified accounts.
        </span>
      </div>
    </div>
  );
};
