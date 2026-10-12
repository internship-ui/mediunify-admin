/**
 * MediUnify Central Date Formatting Utilities
 * Standard Project Format: DD-MM-YYYY (e.g., 01-10-2026)
 * DateTime Format: DD-MM-YYYY at hh:mm A (e.g., 01-10-2026 at 02:41 PM)
 */

/**
 * Format any date object or string into DD-MM-YYYY
 * @param {Date|string|number} dateInput 
 * @returns {string} Formatted date (DD-MM-YYYY)
 */
export function formatDateDDMMYYYY(dateInput) {
  if (!dateInput) return '';
  
  // If already in DD-MM-YYYY format
  if (typeof dateInput === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(dateInput.trim())) {
    return dateInput.trim();
  }

  // If in DD-MM-YYYY at hh:mm A format
  if (typeof dateInput === 'string' && /^\d{2}-\d{2}-\d{4}/.test(dateInput.trim())) {
    return dateInput.trim().slice(0, 10);
  }

  // If in YYYY-MM-DD format (from input type="date")
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput.trim())) {
    const [y, m, d] = dateInput.trim().split('-');
    return `${d}-${m}-${y}`;
  }

  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}

/**
 * Format a Date object into DD-MM-YYYY at hh:mm A
 * @param {Date|string|number} dateInput 
 * @returns {string} Formatted datetime string
 */
export function formatDateTimeWithAt(dateInput) {
  if (!dateInput) return '';

  // If already formatted like "01-10-2026 at 02:41 PM"
  if (typeof dateInput === 'string' && /^\d{2}-\d{2}-\d{4}\s+at\s+\d{2}:\d{2}\s+(AM|PM)$/i.test(dateInput.trim())) {
    return dateInput.trim();
  }

  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const strHours = String(hours).padStart(2, '0');

  return `${day}-${month}-${year} at ${strHours}:${minutes} ${ampm}`;
}

/**
 * Converts a DD-MM-YYYY string to YYYY-MM-DD for standard HTML <input type="date" />
 * @param {string} ddmmyyyy 
 * @returns {string} YYYY-MM-DD
 */
export function toHtmlDateValue(ddmmyyyy) {
  if (!ddmmyyyy) return '';
  const match = String(ddmmyyyy).match(/^(\d{2})-(\d{2})-(\d{4})/);
  if (match) {
    const [, d, m, y] = match;
    return `${y}-${m}-${d}`;
  }
  return '';
}

/**
 * Converts HTML <input type="date" /> (YYYY-MM-DD) to DD-MM-YYYY
 * @param {string} yyyymmdd 
 * @returns {string} DD-MM-YYYY
 */
export function fromHtmlDateValue(yyyymmdd) {
  if (!yyyymmdd) return '';
  const parts = String(yyyymmdd).split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return yyyymmdd;
}

/**
 * Compare if a date matches the given filter date
 * @param {string} recordDateStr e.g. "01-10-2026 at 02:41 PM"
 * @param {string} filterDateStr e.g. "01-10-2026" or "2026-10-01"
 */
export function isDateMatching(recordDateStr, filterDateStr) {
  if (!filterDateStr) return true;
  if (!recordDateStr) return false;

  const standardFilter = formatDateDDMMYYYY(filterDateStr);
  const standardRecord = formatDateDDMMYYYY(recordDateStr);

  return standardRecord === standardFilter;
}
