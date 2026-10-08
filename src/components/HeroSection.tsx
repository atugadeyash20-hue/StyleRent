import React from 'react';
import { Sparkles, Shield, RotateCcw, Truck, ArrowRight, Award, Briefcase, Theater, Share2 } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onHowItWorksClick: () => void;
  onSelectCategory?: (category: string) => void;
  onOpenShare?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onHowItWorksClick,
  onSelectCategory,
  onOpenShare,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#F3ECE2] border-b border-stone-200">
      {/* Decorative subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#53101E_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#53101E]/10 border border-[#53101E]/20 text-[#53101E] text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#C69947]" />
              Men's & Women's Designer Rental
            </div>

            <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#3B0913] leading-tight">
              Wear the Designer Outfit. <br />
              <span className="text-[#C69947] italic">Never</span> the Retail Price.
            </h1>

            <p className="text-base sm:text-lg text-stone-700 max-w-xl leading-relaxed">
              Rent iconic men's royal sherwanis with dhoti, double-breasted pinstripe suits, theatrical & mythological costumes, executive power suits, and resort casuals from ₹799. Delivered sanitized to your doorstep in a reusable bag.
            </p>

            {/* Quick Department Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold">
              <button
                onClick={() => onSelectCategory?.('Formals')}
                className="px-3.5 py-1.5 rounded-full bg-white text-stone-900 border border-stone-300 hover:border-[#53101E] hover:text-[#53101E] transition-colors cursor-pointer shadow-2xs"
              >
                👔 Executive Formals & Suits
              </button>
              <button
                onClick={() => onSelectCategory?.('Costumes')}
                className="px-3.5 py-1.5 rounded-full bg-white text-stone-900 border border-stone-300 hover:border-[#53101E] hover:text-[#53101E] transition-colors cursor-pointer shadow-2xs"
              >
                🎭 Theatrical & Mythological Costumes
              </button>
              <button
                onClick={() => onSelectCategory?.('Casuals')}
                className="px-3.5 py-1.5 rounded-full bg-white text-stone-900 border border-stone-300 hover:border-[#53101E] hover:text-[#53101E] transition-colors cursor-pointer shadow-2xs"
              >
                ✨ Smart Casuals & Linen Fits
              </button>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 bg-[#53101E] text-white font-medium text-sm rounded-full shadow-md hover:bg-[#3B0913] hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Browse All Collections</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onHowItWorksClick}
                className="px-6 py-3.5 bg-white text-stone-800 border border-stone-300 font-medium text-sm rounded-full hover:bg-stone-50 hover:border-stone-400 transition-all cursor-pointer"
              >
                How It Works
              </button>

              {onOpenShare && (
                <button
                  onClick={onOpenShare}
                  className="px-5 py-3.5 bg-[#DFC07A]/25 border border-[#C69947]/50 text-[#53101E] font-semibold text-sm rounded-full hover:bg-[#DFC07A]/40 transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
                >
                  <Share2 className="w-4 h-4 text-[#53101E]" />
                  <span>Share Public Link</span>
                </button>
              )}
            </div>

            {/* Trust Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-stone-300/60">
              <div className="flex items-start gap-2.5">
                <Shield className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">4-Stage Sanitized</h4>
                  <p className="text-[11px] text-stone-600">UV & 120°C Steam dry clean</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Truck className="w-5 h-5 text-[#53101E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">2-Way Doorstep</h4>
                  <p className="text-[11px] text-stone-600">Free delivery & pickup</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <RotateCcw className="w-5 h-5 text-[#C69947] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Reusable Bag</h4>
                  <p className="text-[11px] text-stone-600">No packing or dry cleaning</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Award className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Backup Size</h4>
                  <p className="text-[11px] text-stone-600">Fit guarantee for ₹399</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Collage: Highlight Men's Royal Ethnic & Formals */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              {/* Main Fashion Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100 aspect-3/4">
                <img
                  src="/assets/images/maroon_achkan_dhoti_1791404123213.jpg"
                  alt="Royal Maroon Embroidered Silk Achkan with Zari Dhoti"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
                
                {/* Floating Price Tag */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-lg border border-stone-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-[#53101E] tracking-wider">
                        Heritage Men's Couture
                      </p>
                      <h3 className="text-sm font-bold text-stone-900">
                        Maroon Achkan with Zari Dhoti
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs line-through text-stone-400">₹46,000</span>
                      <p className="text-base font-bold text-[#53101E]">₹1,599 / 3D</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-600">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      ✓ Delivered 1 day prior
                    </span>
                    <span className="text-stone-500">Deposit 100% Refundable</span>
                  </div>
                </div>
              </div>

              {/* Accent Floating Badge */}
              <div className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 bg-[#53101E] text-stone-100 rounded-xl p-3 shadow-xl border border-[#DFC07A]/40 text-center">
                <p className="text-[10px] uppercase tracking-wider text-[#DFC07A] font-semibold">Save Up To</p>
                <p className="text-xl font-bold font-cinzel">95%</p>
                <p className="text-[10px] text-stone-300">vs buying new</p>
              </div>

              {/* Floating Second Card: Double-Breasted Suit */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white rounded-xl p-2.5 shadow-lg border border-stone-200 max-w-[220px] hidden sm:flex items-center gap-2.5">
                <img
                  src="/assets/images/pinstripe_double_suit_1791404178297.jpg"
                  alt="Double-Breasted Suit"
                  referrerPolicy="no-referrer"
                  className="w-12 h-14 object-cover rounded-lg border border-stone-200"
                />
                <div className="text-[11px]">
                  <p className="font-bold text-stone-900 line-clamp-1">Italian Pinstripe Suit</p>
                  <p className="text-[#53101E] font-bold">₹1,099 / 3D</p>
                  <p className="text-[10px] text-stone-400">Double-Breasted Fit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
