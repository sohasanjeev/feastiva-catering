import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Gift, ArrowRight } from 'lucide-react';
import { NextDiscountTier } from '../types';

interface DiscountProgressBarProps {
  quantity: number;
  discountPercentage: number;
  nextTier?: NextDiscountTier;
  onSetQuantity: (qty: number) => void;
}

export const DiscountProgressBar: React.FC<DiscountProgressBarProps> = ({
  quantity,
  discountPercentage,
  nextTier,
  onSetQuantity,
}) => {
  const prevDiscountRef = useRef(discountPercentage);

  // Trigger celebration confetti when a new discount tier is unlocked
  useEffect(() => {
    if (discountPercentage > prevDiscountRef.current && discountPercentage > 0) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#d4af37', '#f3e5ab', '#10b981', '#ffffff'],
        });
      } catch (e) {
        // fallback silently
      }
    }
    prevDiscountRef.current = discountPercentage;
  }, [discountPercentage]);

  // Determine current tier progress
  let progressPercentage = 0;
  if (!nextTier) {
    progressPercentage = 100; // max tier unlocked
  } else {
    // calculate relative progress towards next tier
    const prevRequired = discountPercentage === 0 ? 0 : (
      discountPercentage === 5 ? 50 : (discountPercentage === 10 ? 100 : 200)
    );
    const span = nextTier.requiredPlates - prevRequired;
    const currentOverPrev = Math.max(0, quantity - prevRequired);
    progressPercentage = Math.min(100, Math.round((currentOverPrev / span) * 100));
  }

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#17130e] via-[#1a1411] to-[#17130e] border border-amber-500/30 shadow-md space-y-2.5">
      
      {/* Top tier label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {discountPercentage > 0 ? (
            <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
          ) : (
            <Gift className="w-4 h-4 text-amber-400/70" />
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-serif">
            {discountPercentage > 0
              ? `🎉 ${discountPercentage}% Bulk Discount Active`
              : 'Unlock Volume Discounts'}
          </span>
        </div>

        {nextTier ? (
          <button
            onClick={() => onSetQuantity(nextTier.requiredPlates)}
            className="text-[11px] text-amber-400 hover:text-amber-200 underline font-medium flex items-center gap-1 group"
          >
            <span>Jump to {nextTier.requiredPlates} plates</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ) : (
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
            👑 VIP Maximum 20% Unlocked
          </span>
        )}
      </div>

      {/* Progress Bar Track */}
      <div className="relative w-full h-2.5 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
        <div
          style={{ width: `${progressPercentage}%` }}
          className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 rounded-full transition-all duration-500 ease-out shadow-gold-glow"
        />
      </div>

      {/* Message and Incentive */}
      <div className="flex items-center justify-between text-[11px] text-stone-300">
        {nextTier ? (
          <>
            <p>
              Add <strong className="text-amber-300 font-mono text-xs">{nextTier.morePlatesNeeded}</strong> more plates to unlock{' '}
              <strong className="text-amber-300 font-semibold">{nextTier.nextDiscount}% OFF</strong>
            </p>
            <span className="text-stone-400">Next: {nextTier.requiredPlates} plates</span>
          </>
        ) : (
          <p className="text-amber-300/90 font-medium">
            You have unlocked the highest volume tier! Contact Rajiv kr for custom mega-event packages.
          </p>
        )}
      </div>
    </div>
  );
};
