import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../../data/countries';
import { Trophy, Sparkles, CheckCircle2, ArrowRight, X } from 'lucide-react';

interface WinnerCelebrationProps {
  entry: any;
  onClose: () => void;
  onViewReceipt: () => void;
}

export const WinnerCelebration: React.FC<WinnerCelebrationProps> = ({
  entry,
  onClose,
  onViewReceipt,
}) => {
  const amount = entry.actualWinning || entry.potentialWinning;
  const currency = entry.currency;
  const gameNumber = entry.gameNumber;

  useEffect(() => {
    // Fire festive sky blue, royal blue and gold confetti burst
    const count = 250;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#0284C7', '#38BDF8', '#0369A1', '#FBBF24', '#F59E0B', '#FFFFFF'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-gradient-to-b from-[#032242] via-[#094d82] to-slate-950 text-white w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl border-2 border-sky-400/50 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-sky-400/25 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-sky-900/60 hover:bg-sky-800 rounded-full text-sky-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy icon */}
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 rounded-3xl p-4 shadow-xl shadow-amber-500/20 ring-4 ring-amber-300/30 flex items-center justify-center mb-4 transform hover:scale-105 transition-transform">
          <Trophy className="w-14 h-14 text-sky-950 stroke-[2.5]" />
        </div>

        {/* Heading */}
        <div className="space-y-1 mb-4">
          <p className="text-amber-300 font-extrabold text-sm tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>CONGRATULATIONS!</span>
            <Sparkles className="w-4 h-4" />
          </p>
          <h2 className="text-2xl font-black tracking-tight text-white">
            YOU WON!
          </h2>
          <p className="text-xs text-sky-200 font-medium">
            Winning Match: <span className="font-mono font-black text-amber-300 text-sm">#{gameNumber}</span>
          </p>
        </div>

        {/* Big Winning Amount */}
        <div className="bg-gradient-to-r from-sky-900/80 via-sky-800/80 to-sky-900/80 rounded-2xl p-4 border border-sky-400/40 my-4 shadow-inner">
          <p className="text-xs text-sky-200 uppercase font-bold tracking-wider mb-0.5">
            TOTAL WINNING AMOUNT (500X)
          </p>
          <p className="text-3xl font-black text-amber-300 drop-shadow-md">
            {formatCurrency(amount, currency)}
          </p>
        </div>

        {/* Credited Note */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-sky-200 bg-sky-900/50 py-2.5 px-3 rounded-xl border border-sky-500/30 mb-6">
          <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span>Winning amount successfully credited to your wallet.</span>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={onViewReceipt}
            className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-black rounded-2xl shadow-lg shadow-sky-900/40 flex items-center justify-center gap-2 transition-all transform active:scale-98 text-base cursor-pointer"
          >
            <span>VIEW OFFICIAL RECEIPT</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold text-sky-300 hover:text-white transition-colors cursor-pointer"
          >
            Close Celebration
          </button>
        </div>
      </div>
    </div>
  );
};
