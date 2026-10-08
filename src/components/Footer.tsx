import React from 'react';
import { Sparkles, ShieldCheck, RotateCcw, Heart, Share2 } from 'lucide-react';
import { CITIES_LIST } from '../data/mockData';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenShare?: () => void;
  onFilterCategory?: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onOpenAdmin,
  onOpenShare,
  onFilterCategory,
}) => {
  return (
    <footer className="bg-[#3B0913] text-stone-200 border-t border-stone-800">
      {/* Top micro feature banner */}
      <div className="border-b border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-[#DFC07A]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white">4-Stage Hospital Sanitization</h5>
              <p className="text-stone-400 text-[11px]">UV-C chamber + 120°C high-temp steam</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-[#DFC07A]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white">Reusable Return Bag Included</h5>
              <p className="text-stone-400 text-[11px]">Zero packaging waste & free courier pickup</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-[#DFC07A]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white">100% Refundable Security Deposit</h5>
              <p className="text-stone-400 text-[11px]">Automated release to UPI in 48 hours</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-baseline gap-1">
              <span className="font-cinzel text-2xl font-bold tracking-wider text-white">
                STYLE<span className="text-[#DFC07A]">-RENT</span>
              </span>
            </div>
            <p className="text-stone-400 leading-relaxed pr-6 text-[11px]">
              India's premier online clothing rental platform. Wear bespoke bridal lehengas, royal sherwanis, double-breasted Italian pinstripe suits, theatrical & mythological stage costumes, and French linen casuals on demand.
            </p>
          </div>

          {/* Quick Departments */}
          <div className="md:col-span-2 space-y-2.5">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
              Departments
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button 
                  onClick={() => {
                    onFilterCategory?.('Formals');
                    onNavigateSection('shop');
                  }} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Executive Formals
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onFilterCategory?.('Costumes');
                    onNavigateSection('shop');
                  }} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Theatrical Costumes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onFilterCategory?.('Casuals');
                    onNavigateSection('shop');
                  }} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Smart Casuals
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onFilterCategory?.('Sherwanis');
                    onNavigateSection('shop');
                  }} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Royal Sherwanis
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onFilterCategory?.('Lehengas');
                    onNavigateSection('shop');
                  }} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Bridal Lehengas
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
              Customer Service
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button onClick={() => onNavigateSection('how-it-works')} className="hover:text-white transition-colors cursor-pointer">
                  How Rental Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('hygiene')} className="hover:text-white transition-colors cursor-pointer">
                  Hygiene & Sanitization
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('reviews')} className="hover:text-white transition-colors cursor-pointer">
                  Customer Fit Reviews
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-[#DFC07A] hover:underline font-medium cursor-pointer">
                  Staff & Operations Portal
                </button>
              </li>
              {onOpenShare && (
                <li>
                  <button 
                    onClick={onOpenShare} 
                    className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share Public Store Link
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Metro Cities Covered */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
              Doorstep Delivery In
            </h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              {CITIES_LIST.join(' · ')}
            </p>
            <p className="text-[10px] text-stone-500 mt-2">
              Free 2-way doorstep courier pickup included with every reservation in reusable zip bags.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
          <p>© {new Date().getFullYear()} Style-Rent. Luxury Clothing, Formals & Costumes Rental Platform.</p>
          <div className="bg-white/5 px-3 py-1.5 rounded-full border border-white/10 text-stone-300 text-[10px]">
            Doorstep Delivery & Reversible Return Bag Guarantee
          </div>
        </div>
      </div>
    </footer>
  );
};
