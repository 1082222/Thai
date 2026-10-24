import React from 'react';
import { User, GameEntry } from '../../types';
import { formatCurrency, getCountryByCode } from '../../data/countries';
import { Mega3UpHeader } from '../common/Mega3UpHeader';
import { 
  Wallet, 
  Gamepad2, 
  Trophy, 
  History, 
  ArrowDownToLine, 
  User as UserIcon, 
  Building2, 
  FileText, 
  Sparkles, 
  ChevronRight, 
  TrendingUp
} from 'lucide-react';

interface UserDashboardProps {
  user: User;
  recentEntries: GameEntry[];
  onNavigate: (screen: string) => void;
  onOpenReceipt: (entry: GameEntry) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  recentEntries,
  onNavigate,
  onOpenReceipt,
}) => {
  const country = getCountryByCode(user.countryCode);
  const pendingEntries = recentEntries.filter((e) => e.status === 'PENDING');
  const winningEntries = recentEntries.filter((e) => e.status === 'WINNER');
  const totalWon = winningEntries.reduce((sum, e) => sum + e.actualWinning, 0);

  const menuCards = [
    {
      id: 'game',
      title: 'ENTER DRAW',
      subtitle: 'Pick 3-digit number & win 400X',
      icon: Gamepad2,
      badge: '400X Payout',
      badgeColor: 'bg-amber-400 text-sky-950 font-black',
      cardBg: 'bg-gradient-to-br from-sky-600 via-sky-700 to-[#032242] text-white shadow-sky-900/20',
      iconBg: 'bg-white/20 text-white',
      accentColor: 'text-amber-300',
    },
    {
      id: 'wallet',
      title: 'MY WALLET',
      subtitle: `Balance: ${formatCurrency(user.walletBalance, user.currency)}`,
      icon: Wallet,
      badge: 'Active Balance',
      badgeColor: 'bg-sky-100 text-sky-800 font-bold',
      cardBg: 'bg-white text-slate-900 border-2 border-sky-500/30',
      iconBg: 'bg-sky-100 text-sky-800',
      accentColor: 'text-sky-700',
    },
    {
      id: 'withdraw',
      title: 'WITHDRAW',
      subtitle: 'Request withdrawal to your bank',
      icon: ArrowDownToLine,
      badge: 'Instant Request',
      badgeColor: 'bg-sky-100 text-sky-800 font-bold',
      cardBg: 'bg-white text-slate-900 border-2 border-sky-500/30',
      iconBg: 'bg-sky-100 text-sky-800',
      accentColor: 'text-sky-700',
    },
    {
      id: 'results',
      title: 'OFFICIAL RESULTS',
      subtitle: winningEntries.length > 0 ? `${winningEntries.length} Winning draws!` : 'Check winning numbers',
      icon: Trophy,
      badge: winningEntries.length > 0 ? 'Won' : 'Live Draws',
      badgeColor: winningEntries.length > 0 ? 'bg-amber-400 text-sky-950 font-black' : 'bg-slate-100 text-slate-700 font-semibold',
      cardBg: 'bg-white text-slate-900 border-2 border-sky-500/30',
      iconBg: 'bg-amber-100 text-amber-800',
      accentColor: 'text-amber-600',
    },
    {
      id: 'history',
      title: 'MY TICKETS',
      subtitle: `View all ${recentEntries.length} past game tickets`,
      icon: History,
      badge: `${recentEntries.length} Entries`,
      badgeColor: 'bg-slate-100 text-slate-700 font-semibold',
      cardBg: 'bg-white text-slate-900 border-2 border-sky-500/30',
      iconBg: 'bg-sky-50 text-sky-700',
      accentColor: 'text-slate-700',
    },
    {
      id: 'account',
      title: 'BANK ACCOUNTS',
      subtitle: (user.bankAccounts && user.bankAccounts.length > 0)
        ? `${user.bankAccounts.length} Account${user.bankAccounts.length === 1 ? '' : 's'} Linked (${user.accountDetails?.bankName || user.bankAccounts[0].bankName})`
        : (user.accountDetails?.bankName ? `${user.accountDetails.bankName}` : 'Add bank details for withdrawal'),
      icon: Building2,
      badge: (user.bankAccounts && user.bankAccounts.length > 0)
        ? `${user.bankAccounts.length} Linked (Locked 🔒)`
        : (user.accountDetails?.accountNumber ? '1 Linked (Locked 🔒)' : 'Action Needed'),
      badgeColor: (user.bankAccounts && user.bankAccounts.length > 0) || user.accountDetails?.accountNumber 
        ? 'bg-sky-100 text-sky-800 font-bold' 
        : 'bg-amber-100 text-amber-800 font-bold',
      cardBg: 'bg-white text-slate-900 border-2 border-sky-500/30',
      iconBg: 'bg-sky-50 text-sky-700',
      accentColor: 'text-sky-700',
    },
    {
      id: 'documents',
      title: 'MY DOCUMENTS',
      subtitle: user.documentStatus === 'UPDATED' ? 'Documents Verified' : 'Upload verification documents',
      icon: FileText,
      badge: user.documentStatus === 'UPDATED' ? 'UPDATED ✅' : 'NOT UPDATED ⚠️',
      badgeColor: user.documentStatus === 'UPDATED' ? 'bg-sky-100 text-sky-800 font-bold' : 'bg-amber-100 text-amber-800 font-bold',
      cardBg: 'bg-white text-slate-900 border-2 border-sky-500/30',
      iconBg: 'bg-sky-50 text-sky-700',
      accentColor: 'text-sky-700',
    },
    {
      id: 'profile',
      title: 'MY PROFILE',
      subtitle: `${user.fullName} (${user.mobileNumber})`,
      icon: UserIcon,
      badge: `${country.flag} ${user.countryCode}`,
      badgeColor: 'bg-sky-100 text-sky-800 font-bold',
      cardBg: 'bg-white text-slate-900 border-2 border-sky-500/30',
      iconBg: 'bg-sky-50 text-sky-700',
      accentColor: 'text-slate-700',
    },
  ];

  return (
    <div className="space-y-5 pb-6">
      {/* Official Government Lottery Officer Heading Banner */}
      <Mega3UpHeader
        variant="banner"
        subText="OFFICIAL WEEKLY DRAW"
      />

      {/* Hero Wallet Card */}
      <div className="bg-gradient-to-br from-[#032242] via-[#094d82] to-slate-950 text-white rounded-3xl p-6 shadow-xl border-2 border-sky-400/40 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-sky-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-sky-600/40 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{country.flag}</span>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-sky-200">
                {user.country} • {user.currency}
              </p>
              <h2 className="text-base font-extrabold text-white leading-tight">
                {user.fullName}
              </h2>
            </div>
          </div>
          <span className="px-3 py-1 bg-sky-950/70 rounded-full text-xs font-bold text-sky-200 border border-sky-400/40">
            {user.mobileNumber}
          </span>
        </div>

        {/* Extra Large Wallet Balance */}
        <div className="my-2">
          <p className="text-xs font-black uppercase tracking-widest text-sky-200 flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-sky-300" />
            <span>CURRENT WALLET BALANCE</span>
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow">
              {Number(user.walletBalance).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
            <span className="text-2xl font-black text-amber-300">
              {user.currency}
            </span>
          </div>
        </div>

        {/* Quick Summary Row */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-sky-600/40 text-xs">
          <div className="bg-sky-950/60 p-2.5 rounded-xl border border-sky-500/30">
            <span className="text-sky-200/80 block font-medium">Active Tickets</span>
            <span className="font-black text-white text-base flex items-center gap-1 mt-0.5">
              <span>{pendingEntries.length} Tickets</span>
              <span className="text-amber-300 text-xs">⏳</span>
            </span>
          </div>
          <div className="bg-sky-950/60 p-2.5 rounded-xl border border-sky-500/30">
            <span className="text-sky-200/80 block font-medium">Total Won (400X)</span>
            <span className="font-black text-amber-300 text-base flex items-center gap-1 mt-0.5">
              <span>{formatCurrency(totalWon, user.currency)}</span>
              <span>🏆</span>
            </span>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={() => onNavigate('game')}
            className="py-3.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-sky-950 font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm transition-transform active:scale-98 cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>PLAY DRAW</span>
          </button>
          <button
            onClick={() => onNavigate('withdraw')}
            className="py-3.5 px-4 bg-sky-500 hover:bg-sky-400 text-white font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm transition-transform active:scale-98 cursor-pointer"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>WITHDRAW</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard Navigation Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>DASHBOARD MENU</span>
          </h3>
          <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
            Tap to Open
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {menuCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className={`${card.cardBg} rounded-2xl p-4.5 shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left group cursor-pointer active:scale-[0.99]`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${card.iconBg} shadow-xs`}>
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base tracking-tight leading-tight truncate">
                        {card.title}
                      </span>
                    </div>
                    <p className={`text-xs font-semibold mt-0.5 truncate opacity-90 ${card.accentColor}`}>
                      {card.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${card.badgeColor} hidden sm:inline-block`}>
                    {card.badge}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:translate-x-0.5 transition-transform">
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Game Tickets Quick View */}
      {recentEntries.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border-2 border-sky-500/20 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              <span>RECENT LOTTERY TICKETS</span>
            </h4>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 cursor-pointer"
            >
              View All ({recentEntries.length}) →
            </button>
          </div>

          <div className="space-y-2">
            {recentEntries.slice(0, 3).map((entry) => (
              <div
                key={entry.id}
                onClick={() => onOpenReceipt(entry)}
                className="p-3 bg-sky-50/40 hover:bg-sky-50 rounded-2xl border border-sky-200/60 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-700 text-white rounded-xl flex items-center justify-center font-mono font-black text-base shadow-xs">
                    {entry.gameNumber}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm">
                      Ticket #{entry.gameNumber}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-500">
                      Amount: {formatCurrency(entry.gameAmount, entry.currency)} • 400X: {formatCurrency(entry.potentialWinning, entry.currency)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-extrabold ${
                    entry.status === 'WINNER'
                      ? 'bg-amber-400 text-sky-950 font-black'
                      : entry.status === 'NOT MATCHED'
                      ? 'bg-rose-600 text-white'
                      : 'bg-sky-600 text-white'
                  }`}>
                    {entry.status === 'WINNER' ? 'WINNER 🏆' : entry.status === 'NOT MATCHED' ? 'NOT MATCHED ❌' : 'PENDING ⏳'}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
