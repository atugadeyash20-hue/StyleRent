import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  Building, 
  Banknote, 
  Lock, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Zap,
  Truck,
  Package,
  Crown,
  Clock,
  MapPin
} from 'lucide-react';
import { CartItem, CustomerDetails, VerificationDetails, PaymentMethod, Order, DeliverySpeed, UserMembership } from '../types';
import { formatINR, generateTrackingForOrder } from '../utils/rentalCalculations';
import { CITIES_LIST } from '../data/mockData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  userMembership: UserMembership | null;
  onOrderCompleted: (order: Order) => void;
  onOpenMembership?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  userMembership,
  onOrderCompleted,
  onOpenMembership,
}) => {
  if (!isOpen || items.length === 0) return null;

  // Step 1: Customer details
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98201 44552',
    address: 'B-402, Royal Palms, Link Road',
    city: 'Mumbai',
    pincode: '400053',
    state: 'Maharashtra',
  });

  // Delivery speed selection (Feature #2 and #3)
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>('standard');

  // Step 2: Verification details
  const [verificationType, setVerificationType] = useState<'Aadhaar' | 'PAN'>('Aadhaar');
  const [idInput, setIdInput] = useState('XXXX-XXXX-8491');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(true);

  // Step 3: Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiProvider, setUpiProvider] = useState<'phonepe' | 'gpay' | 'paytm' | 'other'>('phonepe');
  const [upiId, setUpiId] = useState('ananya@okhdfcbank');

  // Form errors
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Financial calculations
  const totalRentalFee = items.reduce((acc, item) => acc + item.rentalFee, 0);
  const rawDeposit = items.reduce((acc, item) => acc + item.securityDeposit, 0);

  // Membership Benefits:
  // - 100% Zero Security Deposit waiver if member (or 50% for silver)
  const isMember = userMembership?.isActive || false;
  const isGoldOrVip = isMember && (userMembership?.tier === 'gold' || userMembership?.tier === 'vip');

  const finalDeposit = isGoldOrVip 
    ? 0 
    : isMember 
      ? Math.round(rawDeposit * 0.5) 
      : rawDeposit;

  // Delivery Speed Fee (Feature #2 and #3):
  // - Standard: ₹0
  // - Same-Day: ₹99 (or ₹0 for members)
  // - 2-Hour Emergency SOS: ₹299 (or ₹149 for members)
  let deliverySpeedFee = 0;
  if (deliverySpeed === 'same_day') {
    deliverySpeedFee = isMember ? 0 : 99;
  } else if (deliverySpeed === 'express_2hr') {
    deliverySpeedFee = isMember ? 149 : 299;
  }

  // Member discounts
  const memberRentalDiscount = isMember ? Math.round(totalRentalFee * 0.1) : 0;
  const totalBackupFee = items.reduce((acc, item) => {
    if (!item.hasBackupSize) return acc;
    return acc + (isMember ? 0 : item.backupFee); // Free backup size for members
  }, 0);

  const totalProtectionFee = items.reduce((acc, item) => acc + (item.hasDamageProtection ? item.protectionFee : 0), 0);
  const grandTotal = totalRentalFee - memberRentalDiscount + finalDeposit + totalBackupFee + totalProtectionFee + deliverySpeedFee;

  const handleSimulateVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 700);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.fullName || !customer.phone || !customer.address || !customer.pincode) {
      setErrorMsg('Please complete all delivery address details.');
      return;
    }
    if (!isVerified) {
      setErrorMsg('Please complete demo identity verification before renting luxury apparel.');
      return;
    }

    setIsSubmitting(true);

    // Generate unique order ID
    const newOrderId = `SR-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    // Generate live delivery tracking
    const tracking = generateTrackingForOrder(newOrderId, customer, deliverySpeed);

    const newOrder: Order = {
      orderId: newOrderId,
      createdAt: new Date().toISOString(),
      customer,
      items: [...items],
      deliverySpeed,
      tracking,
      membershipApplied: isMember,
      membershipSavings: isMember ? (rawDeposit - finalDeposit + (isMember ? 99 : 0) + memberRentalDiscount) : 0,
      pricing: {
        totalRentalFee,
        totalSecurityDeposit: finalDeposit,
        totalBackupFee,
        totalProtectionFee,
        deliveryFee: 0,
        deliverySpeedFee,
        membershipDiscount: memberRentalDiscount,
        discount: memberRentalDiscount,
        grandTotal,
      },
      verification: {
        type: verificationType,
        idNumber: idInput || (verificationType === 'Aadhaar' ? 'XXXX-XXXX-9812' : 'ABCDE1234F'),
        isVerified: true,
        verifiedAt: new Date().toISOString().split('T')[0],
      },
      paymentMethod,
      paymentStatus: 'Paid',
      status: deliverySpeed === 'express_2hr' ? 'Shipped' : 'Order Confirmed',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderCompleted(newOrder);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center p-3 sm:p-6">
      <div 
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-[#FAF7F2]">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-stone-900 flex items-center gap-2">
              <span>Style-Rent Secure Checkout</span>
              {isMember && (
                <span className="text-[10px] uppercase font-sans tracking-wider bg-[#DFC07A]/30 text-[#53101E] border border-[#DFC07A] px-2 py-0.5 rounded-full font-bold">
                  💎 {userMembership?.planName}
                </span>
              )}
            </h3>
            <p className="text-xs text-stone-500">
              Select Delivery Speed · Verification · Indian Payment Gateway
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable form */}
        <form onSubmit={handlePlaceOrder} className="overflow-y-auto p-6 space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Membership Upsell or Active Perk Banner */}
          {isMember ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Crown className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <strong className="text-emerald-950 font-bold block">
                    {userMembership?.planName} Benefits Applied to this Booking!
                  </strong>
                  <span className="text-emerald-800 text-[11px]">
                    100% Zero Security Deposit ({formatINR(rawDeposit)} waived) + Free/Discounted Express Delivery + 10% Off Rentals.
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-lg">
                Savings: {formatINR(rawDeposit + memberRentalDiscount)}
              </span>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5">
                <Crown className="w-5 h-5 text-[#53101E] shrink-0" />
                <div>
                  <strong className="text-stone-900 font-bold block">
                    Avoid paying {formatINR(rawDeposit)} Security Deposit today!
                  </strong>
                  <span className="text-stone-600 text-[11px]">
                    Join StylePass Gold for ₹499/mo to get ZERO security deposits & FREE Same-Day delivery.
                  </span>
                </div>
              </div>
              {onOpenMembership && (
                <button
                  type="button"
                  onClick={onOpenMembership}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#53101E] text-white hover:bg-[#3B0913] cursor-pointer shadow-xs"
                >
                  Join & Waive Deposit
                </button>
              )}
            </div>
          )}

          {/* Section 1: Customer Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#53101E] text-white flex items-center justify-center text-[11px]">1</span>
                Delivery & Contact Details
              </h4>
              <span className="text-[11px] text-stone-500">Doorstep delivery address</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={customer.fullName}
                  onChange={(e) => setCustomer({...customer, fullName: e.target.value})}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:border-[#53101E] focus:outline-none"
                  placeholder="e.g. Ananya Sharma"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Mobile Number (for Courier SMS & OTP)</label>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:border-[#53101E] focus:outline-none"
                  placeholder="+91 98201 XXXXX"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-stone-700 block mb-1">Email (for Invoice & Timeline)</label>
                <input
                  type="email"
                  required
                  value={customer.email}
                  onChange={(e) => setCustomer({...customer, email: e.target.value})}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:border-[#53101E] focus:outline-none"
                  placeholder="youremail@example.com"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-stone-700 block mb-1">Flat / House / Street Address</label>
                <input
                  type="text"
                  required
                  value={customer.address}
                  onChange={(e) => setCustomer({...customer, address: e.target.value})}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:border-[#53101E] focus:outline-none"
                  placeholder="Building name, flat number, street"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">City</label>
                <select
                  value={customer.city}
                  onChange={(e) => setCustomer({...customer, city: e.target.value})}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:border-[#53101E] focus:outline-none bg-white"
                >
                  {CITIES_LIST.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  value={customer.pincode}
                  onChange={(e) => setCustomer({...customer, pincode: e.target.value})}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:border-[#53101E] focus:outline-none"
                  placeholder="e.g. 400053"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Choose Delivery Speed (Features #2 and #3) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#53101E] text-white flex items-center justify-center text-[11px]">2</span>
                Choose Delivery Speed & Logistics
              </h4>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                Live Courier Dispatch
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option A: Standard Delivery */}
              <button
                type="button"
                onClick={() => setDeliverySpeed('standard')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  deliverySpeed === 'standard'
                    ? 'border-[#53101E] bg-[#53101E]/5 shadow-sm ring-1 ring-[#53101E]'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                    <Package className="w-4 h-4 text-stone-600" />
                    <span>Standard Delivery</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">FREE</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-snug">
                  Arrives 1 day before event date for try-on & fitting.
                </p>
                <span className="text-[10px] text-stone-400 mt-2 block">
                  Scheduled courier batch
                </span>
              </button>

              {/* Option B: Same-Day Delivery (Feature #2) */}
              <button
                type="button"
                onClick={() => setDeliverySpeed('same_day')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  deliverySpeed === 'same_day'
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-sm ring-1 ring-emerald-600'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    <span>Same-Day Delivery</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-800">
                    {isMember ? 'FREE (Member)' : '₹99'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-snug">
                  Guaranteed delivery today by 8 PM across top metro zones.
                </p>
                <span className="text-[10px] font-semibold text-emerald-700 mt-2 block">
                  Dispatched afternoon batch
                </span>
              </button>

              {/* Option C: 2-Hour Emergency Delivery (Feature #3) */}
              <button
                type="button"
                onClick={() => setDeliverySpeed('express_2hr')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  deliverySpeed === 'express_2hr'
                    ? 'border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-500'
                    : 'border-stone-200 bg-white hover:border-amber-300'
                }`}
              >
                <div className="absolute -top-2.5 right-3 bg-amber-500 text-stone-950 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                  ⚡ SOS Emergency
                </div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-950">
                    <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                    <span>2-Hour Delivery</span>
                  </div>
                  <span className="text-xs font-bold text-amber-950">
                    {isMember ? '₹149 (50% Off)' : '+₹299 extra'}
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 leading-snug">
                  Need outfit at the last moment? Priority rider at your door in under 120 mins!
                </p>
                <span className="text-[10px] font-bold text-amber-800 mt-2 block flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Hyperlocal Runner Assigned
                </span>
              </button>
            </div>
          </div>

          {/* Section 3: Identity Verification (Mock Prototype) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#53101E] text-white flex items-center justify-center text-[11px]">3</span>
                Identity Verification (Prototype)
              </h4>
              <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-medium border border-amber-200">
                Demo Verification Mode
              </span>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200 space-y-3">
              <p className="text-xs text-stone-700 leading-relaxed">
                <strong>Identity Verification Required for Designer Apparel:</strong> To safeguard authentic couture pieces during rental, Style-Rent requires customer identity verification.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-stone-700">Verification Doc:</label>
                  <select
                    value={verificationType}
                    onChange={(e) => setVerificationType(e.target.value as 'Aadhaar' | 'PAN')}
                    className="px-2 py-1 text-xs border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="Aadhaar">Aadhaar Card</option>
                    <option value="PAN">PAN Card</option>
                  </select>
                </div>

                <input
                  type="text"
                  value={idInput}
                  onChange={(e) => setIdInput(e.target.value)}
                  className="px-3 py-1 text-xs border border-stone-300 rounded-lg bg-white"
                  placeholder="Doc ID (Simulated)"
                />

                {!isVerified ? (
                  <button
                    type="button"
                    onClick={handleSimulateVerification}
                    disabled={isVerifying}
                    className="px-4 py-1.5 text-xs font-bold rounded-lg bg-[#53101E] text-white hover:bg-[#3B0913] cursor-pointer"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify Identity (Demo)'}
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>✓ Identity Verified (Demo)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Indian Payment Options */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#53101E] text-white flex items-center justify-center text-[11px]">4</span>
                Select Payment Method
              </h4>
              <span className="text-[11px] text-stone-500">256-Bit SSL Encrypted (Demo)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-[#53101E] bg-[#53101E]/5 font-bold text-stone-900'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Smartphone className="w-5 h-5 mx-auto mb-1 text-[#53101E]" />
                <span className="text-xs">UPI (Instant)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-[#53101E] bg-[#53101E]/5 font-bold text-stone-900'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#53101E]" />
                <span className="text-xs">Debit / Credit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'netbanking'
                    ? 'border-[#53101E] bg-[#53101E]/5 font-bold text-stone-900'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Building className="w-5 h-5 mx-auto mb-1 text-[#53101E]" />
                <span className="text-xs">Net Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-[#53101E] bg-[#53101E]/5 font-bold text-stone-900'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Banknote className="w-5 h-5 mx-auto mb-1 text-[#53101E]" />
                <span className="text-xs">Pay on Delivery</span>
              </button>
            </div>

            {/* UPI sub-details */}
            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <span className="text-xs font-semibold text-stone-700 block">Choose Popular UPI App:</span>
                <div className="flex flex-wrap gap-2">
                  {(['phonepe', 'gpay', 'paytm', 'other'] as const).map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setUpiProvider(app)}
                      className={`px-3 py-1.5 text-xs rounded-xl border font-semibold capitalize transition-all cursor-pointer ${
                        upiProvider === app
                          ? 'bg-[#53101E] text-white border-[#53101E]'
                          : 'bg-white text-stone-700 border-stone-200'
                      }`}
                    >
                      {app === 'phonepe' ? 'PhonePe' : app === 'gpay' ? 'Google Pay' : app === 'paytm' ? 'Paytm' : 'Other UPI'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white"
                    placeholder="Enter UPI ID (e.g. name@okhdfcbank)"
                  />
                  <span className="text-xs text-emerald-700 font-semibold whitespace-nowrap">✓ Demo Auto-approved</span>
                </div>
              </div>
            )}
          </div>

          {/* Price Summary Breakdown inside Checkout */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Rental Charges ({items.length} items)</span>
              <span>{formatINR(totalRentalFee)}</span>
            </div>

            {memberRentalDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>StylePass Member 10% Discount</span>
                <span>- {formatINR(memberRentalDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-emerald-800 font-semibold">
              <span className="flex items-center gap-1">
                <span>Security Deposit</span>
                {isGoldOrVip && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                    Waived by StylePass Gold
                  </span>
                )}
              </span>
              <span>{formatINR(finalDeposit)}</span>
            </div>

            {totalBackupFee > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>Backup Size Fee</span>
                <span>{formatINR(totalBackupFee)}</span>
              </div>
            )}

            {totalProtectionFee > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>Damage Protection</span>
                <span>{formatINR(totalProtectionFee)}</span>
              </div>
            )}

            {/* Delivery fee breakdown */}
            <div className="flex justify-between items-center font-semibold">
              <span className="flex items-center gap-1">
                <span>
                  {deliverySpeed === 'express_2hr' 
                    ? '⚡ 2-Hour Hyperlocal Emergency Delivery' 
                    : deliverySpeed === 'same_day' 
                      ? '🚚 Same-Day Express Delivery' 
                      : '2-Way Standard Doorstep Delivery'}
                </span>
              </span>
              <span className={deliverySpeedFee === 0 ? 'text-emerald-700' : 'text-[#53101E]'}>
                {deliverySpeedFee === 0 ? 'FREE' : formatINR(deliverySpeedFee)}
              </span>
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline text-sm font-bold">
              <span>Total Payable Now</span>
              <span className="text-[#53101E] text-base">{formatINR(grandTotal)}</span>
            </div>
          </div>

          {/* Place order CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#53101E] text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#3B0913] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            {isSubmitting ? (
              <span>Simulating Payment & Creating Live Dispatch...</span>
            ) : (
              <>
                <Lock className="w-4 h-4 text-[#DFC07A]" />
                <span>Pay {formatINR(grandTotal)} & Confirm Rental Booking</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
