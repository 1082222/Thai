import React, { useState } from 'react';
import { User, WalletTransaction, WithdrawalRequest } from '../../types';
import { formatCurrency, getCountryByCode } from '../../data/countries';
import { 
  Wallet, 
  ArrowDownToLine, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  FileText
} from 'lucide-react';

interface UserWalletScreenProps {
  user: User;
  transactions: WalletTransaction[];
  withdrawals: WithdrawalRequest[];
  onNavigateToWithdraw: () => void;
  onNavigateToGame: () => void;
}

export const UserWalletScreen: React.FC<UserWalletScreenProps> = ({
  user,
  transactions,
  withdrawals,
  onNavigateToWithdraw,
  onNavigateToGame,
}) => {
  const country = getCountryByCode(user.countryCode);
  const [activeTab, setActiveTab] = useState<'all' | 'entries' | 'winnings' | 'withdrawals'>('all');

  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'PENDING');
  const totalPendingWithdrawalAmount = pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0);

  const totalWonAmount = transactions
    .filter((t) => t.type === 'WINNING CREDIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalGameAmountSpent = Math.abs(
    transactions
      .filter((t) => t.type === 'GAME ENTRY')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === 'entries') return tx.type === 'GAME ENTRY';
    if (activeTab === 'winnings') return tx.type === 'WINNING CREDIT';
    if (activeTab === 'withdrawals') return tx.type === 'WITHDRAWAL REQUEST' || tx.type === 'WITHDRAWAL REFUND';
    return true;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'WINNING CREDIT':
        return <ArrowDownLeft className="w-4 h-4 text-amber-500" />;
      case 'GAME ENTRY':
        return <ArrowUpRight className="w-4 h-4 text-sky-600" />;
      case 'WITHDRAWAL REQUEST':
        return <ArrowDownToLine className="w-4 h-4 text-amber-600" />;
      case 'WITHDRAWAL REFUND':
        return <ArrowDownLeft className="w-4 h-4 text-sky-600" />;
      default:
        return <Wallet className="w-4 h-4 text-slate-500" />;
    }
  };

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'WINNING CREDIT':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-black';
      case 'GAME ENTRY':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'WITHDRAWAL REQUEST':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'WITHDRAWAL REFUND':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-sky-50 text-sky-700 border-sky-200';
    }
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Wallet Card */}
      <div className="bg-gradient-to-br from-[#032242] via-[#094d82] to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-sky-400/40 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* User tag */}
        <div className="flex items-center justify-between border-b border-sky-600/50 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{country.flag}</span>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-sky-200">
                OFFICIAL WALLET • {user.country}
              </p>
              <p className="text-sm font-extrabold text-white">
                {user.fullName}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-sky-200 bg-sky-950/70 px-3 py-1 rounded-full border border-sky-400/40">
            {user.currency}
          </span>
        </div>

        {/* Extra Large Wallet Balance */}
        <div className="text-center sm:text-left py-2">
          <p className="text-xs font-black uppercase tracking-widest text-sky-200 flex items-center justify-center sm:justify-start gap-1.5 mb-1">
            <Wallet className="w-4 h-4 text-sky-300" />
            <span>WALLET BALANCE</span>
          </p>
          <div className="flex items-baseline justify-center sm:justify-start gap-2">
            <span className="text-5xl sm:text-6xl font-black text-white tracking-tight drop-shadow-md">
              {Number(user.walletBalance).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-300">
              {user.currency}
            </span>
          </div>
        </div>

        {/* 4 Clean Separations */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-sky-600/50 text-xs">
          <div className="bg-sky-950/60 p-3 rounded-2xl border border-sky-500/30">
            <span className="text-sky-300/80 block font-bold text-[10px] uppercase">AVAILABLE BALANCE</span>
            <span className="font-black text-white text-base block mt-0.5">
              {formatCurrency(user.walletBalance, user.currency)}
            </span>
          </div>

          <div className="bg-sky-950/60 p-3 rounded-2xl border border-sky-500/30">
            <span className="text-amber-300/90 block font-bold text-[10px] uppercase">PENDING WITHDRAWAL</span>
            <span className="font-black text-amber-300 text-base block mt-0.5">
              {formatCurrency(totalPendingWithdrawalAmount, user.currency)}
            </span>
          </div>

          <div className="bg-sky-950/60 p-3 rounded-2xl border border-sky-500/30">
            <span className="text-sky-300/80 block font-bold text-[10px] uppercase">TICKET AMOUNT SPENT</span>
            <span className="font-black text-white text-base block mt-0.5">
              {formatCurrency(totalGameAmountSpent, user.currency)}
            </span>
          </div>

          <div className="bg-sky-950/60 p-3 rounded-2xl border border-sky-500/30">
            <span className="text-amber-300/90 block font-bold text-[10px] uppercase">WINNING AMOUNT WON (500X)</span>
            <span className="font-black text-amber-300 text-base block mt-0.5">
              {formatCurrency(totalWonAmount, user.currency)}
            </span>
          </div>
        </div>

        {/* Two Large Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={onNavigateToWithdraw}
            className="py-4 px-4 bg-sky-500 hover:bg-sky-400 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 text-base transition-transform active:scale-98 cursor-pointer"
          >
            <ArrowDownToLine className="w-5 h-5 stroke-[2.5]" />
            <span>WITHDRAW</span>
          </button>

          <button
            onClick={onNavigateToGame}
            className="py-4 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-sky-950 font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 text-base transition-transform active:scale-98 cursor-pointer"
          >
            <Wallet className="w-5 h-5 stroke-[2.5]" />
            <span>PLAY DRAW (500X)</span>
          </button>
        </div>
      </div>

      {/* Pending Withdrawals Notification Alert if any */}
      {pendingWithdrawals.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-black text-sm">
                {pendingWithdrawals.length} Pending Withdrawal Request ({formatCurrency(totalPendingWithdrawalAmount, user.currency)})
              </p>
              <p className="font-semibold text-amber-800">
                Amount has been safely reserved from your available balance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-sky-500/20 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-sky-600" />
              <span>WALLET TRANSACTION HISTORY</span>
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              All entries, winning credits, and withdrawal records
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto">
            {[
              { id: 'all', label: 'All' },
              { id: 'entries', label: 'Game Entries' },
              { id: 'winnings', label: 'Winning Credits' },
              { id: 'withdrawals', label: 'Withdrawals' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-sky-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-10 bg-sky-50/30 rounded-2xl border border-dashed border-sky-200">
            <FileText className="w-10 h-10 text-sky-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No transactions recorded yet</p>
            <p className="text-xs text-slate-500 mt-0.5">Submit game entries to see transactions here.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTransactions.map((tx) => {
              const isPositive = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  className="p-3.5 bg-sky-50/40 hover:bg-sky-50 rounded-2xl border border-sky-200/60 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-sky-200 flex items-center justify-center shadow-xs flex-shrink-0">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-extrabold text-slate-900 text-sm">
                          {tx.description}
                        </p>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${getTransactionBadge(tx.type)}`}>
                          {tx.type}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                        {new Date(tx.date).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })} • Balance After: {formatCurrency(tx.balanceAfter, tx.currency)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`text-base font-black ${
                      isPositive ? 'text-sky-700' : 'text-slate-900'
                    }`}>
                      {isPositive ? '+' : ''}{formatCurrency(tx.amount, tx.currency)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
