import React from 'react';
import { User, GameEntry, WithdrawalRequest, WalletTransaction } from '../../types';
import { formatCurrency } from '../../data/countries';
import { Mega3UpHeader } from '../common/Mega3UpHeader';
import { 
  Users, 
  Wallet, 
  Gamepad2, 
  Trophy, 
  Clock, 
  XCircle, 
  ArrowDownToLine, 
  History, 
  Settings, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  users: User[];
  entries: GameEntry[];
  withdrawals: WithdrawalRequest[];
  transactions: WalletTransaction[];
  onNavigate: (screen: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  entries,
  withdrawals,
  transactions,
  onNavigate,
}) => {
  const pendingEntries = entries.filter((e) => e.status === 'PENDING');
  const winnerEntries = entries.filter((e) => e.status === 'WINNER');
  const notMatchedEntries = entries.filter((e) => e.status === 'NOT MATCHED');
  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'PENDING' || w.status === 'PROCESSING');

  // Calculate currency wallet balances without mixing (Requirement #3 & #22)
  const currencyWallets: Record<string, number> = {};
  const currencyGameAmounts: Record<string, number> = {};
  const currencyWinAmounts: Record<string, number> = {};

  users.forEach((u) => {
    currencyWallets[u.currency] = (currencyWallets[u.currency] || 0) + u.walletBalance;
  });

  entries.forEach((e) => {
    currencyGameAmounts[e.currency] = (currencyGameAmounts[e.currency] || 0) + e.gameAmount;
    if (e.status === 'WINNER') {
      currencyWinAmounts[e.currency] = (currencyWinAmounts[e.currency] || 0) + e.actualWinning;
    }
  });

  const cards = [
    {
      id: 'users',
      title: 'TOTAL USERS',
      value: `${users.length}`,
      subtext: 'Registered members across 5 countries',
      icon: Users,
      iconBg: 'bg-sky-100 text-sky-800',
      badge: 'Active Members',
    },
    {
      id: 'wallets',
      title: 'TOTAL WALLET BALANCES',
      value: Object.entries(currencyWallets).map(([curr, amt]) => `${formatCurrency(amt, curr)}`).join(' • ') || '0 SAR',
      subtext: 'Segregated strictly by currency',
      icon: Wallet,
      iconBg: 'bg-sky-100 text-sky-800',
      badge: '5 Currencies',
    },
    {
      id: 'declare',
      title: 'DECLARE WINNING NUMBER',
      value: 'Live Draw Control',
      subtext: 'Declare 3-digit number & auto-credit 500X',
      icon: Sparkles,
      iconBg: 'bg-amber-100 text-amber-900 font-black',
      badge: 'Action Required',
      highlight: true,
    },
    {
      id: 'entries',
      title: 'TOTAL GAME ENTRIES',
      value: `${entries.length}`,
      subtext: 'All submitted 3-digit tickets',
      icon: Gamepad2,
      iconBg: 'bg-sky-100 text-sky-800',
      badge: 'Tickets',
    },
    {
      id: 'winners',
      title: 'TOTAL WINNERS',
      value: `${winnerEntries.length}`,
      subtext: 'Won 500X matching tickets',
      icon: Trophy,
      iconBg: 'bg-amber-100 text-amber-800',
      badge: '500X Winners',
    },
    {
      id: 'pending',
      title: 'PENDING ENTRIES',
      value: `${pendingEntries.length}`,
      subtext: 'Awaiting next winning declaration',
      icon: Clock,
      iconBg: 'bg-amber-100 text-amber-800',
      badge: 'Pending Draw',
    },
    {
      id: 'not_matched',
      title: 'NOT MATCHED',
      value: `${notMatchedEntries.length}`,
      subtext: 'Non-winning ticket entries',
      icon: XCircle,
      iconBg: 'bg-rose-100 text-rose-800',
      badge: 'Archive',
    },
    {
      id: 'withdrawals',
      title: 'WITHDRAWAL REQUESTS',
      value: `${withdrawals.length} (${pendingWithdrawals.length} Pending)`,
      subtext: 'Member payout requests',
      icon: ArrowDownToLine,
      iconBg: 'bg-sky-100 text-sky-800',
      badge: pendingWithdrawals.length > 0 ? `${pendingWithdrawals.length} Action Needed` : 'Up to date',
    },
    {
      id: 'history',
      title: 'GAME HISTORY',
      value: 'Complete Logs',
      subtext: 'Search & filter all transactions',
      icon: History,
      iconBg: 'bg-slate-100 text-slate-700',
      badge: 'Full Audit',
    },
    {
      id: 'settings',
      title: 'SETTINGS & BACKUP',
      value: 'Configuration',
      subtext: 'Admin PIN, Export JSON & APK Guide',
      icon: Settings,
      iconBg: 'bg-slate-100 text-slate-700',
      badge: 'Admin Panel',
    },
  ];

  return (
    <div className="space-y-5 pb-6">
      {/* Official Government Lottery Officer Heading Banner */}
      <Mega3UpHeader
        variant="banner"
        subText="ADMIN MASTER"
      />

      {/* Admin Top Master Card */}
      <div className="bg-gradient-to-r from-[#032242] via-[#094d82] to-[#032242] text-white rounded-3xl p-6 shadow-2xl border-2 border-sky-400/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-950/70 border border-sky-400/50 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-sky-300">
                ADMIN MASTER DASHBOARD
              </p>
              <h2 className="text-xl font-black text-white tracking-tight">
                The Government Lottery Officer Master
              </h2>
            </div>
          </div>
          <span className="text-xs font-black bg-amber-400 text-slate-950 px-3 py-1.5 rounded-full shadow-md">
            SUPER ADMIN 👑
          </span>
        </div>

        {/* Currency Breakdown Bar (Requirement #3: Admin must NEVER mix currencies together) */}
        <div className="mt-4 pt-3 border-t border-sky-700/60">
          <p className="text-[10px] font-black uppercase tracking-wider text-sky-300 mb-2">
            WALLET BALANCES BY CURRENCY (STRICTLY SEPARATED)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {['SAR', 'KWD', 'OMR', 'BHD', 'AED'].map((curr) => (
              <div key={curr} className="bg-sky-950/60 p-2.5 rounded-xl border border-sky-600/40">
                <span className="text-[10px] font-bold text-sky-300 block">{curr} Total</span>
                <span className="font-black text-white text-sm">
                  {formatCurrency(currencyWallets[curr] || 0, curr)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Button to Declare */}
        <div className="mt-4 pt-3 border-t border-sky-700/60 flex items-center justify-between">
          <span className="text-xs text-sky-200">
            {pendingEntries.length} tickets waiting for result declaration.
          </span>
          <button
            onClick={() => onNavigate('declare')}
            className="py-2 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>DECLARE 3-DIGIT WINNER</span>
          </button>
        </div>
      </div>

      {/* Large Admin Cards Grid (Requirement #22) */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider px-1">
          MANAGEMENT MODULES
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className={`p-4.5 rounded-3xl border-2 transition-all flex items-center justify-between text-left group cursor-pointer shadow-sm hover:shadow-md ${
                  card.highlight
                    ? 'bg-gradient-to-r from-amber-500/10 via-sky-50 to-sky-100/60 border-amber-400/80 ring-2 ring-amber-400/20'
                    : 'bg-white border-sky-500/25 hover:border-sky-500/50 hover:bg-sky-50/20'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${card.iconBg} shadow-xs`}>
                    <Icon className="w-6 h-6 stroke-[2.3]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-wide">
                      {card.title}
                    </p>
                    <p className="text-base font-black text-slate-900 tracking-tight truncate mt-0.5">
                      {card.value}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-500 truncate mt-0.5">
                      {card.subtext}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-sky-50 text-sky-800 rounded-md border border-sky-200 hidden sm:inline-block">
                    {card.badge}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-sky-50 group-hover:bg-sky-600 group-hover:text-white flex items-center justify-center text-sky-800 transition-colors">
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
