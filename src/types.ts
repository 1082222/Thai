export type CountryCode = 'SAR' | 'KWD' | 'OMR' | 'BHD' | 'AED';

export interface CountryInfo {
  id: string;
  name: string;
  flag: string;
  currency: string;
  code: CountryCode;
  symbol: string;
  nameWithPrefix: string;
}

export type Role = 'ADMIN' | 'USER';

export type GameStatus = 'PENDING' | 'WINNER' | 'NOT MATCHED';

export type WithdrawalStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';

export type TransactionType = 
  | 'GAME ENTRY' 
  | 'WINNING CREDIT' 
  | 'WITHDRAWAL REQUEST' 
  | 'WITHDRAWAL REFUND' 
  | 'ADMIN ADD BALANCE' 
  | 'ADMIN DEDUCT BALANCE' 
  | 'ADMIN BALANCE EDIT';

export type DocumentStatus = 'NOT UPDATED' | 'UPDATED';

export interface BankAccountDetails {
  id?: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  isPrimary?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserDocument {
  id: string;
  title: string;
  type: 'ID_PROOF' | 'BANK_PASSBOOK' | 'ADDRESS_PROOF';
  fileName: string;
  fileData?: string;
  uploadedAt: string;
}

export interface User {
  id: string;
  fullName: string;
  mobileNumber: string;
  password: string;
  role: Role;
  country: string;
  countryCode: CountryCode;
  currency: string;
  walletBalance: number;
  accountDetails: BankAccountDetails;
  bankAccounts?: BankAccountDetails[];
  documentStatus: DocumentStatus;
  documents: UserDocument[];
  createdAt: string;
  lastLoginAt?: string;
}

export interface GameEntry {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  country: string;
  countryCode: CountryCode;
  currency: string;
  gameNumber: string; // Exactly 3 digits "000" to "999"
  gameAmount: number;
  potentialWinning: number;
  actualWinning: number;
  status: GameStatus;
  declaredWinningNumber?: string;
  createdAt: string;
  declaredAt?: string;
  credited?: boolean;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  userName: string;
  countryCode: CountryCode;
  currency: string;
  type: TransactionType;
  amount: number; // positive or negative
  balanceAfter: number;
  description: string;
  date: string;
  referenceId?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  country: string;
  countryCode: CountryCode;
  currency: string;
  amount: number;
  bankAccountId?: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  status: WithdrawalStatus;
  requestDate: string;
  processedDate?: string;
  refunded?: boolean;
  adminNote?: string;
}

export interface GameSettings {
  winningMultiplier: number; // 400
  adminMobile: string;
  adminPassword: string;
  adminPin?: string;
  lastWinningNumber?: string;
  lastDeclaredAt?: string;
}
