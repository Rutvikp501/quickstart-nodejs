// ✅ Format a JS Date to 'DD/MM/YYYY, HH:MM:SS AM/PM' in IST timezone
  export function currentDateTime() {
    let date = new Date().toLocaleString()
    const options = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    return date.toLocaleString('en-IN', options);
  }


// ✅ Format a JS Date or ISO string to 'DD/MM/YYYY'
export function formatDateToDDMMYYYY(input) {
  /*** @param {Date | string} input - JS Date object or ISO string (e.g., '2025-07-22')
   * @returns {string} Formatted date string like '22/07/2025'
   *
   * Example:
   * formatDateToDDMMYYYY(new Date()) => '22/07/2025'
   * formatDateToDDMMYYYY('2025-07-22') => '22/07/2025'
   */
  let dateStr;

  if (input instanceof Date) {
    dateStr = input.toISOString().split('T')[0];
  } else if (typeof input === 'string') {
    dateStr = input.trim();
  } else {
    throw new Error('Invalid date format');
  }

  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

// ✅ Format a JS Date to 'YYYY-MM-DD' (for input fields, DB)
export function formatDateToYYYYMMDD(date) {
  /**
   * @param {Date} date - JS Date object
   * @returns {string} Date in 'YYYY-MM-DD' format
   *
   * Example:
   * formatDateToYYYYMMDD(new Date()) => '2025-07-22'
   */
  return date.toISOString().split('T')[0];
}

// ✅ Convert UTC Date to IST (India Standard Time)
export function convertToIST(date) {
  /**
   * @param {Date} date - UTC Date object
   * @returns {Date} New Date object adjusted to IST
   *
   * Example:
   * convertToIST(new Date('2025-07-22T10:00:00Z')) => 2025-07-22T15:30:00.000Z
   */
  const offset = 5.5 * 60 * 60 * 1000;
  return new Date(date.getTime() + offset);
}

// ✅ Parse a date from 'DDMMYYYY' string and convert to IST
export function parseDDMMYYYYToIST(dateString) {
  /**
   * @param {string} dateString - Format: '22072025'
   * @returns {Date} JS Date object in IST
   *
   * Example:
   * parseDDMMYYYYToIST('22072025') => Tue Jul 22 2025 05:30:00 GMT+0530
   */
  const day = parseInt(dateString.substring(0, 2), 10);
  const month = parseInt(dateString.substring(2, 4), 10) - 1;
  const year = parseInt(dateString.substring(4), 10);
  const date = new Date(year, month, day);
  return convertToIST(date);
}

export function formatToReadableDate(inputDate) {
  /**
   * @param {string | Date} inputDate - Accepts:
   *    - '22/07/2025'  (DD/MM/YYYY)
   *    - '2025-07-22'  (ISO string)
   *    - Date object
   *
   * @returns {string} - e.g., '22nd July 2025'
   */

  const getOrdinal = (n) => {
    const s = ['th', 'st', 'nd', 'rd'],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  let date;

  if (typeof inputDate === 'string' && inputDate.includes('/')) {
    // Handle 'DD/MM/YYYY'
    const [day, month, year] = inputDate.split('/');
    date = new Date(`${year}-${month}-${day}`);
  } else if (typeof inputDate === 'string' || inputDate instanceof Date) {
    date = new Date(inputDate);
  } else {
    throw new Error('Invalid date format');
  }

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' }); // Full month name like 'July'
  const year = date.getFullYear();

  return `${getOrdinal(day)} ${month} ${year}`;
}

export function addDaysToDate(date, days) {
  /**
 * Adds a given number of days to a date.
 *
 * @param {Date | string} date - The starting date. Can be a Date object or a date string (e.g., '2025-07-22').
 * @param {number} days - The number of days to add.
 * @returns {Date} - A new Date object with the added days.
 *
 * @example
 * addDaysToDate('2025-07-22', 5); // returns Date object for '2025-07-27'
 * addDaysToDate(new Date(), 10);  // returns Date object 10 days from today
 */
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
