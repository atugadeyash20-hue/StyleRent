import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Video, 
  Sparkles, 
  Scissors, 
  Truck, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  ShoppingBag,
  Heart,
  ChevronRight,
  ShieldAlert,
  Info,
  Share2,
  Check
} from 'lucide-react';
import { Product, Size, FittingOption, CustomMeasurements } from '../types';
import { RentalCalendar } from './RentalCalendar';
import { getPublicShareUrl } from './ShareModal';
import { 
  formatINR, 
  formatDateISO, 
  addDays, 
  calculateRentalDates, 
  isRangeAvailable 
} from '../utils/rentalCalculations';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (itemConfig: {
    product: Product;
    selectedSize: Size;
    fittingOption: FittingOption;
    customMeasurements?: CustomMeasurements;
    rentalDuration: 3 | 7 | 10;
    startDate: string;
    hasBackupSize: boolean;
    backupSize?: Size;
    backupFee: number;
    hasDamageProtection: boolean;
    protectionFee: number;
  }) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  // Image gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'photos' | 'video'>('photos');

  // Size & fitting state
  const [selectedSize, setSelectedSize] = useState<Size>(product.availableSizes[0] || 'M');
  const [fittingOption, setFittingOption] = useState<FittingOption>('standard');
  const [customMeasurements, setCustomMeasurements] = useState<CustomMeasurements>({
    chest: '36',
    waist: '30',
    hip: '38',
    shoulder: '15',
    sleeveLength: '21',
    outfitLength: '54',
  });

  // Rental duration & dates state (default start date = 3 days from today)
  const defaultStartDate = formatDateISO(addDays(new Date(), 3));
  const [rentalDuration, setRentalDuration] = useState<3 | 7 | 10>(3);
  const [startDate, setStartDate] = useState<string>(defaultStartDate);

  // Backup size & damage protection state
  const [hasBackupSize, setHasBackupSize] = useState<boolean>(false);
  const [backupSize, setBackupSize] = useState<Size>(
    product.availableSizes.find(s => s !== selectedSize) || 'L'
  );
  const [hasDamageProtection, setHasDamageProtection] = useState<boolean>(true);

  // Added to cart feedback
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleShareProduct = () => {
    const publicBase = getPublicShareUrl();
    const shareUrl = `${publicBase}#product-${product.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl);
    }
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  // Rental pricing calculation
  const rentalFee = rentalDuration === 3 
    ? product.rentalPrice3Days 
    : rentalDuration === 7 
      ? product.rentalPrice7Days 
      : product.rentalPrice10Days;

  const backupFee = hasBackupSize ? 399 : 0;
  const protectionFee = hasDamageProtection ? 299 : 0;
  const totalDueNow = rentalFee + product.securityDeposit + backupFee + protectionFee;

  const isAvailable = isRangeAvailable(startDate, rentalDuration, product.bookings);

  const handleAddToCart = () => {
    if (!isAvailable) {
      alert('Selected dates conflict with an existing reservation or sanitization buffer. Please choose different dates on the calendar.');
      return;
    }

    onAddToCart({
      product,
      selectedSize,
      fittingOption,
      customMeasurements: fittingOption === 'custom' ? customMeasurements : undefined,
      rentalDuration,
      startDate,
      hasBackupSize,
      backupSize: hasBackupSize ? backupSize : undefined,
      backupFee,
      hasDamageProtection,
      protectionFee,
    });

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6">
      <div 
        className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-stone-500">
              {product.category} · {product.gender.toUpperCase()}
            </span>
            <span className="text-stone-300">|</span>
            <span className="text-xs font-medium text-[#53101E]">
              {product.designerOrBrand}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareProduct}
              className={`p-2 rounded-full border transition-colors cursor-pointer flex items-center gap-1 text-xs ${
                shareCopied 
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700' 
                  : 'border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
              title="Share outfit link with friends"
            >
              {shareCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-semibold pr-1">Link Copied!</span>
                </>
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isWishlisted 
                  ? 'border-[#53101E] text-[#53101E] bg-[#53101E]/10' 
                  : 'border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
              title="Toggle Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Visual Gallery & Video Preview */}
            <div className="lg:col-span-5 space-y-4">
              {/* Media Switcher Tab */}
              <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl max-w-fit">
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'photos' 
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold' 
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  HD Photos
                </button>
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'video' 
                      ? 'bg-[#53101E] text-white shadow-2xs font-semibold' 
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  Runway Video ({product.videoDuration || '0:18'})
                </button>
              </div>

              {/* Main Media Display */}
              <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
                {activeTab === 'photos' ? (
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="relative w-full h-full bg-stone-950 flex flex-col items-center justify-center p-6 text-center">
                    <img
                      src={product.images[0]}
                      alt="Runway Preview background"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover opacity-35 filter blur-xs"
                    />
                    <div className="relative z-10 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-[#53101E] text-white flex items-center justify-center mx-auto shadow-xl animate-pulse">
                        <Video className="w-8 h-8 ml-0.5 text-[#DFC07A]" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-base font-cinzel">
                          360° Runway Simulation
                        </h4>
                        <p className="text-stone-300 text-xs max-w-xs mt-1">
                          Simulated fashion week catwalk showing garment movement, fabric fall, and zari shimmer under spotlight.
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>Live Preview Ready ({product.videoDuration})</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {activeTab === 'photos' && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-18 h-22 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedImageIndex === idx 
                          ? 'border-[#53101E] ring-2 ring-[#53101E]/30' 
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover object-top" />
                    </button>
                  ))}
                </div>
              )}

              {/* Hygiene & Care Official Badge Card */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                    Style-Rent Hygiene & Care Assurance
                  </h4>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-emerald-900">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>Dry Cleaned Professionally</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>Microbially Disinfected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>Steam Ironed at 120°C</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>Quality Audited Pre-Dispatch</span>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-800 leading-relaxed border-t border-emerald-200/70 pt-2">
                  Each garment undergoes hospital-grade ozone sterilization and is sealed with a tamper-evident hygiene tag. You receive it in ready-to-wear boutique condition.
                </p>
              </div>

            </div>

            {/* Right Column: Pricing, Dates, Size, Custom fitting, Add to Cart */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Title & Ratings */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-stone-900">
                  {product.name}
                </h2>
                
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-stone-600">
                  <div className="flex items-center text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                    <span>{product.rating}</span>
                    <span className="text-stone-400 font-normal ml-1">({product.reviewCount} customer reviews)</span>
                  </div>
                  <span>·</span>
                  <span className="text-[#53101E] font-semibold">{product.color}</span>
                  <span>·</span>
                  <span className="text-stone-500">{product.fabric}</span>
                </div>
              </div>

              {/* Price comparison card */}
              <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-stone-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-stone-500 font-medium">Rental Price ({rentalDuration} Days)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#53101E]">
                      {formatINR(rentalFee)}
                    </span>
                    <span className="text-xs text-stone-400 line-through">
                      Retail: {formatINR(product.retailValue)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-stone-500 font-medium">Security Deposit</span>
                  <div className="text-sm font-bold text-emerald-800 flex items-center justify-end gap-1">
                    <span>{formatINR(product.securityDeposit)}</span>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                      100% Refundable
                    </span>
                  </div>
                </div>
              </div>

              {/* RENTAL CALENDAR (Interactive) */}
              <div className="space-y-2">
                <RentalCalendar
                  bookings={product.bookings}
                  selectedStartDate={startDate}
                  durationDays={rentalDuration}
                  onDurationChange={setRentalDuration}
                  onStartDateChange={setStartDate}
                />
              </div>

              {/* SIZE & FITTING SELECTION */}
              <div className="space-y-4 pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Select Outfit Size
                  </label>
                  <span className="text-xs text-stone-500">True to standard Indian sizing</span>
                </div>

                {/* Available Sizes */}
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-12 py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#53101E] text-white border-[#53101E] shadow-sm'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Fitting Assistance Options */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Scissors className="w-4 h-4 text-[#53101E]" />
                    Fitting Assistance Preference
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setFittingOption('standard')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        fittingOption === 'standard'
                          ? 'border-[#53101E] bg-[#53101E]/5 text-stone-900'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <p className="font-bold">Standard Size</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">Use regular boutique ready-to-wear cut</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFittingOption('custom')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        fittingOption === 'custom'
                          ? 'border-[#53101E] bg-[#53101E]/5 text-stone-900'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <p className="font-bold">Custom Measurements</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">Provide chest, waist, and length inches</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFittingOption('tailor_visit')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        fittingOption === 'tailor_visit'
                          ? 'border-[#53101E] bg-[#53101E]/5 text-stone-900'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <p className="font-bold">Request At-Home Tailor Visit</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">Available in Mumbai, Pune, Bengaluru & Delhi NCR</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFittingOption('unstitched_margins')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        fittingOption === 'unstitched_margins'
                          ? 'border-[#53101E] bg-[#53101E]/5 text-stone-900'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <p className="font-bold">Unstitched Margins</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">2-inch seam allowance for gentle local alteration</p>
                    </button>
                  </div>

                  {/* Custom Measurement Inputs Drawer */}
                  {fittingOption === 'custom' && (
                    <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3 mt-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-stone-800">Custom Fit Details (in inches)</h4>
                        <span className="text-[11px] text-stone-500">Free alteration service</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] text-stone-600 font-medium block">Chest / Bust</label>
                          <input
                            type="text"
                            value={customMeasurements.chest}
                            onChange={(e) => setCustomMeasurements({...customMeasurements, chest: e.target.value})}
                            className="w-full bg-white px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-stone-600 font-medium block">Waist</label>
                          <input
                            type="text"
                            value={customMeasurements.waist}
                            onChange={(e) => setCustomMeasurements({...customMeasurements, waist: e.target.value})}
                            className="w-full bg-white px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-stone-600 font-medium block">Hip</label>
                          <input
                            type="text"
                            value={customMeasurements.hip}
                            onChange={(e) => setCustomMeasurements({...customMeasurements, hip: e.target.value})}
                            className="w-full bg-white px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-stone-600 font-medium block">Shoulder</label>
                          <input
                            type="text"
                            value={customMeasurements.shoulder}
                            onChange={(e) => setCustomMeasurements({...customMeasurements, shoulder: e.target.value})}
                            className="w-full bg-white px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-stone-600 font-medium block">Sleeve Length</label>
                          <input
                            type="text"
                            value={customMeasurements.sleeveLength}
                            onChange={(e) => setCustomMeasurements({...customMeasurements, sleeveLength: e.target.value})}
                            className="w-full bg-white px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-stone-600 font-medium block">Garment Length</label>
                          <input
                            type="text"
                            value={customMeasurements.outfitLength}
                            onChange={(e) => setCustomMeasurements({...customMeasurements, outfitLength: e.target.value})}
                            className="w-full bg-white px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* BACKUP SIZE OPTION */}
              <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-stone-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#C69947]" />
                      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                        Worried About the Fit? Add a Backup Size
                      </h4>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      Receive an alternate size alongside your order for just <strong>₹399</strong>. Try both, wear the one that fits best, and return both in the prepaid bag!
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={hasBackupSize}
                      onChange={(e) => setHasBackupSize(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#53101E]"></div>
                  </label>
                </div>

                {hasBackupSize && (
                  <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between">
                    <span className="text-xs font-medium text-stone-700">Choose Backup Size (+₹399):</span>
                    <div className="flex gap-1.5">
                      {product.availableSizes.map((s) => (
                        <button
                          key={`backup-${s}`}
                          type="button"
                          onClick={() => setBackupSize(s)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                            backupSize === s
                              ? 'bg-[#53101E] text-white border-[#53101E]'
                              : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* DAMAGE PROTECTION OPTION */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-emerald-700" />
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Peace of Mind Protection (₹299)
                    </h4>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Covers eligible minor accidental wear: mocktail/food spills, broken buttons, seam loosening, and minor zipper jams with zero deduction from your security deposit.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={hasDamageProtection}
                    onChange={(e) => setHasDamageProtection(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
                </label>
              </div>

              {/* Garment Details & Description */}
              <div className="space-y-3 pt-2 text-xs text-stone-600 leading-relaxed">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-xs">
                  Description & Stylist Notes
                </h4>
                <p>{product.description}</p>
                <div className="grid grid-cols-2 gap-2 pt-1 font-medium text-stone-700">
                  <div>Occasion: <span className="text-[#53101E]">{product.occasions.join(', ')}</span></div>
                  <div>Fabric: <span>{product.fabric}</span></div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Footer / Checkout Action Bar */}
        <div className="px-6 py-4 border-t border-stone-200 bg-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#53101E]">
                {formatINR(totalDueNow)}
              </span>
              <span className="text-xs text-stone-500">
                (Includes {formatINR(product.securityDeposit)} refundable deposit)
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Includes 2-way doorstep delivery in reusable return bag
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold rounded-full border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Continue Browsing
            </button>

            <button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`px-7 py-3 text-xs font-bold rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                addedSuccess 
                  ? 'bg-emerald-700 text-white' 
                  : isAvailable 
                    ? 'bg-[#53101E] text-white hover:bg-[#3B0913]' 
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              {addedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-[#DFC07A]" />
                  <span>Add Outfit to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
