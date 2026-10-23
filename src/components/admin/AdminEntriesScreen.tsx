import React, { useState } from 'react';
import { GameEntry, User } from '../../types';
import { formatCurrency, getCountryByCode } from '../../data/countries';
import { 
  Gamepad2, 
  Search, 
  Filter, 
  Trophy, 
  Clock, 
  XCircle, 
  Calendar, 
  User as UserIcon,
  FileText
} from 'lucide-react';

interface AdminEntriesScreenProps {
  entries: GameEntry[];
  users: User[];
  onOpenReceipt: (entry: GameEntry) => void;
}

export const AdminEntriesScreen: React.FC<AdminEntriesScreenProps> = ({
  entries,
  users,
  onOpenReceipt,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCurrency, setSelectedCurrency] = useState('ALL');

  const getUserMap = () => {
    const map = new Map<string, User>();
    users.forEach((u) => map.set(u.id, u));
    return map;
  };

  const userMap = getUserMap();

  const filteredEntries = entries.filter((e) => {
    if (selectedStatus !== 'ALL' && e.status !== selectedStatus) return false;
    if (selectedCurrency !== 'ALL' && e.currency !== selectedCurrency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchNum = e.gameNumber.toLowerCase().includes(q);
      const matchUser = e.userName?.toLowerCase().includes(q);
      const matchMobile = e.userMobile?.toLowerCase().includes(q);
      if (!matchNum && !matchUser && !matchMobile) return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WINNER':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-sky-600 text-white font-black text-xs rounded-full shadow-xs">
            <Trophy className="w-3.5 h-3.5" /> WINNER 🏆
          </span>
        );
      case 'NOT MATCHED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-600 text-white font-black text-xs rounded-full shadow-xs">
            <XCircle className="w-3.5 h-3.5" /> NOT MATCHED ❌
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
              <Gamepad2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-sky-200">
                ALL TICKETS MASTER LOG
              </p>
              <h2 className="text-xl font-black text-white tracking-tight">
                Game Entries ({entries.length})
              </h2>
            </div>
          </div>
          <span className="text-xs font-bold text-sky-200 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-500/40">
            Live Feed
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
              placeholder="Search user, mobile, or #number..."
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
              <option value="WINNER">WINNER 🏆</option>
              <option value="NOT MATCHED">NOT MATCHED ❌</option>
            </select>
          </div>

          <div>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full px-3 py-2.5 bg-sky-50/40 text-slate-900 font-bold text-xs rounded-xl border border-sky-200 focus:border-sky-600 outline-none"
            >
              <option value="ALL">All Currencies</option>
              <option value="SAR">SAR (Saudi Arabia)</option>
              <option value="KWD">KWD (Kuwait)</option>
              <option value="OMR">OMR (Oman)</option>
              <option value="BHD">BHD (Bahrain)</option>
              <option value="AED">AED (Dubai / UAE)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border-2 border-sky-500/20 text-slate-500 text-xs">
            No game tickets found matching filters.
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const user = userMap.get(entry.userId);
            const country = user ? getCountryByCode(user.countryCode) : null;

            return (
              <div
                key={entry.id}
                onClick={() => onOpenReceipt(entry)}
                className="bg-white hover:bg-sky-50/30 rounded-3xl p-5 border-2 border-sky-500/20 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#032242] via-[#094d82] to-[#032242] text-white rounded-2xl flex items-center justify-center font-mono font-black text-2xl shadow-md border-2 border-sky-400/40">
                      {entry.gameNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-base">
                          {entry.userName || user?.fullName || 'Member'}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          ({entry.userMobile || user?.mobileNumber})
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{country?.flag}</span>
                        <span>{entry.country || user?.country}</span>
                        <span>•</span>
                        <span>{new Date(entry.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {getStatusBadge(entry.status)}
                  </div>
                </div>

                {/* Amounts Grid */}
                <div className="grid grid-cols-3 gap-2 bg-sky-50/50 p-3 rounded-2xl border border-sky-100 text-xs">
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">GAME AMOUNT</span>
                    <span className="font-black text-slate-900 text-sm">
                      {formatCurrency(entry.gameAmount, entry.currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">500X POTENTIAL</span>
                    <span className="font-black text-sky-800 text-sm">
                      {formatCurrency(entry.potentialWinning, entry.currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">WINNING PAID</span>
                    <span className={`font-black text-sm ${entry.actualWinning > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                      {entry.actualWinning > 0 ? `+${formatCurrency(entry.actualWinning, entry.currency)} 🏆` : '0'}
                    </span>
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
