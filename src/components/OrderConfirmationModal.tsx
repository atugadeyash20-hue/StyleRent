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
  SlidersHorizontal
} from 'lucide-react';
import { Order } from '../types';
import { formatINR, formatDisplayDate } from '../utils/rentalCalculations';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onOpenAdmin: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onOpenAdmin,
}) => {
  if (!order) return null;

  const firstItem = order.items[0];

  const timelineSteps = [
    { title: 'Order Confirmed', desc: 'Payment verified & booking reserved', active: true, done: true },
    { title: 'Preparing', desc: 'Hospital-grade dry clean & sanitization', active: true, done: false },
    { title: 'Shipped', desc: 'Packed in reusable zip bag with label', active: false, done: false },
    { title: 'Delivered', desc: 'Doorstep drop 1 day before event', active: false, done: false },
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
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
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
                  </p>
                  <p className="text-stone-600">
                    Rental Dates: <strong>{formatDisplayDate(item.startDate)}</strong> to <strong>{formatDisplayDate(item.returnDate)}</strong>
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 font-semibold">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Doorstep Delivery: {formatDisplayDate(item.deliveryDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Key Dates & Deposit details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-emerald-800 font-semibold block">Refundable Security Deposit</span>
              <p className="text-base font-bold text-emerald-950">
                {formatINR(order.pricing.totalSecurityDeposit)}
              </p>
              <p className="text-[10px] text-emerald-800">
                Refunds to your UPI/Account within 48h after return inspection.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#53101E]/5 border border-[#53101E]/20 space-y-1">
              <span className="text-[#53101E] font-semibold block">Total Amount Paid</span>
              <p className="text-base font-bold text-[#53101E]">
                {formatINR(order.pricing.grandTotal)}
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
          <button
            onClick={onOpenAdmin}
            className="px-4 py-2 text-xs font-semibold rounded-full bg-stone-200 text-stone-800 hover:bg-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Track in Admin Dashboard</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold rounded-full bg-[#53101E] text-white hover:bg-[#3B0913] transition-colors cursor-pointer"
          >
            Continue to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};
