import React from 'react';
import { X, Flame, ShieldAlert, Sparkles, Plus, Minus, Check } from 'lucide-react';
import { FoodItem } from '../types';

interface ItemDetailModalProps {
  item: FoodItem | null;
  onClose: () => void;
  isInPlate: boolean;
  onAddToPlate: (item: FoodItem) => void;
  onRemoveFromPlate: (id: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  isInPlate,
  onAddToPlate,
  onRemoveFromPlate,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-[#121216] border border-amber-500/30 shadow-2xl overflow-hidden text-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-950/80 text-stone-300 hover:text-white border border-stone-700 hover:bg-stone-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image Header */}
        <div className="relative h-60 w-full overflow-hidden bg-stone-950">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-black/30" />

          {/* Dietary Badge */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border shadow-md ${
                item.dietaryType === 'veg'
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60'
                  : 'bg-rose-950/90 text-rose-300 border-rose-500/60'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${item.dietaryType === 'veg' ? 'bg-emerald-400' : 'bg-red-500'}`} />
              {item.dietaryType === 'veg' ? '100% Pure Veg' : 'Signature Non-Veg'}
            </span>

            {item.spiceLevel && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-900/90 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span className="capitalize">{item.spiceLevel}</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-2xl font-serif font-bold text-white tracking-wide">
                {item.name}
              </h3>
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-amber-400">
                  ₹{item.price}
                </span>
                <span className="text-xs text-stone-400 block">/ plate</span>
              </div>
            </div>
            <p className="text-stone-300 text-sm mt-2 leading-relaxed font-light">
              {item.description}
            </p>
          </div>

          {/* Ingredients */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-wider text-amber-400/90 font-semibold">
                Key Ingredients & Preparation
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs bg-stone-900 border border-stone-800 text-stone-300"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Special Notes & Hygiene Guarantee */}
          <div className="p-3.5 rounded-xl bg-stone-900/60 border border-stone-800 text-xs text-stone-400 space-y-1">
            <p className="flex items-center gap-1.5 text-amber-300/90 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Feastiva Culinary Standard
            </p>
            <p>
              Freshly prepared with authentic cold-pressed oils, premium spices, and served under strict commercial kitchen hygiene protocols.
            </p>
          </div>

          {/* Footer Action */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-full text-stone-400 hover:text-stone-200 text-sm font-medium transition-colors"
            >
              Close
            </button>

            {isInPlate ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Added to Plate
                </span>
                <button
                  onClick={() => onRemoveFromPlate(item.id)}
                  className="px-4 py-2.5 rounded-full bg-stone-900 border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onAddToPlate(item);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm shadow-gold-glow hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <Plus className="w-4 h-4" />
                Add to My Plate (₹{item.price})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
