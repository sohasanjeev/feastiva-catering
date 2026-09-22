import React, { useState, useMemo } from 'react';
import { FoodItem, CategoryId, DietaryType } from '../types';
import { CATEGORIES } from '../data/categories';
import { Search, Plus, Check, Flame, Sparkles } from 'lucide-react';

interface MenuSectionProps {
  menuItems: FoodItem[];
  onAddToPlate: (item: FoodItem) => void;
  onRemoveFromPlate: (id: string) => void;
  isItemInPlate: (id: string) => boolean;
  onOpenItemDetail: (item: FoodItem) => void;
  dietaryPreference: DietaryType | 'all';
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  onAddToPlate,
  onRemoveFromPlate,
  isItemInPlate,
  onOpenItemDetail,
  dietaryPreference,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('starters');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Global dietary filter
      if (dietaryPreference !== 'all' && item.dietaryType !== dietaryPreference) {
        return false;
      }
      // Category
      if (item.category !== activeCategory) {
        return false;
      }
      // Search
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [menuItems, dietaryPreference, activeCategory, searchQuery]);

  return (
    <section id="menu" className="py-20 bg-[#09090c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-serif font-semibold">
            The Feastiva Culinary Collection
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            Explore Our <span className="gold-gradient-text">Complete Menu</span>
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            Every dish is prepared using slow-cooking traditions, cold-pressed oils, and royal spices. Click any item to view full ingredients and allergens.
          </p>
        </div>

        {/* Category Tabs Grid / Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2 no-scrollbar justify-start sm:justify-center">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-gold-glow font-bold'
                    : 'bg-stone-900/90 text-stone-400 border border-stone-800 hover:text-stone-200 hover:border-amber-500/30'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Category Description & Quick Search */}
        <div className="mt-8 mb-8 p-4 rounded-2xl bg-[#121216] border border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-white">
              {CATEGORIES.find((c) => c.id === activeCategory)?.name}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {CATEGORIES.find((c) => c.id === activeCategory)?.shortDesc}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in this course..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const added = isItemInPlate(item.id);

            return (
              <div
                key={item.id}
                className="group rounded-2xl bg-[#131317] border border-stone-800/80 hover:border-amber-500/40 transition-all p-4 flex gap-4 items-center justify-between overflow-hidden"
              >
                {/* Thumbnail */}
                <div 
                  className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer bg-stone-950"
                  onClick={() => onOpenItemDetail(item)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Dietary badge */}
                  <span
                    className={`absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-black ${
                      item.dietaryType === 'veg' ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-1.5">
                    <h4 
                      onClick={() => onOpenItemDetail(item)}
                      className="text-sm font-serif font-bold text-white group-hover:text-amber-300 transition-colors truncate cursor-pointer"
                    >
                      {item.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-stone-400 line-clamp-2 mt-1 leading-snug">
                    {item.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      ₹{item.price} <span className="text-[10px] text-stone-500 font-sans font-normal">/ plate</span>
                    </span>

                    {added ? (
                      <button
                        onClick={() => onRemoveFromPlate(item.id)}
                        className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 hover:bg-red-950/40 hover:border-red-500/50 hover:text-red-300 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        Added
                      </button>
                    ) : (
                      <button
                        onClick={() => onAddToPlate(item)}
                        className="px-3 py-1 rounded-full bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-amber-300 text-[11px] font-bold transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-[#141419] border border-stone-800 text-stone-400">
            <p className="text-sm">No items found in this category.</p>
          </div>
        )}

      </div>
    </section>
  );
};
