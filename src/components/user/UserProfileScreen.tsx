import React from 'react';
import { User } from '../../types';
import { formatCurrency, getCountryByCode } from '../../data/countries';
import { maskAccountNumber } from '../../services/storage';
import { 
  User as UserIcon, 
  Smartphone, 
  Globe2, 
  Wallet, 
  Building2, 
  FileText, 
  LogOut, 
  ShieldCheck, 
  Calendar,
  ChevronRight
} from 'lucide-react';

interface UserProfileScreenProps {
  user: User;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  user,
  onNavigate,
  onLogout,
}) => {
  const country = getCountryByCode(user.countryCode);

  return (
    <div className="space-y-5 pb-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-[#032242] via-[#094d82] to-[#032242] text-white rounded-3xl p-6 shadow-xl border-2 border-sky-400/40 text-center relative overflow-hidden">
        <div className="mx-auto w-20 h-20 bg-sky-950/60 text-sky-300 rounded-3xl flex items-center justify-center text-3xl font-black mb-3 border-2 border-sky-500/40 shadow-inner">
          {user.fullName.charAt(0)}
        </div>
        <h2 className="text-xl font-black text-white tracking-tight">
          {user.fullName}
        </h2>
        <p className="text-xs font-bold text-sky-200 mt-0.5 flex items-center justify-center gap-1.5">
          <span>{country.flag}</span>
          <span>{user.country}</span>
          <span>•</span>
          <span>{user.currency}</span>
        </p>

        <div className="mt-4 pt-3 border-t border-sky-600/50 flex items-center justify-around text-xs">
          <div>
            <span className="text-sky-300/80 block font-medium">Mobile Number</span>
            <span className="font-bold text-white text-sm">{user.mobileNumber}</span>
          </div>
          <div className="w-px h-8 bg-sky-600/50" />
          <div>
            <span className="text-sky-300/80 block font-medium">Wallet Balance</span>
            <span className="font-black text-amber-300 text-sm">{formatCurrency(user.walletBalance, user.currency)}</span>
          </div>
        </div>
      </div>

      {/* Account & Security Summary */}
      <div className="bg-white rounded-3xl p-5 border-2 border-sky-500/20 shadow-sm space-y-3">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
          ACCOUNT STATUS & VERIFICATION
        </h3>

        <div className="space-y-2 text-xs">
          <div
            onClick={() => onNavigate('account')}
            className="p-3.5 bg-sky-50/40 hover:bg-sky-50 rounded-2xl border border-sky-200/60 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-sky-200 flex items-center justify-center text-sky-700">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>Linked Bank Accounts</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded font-bold">
                    🔒 Locked
                  </span>
                </p>
                <p className="text-[11px] text-slate-500">
                  {user.bankAccounts && user.bankAccounts.length > 0
                    ? `${user.bankAccounts.length} Account${user.bankAccounts.length === 1 ? '' : 's'} (${user.accountDetails?.bankName || user.bankAccounts[0].bankName})`
                    : user.accountDetails.bankName 
                    ? `${user.accountDetails.bankName} (${maskAccountNumber(user.accountDetails.accountNumber)})` 
                    : 'Not configured'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div
            onClick={() => onNavigate('documents')}
            className="p-3.5 bg-sky-50/40 hover:bg-sky-50 rounded-2xl border border-sky-200/60 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-sky-200 flex items-center justify-center text-sky-700">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900">Verification Documents</p>
                <p className="text-[11px] text-slate-500">
                  Status: {user.documentStatus === 'UPDATED' ? 'UPDATED ✅' : 'NOT UPDATED ⚠️'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full py-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-sm rounded-2xl border-2 border-rose-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>LOGOUT FROM THE GOVERNMENT LOTTERY OFFICER</span>
      </button>

      <div className="text-center">
        <p className="text-[11px] font-semibold text-slate-400">
          The Government Lottery Officer v2.4.0 • Official Draw
        </p>
      </div>
    </div>
  );
};
