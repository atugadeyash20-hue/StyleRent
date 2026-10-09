import { BookingDateRange, Product, RentalDuration, DeliverySpeed, DeliveryTracking, CustomerDetails } from '../types';

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
 * Get product rental fee according to selected duration (1, 3, 7, 10 days)
 */
export function getProductRentalFee(product: Product, durationDays: RentalDuration): number {
  if (durationDays === 1) {
    if (product.rentalPrice1Day && product.rentalPrice1Day > 0) {
      return product.rentalPrice1Day;
    }
    // Logical fallback: ~65% of 3-day rental, rounded to nearest 49 or 99
    return Math.max(499, Math.round((product.rentalPrice3Days * 0.65) / 50) * 50 - 1);
  }
  if (durationDays === 3) return product.rentalPrice3Days;
  if (durationDays === 7) return product.rentalPrice7Days;
  return product.rentalPrice10Days;
}

/**
 * Calculate rental period details including delivery, return, and operational buffer
 * Operational Buffer: 2 days before delivery/start & 2 days after return for sanitization & logistics.
 * (For 1-day rental: 1 day buffer for high-velocity turnover)
 */
export function calculateRentalDates(startDateStr: string, durationDays: RentalDuration) {
  const startDate = parseDateISO(startDateStr);
  
  // Delivery arrives 1 day before the event starts so the customer can try on
  const deliveryDate = addDays(startDate, -1);
  
  // Return date is rental start + duration days
  const returnDate = addDays(startDate, durationDays);
  
  // Operational Buffer: 1 day for 1-day rentals, 2 days for 3/7/10 days
  const bufferDays = durationDays === 1 ? 1 : 2;
  const bufferStartDate = addDays(deliveryDate, -bufferDays);
  const bufferEndDate = addDays(returnDate, bufferDays);

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
export function isRangeAvailable(startDateStr: string, durationDays: RentalDuration, bookings: BookingDateRange[]): boolean {
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

/**
 * Generates live delivery tracking simulation data for an order
 */
export function generateTrackingForOrder(
  orderId: string, 
  customer: CustomerDetails, 
  speed: DeliverySpeed
): DeliveryTracking {
  const isExpress = speed === 'express_2hr';
  const isSameDay = speed === 'same_day';

  const riderPool = [
    { name: 'Arjun Verma', phone: '+91 98202 81729', vehicle: 'MH 02 DK 8812 (EV Scooter)', rating: 4.96 },
    { name: 'Sameer Sheikh', phone: '+91 99304 12948', vehicle: 'MH 01 AB 4491 (Flash Courier EV)', rating: 4.92 },
    { name: 'Vikram Rajput', phone: '+91 97691 38501', vehicle: 'MH 03 CN 7192 (Hyperlocal Express)', rating: 4.98 },
  ];
  const rider = riderPool[Math.floor(Math.random() * riderPool.length)];

  // Random 4-digit OTP
  const deliveryOtp = String(Math.floor(1000 + Math.random() * 9000));

  let currentStep: DeliveryTracking['currentStep'] = 'confirmed';
  let etaMinutes = 1440; // 24 hrs for standard

  if (isExpress) {
    // 2-Hour Express: order is immediately dispatched/out for delivery!
    currentStep = 'out_for_delivery';
    etaMinutes = Math.floor(25 + Math.random() * 45); // 25-70 minutes remaining
  } else if (isSameDay) {
    currentStep = 'dispatched';
    etaMinutes = Math.floor(120 + Math.random() * 180); // 2-5 hours remaining
  } else {
    currentStep = 'sanitizing';
    etaMinutes = 1200;
  }

  // City center coordinates default: Mumbai Bandra Hub
  const hubLat = 19.0596;
  const hubLng = 72.8295;
  // Customer address coordinate offset
  const destLat = 19.1136;
  const destLng = 72.8697;
  // Rider position between hub and dest
  const riderLat = hubLat + (destLat - hubLat) * 0.65;
  const riderLng = hubLng + (destLng - hubLng) * 0.65;

  return {
    trackingNumber: `STR-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
    orderId,
    customerName: customer.fullName,
    customerPhone: customer.phone,
    deliveryAddress: customer.address,
    deliveryCity: customer.city,
    deliverySpeed: speed,
    riderName: rider.name,
    riderPhone: rider.phone,
    riderVehicle: rider.vehicle,
    riderRating: rider.rating,
    currentStep,
    etaMinutes,
    deliveryOtp,
    riderLat,
    riderLng,
    destLat,
    destLng,
    hubName: `Style-Rent Central Sanitization & Dispatch Lab (${customer.city})`,
    updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    statusNotes: isExpress 
      ? '⚡ 2-HOUR SOS EMERGENCY DISPATCH: Sanitization expedited, priority rider assigned.' 
      : isSameDay 
        ? '🚚 SAME-DAY DISPATCH: Scheduled for afternoon delivery batch.' 
        : 'Scheduled for doorstep delivery 1 day before rental start.',
  };
}
