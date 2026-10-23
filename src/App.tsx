import React, { useState, useEffect } from 'react';
import { User, GameEntry, WithdrawalRequest, WalletTransaction, GameSettings } from './types';
import { storage } from './services/storage';
import { formatCurrency, getCountryByCode } from './data/countries';

// Common Components
import { AppLogo } from './components/common/AppLogo';
import { ReceiptModal } from './components/common/ReceiptModal';
import { WinnerCelebration } from './components/common/WinnerCelebration';

// Auth Components
import { LoginScreen } from './components/auth/LoginScreen';
import { RegisterScreen } from './components/auth/RegisterScreen';

// User Components
import { UserDashboard } from './components/user/UserDashboard';
import { UserGameScreen } from './components/user/UserGameScreen';
import { UserWalletScreen } from './components/user/UserWalletScreen';
import { UserWithdrawalScreen } from './components/user/UserWithdrawalScreen';
import { UserHistoryScreen } from './components/user/UserHistoryScreen';
import { UserResultsScreen } from './components/user/UserResultsScreen';
import { UserAccountDetailsScreen } from './components/user/UserAccountDetailsScreen';
import { UserDocumentsScreen } from './components/user/UserDocumentsScreen';
import { UserProfileScreen } from './components/user/UserProfileScreen';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminUsersScreen } from './components/admin/AdminUsersScreen';
import { AdminWalletsScreen } from './components/admin/AdminWalletsScreen';
import { AdminDeclareResultScreen } from './components/admin/AdminDeclareResultScreen';
import { AdminEntriesScreen } from './components/admin/AdminEntriesScreen';
import { AdminWithdrawalsScreen } from './components/admin/AdminWithdrawalsScreen';
import { AdminSettingsScreen } from './components/admin/AdminSettingsScreen';

// Icons
import { 
  Home, 
  Gamepad2, 
  Wallet, 
  Trophy, 
  History, 
  User as UserIcon, 
  ShieldCheck, 
  ArrowLeft, 
  LogOut, 
  Building2, 
  FileText, 
  Settings, 
  ArrowDownToLine,
  Users,
  Sparkles
} from 'lucide-react';

export default function App() {
  // App State
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getCurrentUser());
  const [authView, setAuthView] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');

  // Database reactive states
  const [users, setUsers] = useState<User[]>(() => storage.getUsers());
  const [entries, setEntries] = useState<GameEntry[]>(() => storage.getGameEntries());
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => storage.getWithdrawals());
  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => storage.getTransactions());
  const [settings, setSettings] = useState<GameSettings>(() => storage.getSettings());

  // Modal states
  const [selectedReceiptEntry, setSelectedReceiptEntry] = useState<GameEntry | null>(null);
  const [celebrationEntry, setCelebrationEntry] = useState<GameEntry | null>(null);

  // Sync state whenever database updates
  const refreshData = () => {
    setUsers(storage.getUsers());
    setEntries(storage.getGameEntries());
    setWithdrawals(storage.getWithdrawals());
    setTransactions(storage.getTransactions());
    setSettings(storage.getSettings());

    const active = storage.getCurrentUser();
    if (active) {
      // Refresh current user object from storage
      const refreshed = storage.getUserById(active.id);
      if (refreshed) setCurrentUser(refreshed);
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'ADMIN') {
      setCurrentScreen('admin_dashboard');
    } else {
      setCurrentScreen('dashboard');
    }
    refreshData();
  };

  const handleLogout = () => {
    storage.logout();
    setCurrentUser(null);
    setAuthView('LOGIN');
    setCurrentScreen('dashboard');
  };

  const handleEntrySubmitted = (entry: GameEntry) => {
    refreshData();
    // Open receipt modal immediately
    setSelectedReceiptEntry(entry);
    setCurrentScreen('history');
  };

  // Screen Title Formatter
  const getScreenTitle = () => {
    if (!currentUser) return 'THE GOVERNMENT LOTTERY OFFICER';
    if (currentUser.role === 'ADMIN') {
      switch (currentScreen) {
        case 'admin_users': return 'Registered Users';
        case 'admin_wallets': return 'Treasury & Wallets';
        case 'admin_declare': return 'Declare 3-Digit Winner';
        case 'admin_entries': return 'All Game Tickets';
        case 'admin_withdrawals': return 'Withdrawal Requests';
        case 'admin_settings': return 'Admin Settings';
        default: return 'Government Lottery Officer Control';
      }
    } else {
      switch (currentScreen) {
        case 'game': return 'Government Lottery Draw (500X)';
        case 'wallet': return 'My Wallet';
        case 'withdraw': return 'Request Withdrawal';
        case 'results': return 'Official Draws & Results';
        case 'history': return 'My Game Tickets';
        case 'account': return 'Bank Account Details';
        case 'documents': return 'Verification Documents';
        case 'profile': return 'My Profile';
        default: return 'The Government Lottery Officer';
      }
    }
  };

  // If user is not logged in, show Auth screens
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-3 sm:p-6 antialiased selection:bg-sky-500 selection:text-white">
        <div className="w-full max-w-md">
          {authView === 'LOGIN' ? (
            <LoginScreen
              onLoginSuccess={handleLoginSuccess}
              onNavigateToRegister={() => setAuthView('REGISTER')}
            />
          ) : (
            <RegisterScreen
              onRegisterSuccess={handleLoginSuccess}
              onNavigateToLogin={() => setAuthView('LOGIN')}
            />
          )}
        </div>
      </div>
    );
  }

  const isAdmin = currentUser.role === 'ADMIN';
  const userEntries = entries.filter((e) => e.userId === currentUser.id);
  const userWithdrawals = withdrawals.filter((w) => w.userId === currentUser.id);
  const userTransactions = transactions.filter((t) => t.userId === currentUser.id);
  const country = getCountryByCode(currentUser.countryCode);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 antialiased selection:bg-sky-500 selection:text-white flex flex-col justify-between">
      {/* Receipt Modal */}
      {selectedReceiptEntry && (
        <ReceiptModal
          entry={selectedReceiptEntry}
          onClose={() => setSelectedReceiptEntry(null)}
        />
      )}

      {/* Winner Celebration Modal */}
      {celebrationEntry && (
        <WinnerCelebration
          entry={celebrationEntry}
          onClose={() => setCelebrationEntry(null)}
          onViewReceipt={() => {
            const entry = celebrationEntry;
            setCelebrationEntry(null);
            setSelectedReceiptEntry(entry);
          }}
        />
      )}

      {/* Top App Bar (Official Royal Blue & Sky Blue Theme) */}
      <header className="sticky top-0 z-40 bg-[#032242]/95 backdrop-blur-md border-b border-sky-800/60 shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {currentScreen !== (isAdmin ? 'admin_dashboard' : 'dashboard') ? (
              <button
                onClick={() => setCurrentScreen(isAdmin ? 'admin_dashboard' : 'dashboard')}
                className="p-2 rounded-xl bg-sky-900/80 hover:bg-sky-800 text-sky-200 hover:text-white transition-colors cursor-pointer border border-sky-700/50"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
            ) : (
              <AppLogo size="sm" />
            )}

            <div>
              <h1 className="text-sm sm:text-base font-black text-white leading-tight truncate">
                {getScreenTitle()}
              </h1>
              <p className="text-[11px] font-bold text-sky-300 flex items-center gap-1.5">
                {isAdmin ? (
                  <span className="text-amber-300 font-extrabold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> SUPER ADMIN (Offline Room DB)
                  </span>
                ) : (
                  <span>
                    {country.flag} {currentUser.country} • {currentUser.currency}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2">
            {!isAdmin && (
              <button
                onClick={() => setCurrentScreen('wallet')}
                className="px-3 py-1.5 bg-sky-800 hover:bg-sky-700 text-white rounded-xl border border-sky-500/50 flex items-center gap-1.5 text-xs font-black shadow-xs cursor-pointer"
              >
                <Wallet className="w-3.5 h-3.5 text-sky-300" />
                <span>{formatCurrency(currentUser.walletBalance, currentUser.currency)}</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => setCurrentScreen('admin_declare')}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-sky-950 rounded-xl flex items-center gap-1 text-xs font-black shadow-md cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Declare Draw</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-sky-900/80 hover:bg-rose-900/80 text-sky-200 hover:text-rose-200 transition-colors cursor-pointer border border-sky-700/50"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl w-full mx-auto p-4 sm:p-6 flex-1">
        {isAdmin ? (
          // Admin Screens
          <>
            {currentScreen === 'admin_dashboard' && (
              <AdminDashboard
                users={users}
                entries={entries}
                withdrawals={withdrawals}
                transactions={transactions}
                onNavigate={setCurrentScreen}
              />
            )}
            {currentScreen === 'admin_users' && (
              <AdminUsersScreen
                users={users}
                entries={entries}
                withdrawals={withdrawals}
                onDataRefresh={refreshData}
              />
            )}
            {currentScreen === 'admin_wallets' && (
              <AdminWalletsScreen
                users={users}
                transactions={transactions}
              />
            )}
            {currentScreen === 'admin_declare' && (
              <AdminDeclareResultScreen
                entries={entries}
                settings={settings}
                onResultDeclared={refreshData}
              />
            )}
            {currentScreen === 'admin_entries' && (
              <AdminEntriesScreen
                entries={entries}
                users={users}
                onOpenReceipt={setSelectedReceiptEntry}
              />
            )}
            {currentScreen === 'admin_withdrawals' && (
              <AdminWithdrawalsScreen
                withdrawals={withdrawals}
                users={users}
                onDataRefresh={refreshData}
              />
            )}
            {currentScreen === 'admin_settings' && (
              <AdminSettingsScreen
                settings={settings}
                onSettingsUpdated={refreshData}
              />
            )}
          </>
        ) : (
          // User Screens
          <>
            {currentScreen === 'dashboard' && (
              <UserDashboard
                user={currentUser}
                recentEntries={userEntries}
                onNavigate={setCurrentScreen}
                onOpenReceipt={setSelectedReceiptEntry}
              />
            )}
            {currentScreen === 'game' && (
              <UserGameScreen
                user={currentUser}
                onEntrySuccess={handleEntrySubmitted}
                onNavigateToWallet={() => setCurrentScreen('wallet')}
              />
            )}
            {currentScreen === 'wallet' && (
              <UserWalletScreen
                user={currentUser}
                transactions={userTransactions}
                withdrawals={userWithdrawals}
                onNavigateToWithdraw={() => setCurrentScreen('withdraw')}
                onNavigateToGame={() => setCurrentScreen('game')}
              />
            )}
            {currentScreen === 'withdraw' && (
              <UserWithdrawalScreen
                user={currentUser}
                withdrawals={userWithdrawals}
                onWithdrawalCreated={refreshData}
                onNavigateToAccountDetails={() => setCurrentScreen('account')}
              />
            )}
            {currentScreen === 'results' && (
              <UserResultsScreen
                user={currentUser}
                entries={userEntries}
                settings={settings}
                onOpenReceipt={setSelectedReceiptEntry}
                onTriggerCelebration={setCelebrationEntry}
                onNavigateToGame={() => setCurrentScreen('game')}
              />
            )}
            {currentScreen === 'history' && (
              <UserHistoryScreen
                user={currentUser}
                entries={userEntries}
                onOpenReceipt={setSelectedReceiptEntry}
              />
            )}
            {currentScreen === 'account' && (
              <UserAccountDetailsScreen
                user={currentUser}
                onAccountUpdated={(u) => {
                  setCurrentUser(u);
                  refreshData();
                }}
              />
            )}
            {currentScreen === 'documents' && (
              <UserDocumentsScreen
                user={currentUser}
                onDocumentsUpdated={(u) => {
                  setCurrentUser(u);
                  refreshData();
                }}
              />
            )}
            {currentScreen === 'profile' && (
              <UserProfileScreen
                user={currentUser}
                onNavigate={setCurrentScreen}
                onLogout={handleLogout}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Bottom Navigation Bar (Sky Blue / Royal Blue Theme) */}
      <nav className="sticky bottom-0 z-40 bg-[#032242]/95 backdrop-blur-md border-t border-sky-800/60 py-2 px-3 shadow-2xl">
        <div className="max-w-3xl mx-auto flex items-center justify-around">
          {isAdmin ? (
            // Admin Navigation Bar Items
            [
              { id: 'admin_dashboard', label: 'Dashboard', icon: Home },
              { id: 'admin_users', label: 'Users', icon: Users },
              { id: 'admin_declare', label: 'Declare', icon: Sparkles, highlight: true },
              { id: 'admin_entries', label: 'Tickets', icon: Gamepad2 },
              { id: 'admin_withdrawals', label: 'Payouts', icon: ArrowDownToLine },
              { id: 'admin_settings', label: 'Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const active = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                    active
                      ? 'text-amber-300 font-black'
                      : 'text-sky-300/70 hover:text-sky-100 font-bold'
                  }`}
                >
                  <div className={`p-1 rounded-lg ${active ? 'bg-sky-800 shadow-xs' : ''}`}>
                    <Icon className={`w-5 h-5 ${item.highlight && !active ? 'text-amber-400' : ''}`} />
                  </div>
                  <span className="text-[10px] tracking-tight">{item.label}</span>
                </button>
              );
            })
          ) : (
            // User Navigation Bar Items
            [
              { id: 'dashboard', label: 'Home', icon: Home },
              { id: 'game', label: 'Play 500X', icon: Gamepad2, highlight: true },
              { id: 'wallet', label: 'Wallet', icon: Wallet },
              { id: 'results', label: 'Results', icon: Trophy },
              { id: 'history', label: 'Tickets', icon: History },
              { id: 'profile', label: 'Profile', icon: UserIcon },
            ].map((item) => {
              const Icon = item.icon;
              const active = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                    active
                      ? 'text-amber-300 font-black'
                      : 'text-sky-300/70 hover:text-sky-100 font-bold'
                  }`}
                >
                  <div className={`p-1 rounded-lg ${active ? 'bg-sky-800 shadow-xs' : ''}`}>
                    <Icon className={`w-5 h-5 ${item.highlight && !active ? 'text-amber-400' : ''}`} />
                  </div>
                  <span className="text-[10px] tracking-tight">{item.label}</span>
                </button>
              );
            })
          )}
        </div>
      </nav>
    </div>
  );
}
