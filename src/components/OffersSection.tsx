import React, { useState } from 'react';
import { DiscountRule } from '../types';
import { Sparkles, Trophy, Users, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { formatINR } from '../utils/pricing';

interface OffersSectionProps {
  discountRules: DiscountRule[];
  onSelectPlates: (qty: number) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({
  discountRules,
  onSelectPlates,
}) => {
  const [testPlates, setTestPlates] = useState<number>(100);
  const samplePlateCost = 500;

  // Active rules
  const activeTiers = discountRules.filter((r) => r.active).sort((a, b) => a.minQuantity - b.minQuantity);

  // Calculate savings on simulator
  let applicableDiscount = 0;
  for (const rule of activeTiers) {
    if (testPlates >= rule.minQuantity && testPlates <= rule.maxQuantity) {
      applicableDiscount = rule.discountPercentage;
      break;
    }
  }

  const subtotal = testPlates * samplePlateCost;
  const savings = (subtotal * applicableDiscount) / 100;
  const total = subtotal - savings;

  return (
    <section id="offers" className="py-20 bg-[#0c0c10] border-t border-b border-amber-500/15 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs uppercase tracking-widest font-serif font-bold">
            <Trophy className="w-3.5 h-3.5" />
            Transparent Volume Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            Grand Celebrations, <span className="gold-gradient-text">Bigger Savings</span>
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Unlike traditional caterers with hidden fees, Festiva offers upfront automatic quantity discounts. The larger your celebration, the greater your savings.
          </p>
        </div>

        {/* Volume Discount Slabs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {activeTiers.filter(t => t.discountPercentage > 0).map((tier, idx) => (
            <div
              key={tier.id}
              className="relative p-6 rounded-3xl bg-[#14141a] border border-amber-500/20 hover:border-amber-500/60 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:-translate-y-1"
            >
              {/* Highlight ribbon for 10% and 20% */}
              {tier.discountPercentage >= 15 && (
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-stone-400 font-medium">
                    {tier.label}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                    0{idx + 1}
                  </span>
                </div>

                <div>
                  <h3 className="text-3xl font-serif font-bold text-white gold-gradient-text">
                    {tier.discountPercentage}% OFF
                  </h3>
                  <p className="text-sm font-medium text-stone-300 mt-1">
                    {tier.minQuantity} to {tier.maxQuantity >= 9000 ? '5000+' : tier.maxQuantity} Plates
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-stone-400 border-t border-stone-800 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    Instant bill deduction
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    Live counter options included
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    Dedicated banquet manager
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <a
                  href="#build-plate"
                  onClick={() => onSelectPlates(tier.minQuantity)}
                  className="w-full py-2.5 rounded-full bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors group-hover:bg-amber-500 group-hover:text-stone-950 group-hover:font-bold"
                >
                  <span>Build with {tier.minQuantity} Plates</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Savings Simulator */}
        <div className="rounded-3xl bg-gradient-to-b from-[#16161d] to-[#101014] border border-amber-500/30 p-8 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Simulator Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                  Interactive Calculator
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Estimate Your Volume Savings
                </h3>
                <p className="text-stone-400 text-xs sm:text-sm">
                  Drag the slider to preview estimated bill savings for a standard ₹500/plate banquet spread.
                </p>
              </div>

              {/* Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="text-stone-300">Guest Count:</span>
                  <span className="font-mono text-xl font-bold text-amber-400">
                    {testPlates} Plates
                  </span>
                </div>

                <input
                  type="range"
                  min={25}
                  max={600}
                  step={25}
                  value={testPlates}
                  onChange={(e) => setTestPlates(parseInt(e.target.value))}
                  className="w-full h-2.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />

                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>25 Guests (0%)</span>
                  <span>50 (5%)</span>
                  <span>100 (10%)</span>
                  <span>200 (15%)</span>
                  <span>500+ (20%)</span>
                </div>
              </div>
            </div>

            {/* Right Output Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0e0e12] border border-amber-500/30 space-y-4">
              <div className="flex justify-between text-xs text-stone-400">
                <span>Standard Subtotal:</span>
                <span className="font-mono text-stone-200">{formatINR(subtotal)}</span>
              </div>

              <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                <span>Volume Discount ({applicableDiscount}%):</span>
                <span className="font-mono">-{formatINR(savings)}</span>
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-between items-baseline">
                <span className="text-sm font-serif font-bold text-white">Estimated Total:</span>
                <span className="text-2xl font-bold font-mono text-amber-300">
                  {formatINR(total)}
                </span>
              </div>

              {savings > 0 ? (
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center text-xs text-emerald-300 font-bold">
                  🎉 Instant savings of {formatINR(savings)} unlocked!
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-stone-900 text-center text-[11px] text-stone-400">
                  Increase to 50+ plates to unlock our 5% bulk discount.
                </div>
              )}

              <a
                href="#build-plate"
                onClick={() => onSelectPlates(testPlates)}
                className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-gold-glow"
              >
                <span>Apply {testPlates} Plates to My Plate</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
