import React from 'react';
import { Heart, Briefcase, Cake, Flame, TreePine, Sparkles, ArrowRight } from 'lucide-react';

export const EventTypesSection: React.FC = () => {
  const events = [
    {
      title: 'Grand Weddings & Receptions',
      desc: 'Sumptuous multi-course banquets, royal brass chafing presentations, and personalized traditional hospitality for your special milestone.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80',
      icon: Heart,
      tag: '500+ Guests Tier',
    },
    {
      title: 'Corporate Galas & Conferences',
      desc: 'High-speed professional buffet lines, executive executive boxed meals, live interactive salads, and gourmet tea break spreads.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=80',
      icon: Briefcase,
      tag: 'Punctual & Seamless',
    },
    {
      title: 'Birthdays & Private Soirées',
      desc: 'Fun live snack counters, customized chaat carts, mini slider stations, and dessert bars tailored for memorable birthdays.',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=700&q=80',
      icon: Cake,
      tag: 'Customizable Themes',
    },
    {
      title: 'Live Tandoor & Chaat Counters',
      desc: 'Chefs baking live naan and tossing fresh roomali rotis right in front of your guests, accompanied by Delhi-style live chaat stalls.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80',
      icon: Flame,
      tag: 'Visual Spectacle',
    },
    {
      title: 'Outdoor & Farmhouse Parties',
      desc: 'Complete mobile kitchen setups, charcoal barbecue grills, generator-backed warming equipment, and rustic outdoor hospitality.',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=700&q=80',
      icon: TreePine,
      tag: 'Full Logistics Managed',
    },
    {
      title: 'Religious Functions & Pujas',
      desc: '100% Sattvic / Pure Vegetarian culinary arrangements with zero onion-garlic options, copper utensils, and traditional leaf service.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
      icon: Sparkles,
      tag: 'Pure Veg & Authentic',
    },
  ];

  return (
    <section id="events" className="py-20 bg-[#09090c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-serif font-semibold">
            Occasions We Elevate
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            Catering for <span className="gold-gradient-text">Every Celebration</span>
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            From intimate gatherings of 25 loved ones to grand gala wedding banquets of 5,000 guests across Bangalore, Feastiva delivers flawless culinary hospitality.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, idx) => {
            const Icon = event.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl overflow-hidden bg-[#121217] border border-stone-800/80 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-[#121217]/40 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-stone-950/80 backdrop-blur-md border border-amber-500/30 px-3 py-1 rounded-full text-[11px] font-semibold text-amber-300">
                    {event.tag}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                        {event.title}
                      </h3>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {event.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-800/80">
                    <a
                      href="#build-plate"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors"
                    >
                      <span>Design Menu for This Event</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
