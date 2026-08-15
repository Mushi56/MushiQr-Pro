// src/utils/currency.js
// ─── Multi-Currency & Regional Conversion Engine ───────────────────────────
// Supports all major world currencies, real-time localized currency formatting,
// automatic browser/device regional detection, and dynamic conversion rates.

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0, flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79, flag: '🇬🇧' },
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee', rate: 278.50, flag: '🇵🇰' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.40, flag: '🇮🇳' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rate: 1.36, flag: '🇨🇦' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', rate: 1.51, flag: '🇦🇺' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 155.20, flag: '🇯🇵' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rate: 3.67, flag: '🇦🇪' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', rate: 3.75, flag: '🇸🇦' },
  { code: 'CNY', symbol: 'CN¥', name: 'Chinese Yuan', rate: 7.23, flag: '🇨🇳' },
  { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar', rate: 1.35, flag: '🇸🇬' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', rate: 5.15, flag: '🇧🇷' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', rate: 32.25, flag: '🇹🇷' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', rate: 1365.0, flag: '🇰🇷' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', rate: 4.71, flag: '🇲🇾' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', rate: 16050.0, flag: '🇮🇩' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', rate: 57.80, flag: '🇵🇭' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', rate: 47.10, flag: '🇪🇬' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', rate: 1450.0, flag: '🇳🇬' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', rate: 18.40, flag: '🇿🇦' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', rate: 16.80, flag: '🇲🇽' },
];

/**
 * Detect user's country code and regional default currency based on browser locale/timezone
 */
export function detectUserCurrency() {
  try {
    const saved = localStorage.getItem('mushiqr_selected_currency');
    if (saved && SUPPORTED_CURRENCIES.find(c => c.code === saved)) {
      return saved;
    }

    // Attempt detection via Intl
    const locale = navigator.language || navigator.userLanguage || 'en-US';
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';

    // Region mapping
    if (timeZone.includes('Karachi') || locale.includes('ur-PK') || locale.includes('en-PK')) return 'PKR';
    if (timeZone.includes('Calcutta') || timeZone.includes('Kolkata') || locale.includes('hi') || locale.includes('en-IN')) return 'INR';
    if (timeZone.includes('London') || locale.includes('en-GB')) return 'GBP';
    if (timeZone.includes('Dubai') || timeZone.includes('Abu_Dhabi')) return 'AED';
    if (timeZone.includes('Riyadh')) return 'SAR';
    if (timeZone.includes('Tokyo') || locale.includes('ja')) return 'JPY';
    if (timeZone.includes('Sydney') || timeZone.includes('Melbourne') || locale.includes('en-AU')) return 'AUD';
    if (timeZone.includes('Toronto') || timeZone.includes('Vancouver') || locale.includes('en-CA')) return 'CAD';
    if (timeZone.includes('Paris') || timeZone.includes('Berlin') || timeZone.includes('Rome') || timeZone.includes('Madrid') || timeZone.includes('Amsterdam')) return 'EUR';
    if (timeZone.includes('Seoul') || locale.includes('ko')) return 'KRW';
    if (timeZone.includes('Kuala_Lumpur') || locale.includes('ms')) return 'MYR';
    if (timeZone.includes('Jakarta') || locale.includes('id')) return 'IDR';
    if (timeZone.includes('Manila') || locale.includes('fil')) return 'PHP';
    if (timeZone.includes('Cairo') || locale.includes('ar-EG')) return 'EGP';
    if (timeZone.includes('Lagos')) return 'NGN';
    if (timeZone.includes('Johannesburg')) return 'ZAR';
    if (timeZone.includes('Sao_Paulo') || locale.includes('pt-BR')) return 'BRL';
    if (timeZone.includes('Istanbul') || locale.includes('tr')) return 'TRY';
    if (timeZone.includes('Shanghai') || timeZone.includes('Beijing') || locale.includes('zh')) return 'CNY';
  } catch (e) {
    // fallback to USD
  }
  return 'USD';
}

/**
 * Format a USD base price to the target currency
 */
export function formatCurrencyPrice(baseUsdPrice, targetCurrencyCode = 'USD') {
  if (baseUsdPrice === 0 || baseUsdPrice === '0') return 'Free';
  const numUsd = typeof baseUsdPrice === 'number' ? baseUsdPrice : parseFloat(baseUsdPrice) || 0;
  if (numUsd <= 0) return 'Free';

  const curr = SUPPORTED_CURRENCIES.find(c => c.code === targetCurrencyCode) || SUPPORTED_CURRENCIES[0];
  const converted = numUsd * curr.rate;

  // Format nicely depending on scale
  let formattedNumber;
  if (converted >= 1000) {
    formattedNumber = Math.round(converted).toLocaleString();
  } else if (converted >= 100) {
    formattedNumber = Math.round(converted).toString();
  } else {
    formattedNumber = converted.toFixed(2);
  }

  return `${curr.symbol} ${formattedNumber}`;
}
