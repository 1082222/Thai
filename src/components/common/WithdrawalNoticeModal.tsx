import React from 'react';
import { AlertTriangle, ShieldCheck, ArrowRight, FileText } from 'lucide-react';

interface WithdrawalNoticeModalProps {
  onContinue: () => void;
  onUpdateDetails: () => void;
  onClose: () => void;
}

export const WithdrawalNoticeModal: React.FC<WithdrawalNoticeModalProps> = ({
  onContinue,
  onUpdateDetails,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border-2 border-sky-500/30 overflow-hidden relative">
        {/* Top Warning Icon */}
        <div className="mx-auto w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mb-4 ring-4 ring-amber-50">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-center text-slate-900 tracking-tight mb-2 uppercase">
          IMPORTANT NOTICE
        </h3>

        {/* Notice Content */}
        <div className="bg-sky-50/70 rounded-2xl p-4 border border-sky-200/80 text-xs text-slate-700 leading-relaxed space-y-2 mb-6">
          <p className="font-bold text-sky-950">
            Before processing your withdrawal, please ensure that your account details and required documents are updated and correct.
          </p>
          <p>
            Your withdrawal request may require verification of your account information and supporting documents.
          </p>
          <div className="flex items-center gap-2 pt-1 font-bold text-sky-900 text-[13px]">
            <ShieldCheck className="w-4 h-4 text-sky-600 flex-shrink-0" />
            <span>Please update your bank account details and required documents before submitting a withdrawal request.</span>
          </div>
        </div>

        {/* Two Large Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onUpdateDetails}
            className="w-full py-3.5 px-4 bg-sky-100 hover:bg-sky-200 text-sky-900 font-black rounded-2xl border border-sky-300 transition-all flex items-center justify-center gap-2 text-sm shadow-sm cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>UPDATE DETAILS</span>
          </button>

          <button
            onClick={onContinue}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 hover:from-sky-500 hover:to-sky-700 text-white font-black rounded-2xl shadow-lg shadow-sky-900/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <span>CONTINUE WITHDRAWAL</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
