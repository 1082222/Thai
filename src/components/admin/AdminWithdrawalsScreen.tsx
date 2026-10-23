import React, { useState } from 'react';
import { WithdrawalRequest, User } from '../../types';
import { formatCurrency, getCountryByCode } from '../../data/countries';
import { storage, maskAccountNumber } from '../../services/storage';
import { 
  ArrowDownToLine, 
  Search, 
  Filter, 
  Building2, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Check,
  User as UserIcon
} from 'lucide-react';

interface AdminWithdrawalsScreenProps {
  withdrawals: WithdrawalRequest[];
  users: User[];
  onDataRefresh: () => void;
}

export const AdminWithdrawalsScreen: React.FC<AdminWithdrawalsScreenProps> = ({
  withdrawals,
  users,
  onDataRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCurrency, setSelectedCurrency] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const getUserMap = () => {
    const map = new Map<string, User>();
    users.forEach((u) => map.set(u.id, u));
    return map;
  };

  const userMap = getUserMap();

  const filteredWithdrawals = withdrawals.filter((w) => {
    if (selectedStatus !== 'ALL' && w.status !== selectedStatus) return false;
    if (selectedCurrency !== 'ALL' && w.currency !== selectedCurrency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = w.userName?.toLowerCase().includes(q);
      const matchMobile = w.userMobile?.toLowerCase().includes(q);
      const matchBank = w.bankName?.toLowerCase().includes(q);
      if (!matchName && !matchMobile && !matchBank) return false;
    }
    return true;
  });

  const handleUpdateStatus = (withdrawalId: string, newStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED') => {
    setActionLoadingId(withdrawalId);

    setTimeout(() => {
      const res = storage.updateWithdrawalStatus(withdrawalId, newStatus, 'Admin updated status');
      setActionLoadingId(null);
      if (res.success) {
        onDataRefresh();
      }
    }, 350);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-sky-600 text-white font-black text-xs rounded-full shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETED ✅
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white font-black text-xs rounded-full shadow-xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> PROCESSING 🔄
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-600 text-white font-black text-xs rounded-full shadow-xs">
            <XCircle className="w-3.5 h-3.5" /> REJECTED ❌
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500 text-white font-black text-xs rounded-full shadow-xs">
            <Clock className="w-3.5 h-3.5" /> PENDING ⏳
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#032242] via-[#094d82] to-[#032242] text-white rounded-3xl p-6 shadow-xl border-2 border-sky-400/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-950/70 border border-sky-500/40 flex items-center justify-center text-sky-300">
              <ArrowDownToLine className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-sky-200">
                PAYOUT REQUESTS
              </p>
              <h2 className="text-xl font-black text-white tracking-tight">
                Withdrawal Requests ({withdrawals.length})
              </h2>
            </div>
          </div>
          <span className="text-xs font-bold text-sky-200 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-500/40">
            P2P Verification
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border-2 border-sky-500/20 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-sky-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, mobile, bank..."
              className="w-full pl-10 pr-3 py-2.5 bg-sky-50/40 text-slate-900 font-bold text-xs rounded-xl border border-sky-200 focus:border-sky-600 outline-none"
            />
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-sky-50/40 text-slate-900 font-bold text-xs rounded-xl border border-sky-200 focus:border-sky-600 outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING ⏳</option>
              <option value="PROCESSING">PROCESSING 🔄</option>
              <option value="COMPLETED">COMPLETED ✅</option>
              <option value="REJECTED">REJECTED ❌ (Auto-Refund)</option>
            </select>
          </div>

          <div>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full px-3 py-2.5 bg-sky-50/40 text-slate-900 font-bold text-xs rounded-xl border border-sky-200 focus:border-sky-600 outline-none"
            >
              <option value="ALL">All Currencies</option>
              <option value="SAR">SAR</option>
              <option value="KWD">KWD</option>
              <option value="OMR">OMR</option>
              <option value="BHD">BHD</option>
              <option value="AED">AED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Withdrawals List */}
      <div className="space-y-3">
        {filteredWithdrawals.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border-2 border-sky-500/20 text-slate-500 text-xs">
            No withdrawal requests match your search criteria.
          </div>
        ) : (
          filteredWithdrawals.map((req) => {
            const user = userMap.get(req.userId);
            const country = user ? getCountryByCode(user.countryCode) : null;
            const isLoading = actionLoadingId === req.id;

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-5 border-2 border-sky-500/20 shadow-sm space-y-3"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-slate-900 text-base">
                        {req.userName || user?.fullName || 'Member'}
                      </h3>
                      <span className="text-xs text-slate-500 font-semibold">
                        ({req.userMobile || user?.mobileNumber})
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span>{country?.flag}</span>
                      <span>{req.country || user?.country}</span>
                      <span>•</span>
                      <span>Req: {new Date(req.requestDate).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">REQUESTED AMOUNT</span>
                      <span className="text-xl font-black text-sky-800">
                        {formatCurrency(req.amount, req.currency)}
                      </span>
                    </div>
                    {getStatusBadge(req.status)}
                  </div>
                </div>

                {/* Bank Account Details Grid */}
                <div className="bg-sky-50/50 p-3.5 rounded-2xl border border-sky-100 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">ACCOUNT HOLDER</span>
                    <span className="font-extrabold text-slate-900">{req.accountHolderName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">BANK NAME</span>
                    <span className="font-extrabold text-slate-900">{req.bankName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">ACCOUNT NUMBER</span>
                    <span className="font-mono font-black text-slate-900">{req.accountNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">IFSC / CODE</span>
                    <span className="font-mono font-black text-slate-900">{req.ifscCode || 'N/A'}</span>
                  </div>
                </div>

                {/* Status Update Action Buttons (Requirement #20 & #25) */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold">
                    {req.refunded ? 'Funds have been refunded to user wallet ✅' : 'Manage Payout Status:'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {req.status !== 'PROCESSING' && req.status !== 'COMPLETED' && (
                      <button
                        disabled={isLoading}
                        onClick={() => handleUpdateStatus(req.id, 'PROCESSING')}
                        className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer"
                      >
                        Set Processing 🔄
                      </button>
                    )}

                    {req.status !== 'COMPLETED' && (
                      <button
                        disabled={isLoading}
                        onClick={() => handleUpdateStatus(req.id, 'COMPLETED')}
                        className="py-1.5 px-3 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer"
                      >
                        Mark Completed ✅
                      </button>
                    )}

                    {req.status !== 'REJECTED' && (
                      <button
                        disabled={isLoading}
                        onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                        className="py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer"
                        title="Rejection automatically refunds balance to user"
                      >
                        Reject & Refund ❌
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
