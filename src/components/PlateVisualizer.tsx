import React from 'react';
import { PlateItem } from '../types';
import { Utensils, X, Plus } from 'lucide-react';

interface PlateVisualizerProps {
  items: PlateItem[];
  onRemoveItem: (id: string) => void;
  onClearPlate: () => void;
}

export const PlateVisualizer: React.FC<PlateVisualizerProps> = ({
  items,
  onRemoveItem,
  onClearPlate,
}) => {
  if (items.length === 0) {
    return (
      <div className="relative p-8 rounded-3xl bg-[#131318] border border-dashed border-amber-500/30 text-center flex flex-col items-center justify-center min-h-[260px] space-y-3">
        {/* Empty plate illustration */}
        <div className="w-28 h-28 rounded-full border-2 border-dashed border-amber-500/30 flex items-center justify-center bg-amber-500/5 shadow-inner">
          <Utensils className="w-10 h-10 text-amber-500/40 animate-pulse" />
        </div>
        <div>
          <h4 className="text-base font-serif font-bold text-white">Your Royal Banquet Plate is Empty</h4>
          <p className="text-xs text-stone-400 max-w-xs mt-1">
            Pick your favorite starters, rich gravies, tandoor naans, biryanis & sweets from the menu to fill your platter.
          </p>
        </div>
      </div>
    );
  }

  // Calculate course diversity
  const coursesPresent = new Set(items.map((i) => i.foodItem.category));

  return (
    <div className="space-y-4">
      {/* Enhanced Royal Thali Platter */}
      <div className="relative p-6 rounded-3xl bg-gradient-to-b from-[#181822] via-[#121217] to-[#0d0d10] border border-amber-500/40 shadow-2xl overflow-hidden">
        
        {/* Subtle ambient lighting inside thali */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Thali Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-serif font-bold text-amber-200 uppercase tracking-widest">
              Royal Banquet Platter
            </span>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold font-mono">
            {items.length} Delicacies Plated
          </span>
        </div>

        {/* The Luxury Brass Platter Graphic */}
        <div className="relative my-6 mx-auto w-64 h-64 sm:w-72 sm:h-72 rounded-full border-[6px] border-[#382f20] bg-gradient-to-tr from-[#0a0a0d] via-[#15151c] to-[#0a0a0d] shadow-[0_0_35px_rgba(212,175,55,0.2)] flex items-center justify-center p-4">
          
          {/* Concentric engraved gold rings */}
          <div className="absolute inset-1.5 rounded-full border border-amber-500/30 pointer-events-none" />
          <div className="absolute inset-3 rounded-full border border-dashed border-amber-500/20 pointer-events-none" />
          <div className="absolute inset-6 rounded-full border border-stone-800/80 pointer-events-none" />

          {/* Central Logo Medallion */}
          <div className="z-10 w-20 h-20 rounded-full bg-gradient-to-b from-stone-900 via-black to-stone-950 border-2 border-amber-500/50 flex flex-col items-center justify-center text-center p-2 shadow-gold-glow">
            <img 
              src="/assets/feastiva_official_logo.png" 
              alt="Feastiva Logo" 
              className="w-14 h-14 object-contain" 
            />
          </div>

          {/* Arranged Katoris (Bowls) in circular formation */}
          {items.slice(0, 8).map((item, index) => {
            const total = Math.min(items.length, 8);
            const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
            const radius = 94; // radius in px
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <div
                key={item.foodItem.id}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
                className="absolute z-20 group"
              >
                {/* Katori Bowl Container */}
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-[0_4px_12px_rgba(0,0,0,0.8)] bg-stone-950 group-hover:scale-125 transition-transform duration-300">
                  <img
                    src={item.foodItem.image}
                    alt={item.foodItem.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />

                  {/* Dietary indicator dot */}
                  <span
                    className={`absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-black shadow ${
                      item.foodItem.dietaryType === 'veg' ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                  />

                  {/* Hover Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveItem(item.foodItem.id);
                    }}
                    className="absolute inset-0 bg-black/75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-400"
                    title="Remove from plate"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-950/95 border border-amber-500/40 text-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md z-30">
                  {item.foodItem.name} (₹{item.foodItem.price})
                </div>
              </div>
            );
          })}
        </div>

        {/* Variety Tracker */}
        <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-800">
          <span>{coursesPresent.size} Distinct Courses Chosen</span>
          <span className="text-amber-400 font-medium">Bespoke Guest Experience</span>
        </div>
      </div>

      {/* Item List with instant removal */}
      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={item.foodItem.id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/70 border border-stone-800/80 hover:border-amber-500/40 transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  item.foodItem.dietaryType === 'veg' ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />
              <div className="truncate">
                <p className="text-xs font-semibold text-stone-200 truncate group-hover:text-amber-300 transition-colors">
                  {item.foodItem.name}
                </p>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">
                  {item.foodItem.category.replace('-', ' ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs font-mono font-bold text-amber-400">
                ₹{item.foodItem.price}
              </span>
              <button
                onClick={() => onRemoveItem(item.foodItem.id)}
                className="p-1 rounded text-stone-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Remove item"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
