import React, { useState } from 'react';
import { User, WalletTransaction } from '../../types';
import { formatCurrency, getCountryByCode } from '../../data/countries';
import { 
  Wallet, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  History, 
  ShieldCheck, 
  Building2, 
  Globe2 
} from 'lucide-react';

interface AdminWalletsScreenProps {
  users: User[];
  transactions: WalletTransaction[];
}

export const AdminWalletsScreen: React.FC<AdminWalletsScreenProps> = ({
  users,
  transactions,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const currencies = ['SAR', 'KWD', 'OMR', 'BHD', 'AED'];

  // Sums per currency
  const currencyTotals: Record<string, number> = {};
  users.forEach((u) => {
    currencyTotals[u.currency] = (currencyTotals[u.currency] || 0) + u.walletBalance;
  });

  const filteredUsers = users.filter((u) => {
    if (selectedCurrency !== 'ALL' && u.currency !== selectedCurrency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = u.fullName.toLowerCase().includes(q);
      const matchMobile = u.mobileNumber.toLowerCase().includes(q);
      if (!matchName && !matchMobile) return false;
    }
    return true;
  });

  return (
    <div className="space-y-5 pb-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#032242] via-[#094d82] to-[#032242] text-white rounded-3xl p-6 shadow-xl border-2 border-sky-400/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-950/70 border border-sky-500/40 flex items-center justify-center text-sky-300">
              <Wallet className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-sky-200">
                TREASURY MASTER
              </p>
              <h2 className="text-xl font-black text-white tracking-tight">
                Wallet Balances Overview
              </h2>
            </div>
          </div>
          <span className="text-xs font-bold text-sky-200 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-500/40">
            Segregated Currencies
          </span>
        </div>

        {/* Currency Total Cards (Strict currency isolation) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-4 border-t border-sky-700/60">
          {currencies.map((curr) => (
            <div key={curr} className="bg-sky-950/60 p-2.5 rounded-2xl border border-sky-600/40 text-xs">
              <span className="text-[10px] font-bold text-sky-300 block">{curr} TOTAL</span>
              <span className="text-base font-black text-white block mt-0.5">
                {formatCurrency(currencyTotals[curr] || 0, curr)}
              </span>
            </div>
          ))}
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
              placeholder="Search member by Name or Mobile..."
              className="w-full pl-10 pr-3.5 py-2.5 bg-sky-50/40 text-slate-900 font-bold text-xs rounded-xl border border-sky-200 focus:border-sky-600 outline-none"
            />
          </div>

          <div>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-sky-50/40 text-slate-900 font-bold text-xs rounded-xl border border-sky-200 focus:border-sky-600 outline-none"
            >
              <option value="ALL">All Currencies</option>
              <option value="SAR">Saudi Riyal (SAR)</option>
              <option value="KWD">Kuwaiti Dinar (KWD)</option>
              <option value="OMR">Omani Rial (OMR)</option>
              <option value="BHD">Bahraini Dinar (BHD)</option>
              <option value="AED">UAE Dirham (AED)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Wallets Table / Cards */}
      <div className="space-y-3">
        {filteredUsers.map((user) => {
          const country = getCountryByCode(user.countryCode);
          return (
            <div
              key={user.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-sky-500/20 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-sky-700 text-white font-black text-base flex items-center justify-center">
                  {user.fullName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {user.fullName}
                  </h4>
                  <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span>{country.flag}</span>
                    <span>{user.mobileNumber}</span>
                    <span>•</span>
                    <span className="font-bold text-sky-800">{user.country}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">BALANCE</span>
                <span className="text-xl font-black text-sky-900">
                  {formatCurrency(user.walletBalance, user.currency)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
