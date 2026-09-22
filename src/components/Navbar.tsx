import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Menu as MenuIcon, 
  X, 
  Phone, 
  Mail, 
  Sparkles, 
  Settings, 
  User, 
  MessageCircle 
} from 'lucide-react';
import { DietaryType, UserProfile } from '../types';
import { 
  FESTIVA_EMAIL, 
  FESTIVA_PHONE, 
  FESTIVA_GMAIL_COMPOSE_URL, 
  FESTIVA_FOUNDER 
} from '../utils/pricing';

interface NavbarProps {
  dietaryFilter: DietaryType | 'all';
  onToggleDietary: () => void;
  plateItemCount: number;
  plateTotal: number;
  onOpenPlateDrawer: () => void;
  onOpenAdmin: () => void;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  dietaryFilter,
  onToggleDietary,
  plateItemCount,
  plateTotal,
  onOpenPlateDrawer,
  onOpenAdmin,
  currentUser,
  onOpenLogin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Build Your Plate', href: '#build-plate', highlight: true },
    { name: 'Menu', href: '#menu' },
    { name: 'Offers', href: '#offers' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const isPureVeg = dietaryFilter === 'veg';

  return (
    <header className="sticky top-0 z-40 bg-[#070709]/95 backdrop-blur-xl border-b border-[#28241c] transition-all">
      
      {/* Top Utility Bar: Direct Gmail, WhatsApp, and Founder line */}
      <div className="bg-[#120d09] border-b border-amber-500/15 py-1.5 px-4 text-xs text-stone-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          
          {/* Left: Direct Gmail Compose Link */}
          <div className="flex items-center gap-4">
            <a
              href={FESTIVA_GMAIL_COMPOSE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors group"
              title="Click to Email us directly on Gmail"
            >
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                <Mail className="w-3 h-3" />
              </div>
              <span className="font-mono text-[11px] underline decoration-amber-500/40">
                {FESTIVA_EMAIL}
              </span>
            </a>

            <span className="hidden sm:inline text-stone-700">|</span>

            {/* Direct WhatsApp Click */}
            <a
              href="https://wa.me/919234076376"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
              title="Click to Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: +91 {FESTIVA_PHONE}</span>
            </a>
          </div>

          {/* Right: Announcement & Founder */}
          <div className="flex items-center gap-3 text-[11px] text-stone-400">
            <span className="hidden md:inline-flex items-center gap-1 text-amber-400/90 font-medium">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Bulk Offers: 5% to 20% OFF
            </span>
            <span className="hidden md:inline text-stone-700">•</span>
            <span>Founder: <strong className="text-stone-200">{FESTIVA_FOUNDER}</strong> (Bangalore)</span>
          </div>

        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo brand (Using the exact official Feastiva logo image!) */}
          <a href="#home" className="flex items-center gap-3 group flex-shrink-0">
            <img 
              src="/assets/feastiva_official_logo.png" 
              alt="Feastiva Catering Official Logo" 
              className="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-3.5 py-1.5 text-xs tracking-wider uppercase font-semibold rounded-full transition-all ${
                  link.highlight
                    ? 'text-amber-300 bg-amber-500/10 border border-amber-500/40 hover:bg-amber-500/20 shadow-sm'
                    : 'text-stone-300 hover:text-amber-300 hover:bg-white/5'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Controls: De-congested, sleek & spaced */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            
            {/* VEG / NON-VEG TOGGLE SWITCH */}
            <button
              onClick={onToggleDietary}
              title={isPureVeg ? "Currently Pure Veg. Click to show Non-Veg & Veg" : "Currently Non-Veg. Click to show 100% Pure Veg"}
              className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border transition-all shadow-md group ${
                isPureVeg 
                  ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-300 hover:border-emerald-400' 
                  : 'bg-rose-950/90 border-amber-500/50 text-amber-200 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isPureVeg ? 'bg-emerald-400' : 'bg-red-500'}`} />
                <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline font-serif">
                  {isPureVeg ? 'Pure Veg' : 'Non-Veg'}
                </span>
              </div>

              {/* Slider Pill */}
              <div className={`w-8 h-4 rounded-full p-0.5 flex items-center transition-colors ${
                isPureVeg ? 'bg-emerald-700 justify-start' : 'bg-red-700 justify-end'
              }`}>
                <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
              </div>
            </button>

            {/* MY PLATE CART BUTTON */}
            <button
              onClick={onOpenPlateDrawer}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-xs shadow-gold-glow transition-all hover:scale-105 active:scale-95"
            >
              <UtensilsCrossed className="w-4 h-4 text-stone-950" />
              <span className="hidden sm:inline">Plate</span>
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-stone-950 text-amber-300 text-[11px] font-bold">
                {plateItemCount}
              </span>
            </button>

            {/* USER LOGIN / PROFILE BUTTON */}
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-white transition-colors text-xs font-medium"
              title="Customer Login / Profile"
            >
              {currentUser?.isLoggedIn ? (
                <div className="flex items-center gap-1.5">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover border border-amber-400"
                  />
                  <span className="hidden sm:inline font-semibold text-amber-300 truncate max-w-[80px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Sign In</span>
                </div>
              )}
            </button>

            {/* ADMIN ACCESS ICON */}
            <button
              onClick={onOpenAdmin}
              title="Admin Panel"
              className="p-2 text-stone-400 hover:text-amber-300 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-amber-500/30"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-300 hover:text-amber-300 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#101014] border-b border-amber-500/20 px-4 pt-3 pb-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <span className="text-xs uppercase tracking-wider text-stone-400">Dietary Mode</span>
            <button
              onClick={onToggleDietary}
              className={`px-3 py-1.5 text-xs rounded-full border font-bold flex items-center gap-1.5 ${
                isPureVeg 
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300' 
                  : 'bg-rose-950 border-rose-500 text-rose-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isPureVeg ? 'bg-emerald-400' : 'bg-red-400'}`} />
              {isPureVeg ? '🌱 Pure Veg Active' : '🍗 Non-Veg Active'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                  link.highlight
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                    : 'text-stone-300 hover:bg-white/5'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPlateDrawer();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-amber-500 text-stone-950 font-bold text-xs shadow-gold-glow"
            >
              <UtensilsCrossed className="w-4 h-4" />
              View Catering Plate ({plateItemCount} items)
            </button>

            <a
              href={FESTIVA_GMAIL_COMPOSE_URL}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-stone-900 border border-stone-800 text-stone-200 text-xs font-medium"
            >
              <Mail className="w-3.5 h-3.5 text-red-400" />
              <span>Email: {FESTIVA_EMAIL}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
