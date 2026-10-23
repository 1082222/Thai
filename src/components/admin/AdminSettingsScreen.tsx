import React, { useState } from 'react';
import { GameSettings } from '../../types';
import { storage } from '../../services/storage';
import { 
  Settings, 
  KeyRound, 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  Smartphone, 
  FileCode,
  Lock,
  Save,
  AlertCircle
} from 'lucide-react';

interface AdminSettingsScreenProps {
  settings: GameSettings;
  onSettingsUpdated: () => void;
}

export const AdminSettingsScreen: React.FC<AdminSettingsScreenProps> = ({
  settings,
  onSettingsUpdated,
}) => {
  const [adminPassword, setAdminPassword] = useState(settings.adminPassword || 'SiddharthReddy@1234');
  const [adminPin, setAdminPin] = useState(settings.adminPin || '1234');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!adminPassword || adminPassword.length < 6) {
      setMessage({ type: 'error', text: 'Admin Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = storage.updateSettings({
        adminPassword: adminPassword.trim(),
        adminPin: adminPin.trim(),
      });
      setLoading(false);

      if (res.success) {
        setMessage({ type: 'success', text: 'Admin security credentials updated successfully!' });
        onSettingsUpdated();
      } else {
        setMessage({ type: 'error', text: 'Failed to update settings' });
      }
    }, 300);
  };

  const handleExportJSON = () => {
    const data = storage.exportAllData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `government_lottery_officer_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all game entries and restore default demo members?')) {
      storage.resetToDefaults();
      onSettingsUpdated();
      setMessage({ type: 'success', text: 'Application database reset to initial state.' });
    }
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#032242] via-[#094d82] to-[#032242] text-white rounded-3xl p-6 shadow-xl border-2 border-sky-400/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-950/70 border border-sky-500/40 flex items-center justify-center text-sky-300">
              <Settings className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-sky-200">
                SYSTEM CONFIGURATION
              </p>
              <h2 className="text-xl font-black text-white tracking-tight">
                Admin Settings & Backup
              </h2>
            </div>
          </div>
          <span className="text-xs font-black bg-amber-400 text-slate-950 px-3 py-1 rounded-full shadow-md">
            v2.4.0
          </span>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl border-2 flex items-center gap-3 text-xs font-bold ${
          message.type === 'success'
            ? 'bg-sky-50 border-sky-300 text-sky-900'
            : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-sky-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Admin Security Form */}
      <form onSubmit={handleSaveSecurity} className="bg-white rounded-3xl p-6 shadow-xl border-2 border-sky-500/30 space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-sky-600" />
          <span>ADMIN CREDENTIALS</span>
        </h3>

        <div className="space-y-1">
          <label className="block text-xs font-black text-slate-700 uppercase">
            ADMIN MOBILE NUMBER (FIXED IDENTIFIER)
          </label>
          <input
            type="text"
            value="9849020341"
            disabled
            className="w-full px-3.5 py-2.5 bg-slate-100 text-slate-600 font-mono font-bold text-xs rounded-xl border border-slate-200 cursor-not-allowed"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-black text-slate-700 uppercase">
            ADMIN MASTER PASSWORD
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-sky-50/40 text-slate-900 font-mono font-bold text-xs rounded-xl border-2 border-sky-200 focus:border-sky-600 outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-black text-slate-700 uppercase">
            ADMIN QUICK PIN
          </label>
          <input
            type="text"
            value={adminPin}
            onChange={(e) => setAdminPin(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-sky-50/40 text-slate-900 font-mono font-bold text-xs rounded-xl border-2 border-sky-200 focus:border-sky-600 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-sky-800 hover:from-sky-500 hover:to-sky-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'SAVING...' : 'UPDATE ADMIN CREDENTIALS'}</span>
        </button>
      </form>

      {/* Backup & Reset Database */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-sky-500/30 space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
          <Download className="w-4 h-4 text-sky-600" />
          <span>DATA BACKUP & RESTORE</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleExportJSON}
            className="p-4 bg-sky-50 hover:bg-sky-100 text-sky-900 font-black text-xs rounded-2xl border-2 border-sky-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4 text-sky-700" />
            <span>EXPORT ALL DATA (JSON)</span>
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="p-4 bg-rose-50 hover:bg-rose-100 text-rose-800 font-black text-xs rounded-2xl border-2 border-rose-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>RESET DATABASE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
