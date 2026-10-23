import React, { useState } from 'react';
import { User, GameEntry, WithdrawalRequest } from '../../types';
import { formatCurrency, getCountryByCode } from '../../data/countries';
import { storage, maskAccountNumber } from '../../services/storage';
import { 
  Users, 
  Search, 
  Wallet, 
  Plus, 
  Minus, 
  Edit3, 
  Building2, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Check, 
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface AdminUsersScreenProps {
  users: User[];
  entries: GameEntry[];
  withdrawals: WithdrawalRequest[];
  onDataRefresh: () => void;
}

export const AdminUsersScreen: React.FC<AdminUsersScreenProps> = ({
  users,
  entries,
  withdrawals,
  onDataRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  
  // Wallet Adjust Modal State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalAction, setModalAction] = useState<'ADD' | 'DEDUCT' | 'SET'>('ADD');
  const [adjustAmount, setAdjustAmount] = useState<number | string>('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // User detail inspection modal
  const [inspectUser, setInspectUser] = useState<User | null>(null);

  const filteredUsers = users.filter((u) => {
    if (selectedCountry !== 'ALL' && u.countryCode !== selectedCountry) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = u.fullName.toLowerCase().includes(q);
      const matchMobile = u.mobileNumber.toLowerCase().includes(q);
      const matchId = u.id.toLowerCase().includes(q);
      if (!matchName && !matchMobile && !matchId) return false;
    }
    return true;
  });

  const handleOpenAdjustModal = (user: User, action: 'ADD' | 'DEDUCT' | 'SET') => {
    setSelectedUser(user);
    setModalAction(action);
    setAdjustAmount(action === 'SET' ? user.walletBalance : 100);
    setReason(
      action === 'ADD'
        ? 'Manual Deposit by Admin'
        : action === 'DEDUCT'
        ? 'Manual Deduction by Admin'
        : 'Balance Correction by Admin'
    );
    setModalError(null);
  };

  const handleSaveBalanceAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setModalError(null);

    const val = Number(adjustAmount);
    if (isNaN(val) || (modalAction !== 'SET' && val <= 0) || (modalAction === 'SET' && val < 0)) {
      setModalError('Please enter a valid amount');
      return;
    }

    if (modalAction === 'DEDUCT' && val > selectedUser.walletBalance) {
      setModalError(`Cannot deduct more than user's balance (${formatCurrency(selectedUser.walletBalance, selectedUser.currency)})`);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      let res;
      if (modalAction === 'ADD') {
        res = storage.adminAdjustWallet(selectedUser.id, val, 'ADD', reason || 'Admin Add Balance');
      } else if (modalAction === 'DEDUCT') {
        res = storage.adminAdjustWallet(selectedUser.id, val, 'DEDUCT', reason || 'Admin Deduct Balance');
      } else {
        res = storage.adminAdjustWallet(selectedUser.id, val, 'SET', reason || 'Admin Set Balance');
      }

      setLoading(false);

      if (res.success) {
        setSelectedUser(null);
        onDataRefresh();
      } else {
        setModalError(res.error || 'Failed to adjust balance');
      }
    }, 300);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#032242] via-[#094d82] to-[#032242] text-white rounded-3xl p-6 shadow-xl border-2 border-sky-400/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-950/70 border border-sky-500/40 flex items-center justify-center text-sky-300">
              <Users className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-sky-200">
                MEMBER MANAGEMENT
              </p>
              <h2 className="text-xl font-black text-white tracking-tight">
                Registered Users ({users.length})
              </h2>
            </div>
          </div>
          <span className="text-xs font-bold text-sky-200 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-500/40">
            5 Countries
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border-2 border-sky-500/20 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-sky-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name or Mobile Number..."
              className="w-full pl-10 pr-3.5 py-2.5 bg-sky-50/40 text-slate-900 font-bold text-xs rounded-xl border border-sky-200 focus:border-sky-600 outline-none"
            />
          </div>

          <div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-sky-50/40 text-slate-900 font-bold text-xs rounded-xl border border-sky-200 focus:border-sky-600 outline-none"
            >
              <option value="ALL">All Countries</option>
              <option value="SA">🇸🇦 Saudi Arabia (SAR)</option>
              <option value="KW">🇰🇼 Kuwait (KWD)</option>
              <option value="OM">🇴🇲 Oman (OMR)</option>
              <option value="BH">🇧🇭 Bahrain (BHD)</option>
              <option value="AE">🇦🇪 Dubai / UAE (AED)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border-2 border-sky-500/20 text-slate-500 text-xs">
            No registered users match your search criteria.
          </div>
        ) : (
          filteredUsers.map((user) => {
            const country = getCountryByCode(user.countryCode);
            const userEntries = entries.filter((e) => e.userId === user.id);
            const userWins = userEntries.filter((e) => e.status === 'WINNER');
            const totalWon = userWins.reduce((sum, e) => sum + e.actualWinning, 0);

            return (
              <div
                key={user.id}
                className="bg-white rounded-3xl p-5 border-2 border-sky-500/20 shadow-sm hover:shadow-md transition-shadow space-y-3"
              >
                {/* User Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-sky-700 text-white font-black text-lg flex items-center justify-center shadow-xs">
                      {user.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-slate-900 text-base">
                          {user.fullName}
                        </h3>
                        {user.role === 'ADMIN' && (
                          <span className="px-2 py-0.5 bg-amber-400 text-amber-950 font-black text-[10px] rounded-full">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{country.flag}</span>
                        <span>{user.mobileNumber}</span>
                        <span>•</span>
                        <span className="font-bold text-sky-800">{user.country} ({user.currency})</span>
                      </p>
                    </div>
                  </div>

                  {/* Wallet Balance Display (Requirement #28 & #3) */}
                  <div className="text-left sm:text-right bg-sky-50/70 p-2.5 rounded-2xl border border-sky-200/80">
                    <span className="text-[10px] font-black uppercase text-sky-700 block">
                      WALLET BALANCE
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      {formatCurrency(user.walletBalance, user.currency)}
                    </span>
                  </div>
                </div>

                {/* Badges & Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">Tickets</span>
                    <span className="font-black text-slate-900">{userEntries.length} Entries</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">Total Won</span>
                    <span className="font-black text-amber-600">{formatCurrency(totalWon, user.currency)}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">Bank Accounts</span>
                    <span className="font-bold text-slate-800 truncate block text-[11px]">
                      {user.bankAccounts && user.bankAccounts.length > 0 
                        ? `✅ ${user.bankAccounts.length} Accs (${user.accountDetails?.bankName || user.bankAccounts[0].bankName})`
                        : user.accountDetails?.bankName 
                        ? `✅ ${user.accountDetails.bankName}` 
                        : '❌ Not Set'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">Documents</span>
                    <span className={`font-bold ${user.documentStatus === 'UPDATED' ? 'text-sky-700' : 'text-amber-700'}`}>
                      {user.documentStatus === 'UPDATED' ? 'UPDATED ✅' : 'NOT UPDATED ⚠️'}
                    </span>
                  </div>
                </div>

                {/* Admin Actions Row (Requirement #3: Add, Deduct, Edit Balance) */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setInspectUser(user)}
                    className="text-xs font-bold text-sky-800 hover:text-sky-950 flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Bank & Docs</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenAdjustModal(user, 'ADD')}
                      className="py-1.5 px-3 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Balance</span>
                    </button>
                    <button
                      onClick={() => handleOpenAdjustModal(user, 'DEDUCT')}
                      className="py-1.5 px-3 bg-slate-700 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                      <span>Deduct</span>
                    </button>
                    <button
                      onClick={() => handleOpenAdjustModal(user, 'SET')}
                      className="py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Set Exact</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Adjust Balance Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-2 border-sky-500/40 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-sky-700 block">
                  WALLET ADJUSTMENT
                </span>
                <h3 className="font-black text-slate-900 text-lg">
                  {modalAction === 'ADD' ? '➕ Add Balance' : modalAction === 'DEDUCT' ? '➖ Deduct Balance' : '✏️ Set Exact Balance'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target User Info */}
            <div className="bg-sky-50/60 p-3 rounded-2xl border border-sky-200/80 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900">{selectedUser.fullName}</span>
                <span className="font-black text-sky-800">{selectedUser.currency}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 mt-1">
                <span>Current Balance:</span>
                <span className="font-black text-slate-900">
                  {formatCurrency(selectedUser.walletBalance, selectedUser.currency)}
                </span>
              </div>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-800">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveBalanceAdjustment} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase">
                  {modalAction === 'SET' ? 'NEW WALLET BALANCE' : 'AMOUNT TO ' + modalAction} ({selectedUser.currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 bg-sky-50/40 text-slate-900 font-black text-xl rounded-xl border-2 border-sky-300 focus:border-sky-600 outline-none mt-1"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase">
                  REASON / AUDIT NOTE
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Deposit confirmation / VIP bonus"
                  className="w-full px-3.5 py-2.5 bg-sky-50/40 text-slate-900 font-bold text-xs rounded-xl border border-sky-200 focus:border-sky-600 outline-none mt-1"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 py-3 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Confirm Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect User Modal */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border-2 border-sky-500/40 space-y-4 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-600" />
                <h3 className="font-black text-slate-900 text-base">
                  {inspectUser.fullName} - Account & Docs
                </h3>
              </div>
              <button
                onClick={() => setInspectUser(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bank Details */}
            <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-200 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-sky-200/60 pb-2">
                <h4 className="font-black text-slate-900 uppercase">
                  Linked Bank Accounts ({inspectUser.bankAccounts?.length || (inspectUser.accountDetails?.accountNumber ? 1 : 0)})
                </h4>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                  🔒 Locked Records
                </span>
              </div>

              {inspectUser.bankAccounts && inspectUser.bankAccounts.length > 0 ? (
                <div className="space-y-2.5">
                  {inspectUser.bankAccounts.map((acc, i) => (
                    <div key={acc.id || i} className="bg-white p-3 rounded-xl border border-sky-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900">{acc.bankName}</span>
                        {acc.isPrimary && (
                          <span className="px-1.5 py-0.5 bg-amber-400 text-slate-950 font-extrabold text-[9px] rounded uppercase">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block font-bold text-[9px]">HOLDER</span>
                          <span className="font-bold text-slate-800">{acc.accountHolderName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold text-[9px]">IFSC / CODE</span>
                          <span className="font-mono font-bold text-slate-800">{acc.ifscCode || 'N/A'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block font-bold text-[9px]">ACCOUNT NUMBER / IBAN</span>
                          <span className="font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded block">
                            {acc.accountNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : inspectUser.accountDetails?.accountNumber ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">ACCOUNT HOLDER</span>
                    <span className="font-extrabold text-slate-900">{inspectUser.accountDetails.accountHolderName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">BANK NAME</span>
                    <span className="font-extrabold text-slate-900">{inspectUser.accountDetails.bankName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">ACCOUNT NUMBER</span>
                    <span className="font-mono font-black text-slate-900">{inspectUser.accountDetails.accountNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">IFSC / CODE</span>
                    <span className="font-mono font-black text-slate-900">{inspectUser.accountDetails.ifscCode || 'N/A'}</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 italic">No bank accounts linked yet.</p>
              )}
            </div>

            {/* Documents */}
            <div className="space-y-2 text-xs">
              <h4 className="font-black text-slate-900 uppercase">Verification Documents ({inspectUser.documents?.length || 0})</h4>
              {!inspectUser.documents || inspectUser.documents.length === 0 ? (
                <p className="text-slate-500 italic">No documents uploaded yet.</p>
              ) : (
                inspectUser.documents.map((doc) => (
                  <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-black text-slate-900">{doc.title}</p>
                      <p className="text-[10px] text-slate-500">{doc.type} • {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-bold text-[10px]">
                      Verified ✅
                    </span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setInspectUser(null)}
              className="w-full py-3 bg-sky-700 hover:bg-sky-800 text-white font-black text-xs rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
