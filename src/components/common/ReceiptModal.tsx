import React, { useState } from 'react';
import { GameEntry } from '../../types';
import { maskAccountNumber, storage } from '../../services/storage';
import { formatCurrency, getCountryByCode } from '../../data/countries';
import { GovernmentLotteryHeader } from './Mega3UpHeader';
import { 
  X, 
  Copy, 
  Share2, 
  Check, 
  Trophy, 
  Calendar, 
  Smartphone, 
  Building2, 
  User as UserIcon, 
  Sparkles,
  Hash
} from 'lucide-react';

interface ReceiptModalProps {
  entry: GameEntry;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ entry, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const country = getCountryByCode(entry.countryCode);
  const user = storage.getUserById(entry.userId);
  const account = user?.bankAccounts?.find((a) => a.id === entry.bankAccountId) || user?.accountDetails;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WINNER':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-sky-950 font-black text-sm rounded-full shadow-sm animate-pulse">
            <Trophy className="w-4 h-4 fill-sky-950" />
            WINNER 400X!
          </span>
        );
      case 'LOSER':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 text-white font-black text-sm rounded-full shadow-sm">
            NOT MATCHED ❌
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500 text-white font-black text-sm rounded-full shadow-sm">
            PENDING ⏳
          </span>
        );
    }
  };

  const receiptPlainText = `
========================================
THE GOVERNMENT LOTTERY OFFICER - OFFICIAL RECEIPT
========================================
Ticket ID: ${entry.id}
Date: ${new Date(entry.createdAt).toLocaleString()}

CUSTOMER DETAILS:
Name: ${entry.userName}
Mobile: ${entry.userMobile}
Country: ${entry.country} (${country.flag})
Currency: ${entry.currency}

BENEFICIARY ACCOUNT DETAILS:
Holder: ${account?.accountHolderName || entry.userName}
Bank: ${account?.bankName || 'Verified Bank'}
Account No: ${account?.accountNumber ? maskAccountNumber(account.accountNumber) : 'Not Added'}
IFSC Code: ${account?.ifscCode || 'N/A'}

DRAW DETAILS:
Selected 3-Digit Number: ${entry.gameNumber}
Game Amount: ${formatCurrency(entry.gameAmount, entry.currency)}
Potential Winning (400x): ${formatCurrency(entry.potentialWinning, entry.currency)}
Current Status: ${entry.status}
${entry.status === 'WINNER' ? `Winning Credited: ${formatCurrency(entry.actualWinning, entry.currency)} 🏆` : ''}

🍀 ALL THE BEST! 🍀
========================================
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(receiptPlainText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `The Government Lottery Ticket #${entry.gameNumber}`,
          text: receiptPlainText.trim(),
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border-2 border-sky-500/30 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#032242] via-[#094d82] to-[#032242] text-white p-4 relative flex-shrink-0 border-b-2 border-amber-400">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-black/70 rounded-full text-white transition-colors cursor-pointer z-20"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="pr-8">
            <GovernmentLotteryHeader
              variant="compact"
              subText="OFFICIAL RECEIPT"
              showPartnerBadge={false}
            />
          </div>

          <p className="text-[11px] text-sky-200/90 mt-2 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>Ticket Issue: {new Date(entry.createdAt).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}</span>
          </p>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800 bg-sky-50/30">
          {/* Top Lucky Number Banner */}
          <div className="bg-white rounded-2xl p-4 border-2 border-sky-400/40 shadow-sm text-center">
            <p className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
              SELECTED 3-DIGIT LUCKY NUMBER
            </p>
            <div className="flex items-center justify-center gap-3 my-2">
              {entry.gameNumber.split('').map((digit, idx) => (
                <div
                  key={idx}
                  className="w-14 h-16 bg-gradient-to-b from-sky-600 via-sky-700 to-[#032242] text-white rounded-2xl flex items-center justify-center text-3xl font-black shadow-md border-2 border-sky-300 ring-2 ring-sky-500/20 font-mono"
                >
                  {digit}
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Status:</span>
              {getStatusBadge(entry.status)}
            </div>
          </div>

          {/* Section 1: Customer Details */}
          <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-sky-900 font-extrabold text-sm border-b border-sky-50 pb-1.5">
              <UserIcon className="w-4 h-4 text-sky-600" />
              <span>CUSTOMER DETAILS</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Customer Name</span>
                <span className="font-bold text-slate-800 text-sm">{entry.userName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Mobile Number</span>
                <span className="font-bold text-slate-800 text-sm flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-sky-600" />
                  {entry.userMobile}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Country</span>
                <span className="font-bold text-slate-800 text-sm flex items-center gap-1">
                  <span>{country.flag}</span>
                  <span>{entry.country}</span>
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Currency</span>
                <span className="font-bold text-sky-700 text-sm bg-sky-50 px-2 py-0.5 rounded-md inline-block border border-sky-200">
                  {entry.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Account Details */}
          <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-sky-900 font-extrabold text-sm border-b border-sky-50 pb-1.5">
              <Building2 className="w-4 h-4 text-sky-600" />
              <span>BENEFICIARY ACCOUNT DETAILS</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Account Holder</span>
                <span className="font-bold text-slate-800">
                  {account?.accountHolderName || entry.userName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Bank Name</span>
                <span className="font-bold text-slate-800">
                  {account?.bankName || 'Verified Bank'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Account Number</span>
                <span className="font-mono font-bold text-slate-800">
                  {account?.accountNumber ? maskAccountNumber(account.accountNumber) : 'XXXX8901'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">IFSC / Code</span>
                <span className="font-mono font-bold text-slate-800">
                  {account?.ifscCode || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Game & Winning Details */}
          <div className="bg-gradient-to-br from-[#032242] to-sky-950 text-white rounded-2xl p-4 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-sky-700/50 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-sky-300 uppercase">
                <Hash className="w-3.5 h-3.5" />
                <span>DRAW & WINNING BREAKDOWN</span>
              </div>
              <span className="text-xs bg-sky-800/80 px-2 py-0.5 rounded text-sky-200 font-mono">
                400X PAYOUT
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sky-300/80 text-xs block font-medium">Ticket Amount</span>
                <span className="text-lg font-black text-white">
                  {formatCurrency(entry.gameAmount, entry.currency)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-amber-300 text-xs block font-bold flex items-center justify-end gap-1">
                  <Sparkles className="w-3 h-3" /> Potential Winning
                </span>
                <span className="text-xl font-black text-amber-300 drop-shadow">
                  {formatCurrency(entry.potentialWinning, entry.currency)}
                </span>
              </div>
            </div>

            {entry.status === 'WINNER' && (
              <div className="bg-sky-800/80 rounded-xl p-3 border border-sky-400/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-300" />
                  <span className="text-xs font-bold text-sky-100">Actual Won & Credited:</span>
                </div>
                <span className="text-lg font-black text-amber-300">
                  +{formatCurrency(entry.actualWinning, entry.currency)}
                </span>
              </div>
            )}
          </div>

          {/* Section 4: Prominent Banner */}
          <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 text-white rounded-2xl p-3.5 text-center shadow-md ring-2 ring-sky-300/50">
            <p className="text-lg font-black tracking-wide drop-shadow-sm flex items-center justify-center gap-2">
              <span>🍀</span>
              <span>ALL THE BEST!</span>
              <span>🍀</span>
            </p>
            <p className="text-[11px] text-sky-100 font-medium mt-0.5">
              Thank you for playing The Government Lottery. Winning result will be declared soon.
            </p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-white border-t border-sky-100 flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold rounded-xl border border-sky-200 transition-all flex items-center justify-center gap-1.5 text-sm cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-sky-600" /> : <Copy className="w-4 h-4 text-sky-700" />}
            <span>{copied ? 'Copied!' : 'Copy Receipt'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex-1 py-3 px-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md shadow-sky-900/20 transition-all flex items-center justify-center gap-1.5 text-sm cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{shared ? 'Shared!' : 'Share Receipt'}</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
