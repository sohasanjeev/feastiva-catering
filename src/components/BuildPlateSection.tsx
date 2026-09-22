import React, { useState, useMemo } from 'react';
import { 
  FoodItem, 
  PlateItem, 
  CategoryId, 
  DietaryType, 
  DiscountRule, 
  PricingBreakdown 
} from '../types';
import { CATEGORIES } from '../data/categories';
import { calculatePricing, formatINR } from '../utils/pricing';
import { PlateVisualizer } from './PlateVisualizer';
import { DiscountProgressBar } from './DiscountProgressBar';
import { 
  Plus, 
  Minus, 
  Search, 
  SlidersHorizontal, 
  UtensilsCrossed, 
  Send, 
  MessageCircle, 
  Trash2, 
  Sparkles, 
  Info,
  Check,
  ChevronRight
} from 'lucide-react';

interface BuildPlateSectionProps {
  menuItems: FoodItem[];
  plateItems: PlateItem[];
  onAddToPlate: (item: FoodItem) => void;
  onRemoveFromPlate: (id: string) => void;
  onClearPlate: () => void;
  quantity: number;
  onSetQuantity: (qty: number) => void;
  discountRules: DiscountRule[];
  dietaryPreference: DietaryType | 'all';
  onOpenEnquiryModal: () => void;
  onOpenItemDetail: (item: FoodItem) => void;
  isMobileDrawerOpen: boolean;
  onCloseMobileDrawer: () => void;
}

export const BuildPlateSection: React.FC<BuildPlateSectionProps> = ({
  menuItems,
  plateItems,
  onAddToPlate,
  onRemoveFromPlate,
  onClearPlate,
  quantity,
  onSetQuantity,
  discountRules,
  dietaryPreference,
  onOpenEnquiryModal,
  onOpenItemDetail,
  isMobileDrawerOpen,
  onCloseMobileDrawer,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [localDietaryFilter, setLocalDietaryFilter] = useState<DietaryType | 'all'>(dietaryPreference);

  // Sync local dietary filter if global changes
  React.useEffect(() => {
    setLocalDietaryFilter(dietaryPreference);
  }, [dietaryPreference]);

  // Calculate pricing breakdown in real-time
  const pricing: PricingBreakdown = useMemo(() => {
    return calculatePricing(plateItems, quantity, discountRules);
  }, [plateItems, quantity, discountRules]);

  // Filter menu items based on category, search and dietary
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Global dietary mode
      if (localDietaryFilter !== 'all' && item.dietaryType !== localDietaryFilter) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [menuItems, localDietaryFilter, selectedCategory, searchQuery]);

  // Check if an item is already added to plate
  const isItemInPlate = (itemId: string) => {
    return plateItems.some((p) => p.foodItem.id === itemId);
  };

  const quickQuantities = [10, 25, 50, 75, 100, 150, 200, 500];

  return (
    <section id="build-plate" className="relative py-16 bg-[#0c0c0f] border-t border-b border-amber-500/10">
      
      {/* Decorative ambient backdrop */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs uppercase tracking-widest font-serif font-bold">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            Signature Experience
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Build Your Own <span className="gold-gradient-text">Banquet Plate</span>
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Select items from across our curated courses, set your guest count, and see your customized per-plate bill and volume discounts update instantly.
          </p>
        </div>

        {/* MAIN SPLIT GRID: Left (Menu items selection) | Right (Fixed Plate summary & bill) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT MAIN AREA (Col 7/8) ================= */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            
            {/* Search & Dietary Bar */}
            <div className="p-4 rounded-2xl bg-[#141419] border border-amber-500/20 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                
                {/* Search input */}
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dishes (e.g. Butter Naan, Paneer...)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-200 text-xs placeholder:text-stone-500 focus:outline-none focus:border-amber-500/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Dietary Filter Segmented Switch */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-900 border border-stone-800 w-full sm:w-auto justify-center">
                  <button
                    onClick={() => setLocalDietaryFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      localDietaryFilter === 'all'
                        ? 'bg-amber-500 text-stone-950 shadow-sm'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    All Items
                  </button>
                  <button
                    onClick={() => setLocalDietaryFilter('veg')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      localDietaryFilter === 'veg'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-emerald-400 hover:text-emerald-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-300" />
                    Pure Veg
                  </button>
                  <button
                    onClick={() => setLocalDietaryFilter('non-veg')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      localDietaryFilter === 'non-veg'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-rose-400 hover:text-rose-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-300" />
                    Non-Veg
                  </button>
                </div>

              </div>

              {/* Category Horizontal Pills Scroll */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-gold-glow'
                      : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200'
                  }`}
                >
                  All Courses ({filteredItems.length})
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-gold-glow'
                        : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredItems.map((item) => {
                const added = isItemInPlate(item.id);

                return (
                  <div
                    key={item.id}
                    className={`group relative rounded-2xl bg-[#141419] border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                      added
                        ? 'border-amber-500/60 shadow-gold-glow'
                        : 'border-stone-800/80 hover:border-amber-500/30 hover:bg-[#181820]'
                    }`}
                  >
                    {/* Image Area */}
                    <div 
                      className="relative h-44 overflow-hidden cursor-pointer"
                      onClick={() => onOpenItemDetail(item)}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141419] via-transparent to-black/20" />

                      {/* Dietary Dot Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shadow-md ${
                            item.dietaryType === 'veg'
                              ? 'bg-stone-950/90 border-emerald-500 text-emerald-400'
                              : 'bg-stone-950/90 border-rose-500 text-rose-400'
                          }`}
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              item.dietaryType === 'veg' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                        </span>
                      </div>

                      {/* Tags: Chef special / popular */}
                      <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                        {item.isChefSpecial && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-stone-950 shadow-md">
                            Special
                          </span>
                        )}
                        {item.isPopular && !item.isChefSpecial && (
                          <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-stone-900/90 text-amber-300 border border-amber-500/30">
                            Popular
                          </span>
                        )}
                      </div>

                      {/* Price badge over image */}
                      <div className="absolute bottom-2.5 right-3 bg-stone-950/90 px-2.5 py-1 rounded-lg border border-amber-500/30">
                        <span className="text-xs font-mono font-bold text-amber-300">
                          ₹{item.price}
                        </span>
                        <span className="text-[10px] text-stone-400"> / plate</span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 
                          onClick={() => onOpenItemDetail(item)}
                          className="text-sm font-serif font-bold text-white group-hover:text-amber-300 transition-colors cursor-pointer"
                        >
                          {item.name}
                        </h4>
                        <p className="text-xs text-stone-400 line-clamp-2 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-800/60">
                        <button
                          onClick={() => onOpenItemDetail(item)}
                          className="text-[11px] text-stone-400 hover:text-amber-300 transition-colors"
                        >
                          Details
                        </button>

                        {added ? (
                          <button
                            onClick={() => onRemoveFromPlate(item.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500 text-amber-300 text-xs font-bold hover:bg-red-500/20 hover:border-red-500 hover:text-red-400 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>In Plate</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onAddToPlate(item)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-transform hover:scale-105 active:scale-95 shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-[#141419] border border-stone-800 text-stone-400 space-y-2">
                <UtensilsCrossed className="w-8 h-8 text-stone-600 mx-auto" />
                <p className="text-sm font-medium text-stone-300">No food items found matching your criteria</p>
                <p className="text-xs text-stone-500">Try changing your search term or switching the Pure Veg filter.</p>
              </div>
            )}

          </div>


          {/* ================= RIGHT FIXED / STICKY PANEL (Col 5/4) ================= */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28 space-y-6">
            
            <div className="rounded-3xl bg-[#131317] border border-amber-500/30 p-5 sm:p-6 shadow-2xl space-y-6">
              
              {/* Box Title */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-white text-base">
                      My Catering Plate
                    </h3>
                    <p className="text-[10px] text-stone-400">
                      {plateItems.length} items configured
                    </p>
                  </div>
                </div>

                {plateItems.length > 0 && (
                  <button
                    onClick={onClearPlate}
                    className="text-[11px] text-stone-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Plate Visual Representation */}
              <PlateVisualizer
                items={plateItems}
                onRemoveItem={onRemoveFromPlate}
                onClearPlate={onClearPlate}
              />

              {/* QUANTITY SELECTOR (Plate Count) */}
              <div className="space-y-3 pt-2 border-t border-stone-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider text-amber-300 font-serif font-bold">
                    Event Guests / Plates Required
                  </label>
                  <span className="text-xs font-mono text-stone-400">
                    {quantity} Plates
                  </span>
                </div>

                {/* Plus / Minus Counter with manual input */}
                <div className="flex items-center justify-between gap-3 p-1.5 rounded-2xl bg-stone-900 border border-stone-800">
                  <button
                    onClick={() => onSetQuantity(Math.max(10, quantity - 5))}
                    className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-200 flex items-center justify-center font-bold text-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex items-baseline justify-center gap-1.5">
                    <input
                      type="number"
                      min={10}
                      max={10000}
                      value={quantity}
                      onChange={(e) => onSetQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-20 text-center text-xl font-bold font-mono text-white bg-transparent focus:outline-none"
                    />
                    <span className="text-xs text-stone-400 uppercase font-medium">Plates</span>
                  </div>

                  <button
                    onClick={() => onSetQuantity(quantity + 5)}
                    className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-200 flex items-center justify-center font-bold text-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick select buttons */}
                <div className="grid grid-cols-4 gap-1.5">
                  {quickQuantities.map((q) => (
                    <button
                      key={q}
                      onClick={() => onSetQuantity(q)}
                      className={`py-1 rounded-lg text-xs font-semibold transition-colors ${
                        quantity === q
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'bg-stone-900 text-stone-400 border border-stone-800 hover:border-amber-500/40 hover:text-stone-200'
                      }`}
                    >
                      {q}+
                    </button>
                  ))}
                </div>
              </div>

              {/* SMART DISCOUNT PROGRESS BAR */}
              <DiscountProgressBar
                quantity={quantity}
                discountPercentage={pricing.discountPercentage}
                nextTier={pricing.nextTier}
                onSetQuantity={onSetQuantity}
              />

              {/* DETAILED PRICE BREAKDOWN */}
              <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-stone-400">
                  <span>Base Price / Plate</span>
                  <span className="font-mono text-stone-200 font-semibold">
                    {formatINR(pricing.basePricePerPlate)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-stone-400">
                  <span>Plates Count</span>
                  <span className="font-mono text-stone-200">
                    × {pricing.quantity}
                  </span>
                </div>

                <div className="flex items-center justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-stone-200">
                    {formatINR(pricing.subtotal)}
                  </span>
                </div>

                {pricing.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-400 font-medium">
                    <span>Bulk Discount ({pricing.discountPercentage}%)</span>
                    <span className="font-mono">
                      -{formatINR(pricing.discountAmount)}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-800 flex items-baseline justify-between">
                  <div>
                    <span className="text-stone-400 text-xs block">Final Price / Plate</span>
                    <span className="text-sm font-serif font-bold text-amber-300">
                      {formatINR(pricing.finalPricePerPlate)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Estimated Total</span>
                    <span className="text-xl sm:text-2xl font-bold font-mono text-white gold-gradient-text">
                      {formatINR(pricing.finalTotal)}
                    </span>
                  </div>
                </div>

                {pricing.savings > 0 && (
                  <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-center text-emerald-300 font-semibold text-[11px]">
                    🎉 You save {formatINR(pricing.savings)} with our {pricing.discountPercentage}% volume discount!
                  </div>
                )}
              </div>

              {/* ESTIMATE VS PAYMENT DISCLAIMER */}
              <div className="flex items-start gap-2 text-[11px] text-stone-400 leading-snug">
                <Info className="w-4 h-4 text-amber-400/80 flex-shrink-0 mt-0.5" />
                <p>
                  This is an estimated catering price. Final pricing may vary based on exact event requirements, venue setup, and service staff.
                </p>
              </div>

              {/* ACTION CTAs */}
              <div className="space-y-2.5 pt-1">
                <button
                  disabled={plateItems.length === 0}
                  onClick={onOpenEnquiryModal}
                  className={`w-full py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-gold-glow ${
                    plateItems.length === 0
                      ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Request Catering Quote</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <a
                  href={`https://wa.me/919234076376?text=${encodeURIComponent(
                    `Hello Rajiv kr (Feastiva Catering), I built a custom catering plate for ${quantity} plates. Estimated total: ${formatINR(pricing.finalTotal)}. Let's discuss!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-full border border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Direct WhatsApp Enquiry (+91 9234076376)</span>
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* MOBILE BOTTOM SHEET / FLOATING DRAWER */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-[#141419] border-t border-amber-500/40 p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif font-bold text-white text-base">
                  My Plate Summary ({plateItems.length} items)
                </h3>
              </div>
              <button
                onClick={onCloseMobileDrawer}
                className="p-1 text-stone-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <PlateVisualizer
              items={plateItems}
              onRemoveItem={onRemoveFromPlate}
              onClearPlate={onClearPlate}
            />

            {/* Quantity Controls in Drawer */}
            <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-stone-900">
              <span className="text-xs text-stone-300">Plates:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSetQuantity(Math.max(10, quantity - 10))}
                  className="w-8 h-8 rounded-lg bg-stone-800 text-stone-200 font-bold"
                >
                  -
                </button>
                <span className="font-mono font-bold text-amber-300 px-2">{quantity}</span>
                <button
                  onClick={() => onSetQuantity(quantity + 10)}
                  className="w-8 h-8 rounded-lg bg-stone-800 text-stone-200 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-400">Total Plates:</span>
                <span className="font-mono text-stone-200">{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Discount Applied:</span>
                <span className="font-mono text-emerald-400">{pricing.discountPercentage}%</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-stone-800">
                <span className="text-white">Estimated Total:</span>
                <span className="font-mono text-amber-400">{formatINR(pricing.finalTotal)}</span>
              </div>
            </div>

            <button
              disabled={plateItems.length === 0}
              onClick={() => {
                onCloseMobileDrawer();
                onOpenEnquiryModal();
              }}
              className="w-full py-3.5 rounded-full bg-amber-500 text-stone-950 font-bold text-sm shadow-gold-glow"
            >
              Request Quote ({formatINR(pricing.finalTotal)})
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
