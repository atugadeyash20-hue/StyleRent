import React from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ShieldCheck, 
  RotateCcw, 
  Calendar, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight,
  Info
} from 'lucide-react';
import { CartItem } from '../types';
import { formatINR, formatDisplayDate } from '../utils/rentalCalculations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (cartItemId: string) => void;
  onToggleProtection: (cartItemId: string) => void;
  onToggleBackup: (cartItemId: string) => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onToggleProtection,
  onToggleBackup,
  onProceedCheckout,
}) => {
  if (!isOpen) return null;

  // Totals calculations
  const totalRentalFee = items.reduce((acc, item) => acc + item.rentalFee, 0);
  const totalDeposit = items.reduce((acc, item) => acc + item.securityDeposit, 0);
  const totalBackupFee = items.reduce((acc, item) => acc + (item.hasBackupSize ? item.backupFee : 0), 0);
  const totalProtectionFee = items.reduce((acc, item) => acc + (item.hasDamageProtection ? item.protectionFee : 0), 0);
  const deliveryFee = 0; // Free 2-way doorstep delivery in demo
  const grandTotal = totalRentalFee + totalDeposit + totalBackupFee + totalProtectionFee + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#53101E]" />
            <h3 className="font-cinzel text-lg font-bold text-stone-900">
              Your Rental Bag ({items.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-stone-800 text-base">Your rental bag is empty</h4>
              <p className="text-xs text-stone-500 max-w-xs">
                Explore designer lehengas, sherwanis, sarees, and suits for your upcoming weddings and parties!
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 text-xs font-semibold rounded-full bg-[#53101E] text-white hover:bg-[#3B0913] cursor-pointer"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={item.cartItemId} 
                className="rounded-2xl border border-stone-200 p-4 bg-white shadow-2xs space-y-3 relative group"
              >
                {/* Product row */}
                <div className="flex gap-3">
                  <div className="w-18 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.cartItemId)}
                        className="text-stone-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                        title="Remove outfit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-500">
                      Size: <span className="font-semibold text-stone-800">{item.selectedSize}</span> · {item.rentalDuration} Days
                    </p>

                    <div className="text-[11px] text-stone-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#53101E]" />
                      <span>{formatDisplayDate(item.startDate)} to {formatDisplayDate(item.returnDate)}</span>
                    </div>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-sm font-bold text-[#53101E]">
                        {formatINR(item.rentalFee)}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-medium">
                        + {formatINR(item.securityDeposit)} dep.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Toggles: Backup Size & Damage Protection */}
                <div className="border-t border-stone-100 pt-2 space-y-2 text-xs">
                  {/* Backup Size Toggle */}
                  <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-stone-50">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C69947]" />
                      <span className="text-[11px] text-stone-700">
                        Backup Size ({item.backupSize || 'L'}): <strong>₹399</strong>
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer scale-80">
                      <input
                        type="checkbox"
                        checked={item.hasBackupSize}
                        onChange={() => onToggleBackup(item.cartItemId)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#53101E]"></div>
                    </label>
                  </div>

                  {/* Damage Protection Toggle */}
                  <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-stone-50">
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="text-[11px] text-stone-700">
                        Peace of Mind Protection: <strong>₹299</strong>
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer scale-80">
                      <input
                        type="checkbox"
                        checked={item.hasDamageProtection}
                        onChange={() => onToggleProtection(item.cartItemId)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-700"></div>
                    </label>
                  </div>
                </div>

                {/* Return Bag Inclusion Notice */}
                <div className="text-[10px] text-stone-500 bg-[#FAF7F2] p-2 rounded-lg flex items-center gap-1.5 border border-stone-200/60">
                  <RotateCcw className="w-3 h-3 text-[#C69947] shrink-0" />
                  <span>Includes reusable return zip-lock bag & pre-printed label</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Price breakdown & checkout button */}
        {items.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-[#FAF7F2] space-y-4">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Rental Fee</span>
                <span className="font-semibold text-stone-900">{formatINR(totalRentalFee)}</span>
              </div>

              <div className="flex justify-between items-center text-emerald-800">
                <span className="flex items-center gap-1">
                  <span>Refundable Security Deposit</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded-sm">100% Refundable</span>
                </span>
                <span className="font-semibold">{formatINR(totalDeposit)}</span>
              </div>

              {totalBackupFee > 0 && (
                <div className="flex justify-between">
                  <span>Backup Size Option</span>
                  <span className="font-semibold text-stone-900">{formatINR(totalBackupFee)}</span>
                </div>
              )}

              {totalProtectionFee > 0 && (
                <div className="flex justify-between">
                  <span>Peace of Mind Damage Protection</span>
                  <span className="font-semibold text-stone-900">{formatINR(totalProtectionFee)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>2-Way Doorstep Delivery & Reusable Bag</span>
                <span className="font-semibold text-emerald-700">FREE</span>
              </div>

              <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline text-sm">
                <span className="font-bold text-stone-900">Total Payable Now</span>
                <span className="font-bold text-lg text-[#53101E]">{formatINR(grandTotal)}</span>
              </div>

              <p className="text-[10px] text-stone-500 italic text-center pt-1">
                * {formatINR(totalDeposit)} deposit is automatically refunded to your UPI/card within 48h after return inspection.
              </p>
            </div>

            <button
              onClick={onProceedCheckout}
              className="w-full py-3.5 bg-[#53101E] text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#3B0913] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
