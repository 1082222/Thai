import React from 'react';
import { GameEntry, User, GameSettings } from '../../types';
import { formatCurrency } from '../../data/countries';
import { Mega3UpHeader } from '../common/Mega3UpHeader';
import { 
  Trophy, 
  Sparkles, 
  Clock, 
  Gamepad2, 
  ArrowRight
} from 'lucide-react';

interface UserResultsScreenProps {
  user: User;
  entries: GameEntry[];
  settings: GameSettings;
  onOpenReceipt: (entry: GameEntry) => void;
  onTriggerCelebration: (entry: GameEntry) => void;
  onNavigateToGame: () => void;
}

export const UserResultsScreen: React.FC<UserResultsScreenProps> = ({
  user,
  entries,
  settings,
  onOpenReceipt,
  onTriggerCelebration,
  onNavigateToGame,
}) => {
  const winnerEntries = entries.filter((e) => e.status === 'WINNER');
  const pendingEntries = entries.filter((e) => e.status === 'PENDING');

  return (
    <div className="space-y-5 pb-6">
      {/* Official Government Lottery Officer Heading Banner */}
      <Mega3UpHeader
        variant="banner"
        subText="OFFICIAL RESULTS"
      />

      {/* Latest Declared Winning Number Banner */}
      <div className="bg-gradient-to-br from-[#032242] via-[#094d82] to-slate-950 text-white rounded-3xl p-6 shadow-2xl border-2 border-sky-400/50 text-center relative overflow-hidden">
        <div className="flex items-center justify-center gap-2 mb-2 text-amber-300 font-black text-xs uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          <span>OFFICIAL WINNING DRAW RESULT</span>
          <Sparkles className="w-4 h-4" />
        </div>

        <p className="text-xs text-sky-200 font-semibold mb-2">
          {settings.lastDeclaredAt
            ? `Declared on ${new Date(settings.lastDeclaredAt).toLocaleDateString()} at ${new Date(settings.lastDeclaredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : 'Live Official Draw'}
        </p>

        {/* 3-Digit Winning Number Display */}
        <div className="flex items-center justify-center gap-3 my-3">
          {(settings.lastWinningNumber || '777').split('').map((digit, idx) => (
            <div
              key={idx}
              className="w-16 h-20 sm:w-20 sm:h-24 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-sky-950 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl font-black font-mono shadow-xl border-3 border-amber-300 ring-4 ring-amber-400/30"
            >
              {digit}
            </div>
          ))}
        </div>

        <p className="text-xs font-bold text-amber-200 mt-2">
          Winning Multiplier: 500X • 1 {user.currency} = 500 {user.currency}
        </p>
      </div>

      {/* Winner Spotlight Banner if user won */}
      {winnerEntries.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-sky-950 rounded-3xl p-5 shadow-xl border-2 border-amber-300 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-sky-950" />
              <h3 className="font-black text-lg">
                YOU HAVE {winnerEntries.length} WINNING TICKET{winnerEntries.length > 1 ? 'S' : ''}!
              </h3>
            </div>
            <span className="text-xs font-black bg-sky-950 text-amber-300 px-3 py-1 rounded-full">
              🏆 WINNER
            </span>
          </div>

          <div className="space-y-2">
            {winnerEntries.map((win) => (
              <div
                key={win.id}
                className="bg-white/95 rounded-2xl p-3.5 flex items-center justify-between shadow-xs"
              >
                <div>
                  <span className="font-mono font-black text-lg text-sky-950">
                    Match #{win.gameNumber}
                  </span>
                  <p className="text-xs font-bold text-sky-800">
                    Won: {formatCurrency(win.actualWinning, win.currency)} (Credited to Wallet)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onTriggerCelebration(win)}
                    className="py-1.5 px-3 bg-sky-700 hover:bg-sky-800 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Celebration 🎉
                  </button>
                  <button
                    onClick={() => onOpenReceipt(win)}
                    className="py-1.5 px-3 bg-amber-200 hover:bg-amber-300 text-sky-950 font-black text-xs rounded-xl cursor-pointer"
                  >
                    Receipt 🎫
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Tickets Section */}
      <div className="bg-white rounded-3xl p-5 border-2 border-sky-500/20 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>PENDING TICKETS AWAITING NEXT DRAW</span>
          </h4>
          <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
            {pendingEntries.length} Active
          </span>
        </div>

        {pendingEntries.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            <p>You have no pending tickets for the upcoming draw.</p>
            <button
              onClick={onNavigateToGame}
              className="mt-2 text-sky-800 font-extrabold underline inline-flex items-center gap-1 cursor-pointer"
            >
              Enter The Government Lottery now →
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {pendingEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => onOpenReceipt(entry)}
                className="p-3.5 bg-amber-50/40 hover:bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center font-mono font-black text-xl shadow-xs">
                    {entry.gameNumber}
                  </div>
                  <div>
                    <span className="font-black text-slate-900 text-sm">
                      Ticket #{entry.gameNumber}
                    </span>
                    <p className="text-xs font-semibold text-slate-500">
                      Amount: {formatCurrency(entry.gameAmount, entry.currency)} • Potential 500X: {formatCurrency(entry.potentialWinning, entry.currency)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-amber-500 text-white text-xs font-black rounded-full">
                    PENDING ⏳
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA to play */}
      <button
        onClick={onNavigateToGame}
        className="w-full py-4 bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 hover:from-sky-500 hover:to-sky-700 text-white font-black text-base rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer"
      >
        <Gamepad2 className="w-5 h-5" />
        <span>ENTER NEW 3-DIGIT TICKET</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
