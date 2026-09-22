import React, { useState, useEffect } from 'react';
import { FoodItem, PlateItem, DiscountRule, CustomerEnquiry, DietaryType, UserProfile } from './types';
import { INITIAL_MENU_ITEMS } from './data/initialMenu';
import { DEFAULT_DISCOUNT_RULES, calculatePricing, formatINR } from './utils/pricing';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBadges } from './components/TrustBadges';
import { BuildPlateSection } from './components/BuildPlateSection';
import { MenuSection } from './components/MenuSection';
import { OffersSection } from './components/OffersSection';
import { EventTypesSection } from './components/EventTypesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { AboutSection } from './components/AboutSection';
import { ItemDetailModal } from './components/ItemDetailModal';
import { EventEnquiryModal } from './components/EventEnquiryModal';
import { AdminModal } from './components/AdminModal';
import { AdminPortal } from './components/AdminPortal';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';
import { UtensilsCrossed } from 'lucide-react';

export const App: React.FC = () => {
  // Route State: Customer Website vs Dedicated Owner Admin Suite
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return typeof window !== 'undefined' && (window.location.hash === '#admin' || window.location.hash === '#owner');
  });

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminRoute(window.location.hash === '#admin' || window.location.hash === '#owner');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 1. Dietary Toggle Switch State: 'veg' (100% Pure Veg) <--> 'all' (Non-Veg & Veg)
  const [dietaryPreference, setDietaryPreference] = useState<DietaryType | 'all'>('veg');

  // 2. Customer User Profile state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('feastiva_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // 3. Menu items state (seeded with 3 PDFs comprehensive menu, persistent in LocalStorage)
  const [menuItems, setMenuItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('feastiva_menu_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_MENU_ITEMS;
      }
    }
    return INITIAL_MENU_ITEMS;
  });

  // 4. Plate items (the user's customized plate)
  const [plateItems, setPlateItems] = useState<PlateItem[]>(() => {
    const saved = localStorage.getItem('feastiva_plate_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    const initialSample = INITIAL_MENU_ITEMS.filter((item) =>
      ['starter-1', 'curry-1', 'curry-3', 'bread-1', 'rice-4', 'sweet-1'].includes(item.id)
    ).map((item) => ({ foodItem: item, quantityPerPlate: 1 }));
    return initialSample;
  });

  // 5. Quantity (Plates count)
  const [quantity, setQuantity] = useState<number>(() => {
    const saved = localStorage.getItem('feastiva_quantity');
    return saved ? parseInt(saved) || 50 : 50;
  });

  // 6. Volume Discount Rules
  const [discountRules, setDiscountRules] = useState<DiscountRule[]>(() => {
    const saved = localStorage.getItem('feastiva_discount_rules');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_DISCOUNT_RULES;
      }
    }
    return DEFAULT_DISCOUNT_RULES;
  });

  // 7. Enquiries / Orders list for Admin
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>(() => {
    const saved = localStorage.getItem('feastiva_enquiries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Modals state
  const [detailItem, setDetailItem] = useState<FoodItem | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('feastiva_user_profile', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('feastiva_user_profile');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('feastiva_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('feastiva_plate_items', JSON.stringify(plateItems));
  }, [plateItems]);

  useEffect(() => {
    localStorage.setItem('feastiva_quantity', quantity.toString());
  }, [quantity]);

  useEffect(() => {
    localStorage.setItem('feastiva_discount_rules', JSON.stringify(discountRules));
  }, [discountRules]);

  useEffect(() => {
    localStorage.setItem('feastiva_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  // Pricing calculation
  const currentPricing = calculatePricing(plateItems, quantity, discountRules);

  // Handlers
  const handleToggleDietary = () => {
    setDietaryPreference((prev) => (prev === 'veg' ? 'all' : 'veg'));
  };

  const handleAddToPlate = (item: FoodItem) => {
    setPlateItems((prev) => {
      const exists = prev.find((p) => p.foodItem.id === item.id);
      if (exists) return prev;
      return [...prev, { foodItem: item, quantityPerPlate: 1 }];
    });
  };

  const handleRemoveFromPlate = (id: string) => {
    setPlateItems((prev) => prev.filter((p) => p.foodItem.id !== id));
  };

  const handleClearPlate = () => {
    setPlateItems([]);
  };

  const handleUpdateMenuItem = (updated: FoodItem) => {
    setMenuItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setPlateItems((prev) =>
      prev.map((p) => (p.foodItem.id === updated.id ? { ...p, foodItem: updated } : p))
    );
  };

  const handleAddMenuItem = (newItem: FoodItem) => {
    setMenuItems((prev) => [newItem, ...prev]);
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    handleRemoveFromPlate(id);
  };

  const handleUpdateDiscountRule = (updated: DiscountRule) => {
    setDiscountRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleSubmitEnquiry = (newEnquiry: CustomerEnquiry) => {
    setEnquiries((prev) => [newEnquiry, ...prev]);
  };

  const handleUpdateEnquiryStatus = (id: string, status: CustomerEnquiry['status']) => {
    setEnquiries((prev) =>
      prev.map((enq) => (enq.id === id ? { ...enq, status } : enq))
    );
  };

  const handleResetDefaults = () => {
    setMenuItems(INITIAL_MENU_ITEMS);
    setDiscountRules(DEFAULT_DISCOUNT_RULES);
    localStorage.removeItem('feastiva_menu_items');
    localStorage.removeItem('feastiva_discount_rules');
  };

  const scrollToBuildPlate = () => {
    const el = document.getElementById('build-plate');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Dedicated Full-Page Owner Admin Portal
  if (isAdminRoute) {
    return (
      <AdminPortal
        menuItems={menuItems}
        onUpdateMenuItem={handleUpdateMenuItem}
        onAddMenuItem={handleAddMenuItem}
        onDeleteMenuItem={handleDeleteMenuItem}
        discountRules={discountRules}
        onUpdateDiscountRule={handleUpdateDiscountRule}
        enquiries={enquiries}
        onUpdateEnquiryStatus={handleUpdateEnquiryStatus}
        onResetDefaults={handleResetDefaults}
        onBackToWebsite={() => {
          window.location.hash = '';
          setIsAdminRoute(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-stone-200 font-sans selection:bg-amber-500/20 selection:text-amber-200">
      
      {/* Top Navigation */}
      <Navbar
        dietaryFilter={dietaryPreference}
        onToggleDietary={handleToggleDietary}
        plateItemCount={plateItems.length}
        plateTotal={currentPricing.finalTotal}
        onOpenPlateDrawer={() => setIsMobileDrawerOpen(true)}
        onOpenAdmin={() => { window.location.hash = '#admin'; setIsAdminRoute(true); }}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero
          dietaryFilter={dietaryPreference}
          onScrollToBuildPlate={scrollToBuildPlate}
          onScrollToMenu={scrollToMenu}
        />

        {/* 4 Core Pillars */}
        <TrustBadges />

        {/* SIGNATURE CORE FEATURE: Build Your Own Plate */}
        <BuildPlateSection
          menuItems={menuItems}
          plateItems={plateItems}
          onAddToPlate={handleAddToPlate}
          onRemoveFromPlate={handleRemoveFromPlate}
          onClearPlate={handleClearPlate}
          quantity={quantity}
          onSetQuantity={setQuantity}
          discountRules={discountRules}
          dietaryPreference={dietaryPreference}
          onOpenEnquiryModal={() => setIsEnquiryModalOpen(true)}
          onOpenItemDetail={(item) => setDetailItem(item)}
          isMobileDrawerOpen={isMobileDrawerOpen}
          onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
        />

        {/* Complete Menu Section */}
        <MenuSection
          menuItems={menuItems}
          onAddToPlate={handleAddToPlate}
          onRemoveFromPlate={handleRemoveFromPlate}
          isItemInPlate={(id) => plateItems.some((p) => p.foodItem.id === id)}
          onOpenItemDetail={(item) => setDetailItem(item)}
          dietaryPreference={dietaryPreference}
        />

        {/* Volume Offers & Simulator */}
        <OffersSection
          discountRules={discountRules}
          onSelectPlates={(qty) => {
            setQuantity(qty);
            scrollToBuildPlate();
          }}
        />

        {/* Event Types Showcase */}
        <EventTypesSection />

        {/* How It Works */}
        <HowItWorksSection />

        {/* About Feastiva & Founder Rajiv kr */}
        <AboutSection />
      </main>

      {/* Luxury Footer */}
      <Footer />

      {/* Mobile Floating Plate Bar */}
      <div className="lg:hidden fixed bottom-4 inset-x-4 z-40">
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm shadow-gold-glow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4" />
            <span>My Catering Plate ({plateItems.length} items)</span>
          </div>
          <div className="font-mono text-base font-black">
            {formatINR(currentPricing.finalTotal)}
          </div>
        </button>
      </div>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        isInPlate={detailItem ? plateItems.some((p) => p.foodItem.id === detailItem.id) : false}
        onAddToPlate={handleAddToPlate}
        onRemoveFromPlate={handleRemoveFromPlate}
      />

      {/* Event Booking / Quotation Modal */}
      <EventEnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        plateItems={plateItems}
        pricing={currentPricing}
        onSubmitEnquiry={handleSubmitEnquiry}
        currentUser={currentUser}
      />

      {/* User Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onLogin={(u) => setCurrentUser(u)}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        menuItems={menuItems}
        onUpdateMenuItem={handleUpdateMenuItem}
        onAddMenuItem={handleAddMenuItem}
        onDeleteMenuItem={handleDeleteMenuItem}
        discountRules={discountRules}
        onUpdateDiscountRule={handleUpdateDiscountRule}
        enquiries={enquiries}
        onUpdateEnquiryStatus={handleUpdateEnquiryStatus}
        onResetDefaults={handleResetDefaults}
      />

    </div>
  );
};
