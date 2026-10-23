import { 
  User, 
  GameEntry, 
  WalletTransaction, 
  WithdrawalRequest, 
  GameSettings,
  CountryCode,
  BankAccountDetails,
  UserDocument,
  TransactionType,
  WithdrawalStatus
} from '../types';
import { getCountryByCode } from '../data/countries';

const STORAGE_KEYS = {
  USERS: 'mega_weekly_game_users_v2',
  ENTRIES: 'mega_weekly_game_entries_v2',
  TRANSACTIONS: 'mega_weekly_game_transactions_v2',
  WITHDRAWALS: 'mega_weekly_game_withdrawals_v2',
  SETTINGS: 'mega_weekly_game_settings_v2',
  CURRENT_USER_ID: 'mega_weekly_game_session_uid_v2',
};

export const ADMIN_CREDENTIALS = {
  mobile: '9849020341',
  password: 'SiddharthReddy@1234',
};

const DEFAULT_SETTINGS: GameSettings = {
  winningMultiplier: 500,
  adminMobile: ADMIN_CREDENTIALS.mobile,
  adminPassword: ADMIN_CREDENTIALS.password,
  lastWinningNumber: '777',
  lastDeclaredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
};

const SEED_USERS: User[] = [
  {
    id: 'user_ahmed_saudi',
    fullName: 'Ahmed Al-Harbi',
    mobileNumber: '9849020342',
    password: 'User@123',
    role: 'USER',
    country: 'Saudi Arabia',
    countryCode: 'SAR',
    currency: 'SAR',
    walletBalance: 5000,
    accountDetails: {
      id: 'acc_ahmed_1',
      accountHolderName: 'Ahmed Al-Harbi',
      bankName: 'Al Rajhi Bank',
      accountNumber: 'SA8080000123456789012345',
      ifscCode: 'RJHI0001',
      isPrimary: true,
      createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    },
    bankAccounts: [
      {
        id: 'acc_ahmed_1',
        accountHolderName: 'Ahmed Al-Harbi',
        bankName: 'Al Rajhi Bank',
        accountNumber: 'SA8080000123456789012345',
        ifscCode: 'RJHI0001',
        isPrimary: true,
        createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 9).toISOString(),
      },
      {
        id: 'acc_ahmed_2',
        accountHolderName: 'Ahmed Al-Harbi',
        bankName: 'Saudi National Bank (SNB)',
        accountNumber: 'SA1210000000009876543210',
        ifscCode: 'NCB0001',
        isPrimary: false,
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      }
    ],
    documentStatus: 'UPDATED',
    documents: [
      {
        id: 'doc_1',
        title: 'National Identity Card',
        type: 'ID_PROOF',
        fileName: 'national_id_ahmed.pdf',
        uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: 'doc_2',
        title: 'Bank Account Certificate',
        type: 'BANK_PASSBOOK',
        fileName: 'alrajhi_statement.pdf',
        uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'user_fahad_kuwait',
    fullName: 'Fahad Al-Kuwaiti',
    mobileNumber: '9849020343',
    password: 'User@123',
    role: 'USER',
    country: 'Kuwait',
    countryCode: 'KWD',
    currency: 'KWD',
    walletBalance: 250,
    accountDetails: {
      id: 'acc_fahad_1',
      accountHolderName: 'Fahad Al-Kuwaiti',
      bankName: 'National Bank of Kuwait (NBK)',
      accountNumber: 'KW68NBOK000000000123456789',
      ifscCode: 'NBOK0001',
      isPrimary: true,
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    bankAccounts: [
      {
        id: 'acc_fahad_1',
        accountHolderName: 'Fahad Al-Kuwaiti',
        bankName: 'National Bank of Kuwait (NBK)',
        accountNumber: 'KW68NBOK000000000123456789',
        ifscCode: 'NBOK0001',
        isPrimary: true,
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      }
    ],
    documentStatus: 'UPDATED',
    documents: [
      {
        id: 'doc_3',
        title: 'Civil ID Card',
        type: 'ID_PROOF',
        fileName: 'civil_id_fahad.jpg',
        uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: 'user_tariq_oman',
    fullName: 'Tariq Al-Omani',
    mobileNumber: '9849020344',
    password: 'User@123',
    role: 'USER',
    country: 'Oman',
    countryCode: 'OMR',
    currency: 'OMR',
    walletBalance: 100,
    accountDetails: {
      id: 'acc_tariq_1',
      accountHolderName: 'Tariq Al-Omani',
      bankName: 'Bank Muscat',
      accountNumber: 'OM54BMUS0000001234567890',
      ifscCode: 'BMUS0001',
      isPrimary: true,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    bankAccounts: [
      {
        id: 'acc_tariq_1',
        accountHolderName: 'Tariq Al-Omani',
        bankName: 'Bank Muscat',
        accountNumber: 'OM54BMUS0000001234567890',
        ifscCode: 'BMUS0001',
        isPrimary: true,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      }
    ],
    documentStatus: 'NOT UPDATED',
    documents: [],
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'user_yusuf_bahrain',
    fullName: 'Yusuf Al-Bahraini',
    mobileNumber: '9849020345',
    password: 'User@123',
    role: 'USER',
    country: 'Bahrain',
    countryCode: 'BHD',
    currency: 'BHD',
    walletBalance: 300,
    accountDetails: {
      id: 'acc_yusuf_1',
      accountHolderName: 'Yusuf Al-Bahraini',
      bankName: 'National Bank of Bahrain',
      accountNumber: 'BH29NBOB00000012345678',
      ifscCode: 'NBOB0001',
      isPrimary: true,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    bankAccounts: [
      {
        id: 'acc_yusuf_1',
        accountHolderName: 'Yusuf Al-Bahraini',
        bankName: 'National Bank of Bahrain',
        accountNumber: 'BH29NBOB00000012345678',
        ifscCode: 'NBOB0001',
        isPrimary: true,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      }
    ],
    documentStatus: 'NOT UPDATED',
    documents: [],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'user_rashid_dubai',
    fullName: 'Rashid Al-Maktoum',
    mobileNumber: '9849020346',
    password: 'User@123',
    role: 'USER',
    country: 'Dubai / UAE',
    countryCode: 'AED',
    currency: 'AED',
    walletBalance: 1000,
    accountDetails: {
      id: 'acc_rashid_1',
      accountHolderName: 'Rashid Al-Maktoum',
      bankName: 'Emirates NBD',
      accountNumber: 'AE070260000123456789012',
      ifscCode: 'EBIL0001',
      isPrimary: true,
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    bankAccounts: [
      {
        id: 'acc_rashid_1',
        accountHolderName: 'Rashid Al-Maktoum',
        bankName: 'Emirates NBD',
        accountNumber: 'AE070260000123456789012',
        ifscCode: 'EBIL0001',
        isPrimary: true,
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      }
    ],
    documentStatus: 'UPDATED',
    documents: [
      {
        id: 'doc_4',
        title: 'Emirates ID',
        type: 'ID_PROOF',
        fileName: 'emirates_id_rashid.pdf',
        uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const SEED_ENTRIES: GameEntry[] = [
  {
    id: 'entry_1',
    userId: 'user_ahmed_saudi',
    userName: 'Ahmed Al-Harbi',
    userMobile: '9849020342',
    country: 'Saudi Arabia',
    countryCode: 'SAR',
    currency: 'SAR',
    gameNumber: '777',
    gameAmount: 10,
    potentialWinning: 5000,
    actualWinning: 5000,
    status: 'WINNER',
    declaredWinningNumber: '777',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    declaredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    credited: true,
  },
  {
    id: 'entry_2',
    userId: 'user_ahmed_saudi',
    userName: 'Ahmed Al-Harbi',
    userMobile: '9849020342',
    country: 'Saudi Arabia',
    countryCode: 'SAR',
    currency: 'SAR',
    gameNumber: '123',
    gameAmount: 20,
    potentialWinning: 10000,
    actualWinning: 0,
    status: 'NOT MATCHED',
    declaredWinningNumber: '777',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    declaredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    credited: false,
  },
  {
    id: 'entry_3',
    userId: 'user_ahmed_saudi',
    userName: 'Ahmed Al-Harbi',
    userMobile: '9849020342',
    country: 'Saudi Arabia',
    countryCode: 'SAR',
    currency: 'SAR',
    gameNumber: '345',
    gameAmount: 15,
    potentialWinning: 7500,
    actualWinning: 0,
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    credited: false,
  },
  {
    id: 'entry_4',
    userId: 'user_fahad_kuwait',
    userName: 'Fahad Al-Kuwaiti',
    userMobile: '9849020343',
    country: 'Kuwait',
    countryCode: 'KWD',
    currency: 'KWD',
    gameNumber: '345',
    gameAmount: 10,
    potentialWinning: 5000,
    actualWinning: 0,
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    credited: false,
  },
];

const SEED_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx_1',
    userId: 'user_ahmed_saudi',
    userName: 'Ahmed Al-Harbi',
    countryCode: 'SAR',
    currency: 'SAR',
    type: 'ADMIN ADD BALANCE',
    amount: 1000,
    balanceAfter: 1000,
    description: 'Initial Wallet Balance',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'tx_2',
    userId: 'user_ahmed_saudi',
    userName: 'Ahmed Al-Harbi',
    countryCode: 'SAR',
    currency: 'SAR',
    type: 'GAME ENTRY',
    amount: -10,
    balanceAfter: 990,
    description: 'The Government Lottery Entry #777',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    referenceId: 'entry_1',
  },
  {
    id: 'tx_3',
    userId: 'user_ahmed_saudi',
    userName: 'Ahmed Al-Harbi',
    countryCode: 'SAR',
    currency: 'SAR',
    type: 'WINNING CREDIT',
    amount: 5000,
    balanceAfter: 5990,
    description: 'The Government Lottery Winning Amount (10 × 500 SAR)',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    referenceId: 'entry_1',
  },
  {
    id: 'tx_4',
    userId: 'user_ahmed_saudi',
    userName: 'Ahmed Al-Harbi',
    countryCode: 'SAR',
    currency: 'SAR',
    type: 'GAME ENTRY',
    amount: -20,
    balanceAfter: 5970,
    description: 'The Government Lottery Entry #123',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    referenceId: 'entry_2',
  },
  {
    id: 'tx_5',
    userId: 'user_ahmed_saudi',
    userName: 'Ahmed Al-Harbi',
    countryCode: 'SAR',
    currency: 'SAR',
    type: 'WITHDRAWAL REQUEST',
    amount: -955,
    balanceAfter: 5015,
    description: 'Withdrawal Request to Al Rajhi Bank',
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'tx_6',
    userId: 'user_ahmed_saudi',
    userName: 'Ahmed Al-Harbi',
    countryCode: 'SAR',
    currency: 'SAR',
    type: 'GAME ENTRY',
    amount: -15,
    balanceAfter: 5000,
    description: 'The Government Lottery Entry #345',
    date: new Date(Date.now() - 3600000 * 3).toISOString(),
    referenceId: 'entry_3',
  },
];

const SEED_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'wd_1',
    userId: 'user_ahmed_saudi',
    userName: 'Ahmed Al-Harbi',
    userMobile: '9849020342',
    country: 'Saudi Arabia',
    countryCode: 'SAR',
    currency: 'SAR',
    amount: 955,
    accountHolderName: 'Ahmed Al-Harbi',
    bankName: 'Al Rajhi Bank',
    accountNumber: 'SA8080000123456789012345',
    ifscCode: 'RJHI0001',
    status: 'PROCESSING',
    requestDate: new Date(Date.now() - 86400000 * 1).toISOString(),
  }
];

class StorageService {
  private initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ENTRIES)) {
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(SEED_ENTRIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.WITHDRAWALS)) {
      localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(SEED_WITHDRAWALS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
  }

  constructor() {
    this.initStorage();
  }

  // Users
  private normalizeUser(user: User): User {
    let changed = false;
    if (!user.bankAccounts) {
      user.bankAccounts = [];
      changed = true;
    }

    if (user.bankAccounts.length === 0 && user.accountDetails?.accountNumber) {
      user.bankAccounts.push({
        id: user.accountDetails.id || `acc_${user.id}_1`,
        accountHolderName: user.accountDetails.accountHolderName || user.fullName,
        bankName: user.accountDetails.bankName,
        accountNumber: user.accountDetails.accountNumber,
        ifscCode: user.accountDetails.ifscCode || 'N/A',
        isPrimary: true,
        createdAt: user.accountDetails.createdAt || user.accountDetails.updatedAt || user.createdAt,
        updatedAt: user.accountDetails.updatedAt || user.createdAt,
      });
      changed = true;
    }

    if (user.bankAccounts.length > 0) {
      const hasPrimary = user.bankAccounts.some((a) => a.isPrimary);
      if (!hasPrimary) {
        user.bankAccounts[0].isPrimary = true;
        changed = true;
      }
      const primary = user.bankAccounts.find((a) => a.isPrimary) || user.bankAccounts[0];
      if (!user.accountDetails || user.accountDetails.accountNumber !== primary.accountNumber) {
        user.accountDetails = {
          id: primary.id,
          accountHolderName: primary.accountHolderName,
          bankName: primary.bankName,
          accountNumber: primary.accountNumber,
          ifscCode: primary.ifscCode,
          isPrimary: true,
          createdAt: primary.createdAt,
          updatedAt: primary.updatedAt,
        };
        changed = true;
      }
    }

    return changed ? { ...user } : user;
  }

  getUsers(): User[] {
    this.initStorage();
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) return [];
    try {
      const parsed: User[] = JSON.parse(data);
      let anyChanged = false;
      const normalized = parsed.map((u) => {
        const prev = JSON.stringify(u);
        const norm = this.normalizeUser(u);
        if (JSON.stringify(norm) !== prev) {
          anyChanged = true;
        }
        return norm;
      });
      if (anyChanged) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(normalized));
      }
      return normalized;
    } catch {
      return [];
    }
  }

  getUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find((u) => u.id === id) || null;
  }

  getUserByMobile(mobile: string): User | null {
    const users = this.getUsers();
    const cleanMobile = mobile.trim();
    return users.find((u) => u.mobileNumber.trim() === cleanMobile) || null;
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.unshift(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  createUser(payload: {
    fullName: string;
    mobileNumber: string;
    password: string;
    countryCode: CountryCode;
  }): User {
    const country = getCountryByCode(payload.countryCode);
    const newUser: User = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      fullName: payload.fullName.trim(),
      mobileNumber: payload.mobileNumber.trim(),
      password: payload.password,
      role: 'USER',
      country: country.name,
      countryCode: country.code,
      currency: country.code,
      walletBalance: 0,
      accountDetails: {
        accountHolderName: payload.fullName.trim(),
        bankName: '',
        accountNumber: '',
        ifscCode: '',
      },
      bankAccounts: [],
      documentStatus: 'NOT UPDATED',
      documents: [],
      createdAt: new Date().toISOString(),
    };
    this.saveUser(newUser);
    return newUser;
  }

  // Current session
  getCurrentUserId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
  }

  getCurrentUser(): User | null {
    const id = this.getCurrentUserId();
    if (!id) return null;
    return this.getUserById(id);
  }

  setCurrentUserId(id: string | null): void {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  }

  logout(): void {
    this.setCurrentUserId(null);
  }

  // Settings
  getSettings(): GameSettings {
    this.initStorage();
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  }

  saveSettings(settings: GameSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  updateSettings(partial: Partial<GameSettings>): { success: boolean; settings?: GameSettings } {
    const settings = this.getSettings();
    const updated = { ...settings, ...partial };
    this.saveSettings(updated);
    return { success: true, settings: updated };
  }

  // Entries
  getEntries(): GameEntry[] {
    this.initStorage();
    const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    return data ? JSON.parse(data) : [];
  }

  getGameEntries(): GameEntry[] {
    return this.getEntries();
  }

  getEntriesByUserId(userId: string): GameEntry[] {
    return this.getEntries().filter((e) => e.userId === userId);
  }

  createGameEntry(payload: {
    userId: string;
    gameNumber: string; // 3 digits formatted
    gameAmount: number;
  }): { success: boolean; error?: string; entry?: GameEntry } {
    const user = this.getUserById(payload.userId);
    if (!user) return { success: false, error: 'User not found' };

    const amount = Number(payload.gameAmount);
    if (isNaN(amount) || amount <= 0) {
      return { success: false, error: 'Game amount must be greater than 0' };
    }

    if (user.walletBalance < amount) {
      return { 
        success: false, 
        error: `Insufficient wallet balance. You have ${user.walletBalance} ${user.currency}, but need ${amount} ${user.currency}.` 
      };
    }

    // Format 3-digit number
    let formattedNumber = payload.gameNumber.toString().padStart(3, '0').slice(-3);
    const numInt = parseInt(formattedNumber, 10);
    if (isNaN(numInt) || numInt < 0 || numInt > 999) {
      return { success: false, error: 'Selected number must be between 000 and 999' };
    }

    const settings = this.getSettings();
    const multiplier = settings.winningMultiplier || 500;
    const potentialWinning = amount * multiplier;

    // Deduct wallet balance
    const newBalance = user.walletBalance - amount;
    user.walletBalance = newBalance;
    this.saveUser(user);

    const entryId = 'entry_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newEntry: GameEntry = {
      id: entryId,
      userId: user.id,
      userName: user.fullName,
      userMobile: user.mobileNumber,
      country: user.country,
      countryCode: user.countryCode,
      currency: user.currency,
      gameNumber: formattedNumber,
      gameAmount: amount,
      potentialWinning: potentialWinning,
      actualWinning: 0,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      credited: false,
    };

    const entries = this.getEntries();
    entries.unshift(newEntry);
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));

    // Record Transaction
    this.createTransaction({
      userId: user.id,
      userName: user.fullName,
      countryCode: user.countryCode,
      currency: user.currency,
      type: 'GAME ENTRY',
      amount: -amount,
      balanceAfter: newBalance,
      description: `The Government Lottery Entry #${formattedNumber}`,
      referenceId: entryId,
    });

    return { success: true, entry: newEntry };
  }

  // Game Declaration & Automatic Winning Credit
  declareWinningNumber(winningNumber: string): {
    success: boolean;
    winningNumber: string;
    totalProcessed: number;
    winnersCount: number;
    nonWinnersCount: number;
    totalWinningAmount: number;
    currencyBreakdown: Record<string, number>;
  } {
    const formattedWinner = winningNumber.toString().padStart(3, '0').slice(-3);
    const entries = this.getEntries();
    const settings = this.getSettings();
    const multiplier = settings.winningMultiplier || 500;
    const nowIso = new Date().toISOString();

    let totalProcessed = 0;
    let winnersCount = 0;
    let nonWinnersCount = 0;
    let totalWinningAmount = 0;
    const currencyBreakdown: Record<string, number> = {};

    entries.forEach((entry) => {
      if (entry.status === 'PENDING') {
        totalProcessed++;
        entry.declaredWinningNumber = formattedWinner;
        entry.declaredAt = nowIso;

        if (entry.gameNumber === formattedWinner) {
          entry.status = 'WINNER';
          const winAmount = entry.gameAmount * multiplier;
          entry.actualWinning = winAmount;
          winnersCount++;
          totalWinningAmount += winAmount;
          currencyBreakdown[entry.currency] = (currencyBreakdown[entry.currency] || 0) + winAmount;

          // Automatically credit winning to user's wallet if not credited yet
          if (!entry.credited) {
            const user = this.getUserById(entry.userId);
            if (user) {
              user.walletBalance += winAmount;
              this.saveUser(user);
              entry.credited = true;

              // Record Transaction
              this.createTransaction({
                userId: user.id,
                userName: user.fullName,
                countryCode: user.countryCode,
                currency: user.currency,
                type: 'WINNING CREDIT',
                amount: winAmount,
                balanceAfter: user.walletBalance,
                description: `The Government Lottery Winning Amount (${entry.gameAmount} × ${multiplier} ${entry.currency})`,
                referenceId: entry.id,
              });
            }
          }
        } else {
          entry.status = 'NOT MATCHED';
          entry.actualWinning = 0;
          nonWinnersCount++;
        }
      }
    });

    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));

    // Update settings
    settings.lastWinningNumber = formattedWinner;
    settings.lastDeclaredAt = nowIso;
    this.saveSettings(settings);

    return {
      success: true,
      winningNumber: formattedWinner,
      totalProcessed,
      winnersCount,
      nonWinnersCount,
      totalWinningAmount,
      currencyBreakdown,
    };
  }

  // Transactions
  getTransactions(): WalletTransaction[] {
    this.initStorage();
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  }

  getTransactionsByUserId(userId: string): WalletTransaction[] {
    return this.getTransactions().filter((t) => t.userId === userId);
  }

  createTransaction(payload: {
    userId: string;
    userName: string;
    countryCode: CountryCode;
    currency: string;
    type: TransactionType;
    amount: number;
    balanceAfter: number;
    description: string;
    referenceId?: string;
  }): WalletTransaction {
    const transactions = this.getTransactions();
    const newTx: WalletTransaction = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: payload.userId,
      userName: payload.userName,
      countryCode: payload.countryCode,
      currency: payload.currency,
      type: payload.type,
      amount: payload.amount,
      balanceAfter: payload.balanceAfter,
      description: payload.description,
      date: new Date().toISOString(),
      referenceId: payload.referenceId,
    };
    transactions.unshift(newTx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    return newTx;
  }

  // Admin Wallet Management
  adminAdjustBalance(payload: {
    userId: string;
    action: 'ADD' | 'DEDUCT' | 'SET';
    amount: number;
    reason: string;
  }): { success: boolean; error?: string; user?: User } {
    const user = this.getUserById(payload.userId);
    if (!user) return { success: false, error: 'User not found' };

    const val = Number(payload.amount);
    if (isNaN(val) || (payload.action !== 'SET' && val <= 0)) {
      return { success: false, error: 'Invalid amount entered' };
    }

    let txType: TransactionType = 'ADMIN BALANCE EDIT';
    let txAmount = 0;

    if (payload.action === 'ADD') {
      user.walletBalance += val;
      txType = 'ADMIN ADD BALANCE';
      txAmount = val;
    } else if (payload.action === 'DEDUCT') {
      if (user.walletBalance < val) {
        return { success: false, error: `User only has ${user.walletBalance} ${user.currency}` };
      }
      user.walletBalance -= val;
      txType = 'ADMIN DEDUCT BALANCE';
      txAmount = -val;
    } else if (payload.action === 'SET') {
      if (val < 0) return { success: false, error: 'Balance cannot be negative' };
      txAmount = val - user.walletBalance;
      user.walletBalance = val;
      txType = 'ADMIN BALANCE EDIT';
    }

    this.saveUser(user);

    this.createTransaction({
      userId: user.id,
      userName: user.fullName,
      countryCode: user.countryCode,
      currency: user.currency,
      type: txType,
      amount: txAmount,
      balanceAfter: user.walletBalance,
      description: payload.reason || `Admin adjustment: ${txType}`,
    });

    return { success: true, user };
  }

  // Withdrawals
  getWithdrawals(): WithdrawalRequest[] {
    this.initStorage();
    const data = localStorage.getItem(STORAGE_KEYS.WITHDRAWALS);
    return data ? JSON.parse(data) : [];
  }

  getWithdrawalsByUserId(userId: string): WithdrawalRequest[] {
    return this.getWithdrawals().filter((w) => w.userId === userId);
  }

  createWithdrawalRequest(payload: {
    userId: string;
    amount: number;
    bankAccountId?: string;
  }): { success: boolean; error?: string; withdrawal?: WithdrawalRequest } {
    const user = this.getUserById(payload.userId);
    if (!user) return { success: false, error: 'User not found' };

    const amount = Number(payload.amount);
    if (isNaN(amount) || amount <= 0) {
      return { success: false, error: 'Withdrawal amount must be greater than 0' };
    }

    if (amount > user.walletBalance) {
      return { 
        success: false, 
        error: `Requested amount exceeds available balance (${user.walletBalance} ${user.currency})` 
      };
    }

    let selectedAccount: BankAccountDetails | undefined;
    if (payload.bankAccountId && user.bankAccounts) {
      selectedAccount = user.bankAccounts.find((a) => a.id === payload.bankAccountId);
    }
    if (!selectedAccount && user.bankAccounts && user.bankAccounts.length > 0) {
      selectedAccount = user.bankAccounts.find((a) => a.isPrimary) || user.bankAccounts[0];
    }
    if (!selectedAccount && user.accountDetails?.accountNumber) {
      selectedAccount = user.accountDetails;
    }

    if (!selectedAccount || !selectedAccount.accountNumber || !selectedAccount.bankName) {
      return {
        success: false,
        error: 'Please add and link your Bank Account Details before requesting withdrawal.',
      };
    }

    // Deduct immediately from available wallet
    const newBalance = user.walletBalance - amount;
    user.walletBalance = newBalance;
    this.saveUser(user);

    const withdrawalId = 'wd_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newWithdrawal: WithdrawalRequest = {
      id: withdrawalId,
      userId: user.id,
      userName: user.fullName,
      userMobile: user.mobileNumber,
      country: user.country,
      countryCode: user.countryCode,
      currency: user.currency,
      amount: amount,
      bankAccountId: selectedAccount.id,
      accountHolderName: selectedAccount.accountHolderName || user.fullName,
      bankName: selectedAccount.bankName,
      accountNumber: selectedAccount.accountNumber,
      ifscCode: selectedAccount.ifscCode || 'N/A',
      status: 'PENDING',
      requestDate: new Date().toISOString(),
      refunded: false,
    };

    const withdrawals = this.getWithdrawals();
    withdrawals.unshift(newWithdrawal);
    localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(withdrawals));

    // Record Transaction
    this.createTransaction({
      userId: user.id,
      userName: user.fullName,
      countryCode: user.countryCode,
      currency: user.currency,
      type: 'WITHDRAWAL REQUEST',
      amount: -amount,
      balanceAfter: newBalance,
      description: `Withdrawal Request to ${selectedAccount.bankName} (${maskAccountNumber(selectedAccount.accountNumber)})`,
      referenceId: withdrawalId,
    });

    return { success: true, withdrawal: newWithdrawal };
  }

  updateWithdrawalStatus(
    withdrawalId: string, 
    newStatus: WithdrawalStatus,
    adminNote?: string
  ): { success: boolean; error?: string } {
    const withdrawals = this.getWithdrawals();
    const idx = withdrawals.findIndex((w) => w.id === withdrawalId);
    if (idx < 0) return { success: false, error: 'Withdrawal request not found' };

    const item = withdrawals[idx];
    const oldStatus = item.status;
    item.status = newStatus;
    item.processedDate = new Date().toISOString();
    if (adminNote) item.adminNote = adminNote;

    // If REJECTED and not already refunded, refund back to user's wallet
    if (newStatus === 'REJECTED' && !item.refunded && oldStatus !== 'REJECTED') {
      const user = this.getUserById(item.userId);
      if (user) {
        user.walletBalance += item.amount;
        this.saveUser(user);
        item.refunded = true;

        this.createTransaction({
          userId: user.id,
          userName: user.fullName,
          countryCode: user.countryCode,
          currency: user.currency,
          type: 'WITHDRAWAL REFUND',
          amount: item.amount,
          balanceAfter: user.walletBalance,
          description: `Withdrawal Refund (Rejected by Admin: ${adminNote || 'Verification required'})`,
          referenceId: item.id,
        });
      }
    }

    withdrawals[idx] = item;
    localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(withdrawals));
    return { success: true };
  }

  // Multiple Bank Accounts Management
  addBankAccount(
    userId: string,
    payload: {
      accountHolderName: string;
      bankName: string;
      accountNumber: string;
      ifscCode: string;
    }
  ): { success: boolean; error?: string; user?: User; account?: BankAccountDetails } {
    const user = this.getUserById(userId);
    if (!user) return { success: false, error: 'User not found' };

    const cleanHolder = payload.accountHolderName.trim();
    const cleanBank = payload.bankName.trim();
    const cleanAcc = payload.accountNumber.trim();
    const cleanIfsc = (payload.ifscCode || '').trim() || 'N/A';

    if (!cleanHolder) {
      return { success: false, error: 'Please enter account holder name' };
    }
    if (!cleanBank) {
      return { success: false, error: 'Please enter bank name' };
    }
    if (!cleanAcc || cleanAcc.length < 5) {
      return { success: false, error: 'Please enter a valid account number or IBAN (min 5 digits)' };
    }

    if (!user.bankAccounts) {
      user.bankAccounts = [];
    }

    const isDuplicate = user.bankAccounts.some(
      (a) => a.accountNumber.replace(/\s+/g, '').toUpperCase() === cleanAcc.replace(/\s+/g, '').toUpperCase()
    );
    if (isDuplicate) {
      return { success: false, error: 'This bank account is already registered to your account.' };
    }

    const isFirst = user.bankAccounts.length === 0;
    const newAccount: BankAccountDetails = {
      id: `acc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      accountHolderName: cleanHolder,
      bankName: cleanBank,
      accountNumber: cleanAcc,
      ifscCode: cleanIfsc,
      isPrimary: isFirst,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    user.bankAccounts.push(newAccount);

    if (isFirst) {
      user.accountDetails = { ...newAccount };
    }

    this.saveUser(user);
    return { success: true, user, account: newAccount };
  }

  setPrimaryBankAccount(
    userId: string, 
    accountId: string
  ): { success: boolean; error?: string; user?: User } {
    const user = this.getUserById(userId);
    if (!user) return { success: false, error: 'User not found' };

    if (!user.bankAccounts || user.bankAccounts.length === 0) {
      return { success: false, error: 'No bank accounts found' };
    }

    const target = user.bankAccounts.find((a) => a.id === accountId);
    if (!target) {
      return { success: false, error: 'Bank account not found' };
    }

    user.bankAccounts = user.bankAccounts.map((a) => ({
      ...a,
      isPrimary: a.id === accountId,
    }));

    user.accountDetails = {
      ...target,
      isPrimary: true,
    };

    this.saveUser(user);
    return { success: true, user };
  }

  // Account Details (maintained for compatibility, syncs to primary)
  updateAccountDetails(userId: string, details: BankAccountDetails): { success: boolean; user?: User } {
    const user = this.getUserById(userId);
    if (!user) return { success: false };
    user.accountDetails = {
      ...details,
      updatedAt: new Date().toISOString(),
    };
    this.saveUser(user);
    return { success: true, user };
  }

  // Documents
  updateDocuments(userId: string, documents: UserDocument[]): { success: boolean; user?: User } {
    const user = this.getUserById(userId);
    if (!user) return { success: false };
    user.documents = documents;
    user.documentStatus = documents.length > 0 ? 'UPDATED' : 'NOT UPDATED';
    this.saveUser(user);
    return { success: true, user };
  }

  adminAdjustWallet(
    userId: string, 
    amount: number, 
    action: 'ADD' | 'DEDUCT' | 'SET', 
    reason: string
  ): { success: boolean; error?: string; user?: User } {
    return this.adminAdjustBalance({ userId, action, amount, reason });
  }

  // Reset demo data
  resetAllData(): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(SEED_ENTRIES));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(SEED_WITHDRAWALS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }

  resetToDefaults(): void {
    this.resetAllData();
  }

  exportAllData(): {
    users: User[];
    entries: GameEntry[];
    transactions: WalletTransaction[];
    withdrawals: WithdrawalRequest[];
    settings: GameSettings;
    exportedAt: string;
  } {
    return {
      users: this.getUsers(),
      entries: this.getEntries(),
      transactions: this.getTransactions(),
      withdrawals: this.getWithdrawals(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString(),
    };
  }
}

export const storage = new StorageService();

export function maskAccountNumber(acc: string): string {
  if (!acc) return 'XXXX----';
  const clean = acc.trim();
  if (clean.length <= 4) return 'XXXX' + clean;
  return 'XXXX' + clean.slice(-4);
}
