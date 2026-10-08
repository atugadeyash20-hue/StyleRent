import { BookingDateRange } from '../types';

/**
 * Adds specified number of days to a Date object
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Format a Date to YYYY-MM-DD string
 */
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parse YYYY-MM-DD string into local Date
 */
export function parseDateISO(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Format date for friendly Indian display: e.g. "15 Oct 2026"
 */
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = parseDateISO(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Calculate rental period details including delivery, return, and operational buffer
 * Operational Buffer: 2 days before delivery/start & 2 days after return for sanitization & logistics.
 */
export function calculateRentalDates(startDateStr: string, durationDays: 3 | 7 | 10) {
  const startDate = parseDateISO(startDateStr);
  
  // Delivery arrives 1 day before the event starts so the customer can try on
  const deliveryDate = addDays(startDate, -1);
  
  // Return date is rental start + duration days
  const returnDate = addDays(startDate, durationDays);
  
  // Operational Buffer: 2 days before delivery & 2 days after return
  const bufferStartDate = addDays(deliveryDate, -2);
  const bufferEndDate = addDays(returnDate, 2);

  return {
    deliveryDate: formatDateISO(deliveryDate),
    startDate: startDateStr,
    returnDate: formatDateISO(returnDate),
    bufferStart: formatDateISO(bufferStartDate),
    bufferEnd: formatDateISO(bufferEndDate),
  };
}

/**
 * Check if a date string falls inside any existing booking including operational buffers
 */
export function isDateBlockedByBookings(dateStr: string, bookings: BookingDateRange[]): { isBlocked: boolean; reason?: string } {
  const targetDate = parseDateISO(dateStr).getTime();

  for (const booking of bookings) {
    const bufStart = parseDateISO(booking.bufferStart).getTime();
    const bufEnd = parseDateISO(booking.bufferEnd).getTime();
    const rentalStart = parseDateISO(booking.startDate).getTime();
    const rentalEnd = parseDateISO(booking.endDate).getTime();

    if (targetDate >= rentalStart && targetDate <= rentalEnd) {
      return { isBlocked: true, reason: 'Rented by another customer' };
    }

    if (targetDate >= bufStart && targetDate <= bufEnd) {
      return { isBlocked: true, reason: 'Operational Buffer (Cleaning & Transit)' };
    }
  }

  return { isBlocked: false };
}

/**
 * Check if an entire selected rental window is completely available
 */
export function isRangeAvailable(startDateStr: string, durationDays: 3 | 7 | 10, bookings: BookingDateRange[]): boolean {
  const dates = calculateRentalDates(startDateStr, durationDays);
  const rangeStart = parseDateISO(dates.bufferStart).getTime();
  const rangeEnd = parseDateISO(dates.bufferEnd).getTime();

  for (const b of bookings) {
    const existingStart = parseDateISO(b.bufferStart).getTime();
    const existingEnd = parseDateISO(b.bufferEnd).getTime();

    // Check overlap
    if (rangeStart <= existingEnd && rangeEnd >= existingStart) {
      return false;
    }
  }

  return true;
}

/**
 * Format Indian Rupee currency with commas: ₹1,499
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
