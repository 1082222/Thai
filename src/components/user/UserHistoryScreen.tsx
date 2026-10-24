import React, { useState } from 'react';
import { GameEntry, User } from '../../types';
import { formatCurrency } from '../../data/countries';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  Trophy, 
  Clock, 
  XCircle, 
  Eye, 
  FileText,
  Sparkles
} from 'lucide-react';

interface UserHistoryScreenProps {
  user: User;
  entries: GameEntry[];
  onOpenReceipt: (entry: GameEntry) => void;
}

export const UserHistoryScreen: React.FC<UserHistoryScreenProps> = ({
  user,
  entries,
  onOpenReceipt,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const filteredEntries = entries.filter((entry) => {
    // Search by game number or user
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchNum = entry.gameNumber.toLowerCase().includes(q);
      const matchId = entry.id.toLowerCase().includes(q);
      if (!matchNum && !matchId) return false;
    }

    // Filter by status
    if (selectedStatus !== 'ALL' && entry.status !== selectedStatus) {
      return false;
    }

    // Filter by date
    if (selectedDate) {
      const entryDate = new Date(entry.createdAt).toISOString().split('T')[0];
      if (entryDate !== selectedDate) return false;
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
            <div className="w-12 h-12 rounded-2xl bg-sky-950/60 flex items-center justify-center text-sky-300 border border-sky-500/40">
              <History className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-sky-200">
                GAME TICKETS ARCHIVE
              </p>
              <h2 className="text-xl font-black text-white tracking-tight">
                My Game History
              </h2>
            </div>
          </div>
          <span className="text-xs font-black bg-sky-950/70 text-sky-200 px-3 py-1.5 rounded-full border border-sky-500/40">
            {entries.length} Total Tickets
          </span>
        </div>
      </div>

      {/* Filter and Search Bar (Requirement #14: Search by Game Number, Date, Status) */}
      <div className="bg-white rounded-3xl p-5 border-2 border-sky-500/20 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search by Number */}
          <div className="relative">
            <Search className="w-4 h-4 text-sky-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by 3-digit number..."
              className="w-full pl-10 pr-3 py-2.5 bg-sky-50/50 text-slate-900 font-bold text-xs rounded-xl border border-sky-200 focus:border-sky-600 outline-none"
            />
          </div>

          {/* Filter by Status */}
          <div className="relative">
            <Filter className="w-4 h-4 text-sky-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-sky-50/50 text-slate-900 font-bold text-xs rounded-xl border border-sky-200 focus:border-sky-600 outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING ⏳</option>
              <option value="WINNER">WINNER 🏆</option>
              <option value="NOT MATCHED">NOT MATCHED ❌</option>
            </select>
          </div>

          {/* Filter by Date */}
          <div className="relative">
            <Calendar className="w-4 h-4 text-sky-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-sky-50/50 text-slate-900 font-bold text-xs rounded-xl border border-sky-200 focus:border-sky-600 outline-none"
            />
          </div>
        </div>

        {(searchQuery || selectedStatus !== 'ALL' || selectedDate) && (
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="font-semibold text-slate-500">
              Showing {filteredEntries.length} of {entries.length} results
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('ALL');
                setSelectedDate('');
              }}
              className="font-bold text-sky-700 hover:text-sky-900 text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-sky-500/20">
          <FileText className="w-12 h-12 text-sky-300 mx-auto mb-2" />
          <h4 className="font-black text-slate-900 text-base">No Tickets Found</h4>
          <p className="text-xs text-slate-500 mt-1">Try changing your search query or filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
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
                        Ticket #{entry.gameNumber}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-sky-600" />
                      {new Date(entry.createdAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  {getStatusBadge(entry.status)}
                </div>
              </div>

              {/* Amount Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-sky-50/50 p-3 rounded-2xl border border-sky-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">GAME AMOUNT</span>
                  <span className="font-black text-slate-900 text-sm">
                    {formatCurrency(entry.gameAmount, entry.currency)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">POTENTIAL (400X)</span>
                  <span className="font-black text-sky-800 text-sm">
                    {formatCurrency(entry.potentialWinning, entry.currency)}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">ACTUAL WON</span>
                  <span className={`font-black text-sm ${entry.actualWinning > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                    {entry.actualWinning > 0 ? `+${formatCurrency(entry.actualWinning, entry.currency)} 🏆` : '0 ' + entry.currency}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-sky-700 font-bold pt-1">
                <span className="flex items-center gap-1 group-hover:underline">
                  <Eye className="w-3.5 h-3.5" /> View Official Customer Receipt
                </span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
