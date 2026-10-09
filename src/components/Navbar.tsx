import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  SlidersHorizontal, 
  Menu, 
  X, 
  Search,
  Briefcase,
  Share2,
  Truck,
  Crown,
  Zap,
  Navigation
} from 'lucide-react';
import { formatINR } from '../utils/rentalCalculations';
import { UserMembership } from '../types';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  onOpenShare: () => void;
  onOpenMembership: () => void;
  onOpenTracking: () => void;
  userMembership?: UserMembership | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigateSection: (sectionId: string) => void;
  onFilterCategory?: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAdmin,
  onOpenShare,
  onOpenMembership,
  onOpenTracking,
  userMembership,
  searchQuery,
  onSearchChange,
  onNavigateSection,
  onFilterCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMember = userMembership?.isActive || false;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-stone-200">
      {/* Top micro banner */}
      <div className="bg-[#53101E] text-stone-100 text-xs py-1.5 px-4 text-center flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#DFC07A]" />
          <span>
            Rent Luxury Outfits from ₹599/day · ⚡ 2-Hr SOS Emergency Delivery · 🚚 Same-Day Service
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMembership}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#DFC07A] bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-full border border-[#DFC07A]/40 transition-colors cursor-pointer"
          >
            <Crown className="w-3 h-3 text-[#DFC07A]" />
            <span>{isMember ? '👑 StylePass Active (0% Deposit)' : '👑 StylePass: 0% Deposit'}</span>
          </button>

          <button
            onClick={onOpenTracking}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 transition-colors cursor-pointer"
          >
            <Navigation className="w-3 h-3 text-emerald-400" />
            <span>Track Delivery</span>
          </button>

          <button
            onClick={onOpenShare}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-200 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
          >
            <Share2 className="w-3 h-3 text-[#DFC07A]" />
            <span>Share Link</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigateSection('hero')} 
              className="text-left group cursor-pointer"
            >
              <div className="flex items-baseline gap-1.5">
                <span className="font-cinzel text-2xl sm:text-3xl font-bold tracking-wider text-[#53101E]">
                  STYLE<span className="text-[#C69947]">-RENT</span>
                </span>
              </div>
              <p className="text-[10px] tracking-widest uppercase text-stone-500 font-medium -mt-1 group-hover:text-stone-700 transition-colors">
                Luxury Apparel & Costumes On Demand
              </p>
            </button>
          </div>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search sherwanis, pinstripe suits, Krishna costume, blazers..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white pl-10 pr-4 py-2 text-sm border border-stone-200 rounded-full focus:outline-none focus:border-[#53101E] focus:ring-1 focus:ring-[#53101E] shadow-2xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-stone-700">
            <button 
              onClick={() => onNavigateSection('shop')}
              className="hover:text-[#53101E] transition-colors cursor-pointer"
            >
              All Outfits
            </button>
            <button 
              onClick={() => {
                if (onFilterCategory) onFilterCategory('Formals');
                onNavigateSection('shop');
              }}
              className="hover:text-[#53101E] transition-colors flex items-center gap-1 cursor-pointer font-semibold text-stone-900"
            >
              👔 Formals
            </button>
            <button 
              onClick={() => {
                if (onFilterCategory) onFilterCategory('Costumes');
                onNavigateSection('shop');
              }}
              className="hover:text-[#53101E] transition-colors flex items-center gap-1 cursor-pointer font-semibold text-stone-900"
            >
              🎭 Costumes
            </button>
            <button 
              onClick={() => {
                if (onFilterCategory) onFilterCategory('Casuals');
                onNavigateSection('shop');
              }}
              className="hover:text-[#53101E] transition-colors flex items-center gap-1 cursor-pointer font-semibold text-stone-900"
            >
              ✨ Casuals
            </button>
            <button 
              onClick={() => onNavigateSection('how-it-works')}
              className="hover:text-[#53101E] transition-colors cursor-pointer text-stone-600"
            >
              How It Works
            </button>
            <button 
              onClick={() => onNavigateSection('hygiene')}
              className="hover:text-[#53101E] transition-colors flex items-center gap-1 cursor-pointer text-stone-600"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Hygiene
            </button>
            <button 
              onClick={() => onNavigateSection('reviews')}
              className="hover:text-[#53101E] transition-colors cursor-pointer text-stone-600"
            >
              Reviews
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Share Public Link Button */}
            <button
              onClick={onOpenShare}
              title="Share Public Link with Anyone"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#53101E] bg-[#DFC07A]/25 hover:bg-[#DFC07A]/40 border border-[#DFC07A]/60 rounded-full transition-colors cursor-pointer shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-[#53101E]" />
              <span className="hidden sm:inline">Share Link</span>
            </button>

            {/* StylePass Club Shortcut */}
            <button
              onClick={onOpenMembership}
              title="StylePass Royalty Club"
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer border shadow-2xs ${
                isMember
                  ? 'bg-[#53101E] text-white border-[#DFC07A]'
                  : 'bg-[#DFC07A]/25 text-[#53101E] border-[#DFC07A]/70 hover:bg-[#DFC07A]/40'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-[#C69947]" />
              <span>{isMember ? 'StylePass VIP' : 'StylePass Club'}</span>
            </button>

            {/* Track Delivery shortcut */}
            <button
              onClick={onOpenTracking}
              title="Track Active Delivery & GPS"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-full transition-colors cursor-pointer shadow-2xs"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-700" />
              <span>Track Delivery</span>
            </button>

            {/* Admin Dashboard shortcut */}
            <button
              onClick={onOpenAdmin}
              title="Admin & Staff Portal"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#53101E] bg-[#53101E]/10 rounded-full hover:bg-[#53101E]/15 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Admin / Staff</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 text-stone-700 hover:text-[#53101E] rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#53101E] text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 bg-[#53101E] text-stone-50 rounded-full hover:bg-[#3B0913] transition-colors cursor-pointer shadow-sm"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#DFC07A]" />
              <span className="text-xs font-semibold">
                Cart {cartCount > 0 ? `(${cartCount})` : ''}
              </span>
              {cartTotal > 0 && (
                <span className="hidden md:inline text-xs font-medium text-[#DFC07A] pl-1 border-l border-white/20">
                  {formatINR(cartTotal)}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 rounded-md hover:bg-stone-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="pb-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search sherwanis, formals, costumes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-2 text-sm border border-stone-200 rounded-full focus:outline-none focus:border-[#53101E]"
            />
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-stone-200 space-y-3 bg-[#FAF7F2]">
            <div className="flex flex-col space-y-2 text-sm font-medium">
              <button
                onClick={() => {
                  onNavigateSection('shop');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-stone-100"
              >
                All Outfits
              </button>
              <button
                onClick={() => {
                  if (onFilterCategory) onFilterCategory('Formals');
                  onNavigateSection('shop');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg font-bold text-stone-900 bg-stone-100"
              >
                👔 Formals & Power Suits
              </button>
              <button
                onClick={() => {
                  if (onFilterCategory) onFilterCategory('Costumes');
                  onNavigateSection('shop');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg font-bold text-stone-900 bg-stone-100"
              >
                🎭 Theatrical & Mythological Costumes
              </button>
              <button
                onClick={() => {
                  if (onFilterCategory) onFilterCategory('Casuals');
                  onNavigateSection('shop');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg font-bold text-stone-900 bg-stone-100"
              >
                ✨ Smart Casuals & Linen Sets
              </button>
              <button
                onClick={() => {
                  onNavigateSection('how-it-works');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-stone-100"
              >
                How Rental Works
              </button>
              <button
                onClick={() => {
                  onNavigateSection('hygiene');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-stone-100"
              >
                Hygiene & Sanitization
              </button>
              <button
                onClick={() => {
                  onNavigateSection('reviews');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-stone-100"
              >
                Customer Reviews
              </button>
              <button
                onClick={() => {
                  onOpenMembership();
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2.5 rounded-lg bg-[#DFC07A]/25 text-[#53101E] font-bold flex items-center justify-between border border-[#DFC07A]/50"
              >
                <span className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-[#C69947]" />
                  StylePass Royalty Club (0% Deposit)
                </span>
                <span className="text-[10px] bg-[#53101E] text-white px-2 py-0.5 rounded-full font-bold">VIP</span>
              </button>
              <button
                onClick={() => {
                  onOpenTracking();
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2.5 rounded-lg bg-emerald-50 text-emerald-950 font-bold flex items-center justify-between border border-emerald-200"
              >
                <span className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-700" />
                  Live Order & GPS Tracking
                </span>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">Live</span>
              </button>
              <button
                onClick={() => {
                  onOpenShare();
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2.5 rounded-lg bg-[#DFC07A]/25 text-[#53101E] font-bold flex items-center justify-between border border-[#DFC07A]/40"
              >
                <span className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#53101E]" />
                  Share Public Link (Anyone can open)
                </span>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-semibold">Public</span>
              </button>
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg bg-[#53101E]/10 text-[#53101E] font-semibold"
              >
                Admin / Staff Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
