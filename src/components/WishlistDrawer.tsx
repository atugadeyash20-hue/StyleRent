import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../utils/rentalCalculations';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistedProducts: Product[];
  onRemoveWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistedProducts,
  onRemoveWishlist,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#53101E] fill-current" />
            <h3 className="font-cinzel text-lg font-bold text-stone-900">
              Saved Wishlist ({wishlistedProducts.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-stone-800 text-base">Your wishlist is empty</h4>
              <p className="text-xs text-stone-500 max-w-xs">
                Save designer outfits you love for your upcoming occasions and book them when your event dates are set!
              </p>
            </div>
          ) : (
            wishlistedProducts.map((p) => (
              <div 
                key={p.id} 
                className="rounded-2xl border border-stone-200 p-3 bg-white shadow-2xs flex gap-3 items-center group"
              >
                <img 
                  src={p.images[0]} 
                  alt={p.name} 
                  referrerPolicy="no-referrer"
                  className="w-16 h-20 rounded-xl object-cover object-top border border-stone-200 shrink-0"
                />

                <div className="flex-1 space-y-1 text-xs">
                  <h4 className="font-bold text-stone-900 line-clamp-1">{p.name}</h4>
                  <p className="text-stone-500">{p.category} · {p.designerOrBrand}</p>
                  <p className="font-bold text-[#53101E]">{formatINR(p.rentalPrice3Days)} / 3 Days</p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      className="px-3 py-1 bg-[#53101E] text-white rounded-full text-[11px] font-semibold hover:bg-[#3B0913] cursor-pointer"
                    >
                      View & Rent
                    </button>
                    <button
                      onClick={() => onRemoveWishlist(p.id)}
                      className="p-1 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-[#FAF7F2]">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-full transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
