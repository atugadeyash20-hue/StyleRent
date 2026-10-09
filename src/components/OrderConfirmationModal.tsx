import React from 'react';
import { 
  CheckCircle2, 
  X, 
  Package, 
  Calendar, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  ArrowRight,
  Download,
  Sparkles,
  SlidersHorizontal,
  Navigation,
  Zap
} from 'lucide-react';
import { Order } from '../types';
import { formatINR, formatDisplayDate } from '../utils/rentalCalculations';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onOpenAdmin: () => void;
  onOpenTracking?: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onOpenAdmin,
  onOpenTracking,
}) => {
  if (!order) return null;

  const firstItem = order.items[0];
  const isExpress2Hr = order.deliverySpeed === 'express_2hr';
  const isSameDay = order.deliverySpeed === 'same_day';

  const timelineSteps = [
    { title: 'Order Confirmed', desc: 'Payment verified & booking reserved', active: true, done: true },
    { title: 'Preparing', desc: 'Hospital-grade dry clean & sanitization', active: true, done: isExpress2Hr },
    { title: 'Dispatched', desc: 'Packed in reusable zip bag with label', active: isExpress2Hr, done: isExpress2Hr },
    { title: 'Out for Delivery', desc: isExpress2Hr ? '⚡ Priority rider en route (under 120 mins)' : 'Doorstep drop 1 day before event', active: isExpress2Hr, done: false },
    { title: 'Return Pickup', desc: 'Courier picks up packed reusable bag', active: false, done: false },
    { title: 'Quality Check', desc: 'Staff checks garment integrity', active: false, done: false },
    { title: 'Deposit Refunded', desc: 'Security deposit released to UPI', active: false, done: false },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center p-3 sm:p-6">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FAF7F2] p-6 border-b border-stone-200 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-8 h-8 text-emerald-700" />
          </div>

          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-900">
            Your Style-Rent Order is Confirmed!
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Order Reference: <span className="font-mono font-bold text-[#53101E]">{order.orderId}</span>
          </p>

          {/* Delivery speed alert */}
          {isExpress2Hr && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-500/15 border border-amber-300 text-amber-950 text-xs font-bold flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>⚡ 2-Hour SOS Emergency Delivery Active! Priority rider is dispatched right now.</span>
            </div>
          )}

          {isSameDay && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-center gap-2">
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>🚚 Same-Day Delivery Active! Delivering today before 8 PM.</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Live tracking quick launch card */}
          {order.tracking && onOpenTracking && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 to-[#3B0913] text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center font-bold">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    Live Location Tracking Active
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  </h4>
                  <p className="text-xs text-stone-300">
                    Rider: {order.tracking.riderName} · ETA: <strong>{order.tracking.etaMinutes} mins</strong> · OTP: <span className="font-mono font-bold text-emerald-400">{order.tracking.deliveryOtp}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenTracking();
                }}
                className="px-4 py-2 rounded-xl bg-[#DFC07A] text-[#53101E] font-bold text-xs hover:bg-[#C69947] transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>Track on Live Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Outfits Summary */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Booked Designer Apparel
            </h3>

            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.name} 
                  referrerPolicy="no-referrer"
                  className="w-16 h-20 rounded-xl object-cover object-top border border-stone-200"
                />
                <div className="flex-1 space-y-1 text-xs">
                  <h4 className="font-bold text-stone-900">{item.product.name}</h4>
                  <p className="text-stone-500">
                    Size: <strong className="text-stone-800">{item.selectedSize}</strong> 
                    {item.hasBackupSize && ` · Backup Size: ${item.backupSize}`}
                    <span> · {item.rentalDuration} Day Rental</span>
                  </p>
                  <p className="text-stone-600">
                    Rental Dates: <strong>{formatDisplayDate(item.startDate)}</strong> to <strong>{formatDisplayDate(item.returnDate)}</strong>
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 font-semibold">
                    <Truck className="w-3.5 h-3.5" />
                    <span>
                      {isExpress2Hr 
                        ? '⚡ Delivery Window: Within next 120 minutes' 
                        : isSameDay 
                          ? '🚚 Doorstep Delivery: Today' 
                          : `Doorstep Delivery: ${formatDisplayDate(item.deliveryDate)}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing summary */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
            <div>
              <p className="text-stone-500">Total Paid Amount</p>
              <p className="text-xl font-bold text-[#53101E]">{formatINR(order.pricing.grandTotal)}</p>
            </div>
            <div className="text-right">
              <p className="text-emerald-800 font-semibold">
                {order.pricing.totalSecurityDeposit === 0 
                  ? 'Zero Deposit (StylePass Benefit)' 
                  : `${formatINR(order.pricing.totalSecurityDeposit)} Refundable Deposit`}
              </p>
              <p className="text-[10px] text-stone-600">
                Via {order.paymentMethod.toUpperCase()} (Demo Verified)
              </p>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Rental Order Timeline
            </h3>

            <div className="relative pl-6 space-y-4 border-l-2 border-stone-200 ml-2">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 ${
                    step.done 
                      ? 'bg-emerald-600 border-white ring-2 ring-emerald-600' 
                      : step.active 
                        ? 'bg-[#53101E] border-white ring-2 ring-[#53101E]' 
                        : 'bg-stone-200 border-white'
                  }`} />
                  <div>
                    <h4 className={`text-xs font-bold ${step.done ? 'text-emerald-800' : step.active ? 'text-[#53101E]' : 'text-stone-500'}`}>
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-stone-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reusable Return Bag Section */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200 flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-[#C69947] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-stone-900">
                Eco-Friendly Reusable Return Bag Included
              </h4>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Your order arrives in a premium zip-lock garment bag with a pre-printed, adhesive-free return shipping label. When your rental is complete, simply put the outfit back into the bag without washing or ironing. Our courier will pick it up on <strong>{firstItem ? formatDisplayDate(firstItem.returnDate) : 'the return date'}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onOpenTracking && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTracking();
                }}
                className="px-4 py-2 text-xs font-bold rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>📍 Live Track Delivery</span>
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              className="px-4 py-2 text-xs font-semibold rounded-full bg-stone-200 text-stone-800 hover:bg-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold rounded-full bg-[#53101E] text-white hover:bg-[#3B0913] transition-colors cursor-pointer"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
