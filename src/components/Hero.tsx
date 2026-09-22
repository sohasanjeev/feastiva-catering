import React from 'react';
import { UtensilsCrossed, BookOpen, Sparkles, CheckCircle2, ChevronDown, MessageCircle, Mail } from 'lucide-react';
import { DietaryType } from '../types';
import { FESTIVA_EMAIL, FESTIVA_GMAIL_COMPOSE_URL, FESTIVA_PHONE, FESTIVA_FOUNDER } from '../utils/pricing';

interface HeroProps {
  dietaryFilter: DietaryType | 'all';
  onScrollToBuildPlate: () => void;
  onScrollToMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  dietaryFilter,
  onScrollToBuildPlate,
  onScrollToMenu,
}) => {
  const isPureVeg = dietaryFilter === 'veg';

  return (
    <section id="home" className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden pt-8 pb-16">
      {/* Background ambient lighting and dark luxury backdrop */}
      <div className="absolute inset-0 bg-[#070709] pointer-events-none" />
      
      {/* Subtle radial gradients for Edem-like luxury warm atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-amber-600/10 via-rose-950/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Dietary Badge & Brand Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-stone-900/95 to-stone-950/95 border border-amber-500/30 shadow-gold-glow flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs uppercase tracking-[0.2em] text-amber-300 font-semibold font-serif">
                Bangalore's Bespoke Luxury Catering
              </span>
              <span className="text-stone-600">|</span>
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
                isPureVeg ? 'text-emerald-400' : 'text-amber-200'
              }`}>
                {isPureVeg ? '🌱 100% Pure Veg Active' : '🍗 Multi-Cuisine Selections'}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-serif font-bold text-white tracking-tight leading-[1.1]">
                Your Event. <br />
                Your Menu. <br />
                <span className="gold-gradient-text drop-shadow-md">
                  Your Festiva.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-stone-300 font-light max-w-2xl leading-relaxed pt-2">
                Build your customized catering plate, select your guest count, and receive instant transparent billing with volume-based bulk discounts.
              </p>
            </div>

            {/* Key Value Props Micro-list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-stone-300 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Customized Menus</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Instant Per-Plate Pricing</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Volume Bulk Offers</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Live Chef Counters</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Farm-Fresh Ingredients</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>50 to 5000+ Guests</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={onScrollToBuildPlate}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-bold text-base shadow-gold-glow hover:shadow-gold-glow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <UtensilsCrossed className="w-5 h-5 text-stone-950 group-hover:rotate-12 transition-transform" />
                <span>Build Your Plate</span>
                <span className="text-xs bg-stone-950/15 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                  Signature Feature
                </span>
              </button>

              <button
                onClick={onScrollToMenu}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-stone-900/80 hover:bg-stone-800 text-amber-200 border border-amber-500/30 font-semibold text-base transition-colors"
              >
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>Explore Full Menu</span>
              </button>
            </div>

            {/* Communication Links */}
            <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between flex-wrap gap-4 text-xs text-stone-400">
              <div className="flex items-center gap-3 flex-wrap">
                <a
                  href={FESTIVA_GMAIL_COMPOSE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-amber-300 hover:text-white"
                >
                  <Mail className="w-3.5 h-3.5 text-red-400" />
                  <span>{FESTIVA_EMAIL}</span>
                </a>
                <span>•</span>
                <a
                  href="https://wa.me/919234076376"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+91 {FESTIVA_PHONE}</span>
                </a>
              </div>

              <div className="flex items-center gap-4 tracking-wider uppercase text-[11px] text-amber-400/90 font-medium">
                <span>Quality</span>
                <span>•</span>
                <span>Hygiene</span>
                <span>•</span>
                <span>Taste</span>
                <span>•</span>
                <span>Trust</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-amber-600/10 to-transparent rounded-3xl blur-2xl transform rotate-3" />
              
              <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-[#121216] shadow-2xl">
                
                {/* Visual Image */}
                <div className="relative h-96 sm:h-[430px] overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
                    alt="Feastiva Luxury Gourmet Dish"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-black/40" />

                  {/* Top Floating Badge with Official Logo */}
                  <div className="absolute top-4 left-4 bg-stone-950/90 backdrop-blur-md border border-amber-500/40 rounded-2xl p-2 px-3 flex items-center gap-3 shadow-lg">
                    <img src="/assets/feastiva_official_logo.png" alt="Feastiva Logo" className="h-10 w-auto object-contain" />
                    <div>
                      <p className="text-[10px] tracking-widest text-amber-400 font-bold uppercase font-serif">FEASTIVA CATERING</p>
                      <p className="text-xs text-stone-200 font-medium">Taste That Brings People Together</p>
                    </div>
                  </div>

                  {/* Live Offers Floating Pill */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs px-3 py-1.5 rounded-full shadow-gold-glow flex items-center gap-1.5 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Up to 20% OFF</span>
                  </div>

                  {/* Bottom Interactive Preview Overlay */}
                  <div className="absolute bottom-4 inset-x-4 bg-stone-950/90 backdrop-blur-md rounded-2xl border border-amber-500/30 p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">Sample Royal Banquet Platter</span>
                      <span className="text-emerald-400 font-semibold">⭐ Chef Rajiv's Signature</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-stone-100 font-bold text-sm">Royal 7-Course Banquet</p>
                        <p className="text-[11px] text-stone-400">Starters, Royal Gravies, Live Tandoor & Sweets</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-stone-400 line-through">₹500</span>
                        <p className="text-amber-300 font-serif font-bold text-base">₹450 <span className="text-[10px] text-stone-300 font-sans font-normal">/ plate</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Indicators */}
                <div className="bg-[#17171d] px-6 py-4 border-t border-amber-500/15 flex items-center justify-around text-center">
                  <div>
                    <p className="text-amber-400 font-bold text-lg font-serif">50+</p>
                    <p className="text-[11px] text-stone-400 uppercase tracking-wider">Dishes to Choose</p>
                  </div>
                  <div className="w-px h-8 bg-stone-800" />
                  <div>
                    <p className="text-amber-400 font-bold text-lg font-serif">100%</p>
                    <p className="text-[11px] text-stone-400 uppercase tracking-wider">Transparent Bill</p>
                  </div>
                  <div className="w-px h-8 bg-stone-800" />
                  <div>
                    <p className="text-amber-400 font-bold text-lg font-serif">Direct</p>
                    <p className="text-[11px] text-stone-400 uppercase tracking-wider">Online Booking</p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Down indicator */}
      <div className="mt-10 text-center">
        <a 
          href="#build-plate" 
          className="inline-flex flex-col items-center gap-1 text-stone-500 hover:text-amber-400 text-xs tracking-widest uppercase transition-colors"
        >
          <span>Scroll to Build Your Plate</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
};
