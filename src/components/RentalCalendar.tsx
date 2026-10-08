import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { BookingDateRange } from '../types';
import { 
  calculateRentalDates, 
  formatDateISO, 
  parseDateISO, 
  formatDisplayDate, 
  isRangeAvailable 
} from '../utils/rentalCalculations';

interface RentalCalendarProps {
  bookings: BookingDateRange[];
  selectedStartDate: string;
  durationDays: 3 | 7 | 10;
  onDurationChange: (days: 3 | 7 | 10) => void;
  onStartDateChange: (dateStr: string) => void;
}

export const RentalCalendar: React.FC<RentalCalendarProps> = ({
  bookings,
  selectedStartDate,
  durationDays,
  onDurationChange,
  onStartDateChange,
}) => {
  // Calendar month state
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    if (selectedStartDate) {
      return parseDateISO(selectedStartDate);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // First day of current month & total days
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Calculated rental dates
  const calculatedDates = selectedStartDate 
    ? calculateRentalDates(selectedStartDate, durationDays)
    : null;

  // Check validity of current selection
  const isCurrentSelectionValid = selectedStartDate 
    ? isRangeAvailable(selectedStartDate, durationDays, bookings)
    : true;

  // Day classification helper
  const getDayStatus = (dateStr: string) => {
    const targetTime = parseDateISO(dateStr).getTime();
    const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

    // Past date
    if (targetTime < todayTime) {
      return { type: 'past', label: 'Past' };
    }

    // Check bookings and buffers
    for (const b of bookings) {
      const rentalStart = parseDateISO(b.startDate).getTime();
      const rentalEnd = parseDateISO(b.endDate).getTime();
      const bufStart = parseDateISO(b.bufferStart).getTime();
      const bufEnd = parseDateISO(b.bufferEnd).getTime();

      if (targetTime >= rentalStart && targetTime <= rentalEnd) {
        return { type: 'booked', label: 'Rented' };
      }
      if (targetTime >= bufStart && targetTime <= bufEnd) {
        return { type: 'buffer', label: 'Cleaning & Transit Buffer' };
      }
    }

    // Check if within current selection
    if (calculatedDates) {
      const selStart = parseDateISO(calculatedDates.startDate).getTime();
      const selEnd = parseDateISO(calculatedDates.returnDate).getTime();
      const delivDate = parseDateISO(calculatedDates.deliveryDate).getTime();

      if (targetTime === delivDate) {
        return { type: 'delivery', label: 'Delivery Day' };
      }
      if (targetTime >= selStart && targetTime <= selEnd) {
        return { type: 'selected', label: 'Rental Period' };
      }
    }

    return { type: 'available', label: 'Available' };
  };

  const handleSelectDay = (dateStr: string) => {
    const status = getDayStatus(dateStr);
    if (status.type === 'past' || status.type === 'booked' || status.type === 'buffer') {
      return; // Cannot click
    }
    onStartDateChange(dateStr);
  };

  // Month names
  const monthName = currentMonth.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-5">
      {/* Duration Selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#53101E]" />
            Rental Duration
          </label>
          <span className="text-xs text-stone-500">Pick event duration</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {([3, 7, 10] as const).map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => onDurationChange(days)}
              className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer text-center ${
                durationDays === days
                  ? 'bg-[#53101E] text-white border-[#53101E] shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
              }`}
            >
              {days} Days Rental
              <span className="block text-[10px] font-normal opacity-80">
                {days === 3 ? 'Weekend / Party' : days === 7 ? 'Full Wedding Week' : 'Destination Wedding'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Smart Buffer Notification */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-amber-950">
            Smart Operational Buffer Algorithm Active
          </p>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Every booking automatically reserves a <strong>2-day pre-delivery buffer</strong> (hospital-grade dry cleaning & packaging) and a <strong>2-day post-return buffer</strong> (return transit & inspection).
          </p>
        </div>
      </div>

      {/* Calendar Header with Navigation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-stone-900 font-cinzel tracking-wide">
            {monthName}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-stone-400 uppercase">
          <div>Su</div>
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Empty cells before first day */}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-9" />
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const status = getDayStatus(dateStr);

            let buttonClass = 'h-9 w-full rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-all relative ';

            if (status.type === 'past') {
              buttonClass += 'text-stone-300 cursor-not-allowed bg-stone-50/50';
            } else if (status.type === 'booked') {
              buttonClass += 'text-red-700 bg-red-50 border border-red-200 cursor-not-allowed line-through opacity-80';
            } else if (status.type === 'buffer') {
              buttonClass += 'text-amber-800 bg-amber-100/70 border border-amber-200/80 cursor-not-allowed opacity-80';
            } else if (status.type === 'delivery') {
              buttonClass += 'bg-emerald-600 text-white font-bold shadow-xs cursor-pointer ring-2 ring-emerald-300';
            } else if (status.type === 'selected') {
              buttonClass += 'bg-[#53101E] text-white font-bold shadow-xs cursor-pointer';
            } else {
              buttonClass += 'text-stone-800 hover:bg-stone-100 border border-stone-100 cursor-pointer';
            }

            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => handleSelectDay(dateStr)}
                disabled={status.type === 'past' || status.type === 'booked' || status.type === 'buffer'}
                title={`${dateStr}: ${status.label}`}
                className={buttonClass}
              >
                <span>{dayNum}</span>
                {status.type === 'delivery' && (
                  <span className="text-[8px] leading-none uppercase font-extrabold text-emerald-100">
                    Arrive
                  </span>
                )}
                {status.type === 'buffer' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 block mt-0.5" />
                )}
                {status.type === 'booked' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 block mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-[11px] text-stone-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-600" />
          <span>Delivery Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#53101E]" />
          <span>Rental Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-300" />
          <span>Buffer / Sanitizing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-100 border border-red-300" />
          <span>Booked</span>
        </div>
      </div>

      {/* Calculated Breakdown Card */}
      {calculatedDates && (
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-700" /> Doorstep Delivery
            </span>
            <span className="font-bold text-emerald-700">
              {formatDisplayDate(calculatedDates.deliveryDate)} (1 day prior)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700 flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5 text-[#53101E]" /> Rental Start Date
            </span>
            <span className="font-bold text-[#53101E]">
              {formatDisplayDate(calculatedDates.startDate)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-600" /> Return Pickup Date
            </span>
            <span className="font-bold text-stone-900">
              {formatDisplayDate(calculatedDates.returnDate)}
            </span>
          </div>

          {!isCurrentSelectionValid && (
            <div className="p-2 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200 mt-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Selected dates conflict with an existing booking or cleaning buffer. Please choose different dates.</span>
            </div>
          )}

          {isCurrentSelectionValid && (
            <div className="pt-2 border-t border-stone-200 text-xs text-emerald-700 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Outfit is available for your chosen dates with full sanitization buffer!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
