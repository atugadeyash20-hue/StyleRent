import React, { useState } from 'react';
import { Heart, Star, ShieldCheck, Play, Video } from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../utils/rentalCalculations';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlayingVideoPreview, setIsPlayingVideoPreview] = useState(false);

  return (
    <div 
      className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPlayingVideoPreview(false);
      }}
    >
      {/* Image / Video Preview Area */}
      <div className="relative aspect-3/4 overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onSelectProduct(product)}>
        {/* Main Image or Secondary on hover */}
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />

        {/* Video Preview Simulation Overlay */}
        {isPlayingVideoPreview && (
          <div className="absolute inset-0 bg-stone-900/90 flex flex-col items-center justify-center p-4 text-center z-10 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-[#53101E] text-white flex items-center justify-center mb-2 animate-pulse">
              <Play className="w-5 h-5 ml-0.5" />
            </div>
            <p className="text-xs font-semibold text-white">Runway 360° Fit Preview</p>
            <p className="text-[10px] text-stone-300">Simulating live runway drape & movement ({product.videoDuration || '0:18'})</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPlayingVideoPreview(false);
              }}
              className="mt-3 px-3 py-1 bg-white/20 text-white rounded-full text-[10px] hover:bg-white/30"
            >
              Exit Preview
            </button>
          </div>
        )}

        {/* Video preview trigger button */}
        {!isPlayingVideoPreview && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlayingVideoPreview(true);
            }}
            title="Watch Runway Video Preview"
            className="absolute bottom-3 left-3 bg-black/60 hover:bg-[#53101E] text-white text-[11px] font-medium px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 transition-colors cursor-pointer z-10"
          >
            <Video className="w-3.5 h-3.5 text-[#DFC07A]" />
            <span>Video Preview</span>
          </button>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer z-10 ${
            isWishlisted 
              ? 'bg-[#53101E] text-white shadow-md' 
              : 'bg-white/80 text-stone-700 hover:bg-white hover:text-[#53101E]'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Hygiene Certification Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200 shadow-2xs">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Dry Cleaned & Sanitized</span>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Metadata: Category, Occasion, Gender */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#53101E] font-medium">{product.occasions[0]}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{product.gender}</span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onSelectProduct(product)}
            className="text-sm font-semibold text-stone-900 line-clamp-1 mt-1 hover:text-[#53101E] cursor-pointer transition-colors"
          >
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-1">
            {product.designerOrBrand}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-500 text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-stone-800 ml-1">{product.rating}</span>
            </div>
            <span className="text-stone-400 text-xs">({product.reviewCount} rentals)</span>
          </div>

          {/* Sizes available */}
          <div className="flex items-center gap-1 mt-2.5">
            <span className="text-[11px] text-stone-400 mr-1">Sizes:</span>
            {product.availableSizes.map((size) => (
              <span 
                key={size} 
                className="text-[10px] font-medium px-1.5 py-0.5 bg-stone-100 text-stone-700 rounded-sm border border-stone-200"
              >
                {size}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-stone-100 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-[#53101E]">
                {formatINR(product.rentalPrice1Day || Math.round(product.rentalPrice3Days * 0.7))}
              </span>
              <span className="text-xs text-stone-500 font-normal">/ 1 Day</span>
            </div>
            <div className="text-[10px] text-stone-500 flex items-center gap-1.5 mt-0.5">
              <span>3 Days: <strong>{formatINR(product.rentalPrice3Days)}</strong></span>
              <span>·</span>
              <span className="text-amber-700 font-medium">⚡ 2-Hr SOS</span>
            </div>
          </div>

          <button
            onClick={() => onSelectProduct(product)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-[#53101E] text-white hover:bg-[#3B0913] transition-colors cursor-pointer shadow-xs"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
