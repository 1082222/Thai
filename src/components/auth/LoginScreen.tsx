import React, { useState } from 'react';
import { Mega3UpHeader } from '../common/Mega3UpHeader';
import { storage, ADMIN_CREDENTIALS } from '../../services/storage';
import { User } from '../../types';
import { Lock, Smartphone, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: User | { role: 'ADMIN'; id: string; fullName: string }) => void;
  onNavigateToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
}) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanMobile = mobileNumber.trim();
    const cleanPassword = password.trim();

    if (!cleanMobile) {
      setError('Please enter your Mobile Number');
      return;
    }
    if (!cleanPassword) {
      setError('Please enter your Password');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // 1. Check if Admin credentials
      if (
        cleanMobile === ADMIN_CREDENTIALS.mobile &&
        cleanPassword === ADMIN_CREDENTIALS.password
      ) {
        setLoading(false);
        onLoginSuccess({
          id: 'admin_root',
          fullName: 'System Administrator',
          role: 'ADMIN',
        });
        return;
      }

      // 2. Check registered users
      const user = storage.getUserByMobile(cleanMobile);
      if (!user) {
        setLoading(false);
        setError('Mobile number not found. Please register as a new user.');
        return;
      }

      if (user.password !== cleanPassword) {
        setLoading(false);
        setError('Invalid password. Please try again.');
        return;
      }

      // Update session
      storage.setCurrentUserId(user.id);
      setLoading(false);
      onLoginSuccess(user);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#032242] to-slate-950 flex flex-col justify-center px-3 sm:px-6 py-6 text-white relative overflow-hidden">
      {/* Decorative light spots */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg mx-auto relative z-10 space-y-5">
        {/* Top Official Banner Heading */}
        <Mega3UpHeader
          variant="banner"
          subText="MEMBER PORTAL"
        />

        {/* Login Card */}
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-sky-500/30">
          <div className="border-b border-sky-100 pb-4 mb-6">
            <h2 className="text-2xl font-black text-sky-950 tracking-tight">
              MEMBER LOGIN
            </h2>
            <p className="text-xs font-semibold text-sky-700 mt-1">
              Enter your registered mobile number & password to enter draw
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Mobile Number Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                LOGIN MOBILE NUMBER
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600">
                  <Smartphone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter Mobile Number"
                  className="w-full pl-11 pr-4 py-3.5 bg-sky-50/50 hover:bg-sky-50/80 focus:bg-white text-slate-900 font-bold text-base rounded-2xl border-2 border-sky-200 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                PASSWORD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full pl-11 pr-4 py-3.5 bg-sky-50/50 hover:bg-sky-50/80 focus:bg-white text-slate-900 font-bold text-base rounded-2xl border-2 border-sky-200 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 hover:from-sky-500 hover:to-sky-700 text-white font-black text-base rounded-2xl shadow-xl shadow-sky-900/30 transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{loading ? 'LOGGING IN...' : 'LOGIN TO ACCOUNT'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* New User Register Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs font-semibold text-slate-500">
              DON'T HAVE AN ACCOUNT?
            </p>
            <button
              onClick={onNavigateToRegister}
              className="mt-2 w-full py-3 px-4 bg-sky-50 hover:bg-sky-100 text-sky-900 font-black text-sm rounded-2xl border border-sky-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>CREATE NEW ACCOUNT</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Official Guarantee Pill */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-900/60 rounded-full border border-sky-400/40 text-xs font-bold text-sky-200 shadow-md">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>The Government Lottery Officer • 500X Guaranteed Direct Payout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
