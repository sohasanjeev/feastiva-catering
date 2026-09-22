import React from 'react';
import { Phone, MapPin, Mail, MessageCircle, ArrowUp } from 'lucide-react';
import { 
  FESTIVA_PHONE, 
  FESTIVA_ADDRESS, 
  FESTIVA_FOUNDER, 
  FESTIVA_INSTAGRAM, 
  FESTIVA_EMAIL, 
  FESTIVA_GMAIL_COMPOSE_URL 
} from '../utils/pricing';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#050507] border-t border-amber-500/20 pt-16 pb-12 text-stone-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Col with Official Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/feastiva_official_logo.png" 
                alt="Feastiva Catering Official Logo" 
                className="h-16 w-auto object-contain" 
              />
            </div>
            
            <p className="text-stone-300 leading-relaxed italic">
              "Thoughtfully curated catering for celebrations big and small."
            </p>

            <div className="text-[11px] text-stone-300">
              <span className="text-amber-400 font-semibold">Founder:</span> {FESTIVA_FOUNDER}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={FESTIVA_GMAIL_COMPOSE_URL}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 hover:border-red-500 flex items-center justify-center text-red-400 transition-colors"
                title="Email us on Gmail"
              >
                <Mail className="w-4 h-4" />
              </a>

              <a
                href="https://wa.me/919234076376"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 hover:border-emerald-500 flex items-center justify-center text-emerald-400 transition-colors"
                title="Chat with Rajiv kr on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href="https://instagram.com/feastivaofficial"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 hover:border-pink-500 flex items-center justify-center text-pink-400 transition-colors"
                title="Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-amber-300 font-serif font-bold">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-amber-300 transition-colors">Home</a></li>
              <li><a href="#build-plate" className="hover:text-amber-300 transition-colors font-semibold text-amber-400">Build Your Plate</a></li>
              <li><a href="#menu" className="hover:text-amber-300 transition-colors">Complete Menu</a></li>
              <li><a href="#offers" className="hover:text-amber-300 transition-colors">Volume Offers</a></li>
              <li><a href="#how-it-works" className="hover:text-amber-300 transition-colors">How It Works</a></li>
              <li><a href="#events" className="hover:text-amber-300 transition-colors">Events & Banquets</a></li>
              <li><a href="#about" className="hover:text-amber-300 transition-colors">About Feastiva</a></li>
            </ul>
          </div>

          {/* Direct Communication */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-amber-300 font-serif font-bold">
              Direct Inquiries
            </h4>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Official Gmail (Click to compose)</span>
                <a 
                  href={FESTIVA_GMAIL_COMPOSE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-300 hover:text-white font-mono flex items-center gap-1.5 mt-0.5"
                >
                  <Mail className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <span>{FESTIVA_EMAIL}</span>
                </a>
              </div>

              <div>
                <span className="text-[10px] text-stone-500 uppercase block">WhatsApp / Helpline (Click to message)</span>
                <a 
                  href="https://wa.me/919234076376" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1.5 mt-0.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>+91 {FESTIVA_PHONE}</span>
                </a>
              </div>

              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Headquarters</span>
                <div className="flex items-start gap-1.5 mt-0.5 text-stone-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{FESTIVA_ADDRESS}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Catering Assurance */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-amber-300 font-serif font-bold">
              Feastiva Seal of Trust
            </h4>
            <div className="p-3.5 rounded-2xl bg-[#0f0f14] border border-amber-500/20 space-y-2">
              <p className="text-[11px] text-stone-300">
                100% Transparent Billing • Fresh Ingredients • Commercial Kitchen Hygiene • On-Time Banquet Service.
              </p>
              <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
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

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} FEASTIVA CATERING. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#admin" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Owner Portal
            </a>
            <span>•</span>
            <a href="#home" className="hover:text-stone-200">Terms & Conditions</a>
            <span>•</span>
            <a href="#home" className="hover:text-stone-200">Privacy Policy</a>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-stone-900 text-stone-400 hover:text-amber-300 hover:bg-stone-800 transition-colors"
              title="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
