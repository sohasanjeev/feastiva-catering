import React from 'react';
import { Award, ShieldCheck, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { 
  FESTIVA_ADDRESS, 
  FESTIVA_FOUNDER, 
  FESTIVA_INSTAGRAM, 
  FESTIVA_PHONE, 
  FESTIVA_EMAIL, 
  FESTIVA_GMAIL_COMPOSE_URL 
} from '../utils/pricing';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-[#08080b] relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute -bottom-20 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual: Official brand card & emblem */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-[#121217] shadow-2xl p-6 space-y-6">
              
              {/* Brand Official Logo Presentation */}
              <div className="text-center space-y-3 pb-6 border-b border-stone-800">
                <div className="relative w-36 mx-auto">
                  <img 
                    src="/assets/feastiva_official_logo.png" 
                    alt="Feastiva Catering Official Brand" 
                    className="w-full h-auto object-contain drop-shadow-xl" 
                  />
                </div>
                <p className="text-xs text-amber-300 italic">
                  "Taste That Brings People Together"
                </p>
              </div>

              {/* Founder Signature & Contact Card */}
              <div className="p-4 rounded-2xl bg-[#171720] border border-stone-800 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 uppercase tracking-wider text-[10px]">Founder</span>
                  <span className="font-serif font-bold text-amber-300 text-sm">{FESTIVA_FOUNDER}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-400 uppercase tracking-wider text-[10px]">Direct Phone & WhatsApp</span>
                  <a 
                    href="https://wa.me/919234076376" 
                    target="_blank" 
                    rel="noreferrer"
                    className="font-mono text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    +91 {FESTIVA_PHONE}
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-400 uppercase tracking-wider text-[10px]">Official Gmail</span>
                  <a 
                    href={FESTIVA_GMAIL_COMPOSE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-300 hover:underline font-mono flex items-center gap-1 truncate max-w-[200px]"
                    title="Click to Compose on Gmail"
                  >
                    <Mail className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                    <span className="truncate">{FESTIVA_EMAIL}</span>
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-400 uppercase tracking-wider text-[10px]">Instagram</span>
                  <a 
                    href="https://instagram.com/feastivaofficial" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-stone-200 hover:text-pink-400"
                  >
                    {FESTIVA_INSTAGRAM}
                  </a>
                </div>

                <div className="pt-2 border-t border-stone-800 flex items-start gap-1.5 text-stone-400 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{FESTIVA_ADDRESS}</span>
                </div>
              </div>

              {/* 4 Core Pillars from card */}
              <div className="grid grid-cols-4 gap-2 text-center pt-2">
                <div className="p-2 rounded-xl bg-stone-900/60 border border-stone-800">
                  <p className="text-[10px] uppercase font-bold text-amber-300">Quality</p>
                </div>
                <div className="p-2 rounded-xl bg-stone-900/60 border border-stone-800">
                  <p className="text-[10px] uppercase font-bold text-amber-300">Hygiene</p>
                </div>
                <div className="p-2 rounded-xl bg-stone-900/60 border border-stone-800">
                  <p className="text-[10px] uppercase font-bold text-amber-300">Taste</p>
                </div>
                <div className="p-2 rounded-xl bg-stone-900/60 border border-stone-800">
                  <p className="text-[10px] uppercase font-bold text-amber-300">Trust</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-serif font-semibold">
              The Feastiva Story
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              Hospitality Rooted in Passion, <br />
              <span className="gold-gradient-text">Precision & Perfection</span>
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Founded by <strong>Rajiv kr</strong> in Bangalore, Feastiva Catering was established with a singular vision: to revolutionize event catering by combining traditional Indian royal hospitality with transparent modern pricing.
            </p>

            <p className="text-stone-300 text-sm leading-relaxed">
              Whether you are organizing an auspicious wedding ceremony requiring 100% pure vegetarian culinary authenticity or an executive corporate gala with succulent kebabs and live chef counters, Feastiva crafts an unforgettable dining experience.
            </p>

            {/* Guarantee Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#131317] border border-stone-800 space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-serif font-bold text-white">
                  Zero Compromise on Hygiene
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Cooked in sanitized commercial facilities using cold-pressed oils, triple-filtered water, and handled exclusively with chef gloves and hairnets.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#131317] border border-stone-800 space-y-2">
                <div className="w-8 h-8 rounded-full bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-serif font-bold text-white">
                  Direct Online Orders & Estimates
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  No hidden service surcharges or sudden last-minute price jumps. You configure your menu and see the exact item-by-item breakdown beforehand.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4 flex-wrap">
              <a
                href="#build-plate"
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs shadow-gold-glow hover:scale-105 transition-transform"
              >
                Customize Your Banquet Menu
              </a>

              <a
                href={FESTIVA_GMAIL_COMPOSE_URL}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-full border border-stone-700 hover:border-amber-500/50 text-stone-300 hover:text-amber-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4 text-red-400" />
                <span>Email {FESTIVA_EMAIL}</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
