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

    // Collect all available language tags from the user's browser / system
    const languages = (navigator.languages && navigator.languages.length) 
      ? navigator.languages 
      : [navigator.language || navigator.userLanguage || ''];
      
    const langString = languages.join(',').toLowerCase();
    const timeZone = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();

    // 1. Pakistan (PKR)
    if (
      timeZone.includes('karachi') || 
      timeZone.includes('pakistan') || 
      langString.includes('-pk') || 
      langString.includes('ur-') || 
      langString.includes('pa-pk')
    ) {
      return 'PKR';
    }

    // 2. Malaysia (MYR)
    if (
      timeZone.includes('kuala_lumpur') || 
      timeZone.includes('malaysia') || 
      timeZone.includes('kuching') || 
      langString.includes('-my') || 
      langString.includes('ms-')
    ) {
      return 'MYR';
    }

    // 3. India (INR)
    if (
      timeZone.includes('calcutta') || 
      timeZone.includes('kolkata') || 
      timeZone.includes('india') || 
      langString.includes('-in') || 
      langString.includes('hi-') || 
      langString.includes('ta-in') || 
      langString.includes('te-in')
    ) {
      return 'INR';
    }

    // 4. UAE (AED)
    if (
      timeZone.includes('dubai') || 
      timeZone.includes('abu_dhabi') || 
      langString.includes('-ae')
    ) {
      return 'AED';
    }

    // 5. Saudi Arabia (SAR)
    if (
      timeZone.includes('riyadh') || 
      langString.includes('-sa')
    ) {
      return 'SAR';
    }

    // 6. Indonesia (IDR)
    if (
      timeZone.includes('jakarta') || 
      timeZone.includes('pontianak') || 
      timeZone.includes('makassar') || 
      timeZone.includes('jayapura') || 
      langString.includes('-id') || 
      langString.includes('id-')
    ) {
      return 'IDR';
    }

    // 7. Philippines (PHP)
    if (
      timeZone.includes('manila') || 
      langString.includes('-ph') || 
      langString.includes('fil') || 
      langString.includes('tl-')
    ) {
      return 'PHP';
    }

    // 8. Singapore (SGD)
    if (
      timeZone.includes('singapore') || 
      langString.includes('-sg')
    ) {
      return 'SGD';
    }

    // 9. Japan (JPY)
    if (
      timeZone.includes('tokyo') || 
      langString.includes('-jp') || 
      langString.includes('ja')
    ) {
      return 'JPY';
    }

    // 10. South Korea (KRW)
    if (
      timeZone.includes('seoul') || 
      langString.includes('-kr') || 
      langString.includes('ko')
    ) {
      return 'KRW';
    }

    // 11. Australia (AUD)
    if (
      timeZone.includes('sydney') || 
      timeZone.includes('melbourne') || 
      timeZone.includes('brisbane') || 
      timeZone.includes('perth') || 
      timeZone.includes('adelaide') || 
      langString.includes('-au')
    ) {
      return 'AUD';
    }

    // 12. Canada (CAD)
    if (
      timeZone.includes('toronto') || 
      timeZone.includes('vancouver') || 
      timeZone.includes('montreal') || 
      timeZone.includes('edmonton') || 
      langString.includes('-ca')
    ) {
      return 'CAD';
    }

    // 13. United Kingdom (GBP) - check specifically for GB region or London timezone
    if (
      timeZone.includes('london') || 
      langString.includes('-gb') || 
      langString.includes('-uk')
    ) {
      return 'GBP';
    }

    // 14. Eurozone (EUR)
    if (
      timeZone.includes('paris') || 
      timeZone.includes('berlin') || 
      timeZone.includes('rome') || 
      timeZone.includes('madrid') || 
      timeZone.includes('amsterdam') || 
      timeZone.includes('brussels') || 
      timeZone.includes('vienna') || 
      timeZone.includes('dublin') || 
      timeZone.includes('helsinki') || 
      timeZone.includes('athens') || 
      timeZone.includes('lisbon') || 
      langString.includes('-de') || 
      langString.includes('-fr') || 
      langString.includes('-it') || 
      langString.includes('-es') || 
      langString.includes('-nl')
    ) {
      return 'EUR';
    }

    // 15. Brazil (BRL)
    if (
      timeZone.includes('sao_paulo') || 
      langString.includes('-br') || 
      langString.includes('pt-br')
    ) {
      return 'BRL';
    }

    // 16. Turkey (TRY)
    if (
      timeZone.includes('istanbul') || 
      langString.includes('-tr') || 
      langString.includes('tr-')
    ) {
      return 'TRY';
    }

    // 17. Egypt (EGP)
    if (
      timeZone.includes('cairo') || 
      langString.includes('-eg')
    ) {
      return 'EGP';
    }

    // 18. Nigeria (NGN)
    if (
      timeZone.includes('lagos') || 
      langString.includes('-ng')
    ) {
      return 'NGN';
    }

    // 19. South Africa (ZAR)
    if (
      timeZone.includes('johannesburg') || 
      langString.includes('-za')
    ) {
      return 'ZAR';
    }

    // 20. China (CNY)
    if (
      timeZone.includes('shanghai') || 
      timeZone.includes('beijing') || 
      timeZone.includes('chongqing') || 
      langString.includes('-cn') || 
      langString.includes('zh-')
    ) {
      return 'CNY';
    }

    // 21. Mexico (MXN)
    if (
      timeZone.includes('mexico_city') || 
      langString.includes('-mx')
    ) {
      return 'MXN';
    }

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
