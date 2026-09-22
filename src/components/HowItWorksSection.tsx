import React from 'react';
import { Utensils, Sliders, Trophy, FileSpreadsheet, MessageCircle, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Choose Your Courses',
      desc: 'Browse through our extensive appetizers, royal gravies, live tandoor breads, aromatic biryanis and gourmet desserts.',
      icon: Utensils,
    },
    {
      num: '02',
      title: 'Build Your Plate',
      desc: 'Add individual items to your custom plate blueprint and see your per-plate price update dynamically with zero hidden fees.',
      icon: Sliders,
    },
    {
      num: '03',
      title: 'Select Guest Count',
      desc: 'Input your event guest count from 10 to 5000+ plates using our simple slider or quick-select buttons.',
      icon: FileSpreadsheet,
    },
    {
      num: '04',
      title: 'Unlock Bulk Discounts',
      desc: 'Watch our dynamic discount engine automatically deduct 5%, 10%, 15%, or 20% off your overall catering bill.',
      icon: Trophy,
    },
    {
      num: '05',
      title: 'Direct WhatsApp Quote',
      desc: 'Submit your date and venue to get a professional catering quotation directly sent to your phone and WhatsApp.',
      icon: MessageCircle,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#0d0d12] border-t border-b border-amber-500/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-serif font-semibold">
            Simple & Transparent
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            How Festiva <span className="gold-gradient-text">Works</span>
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            No guessing games or delayed phone quotes. Design your menu online, verify every rupee, and book with complete confidence.
          </p>
        </div>

        {/* Steps Horizontal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-3xl bg-[#14141a] border border-stone-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-serif font-bold text-2xl text-stone-700 group-hover:text-amber-500/40 transition-colors">
                      {step.num}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2">
                  <span className="text-[10px] text-amber-500/70 uppercase tracking-widest font-semibold">
                    Step {idx + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Callout */}
        <div className="mt-12 text-center">
          <a
            href="#build-plate"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs shadow-gold-glow hover:scale-105 transition-transform"
          >
            <span>Start Building Your Catering Plate Now</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};
