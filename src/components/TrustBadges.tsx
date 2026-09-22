import React from 'react';
import { ShieldCheck, Sparkles, Heart, Award } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const pillars = [
    {
      title: 'QUALITY',
      subtitle: 'Finest handpicked ingredients, pure desi ghee and farm-fresh produce.',
      icon: Award,
    },
    {
      title: 'HYGIENE',
      subtitle: 'Clean, sanitized commercial kitchen with strict food safety measures.',
      icon: ShieldCheck,
    },
    {
      title: 'TASTE',
      subtitle: 'Authentic heritage flavors crafted by seasoned banquet master chefs.',
      icon: Sparkles,
    },
    {
      title: 'TRUST',
      subtitle: 'Trusted by hundreds of families and corporate houses across Bangalore.',
      icon: Heart,
    },
  ];

  return (
    <section className="py-12 bg-[#0c0c10] border-t border-b border-amber-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#141419] border border-stone-800/80 hover:border-amber-500/30 transition-colors flex flex-col items-center text-center space-y-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-white tracking-[0.2em] text-sm uppercase">
                  {pillar.title}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  {pillar.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
