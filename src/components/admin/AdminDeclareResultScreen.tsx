import React, { useState } from 'react';
import { GameEntry, User, GameSettings } from '../../types';
import { storage } from '../../services/storage';
import { formatCurrency } from '../../data/countries';
import { 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Dices, 
  ArrowRight, 
  AlertCircle, 
  Coins,
  History
} from 'lucide-react';

interface AdminDeclareResultScreenProps {
  entries: GameEntry[];
  settings: GameSettings;
  onResultDeclared: () => void;
}

export const AdminDeclareResultScreen: React.FC<AdminDeclareResultScreenProps> = ({
  entries,
  settings,
  onResultDeclared,
}) => {
  const [d1, setD1] = useState('7');
  const [d2, setD2] = useState('7');
  const [d3, setD3] = useState('7');

  const [loading, setLoading] = useState(false);
  const [lastBatchSummary, setLastBatchSummary] = useState<{
    declaredNumber: string;
    totalProcessed: number;
    winnersCount: number;
    notMatchedCount: number;
    winningPayouts: Record<string, number>;
  } | null>(null);

  const pendingEntries = entries.filter((e) => e.status === 'PENDING');
  const selectedNumberString = `${d1}${d2}${d3}`;

  const handleRandom = () => {
    setD1(Math.floor(Math.random() * 10).toString());
    setD2(Math.floor(Math.random() * 10).toString());
    setD3(Math.floor(Math.random() * 10).toString());
  };

  const handleDigitChange = (index: 1 | 2 | 3, value: string) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    if (!clean) return;
    if (index === 1) setD1(clean);
    if (index === 2) setD2(clean);
    if (index === 3) setD3(clean);
  };

  const handleDeclareResult = () => {
    setLoading(true);

    setTimeout(() => {
      const res = storage.declareWinningNumber(selectedNumberString);
      setLoading(false);

      if (res.success) {
        setLastBatchSummary({
          declaredNumber: selectedNumberString,
          totalProcessed: res.totalProcessed,
          winnersCount: res.winnersCount,
          notMatchedCount: res.nonWinnersCount,
          winningPayouts: res.currencyBreakdown,
        });
        onResultDeclared();
      }
    }, 450);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#032242] via-[#094d82] to-[#032242] text-white rounded-3xl p-6 shadow-2xl border-2 border-sky-400/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-sky-300">
                OFFICIAL DRAW ENGINE
              </p>
              <h2 className="text-xl font-black text-white tracking-tight">
                Declare 3-Digit Winning Number
              </h2>
            </div>
          </div>
          <span className="text-xs font-black bg-amber-400 text-slate-950 px-3 py-1.5 rounded-full shadow-md">
            400X Payout
          </span>
        </div>

        {/* Pending Tickets Notice */}
        <div className="mt-4 pt-3 border-t border-sky-700/60 flex items-center justify-between text-xs">
          <span className="text-sky-200 font-medium">
            Active Tickets Ready for Draw:
          </span>
          <span className="font-black text-amber-300 text-sm">
            {pendingEntries.length} Pending Tickets ⏳
          </span>
        </div>
      </div>

      {/* Batch Summary Report after declaration (Requirement #10) */}
      {lastBatchSummary && (
        <div className="bg-gradient-to-br from-[#032242] via-[#094d82] to-slate-900 text-white rounded-3xl p-6 shadow-xl border-2 border-sky-400/50 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-sky-700/60 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-300" />
              <h3 className="font-black text-base text-white">
                DRAW DECLARED: #{lastBatchSummary.declaredNumber}
              </h3>
            </div>
            <span className="text-xs bg-sky-800 px-3 py-1 rounded-full text-sky-200 font-bold">
              BATCH PROCESSED ✅
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-sky-950/60 p-3 rounded-2xl border border-sky-600/30">
              <span className="text-slate-300 block font-bold text-[10px]">TOTAL PROCESSED</span>
              <span className="text-xl font-black text-white">{lastBatchSummary.totalProcessed}</span>
            </div>
            <div className="bg-sky-950/60 p-3 rounded-2xl border border-sky-600/30">
              <span className="text-amber-300 block font-bold text-[10px]">WINNERS (400X)</span>
              <span className="text-xl font-black text-amber-300">{lastBatchSummary.winnersCount} 🏆</span>
            </div>
            <div className="bg-sky-950/60 p-3 rounded-2xl border border-sky-600/30">
              <span className="text-rose-300 block font-bold text-[10px]">NOT MATCHED</span>
              <span className="text-xl font-black text-rose-300">{lastBatchSummary.notMatchedCount} ❌</span>
            </div>
          </div>

          {/* Credited Payouts by Currency */}
          <div className="bg-sky-950/70 p-3.5 rounded-2xl border border-sky-600/40 text-xs space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-300 block">
              AUTOMATICALLY CREDITED PAYOUTS BY CURRENCY:
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {Object.entries(lastBatchSummary.winningPayouts).map(([curr, amt]) => (
                <span key={curr} className="px-2.5 py-1 bg-sky-800 text-white rounded-lg font-black text-xs">
                  {curr}: +{formatCurrency(Number(amt), curr)}
                </span>
              ))}
              {Object.keys(lastBatchSummary.winningPayouts).length === 0 && (
                <span className="text-slate-400 italic">No winning payouts in this round.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Declaration Card */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-sky-500/30 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              SET 3-DIGIT WINNING NUMBER
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              Select any number from 000 to 999
            </p>
          </div>

          <button
            type="button"
            onClick={handleRandom}
            className="py-2 px-3.5 bg-sky-100 hover:bg-sky-200 text-sky-900 font-black text-xs rounded-xl flex items-center gap-1.5 border border-sky-300 cursor-pointer"
          >
            <Dices className="w-4 h-4 text-sky-700" />
            <span>RANDOM DRAW</span>
          </button>
        </div>

        {/* 3 Giant Digit Blocks (Requirement #30: Extra Large Typography) */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 py-4">
          {[
            { val: d1, set: (v: string) => handleDigitChange(1, v), label: 'Digit 1' },
            { val: d2, set: (v: string) => handleDigitChange(2, v), label: 'Digit 2' },
            { val: d3, set: (v: string) => handleDigitChange(3, v), label: 'Digit 3' },
          ].map((digit, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="9"
                  value={digit.val}
                  onChange={(e) => digit.set(e.target.value)}
                  className="w-20 h-28 sm:w-24 sm:h-32 text-center text-5xl sm:text-6xl font-black font-mono bg-gradient-to-b from-amber-50 to-amber-100 text-slate-900 rounded-3xl border-3 border-amber-400 focus:border-sky-700 shadow-lg outline-none"
                />
                <span className="absolute top-1.5 left-2 text-[9px] font-black text-amber-700 uppercase">
                  D{idx + 1}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => digit.set(String((parseInt(digit.val || '0') + 9) % 10))}
                  className="w-8 h-7 bg-slate-100 hover:bg-sky-200 text-slate-700 rounded-lg text-xs font-black flex items-center justify-center cursor-pointer"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => digit.set(String((parseInt(digit.val || '0') + 1) % 10))}
                  className="w-8 h-7 bg-slate-100 hover:bg-sky-200 text-slate-700 rounded-lg text-xs font-black flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Announcement Preview */}
        <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-center space-y-1">
          <p className="text-xs font-bold text-slate-600">
            Selected Winning Number to Declare:
          </p>
          <p className="text-3xl font-black text-sky-900 font-mono tracking-wider">
            🏆 #{selectedNumberString}
          </p>
        </div>

        {/* Safety Declaration Info */}
        <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200 font-medium">
          <p className="font-black text-slate-900">⚡ What happens when you declare:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>All {pendingEntries.length} pending entries are checked against <strong>#{selectedNumberString}</strong>.</li>
            <li>Matching tickets are marked <strong>WINNER 🏆</strong> and automatically credited <strong>Game Amount × 400</strong> in their native currency.</li>
            <li>Non-matching tickets are marked <strong>NOT MATCHED ❌</strong>.</li>
            <li>Single-credit protection ensures winners are credited exactly once.</li>
          </ul>
        </div>

        {/* Big Declare Action Button (Requirement #33) */}
        <button
          type="button"
          disabled={loading}
          onClick={handleDeclareResult}
          className="w-full py-4.5 px-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-lg rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
        >
          <Sparkles className="w-6 h-6 stroke-[2.5]" />
          <span>
            {loading ? 'PROCESSING DRAW & CREDITING WINNERS...' : `DECLARE #${selectedNumberString} & PROCESS ${pendingEntries.length} TICKETS`}
          </span>
          <ArrowRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
};
