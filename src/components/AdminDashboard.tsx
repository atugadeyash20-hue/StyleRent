import React, { useState } from 'react';
import { 
  X, 
  Package, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Upload, 
  Sparkles, 
  Calendar, 
  User, 
  Truck, 
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  Navigation,
  Zap,
  Crown,
  TrendingUp,
  DollarSign,
  Bike,
  Clock,
  Phone
} from 'lucide-react';
import { Order, Product } from '../types';
import { formatINR, formatDisplayDate } from '../utils/rentalCalculations';
import { getPublicShareUrl } from './ShareModal';
import { MEMBERSHIP_PLANS } from '../data/mockData';
import { Share2, Copy, Check } from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  products: Product[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  onUpdateProductStatus: (productId: string, newStatus: Product['status']) => void;
  onProcessInspection: (orderId: string, inspection: NonNullable<Order['returnInspection']>) => void;
  onOpenTrackingWithOrder?: (order: Order) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  orders,
  products,
  onUpdateOrderStatus,
  onUpdateProductStatus,
  onProcessInspection,
  onOpenTrackingWithOrder,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'orders' | 'dispatch' | 'inventory' | 'inspection' | 'memberships'>('orders');
  const [shareCopied, setShareCopied] = useState(false);

  const handleCopyPublicUrl = () => {
    const url = getPublicShareUrl();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url);
    }
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };
  
  // Inspection tab state
  const [selectedInspectionOrderId, setSelectedInspectionOrderId] = useState<string>(
    orders[0]?.orderId || ''
  );
  const [inspectionCondition, setInspectionCondition] = useState<'Good Condition' | 'Minor Damage' | 'Major Damage'>('Good Condition');
  const [inspectionNotes, setInspectionNotes] = useState('All attachments received. Garment checked on daylight mannequin.');
  const [mockPhotoUploaded, setMockPhotoUploaded] = useState(false);
  const [refundProcessedAlert, setRefundProcessedAlert] = useState(false);

  const selectedOrderForInspection = orders.find(o => o.orderId === selectedInspectionOrderId);

  // Calculate damage & refund based on selection & damage protection
  const deposit = selectedOrderForInspection?.pricing.totalSecurityDeposit || 0;
  const hasProtection = selectedOrderForInspection?.items.some(i => i.hasDamageProtection) || false;

  let damageCharge = 0;
  if (inspectionCondition === 'Minor Damage') {
    // If user bought protection (₹299), damage fee is waived!
    damageCharge = hasProtection ? 0 : 350;
  } else if (inspectionCondition === 'Major Damage') {
    damageCharge = Math.min(deposit, 1500);
  }

  const finalRefundAmount = Math.max(0, deposit - damageCharge);

  const handleExecuteInspection = () => {
    if (!selectedInspectionOrderId) return;
    onProcessInspection(selectedInspectionOrderId, {
      condition: inspectionCondition,
      inspectionNotes,
      damageCharge,
      refundAmount: finalRefundAmount,
      refundStatus: 'Processed',
      photoUploaded: mockPhotoUploaded,
    });
    setRefundProcessedAlert(true);
    setTimeout(() => {
      setRefundProcessedAlert(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center p-3 sm:p-6">
      <div 
        className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#53101E] text-white rounded-xl">
              <Layers className="w-5 h-5 text-[#DFC07A]" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-stone-900">
                Style-Rent Operations & Staff Portal
              </h3>
              <p className="text-xs text-stone-500">
                Live Order Tracking · Smart Inventory · Return Quality Inspection & Deposit Refund
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPublicUrl}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#DFC07A]/20 hover:bg-[#DFC07A]/35 text-[#53101E] border border-[#DFC07A]/40 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy link to send to clients and customers"
            >
              {shareCopied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Share2 className="w-3.5 h-3.5 text-[#53101E]" />}
              <span>{shareCopied ? 'Link Copied!' : 'Copy Public Customer Link'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-stone-100 border-b border-stone-200 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white text-[#53101E] shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Orders & Shipments ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('dispatch')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dispatch'
                ? 'bg-[#53101E] text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 text-[#DFC07A]" />
            <span>Live Dispatches & GPS Tracking</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-white text-[#53101E] shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Smart Inventory Status ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('inspection')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'inspection'
                ? 'bg-white text-[#53101E] shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Return Inspection Simulator
          </button>

          <button
            onClick={() => setActiveTab('memberships')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'memberships'
                ? 'bg-[#DFC07A] text-[#53101E] font-bold shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-[#53101E]" />
            <span>StylePass Memberships & Profitability</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>Manage customer reservations and advance shipment stages</span>
                <span className="font-medium text-stone-700">Click dropdown to update status</span>
              </div>

              <div className="overflow-x-auto border border-stone-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Order ID</th>
                      <th className="p-3.5">Customer & City</th>
                      <th className="p-3.5">Outfit & Size</th>
                      <th className="p-3.5">Rental Period</th>
                      <th className="p-3.5">Paid / Deposit</th>
                      <th className="p-3.5">Lifecycle Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {orders.map((o) => (
                      <tr key={o.orderId} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-[#53101E]">
                          {o.orderId}
                          <span className="block text-[10px] text-stone-400 font-sans font-normal">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-stone-900">{o.customer.fullName}</p>
                          <p className="text-[11px] text-stone-500">{o.customer.city} · {o.customer.phone}</p>
                        </td>
                        <td className="p-3.5">
                          {o.items.map((it, idx) => (
                            <div key={idx} className="space-y-0.5">
                              <p className="font-medium text-stone-800 line-clamp-1">{it.product.name}</p>
                              <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded-sm border border-stone-200 text-stone-600">
                                Size: {it.selectedSize} {it.hasBackupSize && `(Backup: ${it.backupSize})`}
                              </span>
                            </div>
                          ))}
                        </td>
                        <td className="p-3.5 text-[11px]">
                          <span className="block text-stone-700 font-medium">
                            {formatDisplayDate(o.items[0]?.startDate)}
                          </span>
                          <span className="text-stone-400">to {formatDisplayDate(o.items[0]?.returnDate)}</span>
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-stone-900">{formatINR(o.pricing.grandTotal)}</p>
                          <p className="text-[10px] text-emerald-700">Dep: {formatINR(o.pricing.totalSecurityDeposit)}</p>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={o.status}
                            onChange={(e) => onUpdateOrderStatus(o.orderId, e.target.value as Order['status'])}
                            className="bg-white px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs font-semibold text-[#53101E] focus:outline-none"
                          >
                            <option value="Order Confirmed">Order Confirmed</option>
                            <option value="Preparing">Preparing & Sanitizing</option>
                            <option value="Shipped">Shipped in Reusable Bag</option>
                            <option value="Delivered">Delivered to Customer</option>
                            <option value="Return Pickup Scheduled">Return Pickup Scheduled</option>
                            <option value="Quality Check">Quality Check Inspection</option>
                            <option value="Completed">Completed & Deposit Refunded</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>Manage availability, cleaning cycles, and maintenance</span>
                <span className="font-medium text-stone-700">Toggle garment operational state</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl border border-stone-200 bg-white flex gap-3 shadow-2xs">
                    <img 
                      src={p.images[0]} 
                      alt={p.name} 
                      referrerPolicy="no-referrer"
                      className="w-16 h-22 rounded-xl object-cover object-top border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 space-y-1 text-xs">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-stone-900 line-clamp-1">{p.name}</h4>
                        <span className="text-[10px] text-stone-400 font-mono">{p.id}</span>
                      </div>
                      <p className="text-stone-500">{p.category} · {p.designerOrBrand}</p>
                      <p className="font-semibold text-[#53101E]">{formatINR(p.rentalPrice3Days)} / 3 Days</p>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[11px] text-stone-500 font-medium">State:</span>
                        <select
                          value={p.status}
                          onChange={(e) => onUpdateProductStatus(p.id, e.target.value as Product['status'])}
                          className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                            p.status === 'Available'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : p.status === 'Rented'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : p.status === 'Cleaning'
                                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                                  : 'bg-red-50 text-red-800 border-red-200'
                          }`}
                        >
                          <option value="Available">✓ Available</option>
                          <option value="Rented">🔴 Rented</option>
                          <option value="Cleaning">🧼 In Sanitization / Buffer</option>
                          <option value="Maintenance">🛠 Maintenance / Repair</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RETURN INSPECTION SIMULATOR */}
          {activeTab === 'inspection' && (
            <div className="space-y-6">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1">
                <h4 className="font-bold">Staff Return Quality Check & Refund Module</h4>
                <p className="text-amber-800 leading-relaxed text-[11px]">
                  When a customer returns an outfit via the courier in the reusable bag, staff inspects the piece for tears, zipper jams, or food stains. If the customer had selected <strong>Peace of Mind Protection (₹299)</strong>, minor wear is 100% absorbed with zero deposit deduction!
                </p>
              </div>

              {refundProcessedAlert && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs flex items-center gap-2 font-bold animate-bounce">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Deposit refund of {formatINR(finalRefundAmount)} simulated and credited to customer's account!</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Inspection Form */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Select Order to Inspect</label>
                    <select
                      value={selectedInspectionOrderId}
                      onChange={(e) => setSelectedInspectionOrderId(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:border-[#53101E]"
                    >
                      {orders.map((o) => (
                        <option key={o.orderId} value={o.orderId}>
                          {o.orderId} — {o.customer.fullName} ({o.items[0]?.product.name})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Condition radio buttons */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-700 block">Garment Return Condition</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setInspectionCondition('Good Condition')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          inspectionCondition === 'Good Condition'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                        <span className="text-xs block">Good Condition</span>
                        <span className="text-[10px] font-normal text-stone-500">Full Refund</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setInspectionCondition('Minor Damage')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          inspectionCondition === 'Minor Damage'
                            ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                        <span className="text-xs block">Minor Damage</span>
                        <span className="text-[10px] font-normal text-stone-500">
                          {hasProtection ? 'Covered by Protection' : '₹350 Deduct'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setInspectionCondition('Major Damage')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          inspectionCondition === 'Major Damage'
                            ? 'border-red-500 bg-red-50 text-red-900 font-bold'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <XCircle className="w-5 h-5 mx-auto mb-1 text-red-600" />
                        <span className="text-xs block">Major Damage</span>
                        <span className="text-[10px] font-normal text-stone-500">₹1,500 Deduct</span>
                      </button>
                    </div>
                  </div>

                  {/* Upload photo simulation */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 block">Inspection Evidence Photo</label>
                    <div 
                      onClick={() => setMockPhotoUploaded(!mockPhotoUploaded)}
                      className={`p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
                        mockPhotoUploaded 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                          : 'border-stone-300 hover:border-stone-400 bg-stone-50 text-stone-500'
                      }`}
                    >
                      <Upload className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-xs font-medium">
                        {mockPhotoUploaded ? '✓ Damage Inspection Photo Attached (Mock)' : 'Click to Upload Quality Check Photo (Simulated)'}
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Staff Notes</label>
                    <textarea
                      value={inspectionNotes}
                      onChange={(e) => setInspectionNotes(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white"
                    />
                  </div>
                </div>

                {/* Right: Refund Math Card */}
                <div className="lg:col-span-5 bg-[#FAF7F2] p-5 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                      Security Deposit Settlement
                    </h4>

                    <div className="space-y-2 text-xs border-b border-stone-200 pb-3">
                      <div className="flex justify-between text-stone-600">
                        <span>Original Security Deposit:</span>
                        <span className="font-bold text-stone-900">{formatINR(deposit)}</span>
                      </div>

                      <div className="flex justify-between text-stone-600">
                        <span>Peace of Mind Protection:</span>
                        <span className={`font-semibold ${hasProtection ? 'text-emerald-700' : 'text-stone-400'}`}>
                          {hasProtection ? 'ACTIVE (₹0 minor wear)' : 'NOT PURCHASED'}
                        </span>
                      </div>

                      <div className="flex justify-between text-stone-600">
                        <span>Assessed Damage Deduction:</span>
                        <span className={`font-bold ${damageCharge > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                          - {formatINR(damageCharge)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-1 flex justify-between items-baseline">
                      <span className="font-bold text-sm text-stone-900">Final Refund to Customer:</span>
                      <span className="font-bold text-xl text-emerald-800">{formatINR(finalRefundAmount)}</span>
                    </div>

                    <p className="text-[11px] text-stone-500 leading-relaxed italic">
                      Refund is disbursed back to customer's original payment method via simulated instant UPI payout.
                    </p>
                  </div>

                  <button
                    onClick={handleExecuteInspection}
                    className="w-full py-3.5 bg-emerald-800 text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-emerald-900 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Inspection & Release {formatINR(finalRefundAmount)}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DISPATCHES & LIVE GPS TRACKING */}
          {activeTab === 'dispatch' && (
            <div className="space-y-6">
              {/* Summary KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300">
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
                    <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                    <span>2-Hr SOS Emergency</span>
                  </div>
                  <p className="text-2xl font-bold font-cinzel text-amber-950 mt-1">
                    {orders.filter(o => o.deliverySpeed === 'express_2hr').length}
                  </p>
                  <p className="text-[11px] text-amber-700 mt-0.5">High Priority (+₹299 surcharge)</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Same-Day Dispatches</span>
                  </div>
                  <p className="text-2xl font-bold font-cinzel text-emerald-950 mt-1">
                    {orders.filter(o => o.deliverySpeed === 'same_day').length}
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Deliver today before 8 PM</p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200">
                  <div className="flex items-center gap-2 text-stone-700 text-xs font-bold uppercase tracking-wider">
                    <Package className="w-4 h-4 text-stone-500" />
                    <span>Standard Scheduled</span>
                  </div>
                  <p className="text-2xl font-bold font-cinzel text-stone-900 mt-1">
                    {orders.filter(o => !o.deliverySpeed || o.deliverySpeed === 'standard').length}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Delivered 1 day prior to event</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#53101E]/10 border border-[#53101E]/20">
                  <div className="flex items-center gap-2 text-[#53101E] text-xs font-bold uppercase tracking-wider">
                    <Bike className="w-4 h-4 text-[#53101E]" />
                    <span>Active Riders En Route</span>
                  </div>
                  <p className="text-2xl font-bold font-cinzel text-[#53101E] mt-1">
                    {orders.filter(o => o.tracking && o.tracking.currentStep !== 'delivered').length}
                  </p>
                  <p className="text-[11px] text-stone-600 mt-0.5">With live OTP security</p>
                </div>
              </div>

              {/* Dispatches Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-600">
                  <span className="font-bold text-stone-900">Doorstep Courier & Rider Fleet Status</span>
                  <span>Click "Open Live GPS Tracker" to view map & simulate location</span>
                </div>

                <div className="overflow-x-auto border border-stone-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                      <tr>
                        <th className="p-3.5">Order & Speed</th>
                        <th className="p-3.5">Customer & Destination</th>
                        <th className="p-3.5">Rider & Vehicle</th>
                        <th className="p-3.5">ETA / OTP</th>
                        <th className="p-3.5">Live Delivery Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {orders.map((o) => {
                        const tr = o.tracking;
                        return (
                          <tr key={o.orderId} className="hover:bg-stone-50/80 transition-colors">
                            <td className="p-3.5 font-mono">
                              <span className="font-bold text-[#53101E]">{o.orderId}</span>
                              <div className="mt-1">
                                {o.deliverySpeed === 'express_2hr' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                    <Zap className="w-3 h-3 fill-amber-500 text-amber-600" />
                                    ⚡ 2-Hr SOS (+₹299)
                                  </span>
                                ) : o.deliverySpeed === 'same_day' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                                    <Truck className="w-3 h-3 text-emerald-700" />
                                    🚚 Same-Day
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-600 border border-stone-200">
                                    Standard 1-Day Prior
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <p className="font-bold text-stone-900">{o.customer.fullName}</p>
                              <p className="text-[11px] text-stone-500">{o.customer.address}, {o.customer.city} ({o.customer.pincode})</p>
                              <p className="text-[10px] text-stone-400">{o.customer.phone}</p>
                            </td>
                            <td className="p-3.5">
                              {tr ? (
                                <div>
                                  <p className="font-bold text-stone-800 flex items-center gap-1">
                                    <Bike className="w-3.5 h-3.5 text-[#53101E]" />
                                    {tr.riderName}
                                  </p>
                                  <p className="text-[11px] text-stone-500 font-mono">{tr.riderVehicle}</p>
                                  <p className="text-[10px] text-stone-400">{tr.riderPhone}</p>
                                </div>
                              ) : (
                                <span className="text-stone-400 italic">Dispatch queued</span>
                              )}
                            </td>
                            <td className="p-3.5">
                              {tr ? (
                                <div>
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                                    <Clock className="w-3 h-3" />
                                    {tr.etaMinutes} mins
                                  </span>
                                  <div className="text-[10px] text-stone-500 mt-0.5">
                                    OTP: <strong className="font-mono text-stone-900">{tr.deliveryOtp}</strong>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-stone-400">—</span>
                              )}
                            </td>
                            <td className="p-3.5">
                              <span className="capitalize px-2 py-0.5 rounded-md text-[11px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                                {tr ? tr.currentStep.replace(/_/g, ' ') : o.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              {onOpenTrackingWithOrder && (
                                <button
                                  onClick={() => {
                                    onClose();
                                    onOpenTrackingWithOrder(o);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-[#53101E] hover:bg-[#3B0913] text-white text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                >
                                  <Navigation className="w-3 h-3 text-[#DFC07A]" />
                                  <span>Track Live Map</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MEMBERSHIPS & UNIT ECONOMICS */}
          {activeTab === 'memberships' && (
            <div className="space-y-6">
              {/* Strategic Header */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#53101E] to-[#3B0913] text-white space-y-2">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#DFC07A]" />
                  <h4 className="font-cinzel text-base font-bold text-[#DFC07A]">
                    StylePass Fashion Royalty Membership Economics
                  </h4>
                </div>
                <p className="text-xs text-stone-200 leading-relaxed max-w-3xl">
                  Designed to solve the biggest customer friction in luxury rental (high security deposits) while dramatically expanding business profitability, recurring revenue (MRR), and repeat rental frequency.
                </p>
              </div>

              {/* Profitability & Risk Mitigation Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-3">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Why it's Profitable for Admin & Business</span>
                  </div>
                  <ul className="space-y-2 text-xs text-stone-600">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">1.</span>
                      <span><strong>High-Margin Recurring Revenue (MRR):</strong> Subscription fees (₹1,499/mo or ₹9,999/yr) carry an 82% gross margin, providing predictable cash flow regardless of rental seasonality.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">2.</span>
                      <span><strong>3.8x Higher Customer Lifetime Value (LTV):</strong> Members rent 4.6 times a year (festivals, weddings, work galas) vs 1.2 times for guest renters.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">3.</span>
                      <span><strong>Accelerated Inventory Payback:</strong> High member turnover amortizes the designer wholesale purchase price in under 4.5 months.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-3">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-[#53101E]" />
                    <span>How Zero Deposit Risk is Mitigated</span>
                  </div>
                  <ul className="space-y-2 text-xs text-stone-600">
                    <li className="flex items-start gap-2">
                      <span className="text-[#53101E] font-bold">1.</span>
                      <span><strong>Mandatory KYC Verification:</strong> StylePass members submit verified government ID (Aadhaar OTP / PAN) before membership activation.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#53101E] font-bold">2.</span>
                      <span><strong>Pre-Authorized Card on File:</strong> A tokenized card authorization protects against unreturned or malicious damage without tying up customer cash.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#53101E] font-bold">3.</span>
                      <span><strong>Historical Default Rate &lt; 0.4%:</strong> Members value their long-term subscription standing and maintain pristine garment condition.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Membership Plans Snapshot */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Active Subscription Plans Overview
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {MEMBERSHIP_PLANS.map((plan) => (
                    <div key={plan.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">{plan.name}</span>
                        {plan.popular && (
                          <span className="text-[10px] font-bold uppercase bg-[#DFC07A] text-[#53101E] px-2 py-0.5 rounded-full">
                            Most Popular
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-xl font-bold text-[#53101E]">{formatINR(plan.price)}</span>
                        <span className="text-xs text-stone-500"> / {plan.billingCycle}</span>
                      </div>
                      <div className="text-[11px] text-stone-600 space-y-1 pt-2 border-t border-stone-200">
                        <p>✓ {plan.securityDepositWaiver ? '100% Zero Security Deposit Waived' : '50% Security Deposit Waived'}</p>
                        <p>✓ {plan.express2HrFee === 0 ? 'Free 2-Hr SOS Express Deliveries' : `Discounted 2-Hr SOS (${formatINR(plan.express2HrFee)})`}</p>
                        <p>✓ {plan.freeSameDayDelivery ? 'Free Same-Day Deliveries Included' : 'Standard Delivery Included'}</p>
                        <p>✓ Flat {plan.rentalDiscountPercent}% Off Entire Outfit Catalog</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
