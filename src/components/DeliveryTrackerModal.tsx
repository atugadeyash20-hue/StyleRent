import React, { useState, useEffect } from 'react';
import { 
  X, 
  Truck, 
  MapPin, 
  Navigation, 
  Clock, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Sparkles, 
  RefreshCw, 
  Package, 
  Bike,
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Order, DeliveryTracking } from '../types';
import { formatDisplayDate, formatINR } from '../utils/rentalCalculations';

interface DeliveryTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  allOrders?: Order[];
  onSelectOrder?: (order: Order) => void;
}

export const DeliveryTrackerModal: React.FC<DeliveryTrackerModalProps> = ({
  isOpen,
  onClose,
  order,
  allOrders = [],
  onSelectOrder,
}) => {
  if (!isOpen) return null;

  // Selected order or first order with tracking
  const activeOrder = order || allOrders[0] || null;

  // Local simulated state for live tracking animation
  const [tracking, setTracking] = useState<DeliveryTracking | null>(() => {
    return activeOrder?.tracking || null;
  });

  const [riderProgress, setRiderProgress] = useState(65); // 0 to 100%
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (activeOrder?.tracking) {
      setTracking(activeOrder.tracking);
    }
  }, [activeOrder]);

  if (!activeOrder || !tracking) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center p-3 sm:p-6">
        <div className="relative bg-white w-full max-w-lg rounded-3xl p-6 my-auto text-center space-y-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-700">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-cinzel">No Active Dispatches</h3>
          <p className="text-xs text-stone-600">
            You don't have any orders currently out for delivery. Place an order to track live doorstep delivery and rider GPS!
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-full bg-[#53101E] text-white"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const isExpress2Hr = tracking.deliverySpeed === 'express_2hr';
  const isSameDay = tracking.deliverySpeed === 'same_day';

  const steps = [
    { key: 'confirmed', label: 'Order Confirmed', time: '11:15 AM', done: true },
    { key: 'sanitizing', label: '120°C Steam Sanitized & QC', time: '11:28 AM', done: true },
    { key: 'dispatched', label: 'Packed in Reusable Bag', time: '11:38 AM', done: true },
    { key: 'out_for_delivery', label: 'Rider Out for Delivery', time: '11:42 AM', done: tracking.currentStep !== 'confirmed' && tracking.currentStep !== 'sanitizing' },
    { key: 'arrived', label: 'Arriving at Doorstep', time: 'Estimated 12:15 PM', done: tracking.currentStep === 'arrived' || tracking.currentStep === 'delivered' },
    { key: 'delivered', label: 'Delivered & Try-On Verified', time: 'Pending OTP', done: tracking.currentStep === 'delivered' },
  ];

  // Helper to advance simulation
  const handleSimulateAdvance = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setRiderProgress(prev => (prev >= 90 ? 30 : prev + 15));
      if (tracking.currentStep === 'out_for_delivery') {
        setTracking(prev => prev ? {
          ...prev,
          etaMinutes: Math.max(12, prev.etaMinutes - 10),
          statusNotes: '⚡ Rider approaching your street. Estimated 12 mins remaining.',
        } : null);
      }
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center p-3 sm:p-6">
      <div 
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FAF7F2] p-5 sm:p-6 border-b border-stone-200 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold bg-[#53101E] text-white px-2.5 py-1 rounded-lg">
              {activeOrder.orderId}
            </span>

            {isExpress2Hr && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-500 text-stone-950 px-2.5 py-0.5 rounded-full shadow-2xs animate-pulse">
                <Zap className="w-3.5 h-3.5 fill-stone-950" />
                ⚡ 2-HOUR SOS EMERGENCY DISPATCH (+₹299)
              </span>
            )}

            {isSameDay && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                <Truck className="w-3.5 h-3.5" />
                🚚 SAME-DAY EXPRESS DELIVERY
              </span>
            )}

            {!isExpress2Hr && !isSameDay && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-stone-200 text-stone-800 px-2.5 py-0.5 rounded-full">
                <Package className="w-3.5 h-3.5" />
                Standard Scheduled Doorstep Delivery
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
                Live Delivery Tracking
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Tracking ID: <span className="font-mono font-semibold text-stone-800">{tracking.trackingNumber}</span> · {tracking.hubName}
              </p>
            </div>

            {/* Select another order if user has multiple */}
            {allOrders.length > 1 && onSelectOrder && (
              <select
                value={activeOrder.orderId}
                onChange={(e) => {
                  const target = allOrders.find(o => o.orderId === e.target.value);
                  if (target) onSelectOrder(target);
                }}
                className="text-xs bg-white border border-stone-300 rounded-xl px-3 py-1.5 font-medium text-stone-700"
              >
                {allOrders.map(o => (
                  <option key={o.orderId} value={o.orderId}>
                    Order {o.orderId} ({o.deliverySpeed === 'express_2hr' ? '⚡ 2-Hr' : 'Standard'})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Banner: ETA & OTP */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* ETA Card */}
            <div className={`p-4 rounded-2xl border ${
              isExpress2Hr 
                ? 'bg-gradient-to-br from-amber-500/15 to-orange-500/10 border-amber-300' 
                : 'bg-emerald-50 border-emerald-200'
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-[#53101E]" />
                  Estimated Arrival
                </span>
                {isExpress2Hr && (
                  <span className="text-[10px] font-extrabold text-amber-900 bg-amber-200/80 px-1.5 py-0.5 rounded-md">
                    ⚡ Priority Runner
                  </span>
                )}
              </div>
              <div className="text-2xl font-black text-[#53101E]">
                {tracking.etaMinutes} mins
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5">
                {isExpress2Hr 
                  ? 'Guaranteed within 120-min window' 
                  : isSameDay 
                    ? 'Delivering today before 8 PM' 
                    : 'Scheduled for event delivery date'}
              </p>
            </div>

            {/* Delivery OTP Card */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50">
              <span className="text-xs font-semibold text-stone-700 block mb-1">
                Delivery Verification OTP
              </span>
              <div className="font-mono text-2xl font-black tracking-widest text-[#53101E]">
                {tracking.deliveryOtp}
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Share with rider after examining outfit packaging
              </p>
            </div>

            {/* Destination Card */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50">
              <span className="text-xs font-semibold text-stone-700 block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#53101E]" />
                Delivery Address
              </span>
              <div className="text-xs font-bold text-stone-900 truncate">
                {tracking.customerName}
              </div>
              <p className="text-[11px] text-stone-600 line-clamp-2 mt-0.5">
                {tracking.deliveryAddress}, {tracking.deliveryCity}
              </p>
            </div>
          </div>

          {/* INTERACTIVE VISUAL GPS RADAR & ROUTE MAP */}
          <div className="rounded-2xl border border-stone-200 bg-stone-900 text-white overflow-hidden shadow-md">
            {/* Map Header Status Bar */}
            <div className="px-4 py-2.5 bg-stone-950/80 border-b border-stone-800 flex flex-wrap items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold text-emerald-400">Live GPS Connected (4G LTE Telemetry)</span>
                <span className="text-stone-500 hidden sm:inline">·</span>
                <span className="text-stone-400 hidden sm:inline">Accuracy ±3m · Speed: 31 km/h</span>
              </div>
              <button
                onClick={handleSimulateAdvance}
                disabled={isSimulating}
                className="text-[11px] text-[#DFC07A] hover:text-white flex items-center gap-1 transition-colors cursor-pointer bg-stone-800 px-2 py-0.5 rounded-lg"
              >
                <RefreshCw className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
                <span>Simulate GPS Tick</span>
              </button>
            </div>

            {/* Stylized Visual Interactive Map Canvas */}
            <div className="relative h-60 sm:h-72 w-full bg-[#1A1E24] overflow-hidden select-none">
              {/* Street grid pattern background */}
              <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748B" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Simulated avenues */}
                <line x1="0" y1="80" x2="100%" y2="80" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6,4" />
                <line x1="0" y1="180" x2="100%" y2="180" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6,4" />
                <line x1="140" y1="0" x2="140" y2="100%" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6,4" />
                <line x1="380" y1="0" x2="380" y2="100%" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6,4" />
              </svg>

              {/* Route Polyline (Glow + Solid line) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 300" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C69947" stopOpacity="0.8" />
                    <stop offset="60%" stopColor="#10B981" stopOpacity="1" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="1" />
                  </linearGradient>
                </defs>
                {/* Road Glow */}
                <path 
                  d="M 60 70 Q 180 60, 240 140 T 420 180 T 540 230" 
                  fill="none" 
                  stroke="#10B981" 
                  strokeWidth="8" 
                  strokeOpacity="0.25"
                />
                {/* Solid dynamic line */}
                <path 
                  d="M 60 70 Q 180 60, 240 140 T 420 180 T 540 230" 
                  fill="none" 
                  stroke="url(#routeGradient)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                  strokeDasharray="6 4"
                />
              </svg>

              {/* Pin 1: Origin Hub */}
              <div className="absolute left-6 top-8 sm:left-12 sm:top-10 flex flex-col items-center group">
                <div className="w-8 h-8 rounded-full bg-[#53101E] border-2 border-[#DFC07A] flex items-center justify-center shadow-lg text-[#DFC07A]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="mt-1 px-2 py-0.5 rounded-md bg-stone-900/90 border border-stone-700 text-[10px] font-bold text-stone-200">
                  Style-Rent Lab
                </div>
              </div>

              {/* Moving Rider Pin */}
              <div 
                className="absolute flex flex-col items-center transition-all duration-700 ease-out z-20"
                style={{ 
                  left: `${Math.min(85, Math.max(20, riderProgress))}%`, 
                  top: `${Math.min(75, Math.max(35, 30 + riderProgress * 0.4))}%` 
                }}
              >
                {/* Pulsing radar waves */}
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute w-10 h-10 rounded-full bg-emerald-400 opacity-60" />
                  <div className="w-9 h-9 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xl text-stone-950 font-bold">
                    <Bike className="w-5 h-5 fill-stone-950 text-stone-950" />
                  </div>
                </div>

                <div className="mt-1 px-2.5 py-1 rounded-lg bg-stone-950 border border-emerald-400 text-[10px] font-bold text-white shadow-xl flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{tracking.riderName}</span>
                  <span className="text-emerald-400 font-mono">({tracking.etaMinutes}m)</span>
                </div>
              </div>

              {/* Pin 2: Destination Doorstep */}
              <div className="absolute right-6 bottom-6 sm:right-12 sm:bottom-8 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center shadow-lg text-white">
                  <MapPin className="w-4 h-4 fill-white" />
                </div>
                <div className="mt-1 px-2 py-0.5 rounded-md bg-stone-900/90 border border-stone-700 text-[10px] font-bold text-blue-200">
                  Your Doorstep
                </div>
              </div>
            </div>

            {/* Map bottom status note */}
            <div className="p-3 bg-stone-950 text-xs flex items-center justify-between border-t border-stone-800">
              <span className="text-stone-300 flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-[#DFC07A]" />
                <span>{tracking.statusNotes}</span>
              </span>
              <span className="text-[11px] text-stone-500">Updated: {tracking.updatedAt}</span>
            </div>
          </div>

          {/* RIDER DETAILS & DIRECT COMMUNICATION */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#53101E] text-[#DFC07A] font-bold text-base flex items-center justify-center border-2 border-[#DFC07A]">
                {tracking.riderName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-stone-900">{tracking.riderName}</h4>
                  <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md">
                    ★ {tracking.riderRating}
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  Vehicle: <strong className="text-stone-800">{tracking.riderVehicle}</strong>
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Identity · Medical Sanitization Gear Equipped</span>
                </div>
              </div>
            </div>

            {/* Communication Buttons */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${tracking.riderPhone}`}
                className="px-3.5 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Rider</span>
              </a>

              <a
                href={`https://api.whatsapp.com/send?phone=919820281729&text=${encodeURIComponent(`Hi ${tracking.riderName}, regarding Style-Rent delivery ${activeOrder.orderId}:`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* STEP-BY-STEP DISPATCH TIMELINE */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <span>Sanitization & Logistics Timeline</span>
              <span className="text-[10px] text-stone-500 font-normal">Real-time status updates</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {steps.map((st, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    st.done
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold'
                      : 'bg-stone-50 border-stone-200 text-stone-400'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mx-auto mb-1 text-xs ${
                    st.done ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-500'
                  }`}>
                    {st.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <div className="text-[11px] leading-tight line-clamp-2">{st.label}</div>
                  <div className="text-[9px] text-stone-500 mt-1 font-mono">{st.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Outfits in this delivery */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
              Garments in Transit ({activeOrder.items.length})
            </span>
            <div className="space-y-2">
              {activeOrder.items.map((it, idx) => (
                <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img 
                      src={it.product.images[0]} 
                      alt={it.product.name} 
                      className="w-10 h-12 rounded-lg object-cover object-top border border-stone-200"
                    />
                    <div>
                      <h5 className="font-bold text-stone-900 line-clamp-1">{it.product.name}</h5>
                      <p className="text-stone-500">
                        Size: <strong>{it.selectedSize}</strong> · {it.rentalDuration} Day Rental
                        {it.hasBackupSize && ` · Backup Size: ${it.backupSize}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#53101E]">{formatINR(it.rentalFee)}</span>
                    <span className="block text-[10px] text-emerald-700">Sealed in zip garment bag</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-[11px] text-stone-500">
            Need urgent changes? Call Priority Helpline: <span className="font-semibold text-stone-800">1800-STYLE-RENT</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 text-xs font-bold rounded-full bg-[#53101E] text-white hover:bg-[#3B0913] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
