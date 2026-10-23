import React, { useState } from 'react';
import { Mega3UpHeader } from '../common/Mega3UpHeader';
import { COUNTRIES } from '../../data/countries';
import { CountryCode, User } from '../../types';
import { storage, ADMIN_CREDENTIALS } from '../../services/storage';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Globe2, 
  User as UserIcon, 
  Smartphone, 
  Lock, 
  ShieldCheck, 
  AlertCircle,
  Coins
} from 'lucide-react';

interface RegisterScreenProps {
  onRegisterSuccess: (user: User) => void;
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
}) => {
  // Step 1: Country Selection (MUST HAPPEN FIRST)
  // Step 2: Personal Details & PIN
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCountryCode, setSelectedCountryCode] = useState<CountryCode>('SAR');
  
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedCountry = COUNTRIES.find((c) => c.code === selectedCountryCode) || COUNTRIES[0];

  const handleSelectCountryAndProceed = (code: CountryCode) => {
    setSelectedCountryCode(code);
    setError(null);
    setStep(2);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = fullName.trim();
    const cleanMobile = mobileNumber.trim();
    const cleanPass = password.trim();

    if (!cleanName) {
      setError('Please enter your Full Name');
      return;
    }
    if (!cleanMobile) {
      setError('Please enter your Mobile Number');
      return;
    }
    if (cleanPass.length < 4) {
      setError('Password / PIN must be at least 4 characters');
      return;
    }
    if (cleanPass !== confirmPassword.trim()) {
      setError('Passwords do not match');
      return;
    }

    // Check if trying to register admin number
    if (cleanMobile === ADMIN_CREDENTIALS.mobile) {
      setError('This mobile number is reserved. Please use another mobile number.');
      return;
    }

    // Check if user already exists
    const existing = storage.getUserByMobile(cleanMobile);
    if (existing) {
      setError('A member with this mobile number already exists. Please login.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newUser = storage.createUser({
        fullName: cleanName,
        mobileNumber: cleanMobile,
        password: cleanPass,
        countryCode: selectedCountryCode,
      });

      storage.setCurrentUserId(newUser.id);
      setLoading(false);
      onRegisterSuccess(newUser);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#032242] to-slate-950 flex flex-col justify-center px-3 sm:px-6 py-6 text-white relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg mx-auto relative z-10 space-y-4">
        {/* Top Official Banner Heading */}
        <Mega3UpHeader
          variant="banner"
          subText="NEW REGISTRATION"
        />

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3">
          <div className={`flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full ${
            step === 1 
              ? 'bg-amber-400 text-sky-950 shadow-md ring-2 ring-amber-300' 
              : 'bg-sky-800 text-sky-200'
          }`}>
            <span>1</span>
            <span>Select Country</span>
          </div>
          <div className="w-6 h-0.5 bg-sky-700" />
          <div className={`flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full ${
            step === 2 
              ? 'bg-amber-400 text-sky-950 shadow-md ring-2 ring-amber-300' 
              : 'bg-sky-800 text-sky-200'
          }`}>
            <span>2</span>
            <span>Account Details</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-sky-500/30">
          {step === 1 ? (
            /* ================= STEP 1: COUNTRY SELECTION ================= */
            <div className="space-y-4">
              <div className="border-b border-sky-100 pb-3">
                <div className="flex items-center gap-2 text-sky-800 font-extrabold text-xs uppercase tracking-wider">
                  <Globe2 className="w-4 h-4 text-sky-600" />
                  <span>STEP 1: SELECT YOUR COUNTRY FIRST</span>
                </div>
                <h2 className="text-xl font-black text-sky-950 tracking-tight mt-1">
                  Choose Your Territory
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your wallet currency is automatically set based on country selection.
                </p>
              </div>

              {/* 5 Countries Cards */}
              <div className="space-y-2.5">
                {COUNTRIES.map((country) => {
                  const isSelected = selectedCountryCode === country.code;
                  return (
                    <button
                      key={country.id}
                      type="button"
                      onClick={() => handleSelectCountryAndProceed(country.code)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left group cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50/90 border-sky-600 ring-2 ring-sky-500/20 shadow-md'
                          : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50/30'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-3xl drop-shadow-sm">{country.flag}</span>
                        <div>
                          <p className="font-extrabold text-slate-900 text-base leading-tight group-hover:text-sky-900">
                            {country.name}
                          </p>
                          <p className="text-xs font-semibold text-sky-700 mt-0.5 flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5" />
                            <span>Currency: {country.currency} ({country.code})</span>
                          </p>
                        </div>
                      </div>

                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isSelected
                          ? 'bg-sky-600 border-sky-600 text-white'
                          : 'border-slate-300 text-transparent group-hover:border-sky-400'
                      }`}>
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <p className="text-[11px] font-semibold text-slate-400">
                  Only authorized GCC partner territories are supported.
                </p>
              </div>
            </div>
          ) : (
            /* ================= STEP 2: PERSONAL DETAILS ================= */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-sky-700 uppercase">
                    <span>{selectedCountry.flag}</span>
                    <span>{selectedCountry.name} ({selectedCountry.code})</span>
                  </div>
                  <h2 className="text-xl font-black text-sky-950 tracking-tight mt-0.5">
                    Member Registration
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 bg-sky-50 px-2.5 py-1.5 rounded-lg border border-sky-200 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change</span>
                </button>
              </div>

              {/* Assigned Currency Notification */}
              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-sky-900">Assigned Wallet Currency:</span>
                <span className="font-black text-sky-800 bg-white px-2.5 py-1 rounded-lg border border-sky-300 shadow-xs">
                  {selectedCountry.currency} ({selectedCountry.code})
                </span>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-2 text-xs font-bold animate-shake">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-3.5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    FULL NAME
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter Full Name"
                      className="w-full pl-10 pr-3.5 py-3 bg-sky-50/40 text-slate-900 font-bold text-sm rounded-xl border-2 border-sky-200 focus:border-sky-600 focus:bg-white outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    MOBILE NUMBER
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="e.g. 9849020342"
                      className="w-full pl-10 pr-3.5 py-3 bg-sky-50/40 text-slate-900 font-bold text-sm rounded-xl border-2 border-sky-200 focus:border-sky-600 focus:bg-white outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Password / PIN */}
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    PASSWORD / SECURE PIN
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create Password or PIN"
                      className="w-full pl-10 pr-3.5 py-3 bg-sky-50/40 text-slate-900 font-bold text-sm rounded-xl border-2 border-sky-200 focus:border-sky-600 focus:bg-white outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    CONFIRM PASSWORD / PIN
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter Password"
                      className="w-full pl-10 pr-3.5 py-3 bg-sky-50/40 text-slate-900 font-bold text-sm rounded-xl border-2 border-sky-200 focus:border-sky-600 focus:bg-white outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 hover:from-sky-500 hover:to-sky-700 text-white font-black text-base rounded-2xl shadow-lg shadow-sky-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
                >
                  <span>{loading ? 'CREATING ACCOUNT...' : 'REGISTER & START PLAYING'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

          {/* Already have an account */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs font-semibold text-slate-500">
              ALREADY REGISTERED?
            </p>
            <button
              onClick={onNavigateToLogin}
              className="mt-1 text-sm font-black text-sky-700 hover:text-sky-900 underline underline-offset-4 cursor-pointer"
            >
              LOGIN TO YOUR ACCOUNT
            </button>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs text-sky-300/80">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Encrypted Offline-First Local Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
};
