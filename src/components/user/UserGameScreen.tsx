import React, { useState } from 'react';
import { User, GameEntry } from '../../types';
import { formatCurrency, getCountryByCode } from '../../data/countries';
import { storage } from '../../services/storage';
import { Mega3UpHeader } from '../common/Mega3UpHeader';
import { 
  Gamepad2, 
  Sparkles, 
  Coins, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Dices, 
  Wallet
} from 'lucide-react';

interface UserGameScreenProps {
  user: User;
  onEntrySuccess: (entry: GameEntry) => void;
  onNavigateToWallet: () => void;
}

export const UserGameScreen: React.FC<UserGameScreenProps> = ({
  user,
  onEntrySuccess,
  onNavigateToWallet,
}) => {
  const country = getCountryByCode(user.countryCode);

  // 3-digit picker states (each digit 0-9)
  const [d1, setD1] = useState('7');
  const [d2, setD2] = useState('7');
  const [d3, setD3] = useState('7');

  const [gameAmount, setGameAmount] = useState<number | string>(10);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedNumberString = `${d1}${d2}${d3}`;
  const numericAmount = Number(gameAmount) || 0;
  const potentialWinning = numericAmount * 500;

  const quickAmountOptions = [5, 10, 20, 50, 100];

  const handleDigitChange = (digitIndex: number, value: string) => {
    const val = value.slice(-1);
    if (val === '' || (val >= '0' && val <= '9')) {
      if (digitIndex === 1) setD1(val || '0');
      if (digitIndex === 2) setD2(val || '0');
      if (digitIndex === 3) setD3(val || '0');
    }
  };

  const handleRandomNumber = () => {
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setD1(rand[0]);
    setD2(rand[1]);
    setD3(rand[2]);
  };

  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (numericAmount <= 0) {
      setError('Please enter a valid game amount greater than 0.');
      return;
    }

    if (user.walletBalance < numericAmount) {
      setError(
        `Insufficient wallet balance! Current balance is ${formatCurrency(user.walletBalance, user.currency)}. Please adjust amount or request deposit.`
      );
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = storage.createGameEntry({
        userId: user.id,
        gameNumber: selectedNumberString,
        gameAmount: numericAmount,
      });

      setLoading(false);

      if (!res.success || !res.entry) {
        setError(res.error || 'Failed to submit entry. Please try again.');
      } else {
        onEntrySuccess(res.entry);
      }
    }, 350);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Official Government Lottery Officer Heading Banner */}
      <Mega3UpHeader
        variant="banner"
        subText="500X OFFICIAL LUCKY DRAW"
      />

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#032242] via-[#094d82] to-[#032242] text-white rounded-3xl p-5 shadow-lg border-2 border-sky-400/40 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                THE GOVERNMENT LOTTERY
              </h2>
            </div>
            <p className="text-xs text-sky-200 font-semibold mt-1 flex items-center gap-1.5">
              <span>Select any 3-digit number from 000 to 999</span>
              <span>•</span>
              <span className="text-amber-300 font-black">500X WINNING MULTIPLIER</span>
            </p>
          </div>

          <div className="hidden sm:block text-right">
            <span className="text-xs font-bold text-sky-200 block uppercase">Selected Country</span>
            <span className="text-sm font-black text-white flex items-center gap-1">
              <span>{country.flag}</span>
              <span>{user.country}</span>
            </span>
          </div>
        </div>

        {/* Current Wallet Balance Display */}
        <div className="mt-4 pt-3 border-t border-sky-600/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-950/70 rounded-xl flex items-center justify-center text-sky-300 border border-sky-500/40">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-sky-300 tracking-wider block">
                CURRENT WALLET BALANCE
              </span>
              <span className="text-lg font-black text-white">
                {formatCurrency(user.walletBalance, user.currency)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToWallet}
            className="text-xs font-black text-sky-950 bg-sky-300 hover:bg-sky-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            My Wallet
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border-2 border-rose-200 text-rose-800 rounded-2xl flex items-center gap-3 text-xs font-bold animate-shake shadow-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <div className="flex-1">
            <p>{error}</p>
            {user.walletBalance < numericAmount && (
              <button
                type="button"
                onClick={onNavigateToWallet}
                className="mt-1 text-sky-800 underline font-extrabold cursor-pointer"
              >
                View wallet options →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Game Entry Card */}
      <form onSubmit={handleSubmitEntry} className="bg-white rounded-3xl p-6 shadow-xl border-2 border-sky-500/30 space-y-6">
        {/* Country & Currency Reminder */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-sky-50/60 p-3 rounded-2xl border border-sky-100">
          <div>
            <span className="text-slate-500 font-bold block text-[10px] uppercase">SELECTED COUNTRY</span>
            <span className="font-extrabold text-slate-800 flex items-center gap-1 mt-0.5">
              <span>{country.flag}</span>
              <span>{country.name}</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 font-bold block text-[10px] uppercase">CURRENCY</span>
            <span className="font-black text-sky-800 bg-white px-2 py-0.5 rounded-lg border border-sky-200 inline-block mt-0.5">
              {user.currency}
            </span>
          </div>
        </div>

        {/* Section 1: 3-Digit Number Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                SELECT YOUR 3-DIGIT NUMBER
              </label>
              <p className="text-[11px] font-semibold text-slate-500">
                Range: 000 to 999 (always 3 digits with leading zeros)
              </p>
            </div>

            <button
              type="button"
              onClick={handleRandomNumber}
              className="py-1.5 px-3 bg-sky-100 hover:bg-sky-200 text-sky-900 font-black text-xs rounded-xl flex items-center gap-1.5 border border-sky-300 transition-colors cursor-pointer"
            >
              <Dices className="w-4 h-4 text-sky-700" />
              <span>LUCKY PICK</span>
            </button>
          </div>

          {/* 3 Giant Digit Blocks */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 py-2">
            {[
              { val: d1, set: (v: string) => handleDigitChange(1, v), label: 'Digit 1' },
              { val: d2, set: (v: string) => handleDigitChange(2, v), label: 'Digit 2' },
              { val: d3, set: (v: string) => handleDigitChange(3, v), label: 'Digit 3' },
            ].map((digit, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="9"
                    value={digit.val}
                    onChange={(e) => digit.set(e.target.value)}
                    className="w-20 h-24 sm:w-24 sm:h-28 text-center text-4xl sm:text-5xl font-black font-mono bg-gradient-to-b from-sky-50 to-sky-100 text-sky-950 rounded-2xl border-3 border-sky-500 focus:border-sky-700 focus:ring-4 focus:ring-sky-500/20 shadow-md outline-none transition-all"
                  />
                  <div className="absolute top-1 left-1.5 text-[9px] font-black text-sky-600 uppercase">
                    D{idx + 1}
                  </div>
                </div>

                {/* Up/Down Quick Step Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => digit.set(String((parseInt(digit.val || '0') + 9) % 10))}
                    className="w-7 h-6 bg-slate-100 hover:bg-sky-200 text-slate-700 rounded-lg text-xs font-black flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => digit.set(String((parseInt(digit.val || '0') + 1) % 10))}
                    className="w-7 h-6 bg-slate-100 hover:bg-sky-200 text-slate-700 rounded-lg text-xs font-black flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <span className="text-xs font-bold text-slate-600">
              Selected Number: <span className="text-base font-black text-sky-800 font-mono">#{selectedNumberString}</span>
            </span>
          </div>
        </div>

        {/* Section 2: Enter Game Amount */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
              ENTER TICKET AMOUNT ({user.currency})
            </label>
            <span className="text-xs font-bold text-sky-700">
              User Currency: {user.currency}
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sky-700 font-black text-lg">
              <Coins className="w-5 h-5 mr-1" />
            </div>
            <input
              type="number"
              min="1"
              max={user.walletBalance > 0 ? user.walletBalance : undefined}
              value={gameAmount}
              onChange={(e) => setGameAmount(e.target.value)}
              placeholder="Enter Amount"
              className="w-full pl-12 pr-16 py-4 bg-sky-50/50 focus:bg-white text-slate-900 font-black text-2xl rounded-2xl border-2 border-sky-300 focus:border-sky-600 focus:ring-4 focus:ring-sky-500/20 outline-none transition-all"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-sky-800 font-black text-base">
              {user.currency}
            </div>
          </div>

          {/* Quick preset amount chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 mr-1">Quick:</span>
            {quickAmountOptions.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setGameAmount(amt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                  Number(gameAmount) === amt
                    ? 'bg-sky-700 text-white border-sky-700 shadow-sm'
                    : 'bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100'
                }`}
              >
                +{amt} {user.currency}
              </button>
            ))}
            {user.walletBalance > 0 && (
              <button
                type="button"
                onClick={() => setGameAmount(Math.floor(user.walletBalance))}
                className="px-3 py-1.5 rounded-xl text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 cursor-pointer"
              >
                MAX ({user.walletBalance} {user.currency})
              </button>
            )}
          </div>
        </div>

        {/* Section 3: Potential Winning Display (500X) */}
        <div className="bg-gradient-to-br from-[#032242] via-[#094d82] to-slate-950 text-white rounded-2xl p-5 shadow-lg border border-sky-400/50 space-y-2">
          <div className="flex items-center justify-between border-b border-sky-700/60 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 uppercase tracking-wide">
              <Sparkles className="w-4 h-4" />
              <span>POTENTIAL WINNING (500X MULTIPLIER)</span>
            </div>
            <span className="text-[11px] bg-sky-800 px-2 py-0.5 rounded text-sky-200 font-mono">
              1 {user.currency} = 500 {user.currency}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-xs text-sky-200 font-semibold">
                Calculation: {numericAmount} × 500 =
              </p>
              <p className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight drop-shadow-md">
                🏆 {formatCurrency(potentialWinning, user.currency)}
              </p>
            </div>
          </div>
        </div>

        {/* Wallet Safety Notice */}
        <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 flex items-center gap-2.5 text-xs text-sky-900 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
          <span>
            {formatCurrency(numericAmount, user.currency)} will be automatically deducted from your wallet upon entry.
          </span>
        </div>

        {/* Submit Game Entry Button */}
        <button
          type="submit"
          disabled={loading || user.walletBalance < numericAmount}
          className={`w-full py-4.5 px-6 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer ${
            user.walletBalance < numericAmount
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 hover:from-sky-500 hover:to-sky-700 text-white shadow-sky-900/30'
          }`}
        >
          <Gamepad2 className="w-6 h-6" />
          <span>
            {loading ? 'SUBMITTING ENTRY...' : `SUBMIT ENTRY (${formatCurrency(numericAmount, user.currency)})`}
          </span>
          <ArrowRight className="w-5 h-5 ml-1" />
        </button>
      </form>
    </div>
  );
};
