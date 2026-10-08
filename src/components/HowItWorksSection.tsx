import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  HeartHandshake, 
  Flame, 
  PackageCheck,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section 1: 4-Step User Journey */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C69947]">
              Simple & Transparent
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900">
              How Style-Rent Works
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Experience the luxury of wearing iconic designer apparel without the clutter, dry-cleaning bills, or hefty price tags.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-stone-200/80 space-y-3 relative group hover:border-[#53101E]/40 transition-colors">
              <span className="text-4xl font-cinzel font-bold text-[#53101E]/20 absolute top-4 right-4">
                01
              </span>
              <div className="w-12 h-12 rounded-2xl bg-[#53101E] text-white flex items-center justify-center shadow-xs">
                <Calendar className="w-6 h-6 text-[#DFC07A]" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">
                1. Browse & Select Dates
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Choose your favorite lehenga, sherwani, or suit. Select 3, 7, or 10 rental days. Add custom measurements or a backup size for ₹399.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-stone-200/80 space-y-3 relative group hover:border-[#53101E]/40 transition-colors">
              <span className="text-4xl font-cinzel font-bold text-[#53101E]/20 absolute top-4 right-4">
                02
              </span>
              <div className="w-12 h-12 rounded-2xl bg-[#53101E] text-white flex items-center justify-center shadow-xs">
                <Truck className="w-6 h-6 text-[#DFC07A]" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">
                2. Doorstep Arrival (1 Day Prior)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Your outfit arrives pristine, ironed, and sealed in our signature breathable Reusable Return Bag so you can test the fit comfortably before your celebration.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-stone-200/80 space-y-3 relative group hover:border-[#53101E]/40 transition-colors">
              <span className="text-4xl font-cinzel font-bold text-[#53101E]/20 absolute top-4 right-4">
                03
              </span>
              <div className="w-12 h-12 rounded-2xl bg-[#53101E] text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-6 h-6 text-[#DFC07A]" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">
                3. Flaunt at Your Event
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Turn heads at the wedding, sangeet, farewell, or cocktail gala. Relax knowing minor stains and loose threads are covered under Damage Protection.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-stone-200/80 space-y-3 relative group hover:border-[#53101E]/40 transition-colors">
              <span className="text-4xl font-cinzel font-bold text-[#53101E]/20 absolute top-4 right-4">
                04
              </span>
              <div className="w-12 h-12 rounded-2xl bg-[#53101E] text-white flex items-center justify-center shadow-xs">
                <RotateCcw className="w-6 h-6 text-[#DFC07A]" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">
                4. Zip & Return Pickup
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Place the outfit back into the bag. <strong>No washing or ironing needed.</strong> Courier picks up from your doorstep, and your deposit is refunded in 48 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Hygiene & Safety 4-Stage Protocol */}
        <div id="hygiene" className="bg-[#FAF7F2] rounded-3xl p-8 sm:p-12 border border-stone-200 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              100% Medical-Grade Sanitization
            </span>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-stone-900">
              Our 4-Stage Hygiene & Quality Protocol
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We treat every garment with meticulous pharmaceutical cleanliness before it reaches your hands. You receive each outfit cleaner than off-the-rack showroom pieces.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="font-bold text-stone-900 text-xs">
                Professional Dry Cleaning
              </h4>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Delicate organic eco-solvent cleaning specifically calibrated for heavy zari, silk brocades, and hand-embroidered velvet.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="font-bold text-stone-900 text-xs">
                Microbial UV Disinfection
              </h4>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Exposed to hospital-grade UV-C chambers and ozone deodorization destroying 99.9% of bacteria and viral pathogens.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="font-bold text-stone-900 text-xs">
                120°C Steam Pressing
              </h4>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                High-temperature vertical tunnel steam irons erase creases while neutralizing allergens, dust mites, and odors.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h4 className="font-bold text-stone-900 text-xs">
                Hermetic Seal & Quality Tag
              </h4>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Inspected by a master tailor, enclosed in a moisture-proof garment shroud, and locked with a serial-numbered tamper tag.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Reusable Return Bag & Sustainability */}
        <div className="border border-amber-200 bg-amber-50/50 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-amber-700" />
              Circular Fashion & Zero Packaging Waste
            </span>
            <h4 className="font-cinzel text-xl font-bold text-stone-900">
              Reusable Zip-Lock Garment Bag Included with Every Order
            </h4>
            <p className="text-xs text-stone-700 leading-relaxed">
              No cardboard waste, no tape, no trips to the post office. Your rental arrives in our custom heavy-duty water-resistant bag with an integrated reversible luggage tag. When your rental ends, simply zip it closed and hand it to our courier.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-amber-200/80 shadow-xs text-center shrink-0 w-full sm:w-auto">
            <p className="text-xs font-bold text-stone-800">Return Process in 3 Seconds:</p>
            <p className="text-[11px] text-stone-500 mt-1">Fold outfit → Slide into bag → Zip closed ✓</p>
            <span className="inline-block mt-2 text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
              Pre-printed courier return label attached
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
