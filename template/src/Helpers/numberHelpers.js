/** * Check if a value is a valid number
 * @param {any} val - Any value
 * @returns {boolean}
 * @example
 * isNumber(42); // true
 * isNumber('abc'); // false
 */
export function isNumber(val) {
  return typeof val === 'number' && !isNaN(val);
}

/** * Format a number with commas (Indian/US format)
 * @param {number|string} num - e.g., 1234567
 * @returns {string} - e.g., "1,234,567"
 * @example
 * formatWithCommas(1234567); // '1,234,567'
 */
export function formatWithCommas(num) {
  return Number(num).toLocaleString('en-IN');
}

/** * Convert percentage string to decimal
 * @param {string} percentage - e.g., "25%"
 * @returns {number} - e.g., 0.25
 * @example
 * percentageToDecimal("25%"); // 0.25
 */
export function percentageToDecimal(percentage) {
  return parseFloat(percentage.replace('%', '')) / 100;
}

/** * Convert decimal to percentage string
 * @param {number} decimal - e.g., 0.25
 * @param {number} [precision=2] - Decimal places
 * @returns {string} - e.g., "25%"
 * @example
 * decimalToPercentage(0.25); // "25%"
 */
export function decimalToPercentage(decimal, precision = 2) {
  return `${(decimal * 100).toFixed(precision)}%`;
}

/** * Round a number to fixed decimal places
 * @param {number} num
 * @param {number} places
 * @returns {number}
 * @example
 * roundTo(3.14159, 2); // 3.14
 */
export function roundTo(num, places) {
  return Number(Number(num).toFixed(places));
}

/** * Clamp a number between min and max
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 * @example
 * clamp(10, 0, 5); // 5
 */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(val, max));
}

/** * Get a random integer between min and max (inclusive)
 * @param {number} min
 * @param {number} max
 * @returns {number}
 * @example
 * getRandomInt(1, 10); // e.g., 4
 */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** * Convert number to Indian currency format (₹)
 * @param {number|string} amount
 * @returns {string}
 * @example
 * formatCurrencyINR(123456.78); // '₹1,23,456.78'
 */
export function formatCurrencyINR(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

/** * Format number into a localized currency string
 * @param {number|string} amount - e.g., 123456.78
 * @param {string} currencyCode - e.g., 'INR', 'USD', 'GBP', 'RUB'
 * @param {string} [locale='en-IN'] - e.g., 'en-IN', 'en-US', 'ru-RU'
 * @returns {string} - Formatted currency string
 *
 * @example
 * formatCurrency(123456.78, 'INR') => ₹1,23,456.78
 * formatCurrency(123456.78, 'USD', 'en-US') => $123,456.78
 * formatCurrency(123456.78, 'GBP', 'en-GB') => £123,456.78
 * formatCurrency(123456.78, 'RUB', 'ru-RU') => 123 456,78 ₽
 */
export function formatCurrency(amount, currencyCode, locale = 'en-IN') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

/** * Convert a currency amount from one currency to another using live rates.
 * @param {number} amount - The amount to convert (e.g., 1000)
 * @param {string} fromCurrency - Source currency code (e.g., 'INR')
 * @param {string} toCurrency - Target currency code (e.g., 'USD')
 * @returns {Promise<number>} - Converted amount
 *
 * Example:
 * convertCurrency(1000, 'INR', 'USD') => 12.01 (based on current rate)
 */
export async function convertCurrency(amount, fromCurrency, toCurrency) {
  const url = `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Currency conversion error:', error);
    return null;
  }
}
