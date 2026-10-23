import React, { useState } from 'react';
import { User, WithdrawalRequest } from '../../types';
import { formatCurrency, getCountryByCode } from '../../data/countries';
import { storage, maskAccountNumber } from '../../services/storage';
import { WithdrawalNoticeModal } from '../common/WithdrawalNoticeModal';
import { 
  ArrowDownToLine, 
  Building2, 
  Wallet, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowRight, 
  FileText,
  CreditCard,
  AlertCircle,
  Lock,
  PlusCircle,
  Check
} from 'lucide-react';

interface UserWithdrawalScreenProps {
  user: User;
  withdrawals: WithdrawalRequest[];
  onWithdrawalCreated: () => void;
  onNavigateToAccountDetails: () => void;
}

export const UserWithdrawalScreen: React.FC<UserWithdrawalScreenProps> = ({
  user,
  withdrawals,
  onWithdrawalCreated,
  onNavigateToAccountDetails,
}) => {
  const country = getCountryByCode(user.countryCode);
  const accounts = user.bankAccounts && user.bankAccounts.length > 0 
    ? user.bankAccounts 
    : (user.accountDetails?.accountNumber ? [user.accountDetails] : []);

  const [selectedAccountId, setSelectedAccountId] = useState<string>(() => {
    const primary = accounts.find((a) => a.isPrimary) || accounts[0];
    return primary?.id || '';
  });

  const activeAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0] || user.accountDetails;

  const [withdrawMode, setWithdrawMode] = useState<'FULL' | 'CUSTOM'>('FULL');
  const [customAmount, setCustomAmount] = useState<number | string>('');
  
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [submittedWithdrawal, setSubmittedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedAmount = withdrawMode === 'FULL' ? user.walletBalance : Number(customAmount) || 0;

  const handleStartWithdrawalFlow = () => {
    setError(null);
    if (!activeAccount || !activeAccount.accountNumber || !activeAccount.bankName) {
      setError('Please add and link a Bank Account before requesting a withdrawal.');
      return;
    }

    if (selectedAmount <= 0) {
      setError('Withdrawal amount must be greater than 0');
      return;
    }

    if (selectedAmount > user.walletBalance) {
      setError(`Cannot withdraw more than available balance (${formatCurrency(user.walletBalance, user.currency)})`);
      return;
    }

    // Show Important Notice Modal (Requirement #18)
    setShowNoticeModal(true);
  };

  const handleConfirmAndSubmit = () => {
    setShowNoticeModal(false);
    setLoading(true);

    setTimeout(() => {
      const res = storage.createWithdrawalRequest({
        userId: user.id,
        amount: selectedAmount,
        bankAccountId: activeAccount?.id,
      });

      setLoading(false);

      if (!res.success || !res.withdrawal) {
        setError(res.error || 'Failed to submit withdrawal request');
      } else {
        setSubmittedWithdrawal(res.withdrawal);
        onWithdrawalCreated();
      }
    }, 400);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-600 text-white font-black text-xs rounded-full shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETED ✅
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white font-black text-xs rounded-full shadow-xs">
            <Clock className="w-3.5 h-3.5" /> PROCESSING 🔄
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-600 text-white font-black text-xs rounded-full shadow-xs">
            <XCircle className="w-3.5 h-3.5" /> REJECTED ❌
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white font-black text-xs rounded-full shadow-xs">
            <Clock className="w-3.5 h-3.5" /> PENDING ⏳
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Notice Modal */}
      {showNoticeModal && (
        <WithdrawalNoticeModal
          onContinue={handleConfirmAndSubmit}
          onUpdateDetails={() => {
            setShowNoticeModal(false);
            onNavigateToAccountDetails();
          }}
          onClose={() => setShowNoticeModal(false)}
        />
      )}

      {/* Success Confirmation Card */}
      {submittedWithdrawal && (
        <div className="bg-gradient-to-br from-[#032242] via-[#094d82] to-slate-950 text-white rounded-3xl p-6 shadow-xl border-2 border-sky-400/50 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-sky-600 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-sky-300" />
              <h3 className="text-lg font-black tracking-tight">
                WITHDRAWAL REQUEST RECEIVED
              </h3>
            </div>
            <button
              onClick={() => setSubmittedWithdrawal(null)}
              className="text-xs text-sky-300 hover:text-white font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>

          <div className="bg-sky-950/60 p-4 rounded-2xl border border-sky-500/30 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-sky-300 block font-medium">Withdrawal Amount</span>
              <span className="text-xl font-black text-amber-300">
                {formatCurrency(submittedWithdrawal.amount, submittedWithdrawal.currency)}
              </span>
            </div>
            <div>
              <span className="text-sky-300 block font-medium">Destination Account</span>
              <span className="text-base font-black text-white font-mono">
                {maskAccountNumber(submittedWithdrawal.accountNumber)}
              </span>
            </div>
            <div>
              <span className="text-sky-300 block font-medium">Bank</span>
              <span className="font-bold text-white">
                {submittedWithdrawal.bankName}
              </span>
            </div>
            <div>
              <span className="text-sky-300 block font-medium">Status</span>
              <div className="mt-0.5">{getStatusBadge(submittedWithdrawal.status)}</div>
            </div>
          </div>

          <p className="text-xs text-sky-200">
            Amount has been deducted from your available balance and will be reviewed by admin.
          </p>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-[#032242] via-[#094d82] to-[#032242] text-white rounded-3xl p-6 shadow-xl border-2 border-sky-400/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-950/70 flex items-center justify-center text-sky-300 border border-sky-500/40">
              <ArrowDownToLine className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-sky-200">
                SECURE WITHDRAWAL
              </p>
              <h2 className="text-xl font-black text-white tracking-tight">
                Request Withdrawal
              </h2>
            </div>
          </div>
          <span className="text-2xl">{country.flag}</span>
        </div>

        {/* Balance Info */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-sky-600/50">
          <div className="bg-sky-950/40 p-3 rounded-2xl border border-sky-500/30">
            <span className="text-[10px] font-black uppercase text-sky-300 block">
              CURRENT WALLET BALANCE
            </span>
            <span className="text-xl font-black text-white block mt-0.5">
              {formatCurrency(user.walletBalance, user.currency)}
            </span>
          </div>

          <div className="bg-sky-950/40 p-3 rounded-2xl border border-sky-500/30">
            <span className="text-[10px] font-black uppercase text-amber-300 block">
              AVAILABLE TO WITHDRAW
            </span>
            <span className="text-xl font-black text-amber-300 block mt-0.5">
              {formatCurrency(user.walletBalance, user.currency)}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border-2 border-rose-200 text-rose-800 rounded-2xl flex items-center gap-3 text-xs font-bold animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <div className="flex-1">
            <p>{error}</p>
            {(!activeAccount?.accountNumber || !activeAccount?.bankName) && (
              <button
                type="button"
                onClick={onNavigateToAccountDetails}
                className="mt-1 text-sky-800 underline font-extrabold cursor-pointer"
              >
                Add Bank Account Details Now →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Account Details Box */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-sky-500/30 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-600" />
            <div>
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">
                PAYOUT DESTINATION ACCOUNT
              </h3>
              <p className="text-[11px] text-slate-500">
                {accounts.length > 1 ? 'Choose which verified bank account to receive your payout' : 'Verified beneficiary account'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToAccountDetails}
            className="text-xs font-extrabold text-sky-700 hover:text-sky-900 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{accounts.length > 0 ? 'Manage / Add Accounts' : 'Add Bank'}</span>
          </button>
        </div>

        {accounts.length === 0 ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-between">
            <div>
              <p className="font-bold">No Bank Account Configured</p>
              <p className="text-[11px] text-amber-700">A verified bank account is required to send your withdrawal funds.</p>
            </div>
            <button
              onClick={onNavigateToAccountDetails}
              className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl text-xs cursor-pointer"
            >
              Add Bank Now
            </button>
          </div>
        ) : accounts.length === 1 ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3 text-xs bg-sky-50/60 p-4 rounded-2xl border-2 border-sky-200/80">
              <div>
                <span className="text-slate-400 font-bold block text-[10px]">ACCOUNT HOLDER</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {accounts[0].accountHolderName || user.fullName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px]">BANK NAME</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {accounts[0].bankName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px]">ACCOUNT NUMBER</span>
                <span className="font-mono font-black text-slate-900 text-sm">
                  {maskAccountNumber(accounts[0].accountNumber)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px]">IFSC / CODE</span>
                <span className="font-mono font-black text-slate-900 text-sm">
                  {accounts[0].ifscCode || 'N/A'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-sky-800 font-semibold px-1">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Verified immutable account. Payout will be transferred directly to this account.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider">
              SELECT BENEFICIARY BANK ({accounts.length} ACCOUNTS LINKED):
            </label>
            <div className="space-y-2">
              {accounts.map((acc, idx) => {
                const accId = acc.id || `acc_${idx}`;
                const isSelected = activeAccount?.id ? activeAccount.id === accId : activeAccount?.accountNumber === acc.accountNumber;

                return (
                  <div
                    key={accId}
                    onClick={() => setSelectedAccountId(accId)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-sky-50/90 border-sky-600 shadow-sm ring-1 ring-sky-500/30'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-xs sm:text-sm">
                            {acc.bankName}
                          </span>
                          {acc.isPrimary && (
                            <span className="px-1.5 py-0.5 bg-sky-100 text-sky-800 font-extrabold text-[9px] rounded uppercase">
                              PRIMARY
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 font-bold text-[9px] rounded flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> LOCKED
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-mono font-bold text-slate-800">
                            {maskAccountNumber(acc.accountNumber)}
                          </span>
                          <span>•</span>
                          <span>{acc.accountHolderName}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      {acc.ifscCode || 'N/A'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Withdrawal Options */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
            WITHDRAWAL AMOUNT OPTION
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setWithdrawMode('FULL')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                withdrawMode === 'FULL'
                  ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-500/20'
                  : 'bg-white border-slate-200 hover:border-sky-300'
              }`}
            >
              <span className="text-xs font-black text-slate-900 block">
                WITHDRAW FULL BALANCE
              </span>
              <span className="text-lg font-black text-sky-800 block mt-1">
                {formatCurrency(user.walletBalance, user.currency)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setWithdrawMode('CUSTOM')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                withdrawMode === 'CUSTOM'
                  ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-500/20'
                  : 'bg-white border-slate-200 hover:border-sky-300'
              }`}
            >
              <span className="text-xs font-black text-slate-900 block">
                CUSTOM AMOUNT
              </span>
              <span className="text-xs font-bold text-slate-500 block mt-1">
                Enter specific sum
              </span>
            </button>
          </div>

          {withdrawMode === 'CUSTOM' && (
            <div className="space-y-1.5 animate-in fade-in pt-1">
              <label className="block text-xs font-extrabold text-slate-700 uppercase">
                ENTER CUSTOM WITHDRAWAL AMOUNT ({user.currency})
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={user.walletBalance}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder={`Max: ${user.walletBalance}`}
                  className="w-full px-4 py-3.5 bg-sky-50/40 text-slate-900 font-black text-xl rounded-2xl border-2 border-sky-300 focus:border-sky-600 outline-none"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-sky-800 font-black">
                  {user.currency}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Withdrawal Safety Overview */}
        <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs text-sky-900 space-y-1">
          <div className="flex items-center justify-between font-extrabold">
            <span>Requested Withdrawal:</span>
            <span>{formatCurrency(selectedAmount, user.currency)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Remaining Available Balance:</span>
            <span className="font-bold text-slate-900">
              {formatCurrency(Math.max(0, user.walletBalance - selectedAmount), user.currency)}
            </span>
          </div>
        </div>

        {/* Big Submit Button */}
        <button
          type="button"
          disabled={loading || selectedAmount <= 0 || selectedAmount > user.walletBalance}
          onClick={handleStartWithdrawalFlow}
          className={`w-full py-4.5 px-6 rounded-2xl font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer ${
            selectedAmount <= 0 || selectedAmount > user.walletBalance
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 hover:from-sky-500 hover:to-sky-700 text-white shadow-sky-900/30'
          }`}
        >
          <ArrowDownToLine className="w-5 h-5 stroke-[2.5]" />
          <span>
            {loading ? 'PROCESSING...' : `PROCEED WITHDRAWAL (${formatCurrency(selectedAmount, user.currency)})`}
          </span>
          <ArrowRight className="w-5 h-5 ml-1" />
        </button>
      </div>

      {/* Withdrawal History Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-sky-500/20 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Clock className="w-5 h-5 text-sky-600" />
          <span>WITHDRAWAL REQUESTS HISTORY</span>
        </h3>

        {withdrawals.length === 0 ? (
          <div className="text-center py-8 bg-sky-50/30 rounded-2xl border border-dashed border-sky-200 text-xs text-slate-500">
            No withdrawal requests submitted yet.
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-sky-50/30 hover:bg-sky-50/60 rounded-2xl border border-sky-200/60 space-y-2 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-slate-900">
                      {formatCurrency(item.amount, item.currency)}
                    </span>
                    <p className="text-[11px] font-semibold text-slate-500">
                      {item.bankName} • {maskAccountNumber(item.accountNumber)}
                    </p>
                  </div>
                  <div>{getStatusBadge(item.status)}</div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-sky-100">
                  <span>
                    Requested: {new Date(item.requestDate).toLocaleDateString()}
                  </span>
                  {item.refunded && (
                    <span className="text-sky-700 font-bold">
                      Refunded to Wallet ✅
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
