import { CountryInfo } from '../types';

export const COUNTRIES: CountryInfo[] = [
  {
    id: 'saudi_arabia',
    name: 'Saudi Arabia',
    nameWithPrefix: '🇸🇦 Saudi Arabia',
    flag: '🇸🇦',
    currency: 'Saudi Riyal',
    code: 'SAR',
    symbol: 'SAR',
  },
  {
    id: 'kuwait',
    name: 'Kuwait',
    nameWithPrefix: '🇰🇼 Kuwait',
    flag: '🇰🇼',
    currency: 'Kuwaiti Dinar',
    code: 'KWD',
    symbol: 'KWD',
  },
  {
    id: 'oman',
    name: 'Oman',
    nameWithPrefix: '🇴🇲 Oman',
    flag: '🇴🇲',
    currency: 'Omani Rial',
    code: 'OMR',
    symbol: 'OMR',
  },
  {
    id: 'bahrain',
    name: 'Bahrain',
    nameWithPrefix: '🇧🇭 Bahrain',
    flag: '🇧🇭',
    currency: 'Bahraini Dinar',
    code: 'BHD',
    symbol: 'BHD',
  },
  {
    id: 'dubai_uae',
    name: 'Dubai / UAE',
    nameWithPrefix: '🇦🇪 Dubai / UAE',
    flag: '🇦🇪',
    currency: 'UAE Dirham',
    code: 'AED',
    symbol: 'AED',
  },
];

export const getCountryByCode = (code: string): CountryInfo => {
  return COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
};

export const formatCurrency = (amount: number, code: string): string => {
  const formattedAmount = Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${formattedAmount} ${code}`;
};
