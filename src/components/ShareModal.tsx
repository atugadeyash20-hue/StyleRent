import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Globe, 
  MessageCircle, 
  Mail, 
  Info, 
  QrCode, 
  ExternalLink,
  Users,
  Smartphone,
  ShieldCheck,
  Download,
  FolderArchive
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SHARED_APP_URL = 'https://ais-pre-bhqatkonulyfu5bb5sbu4s-698741090226.asia-southeast1.run.app';

export const getPublicShareUrl = (): string => {
  if (typeof window !== 'undefined' && window.location) {
    try {
      const href = window.location.href;
      if (href && !href.includes('localhost') && !href.includes('127.0.0.1') && !href.includes('about:')) {
        return href.split('#')[0];
      }
    } catch (e) {
      // fallback
    }
  }
  return SHARED_APP_URL;
};

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen) return null;

  const currentUrl = getPublicShareUrl();
  const shareMessage = `Rent luxury ethnic wear, designer formals, and costumes from Style-Rent starting at ₹899: ${currentUrl}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = currentUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Style-Rent - Online Clothing Rental Platform',
          text: 'Explore and rent royal sherwanis, tuxedos, and designer outfits on Style-Rent:',
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent('Check out Style-Rent for renting designer outfits!')}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent('Check out Style-Rent Clothing Rental')}&body=${encodeURIComponent(shareMessage)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#53101E] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C69947]/20 flex items-center justify-center border border-[#C69947]/40">
              <Globe className="w-5 h-5 text-[#DFC07A]" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-cinzel text-white flex items-center gap-2">
                Share Style-Rent
                <span className="text-[10px] uppercase font-sans tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-semibold">
                  Live
                </span>
              </h2>
              <p className="text-xs text-stone-200">
                How to share your clothing rental platform with friends & clients
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Key Instruction: How to share in AI Studio */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-semibold block text-amber-950 mb-1 text-sm">
                How to make this link work for everyone:
              </strong>
              <ol className="list-decimal pl-4 space-y-1 text-amber-900/90 font-medium">
                <li>Look at the top-right corner of the Google AI Studio window.</li>
                <li>Click the <strong>Share</strong> or <strong>Publish</strong> button.</li>
                <li>Change access to <em>"Anyone with the link can view"</em>.</li>
                <li>Copy that public link — anyone can now open and use Style-Rent without needing any login!</li>
              </ol>
            </div>
          </div>

          {/* Current App Link Box */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Current Workspace / App URL</span>
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 font-sans">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                Active
              </span>
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 font-mono break-all select-all flex items-center justify-between">
                <span className="truncate">{currentUrl || 'Current App URL'}</span>
              </div>
              <button
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-[#53101E] text-white hover:bg-[#3B0913]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy URL
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Sharing Channels */}
          <div>
            <span className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2.5">
              Quick Share Links
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-800 text-xs font-semibold transition-colors shadow-2xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                WhatsApp
              </a>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100/70 text-sky-800 text-xs font-semibold transition-colors shadow-2xs"
              >
                <Share2 className="w-4 h-4 text-sky-600" />
                Telegram
              </a>

              <a
                href={emailUrl}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold transition-colors shadow-2xs"
              >
                <Mail className="w-4 h-4 text-stone-600" />
                Email
              </a>

              <button
                type="button"
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100/70 text-purple-800 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-purple-600" />
                Device Share
              </button>
            </div>
          </div>

          {/* Project Source Code & ZIP Download Section */}
          <div className="pt-3 border-t border-stone-200">
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderArchive className="w-4 h-4 text-[#53101E]" />
                  <span className="text-xs font-bold text-stone-900">Project Code ZIP (Folder-wise)</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  Viva & Demo Ready
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-snug">
                Download the complete codebase bundled folder-wise with React, TypeScript, Tailwind CSS, mock data, and components.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <a
                  href="/style-rent-project.zip"
                  download="style-rent-project.zip"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#53101E] hover:bg-[#3B0913] text-white rounded-lg text-xs font-bold transition-colors shadow-2xs cursor-pointer text-center"
                >
                  <Download className="w-3.5 h-3.5" />
                  Full Project (.ZIP)
                </a>
                <a
                  href="/style-rent-source-code.zip"
                  download="style-rent-source-code.zip"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  <Download className="w-3.5 h-3.5" />
                  Source Code (.ZIP)
                </a>
              </div>
            </div>
          </div>

          {/* QR Code Toggle */}
          <div className="pt-2 border-t border-stone-200">
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full flex items-center justify-between text-xs text-stone-700 font-semibold py-1.5 hover:text-[#53101E] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-stone-500" />
                {showQR ? 'Hide Mobile QR Code' : 'Show Mobile QR Code (Scan to open on phone)'}
              </span>
              <span className="text-[11px] text-[#C69947] font-medium">
                {showQR ? '▲ Collapse' : '▼ Expand'}
              </span>
            </button>

            {showQR && (
              <div className="mt-3 p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col items-center text-center animate-in fade-in duration-150">
                <div className="bg-white p-3 rounded-lg shadow-xs border border-stone-200 inline-block">
                  <img
                    src={qrCodeUrl}
                    alt="Style-Rent QR Code"
                    className="w-40 h-40 object-contain"
                  />
                </div>
                <p className="text-xs text-stone-600 mt-2 max-w-xs">
                  Scan with any smartphone camera to open Style-Rent on your mobile device.
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#53101E] rounded-xl hover:bg-[#3B0913] transition-colors cursor-pointer shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
