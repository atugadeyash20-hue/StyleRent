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
  Filter
} from 'lucide-react';
import { Order, Product } from '../types';
import { formatINR, formatDisplayDate } from '../utils/rentalCalculations';
import { getPublicShareUrl } from './ShareModal';
import { Share2, Copy, Check } from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  products: Product[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  onUpdateProductStatus: (productId: string, newStatus: Product['status']) => void;
  onProcessInspection: (orderId: string, inspection: NonNullable<Order['returnInspection']>) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  orders,
  products,
  onUpdateOrderStatus,
  onUpdateProductStatus,
  onProcessInspection,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'inspection'>('orders');
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
        <div className="px-6 py-2.5 bg-stone-100 border-b border-stone-200 flex gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white text-[#53101E] shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Orders & Shipments ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-white text-[#53101E] shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Smart Inventory Status ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('inspection')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'inspection'
                ? 'bg-white text-[#53101E] shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Return Inspection Simulator
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

        </div>
      </div>
    </div>
  );
};
