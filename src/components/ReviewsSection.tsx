import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, X } from 'lucide-react';
import { Review, Size } from '../types';

interface ReviewsSectionProps {
  reviews: Review[];
  onAddReview: (review: Review) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onAddReview,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [height, setHeight] = useState("5'6\"");
  const [bodyType, setBodyType] = useState('Hourglass');
  const [sizePurchased, setSizePurchased] = useState<Size>('M');
  const [fitFeedback, setFitFeedback] = useState<'Runs Small' | 'True to Size' | 'Runs Large'>('True to Size');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    const newRev: Review = {
      id: `REV-${Date.now()}`,
      customerName: name,
      rating,
      date: 'Just now',
      comment,
      height,
      bodyType,
      sizePurchased,
      fitFeedback,
      verifiedRent: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    };

    onAddReview(newRev);
    setModalOpen(false);
    setName('');
    setComment('');
  };

  return (
    <section id="reviews" className="py-16 bg-[#FAF7F2] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C69947]">
              Customer Experiences & Real Fits
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Loved by Real Guests, Brides & Grooms
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mt-1">
              Read how fellow fashion lovers styled and rented their outfits with verified sizing notes.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 bg-[#53101E] text-white rounded-full text-xs font-semibold hover:bg-[#3B0913] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#DFC07A]" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div 
              key={rev.id} 
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Rating stars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-500 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-400">{rev.date}</span>
                </div>

                {/* Review comment */}
                <p className="text-xs text-stone-700 leading-relaxed italic line-clamp-4">
                  "{rev.comment}"
                </p>
              </div>

              {/* Sizing & Reviewer metadata */}
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-stone-500 font-medium">
                  <span>Height: {rev.height}</span>
                  <span aria-hidden="true">·</span>
                  <span>Size: {rev.sizePurchased}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-semibold">{rev.fitFeedback}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <img
                    src={rev.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={rev.customerName}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1">
                      {rev.customerName}
                      {rev.verifiedRent && (
                        <span title="Verified Rental">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                        </span>
                      )}
                    </h4>
                    <span className="text-[10px] text-stone-400">Verified Rental</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write a Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex justify-center p-4">
          <div 
            className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 my-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-cinzel text-base font-bold text-stone-900">
                Share Your Style-Rent Experience
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  placeholder="e.g. Pooja Mehra"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className={`p-1.5 rounded-lg border cursor-pointer ${rating >= s ? 'bg-amber-100 border-amber-300 text-amber-600' : 'border-stone-200'}`}
                    >
                      <Star className={`w-5 h-5 ${rating >= s ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Height</label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-2 py-1.5 border border-stone-300 rounded-lg"
                    placeholder="e.g. 5'6&quot;"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Body Type</label>
                  <input
                    type="text"
                    value={bodyType}
                    onChange={(e) => setBodyType(e.target.value)}
                    className="w-full px-2 py-1.5 border border-stone-300 rounded-lg"
                    placeholder="e.g. Hourglass"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Size Rented</label>
                  <select
                    value={sizePurchased}
                    onChange={(e) => setSizePurchased(e.target.value as Size)}
                    className="w-full px-2 py-1.5 border border-stone-300 rounded-lg bg-white"
                  >
                    {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Fit Accuracy</label>
                <div className="flex gap-2">
                  {(['Runs Small', 'True to Size', 'Runs Large'] as const).map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFitFeedback(f)}
                      className={`flex-1 py-1.5 rounded-lg border font-medium ${fitFeedback === f ? 'bg-[#53101E] text-white border-[#53101E]' : 'border-stone-200 text-stone-600'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Review Feedback</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  placeholder="How did the outfit look? Did you receive compliments? Was delivery smooth?"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#53101E] text-white rounded-full font-bold uppercase tracking-wider hover:bg-[#3B0913] cursor-pointer"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
