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
  ArrowRight
} from 'lucide-react';
import { CartItem, CustomerDetails, VerificationDetails, PaymentMethod, Order } from '../types';
import { formatINR } from '../utils/rentalCalculations';
import { CITIES_LIST } from '../data/mockData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderCompleted,
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
  const totalDeposit = items.reduce((acc, item) => acc + item.securityDeposit, 0);
  const totalBackupFee = items.reduce((acc, item) => acc + (item.hasBackupSize ? item.backupFee : 0), 0);
  const totalProtectionFee = items.reduce((acc, item) => acc + (item.hasDamageProtection ? item.protectionFee : 0), 0);
  const grandTotal = totalRentalFee + totalDeposit + totalBackupFee + totalProtectionFee;

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

    const newOrder: Order = {
      orderId: newOrderId,
      createdAt: new Date().toISOString(),
      customer,
      items: [...items],
      pricing: {
        totalRentalFee,
        totalSecurityDeposit: totalDeposit,
        totalBackupFee,
        totalProtectionFee,
        deliveryFee: 0,
        discount: 0,
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
      status: 'Order Confirmed',
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
            <h3 className="font-cinzel text-lg font-bold text-stone-900">
              Style-Rent Secure Checkout
            </h3>
            <p className="text-xs text-stone-500">
              College Prototype · Realistic Indian Rental Transaction Flow
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
                <label className="text-xs font-semibold text-stone-700 block mb-1">Mobile Number (for Courier SMS)</label>
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

          {/* Section 2: Identity Verification (Mock Prototype) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#53101E] text-white flex items-center justify-center text-[11px]">2</span>
                Identity Verification (Prototype)
              </h4>
              <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-medium border border-amber-200">
                Demo Verification Mode
              </span>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200 space-y-3">
              <p className="text-xs text-stone-700 leading-relaxed">
                <strong>Identity Verification Required for High-Value Designer Apparel:</strong> To safeguard authentic couture pieces during rental, Style-Rent requires customer identity verification.
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

              <p className="text-[10px] text-stone-500 italic">
                * Note for Viva/Project: Demonstrates KYC workflow without storing actual sensitive Aadhaar/PAN data.
              </p>
            </div>
          </div>

          {/* Section 3: Indian Payment Options */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#53101E] text-white flex items-center justify-center text-[11px]">3</span>
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
            <div className="flex justify-between text-emerald-800 font-semibold">
              <span>Refundable Security Deposit</span>
              <span>{formatINR(totalDeposit)}</span>
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
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>2-Way Doorstep Delivery & Reusable Bag</span>
              <span>FREE</span>
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
              <span>Simulating Payment & Creating Booking...</span>
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
