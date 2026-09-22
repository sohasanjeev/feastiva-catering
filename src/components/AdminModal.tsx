import React, { useState } from 'react';
import { FoodItem, DiscountRule, CustomerEnquiry, CategoryId, DietaryType } from '../types';
import { CATEGORIES } from '../data/categories';
import { 
  X, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Trophy, 
  Inbox, 
  RotateCcw,
  Search,
  MessageCircle
} from 'lucide-react';
import { formatINR } from '../utils/pricing';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: FoodItem[];
  onUpdateMenuItem: (item: FoodItem) => void;
  onAddMenuItem: (item: FoodItem) => void;
  onDeleteMenuItem: (id: string) => void;
  discountRules: DiscountRule[];
  onUpdateDiscountRule: (rule: DiscountRule) => void;
  enquiries: CustomerEnquiry[];
  onUpdateEnquiryStatus: (id: string, status: CustomerEnquiry['status']) => void;
  onResetDefaults: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  onUpdateMenuItem,
  onAddMenuItem,
  onDeleteMenuItem,
  discountRules,
  onUpdateDiscountRule,
  enquiries,
  onUpdateEnquiryStatus,
  onResetDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'discounts' | 'enquiries'>('menu');
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItemModal, setNewItemModal] = useState(false);

  const [newItem, setNewItem] = useState<Partial<FoodItem>>({
    name: '',
    description: '',
    category: 'starters',
    price: 150,
    dietaryType: 'veg',
    available: true,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
  });

  if (!isOpen) return null;

  const filteredMenuItems = menuItems.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onUpdateMenuItem(editingItem);
      setEditingItem(null);
    }
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;

    const created: FoodItem = {
      id: `custom-${Date.now()}`,
      name: newItem.name,
      description: newItem.description || '',
      category: (newItem.category as CategoryId) || 'starters',
      price: Number(newItem.price),
      image: newItem.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
      dietaryType: (newItem.dietaryType as DietaryType) || 'veg',
      available: newItem.available ?? true,
    };

    onAddMenuItem(created);
    setNewItemModal(false);
    setNewItem({
      name: '',
      description: '',
      category: 'starters',
      price: 150,
      dietaryType: 'veg',
      available: true,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl my-6 rounded-3xl bg-[#121217] border border-amber-500/40 shadow-2xl overflow-hidden text-stone-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#1c120c] via-[#24160d] to-[#1a0f0d] border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-white">
                Festiva Catering Admin Panel
              </h3>
              <p className="text-xs text-amber-400/80">
                Menu Management • Volume Discounts • Customer Inquiries
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-900 text-stone-400 hover:text-white border border-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-3 bg-[#16161c] border-b border-stone-800 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === 'menu'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Menu & Prices ({menuItems.length})
          </button>

          <button
            onClick={() => setActiveTab('discounts')}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === 'discounts'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Volume Discount Slabs</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === 'enquiries'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Enquiries & Leads ({enquiries.length})</span>
          </button>

          <div className="ml-auto">
            <button
              onClick={() => {
                if (confirm('Reset all menu prices and discount slabs back to default brochure data?')) {
                  onResetDefaults();
                }
              }}
              className="text-[11px] text-stone-500 hover:text-red-400 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Defaults
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* MENU TAB */}
          {activeTab === 'menu' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter menu items..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <button
                  onClick={() => setNewItemModal(true)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-gold-glow"
                >
                  <Plus className="w-4 h-4" />
                  Add New Food Item
                </button>
              </div>

              {/* Items Table */}
              <div className="border border-stone-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-300">
                    <thead className="bg-[#191922] text-stone-400 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Item</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Dietary</th>
                        <th className="p-3">Price / Plate</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/80 bg-[#131318]">
                      {filteredMenuItems.map((item) => (
                        <tr key={item.id} className="hover:bg-stone-900/50">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-9 h-9 rounded-lg object-cover bg-stone-950"
                              />
                              <div>
                                <p className="font-semibold text-white">{item.name}</p>
                                <p className="text-[10px] text-stone-400 line-clamp-1">{item.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 uppercase text-[10px] text-stone-400">
                            {item.category.replace('-', ' ')}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                item.dietaryType === 'veg'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              }`}
                            >
                              {item.dietaryType}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-amber-400">
                            ₹{item.price}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => onUpdateMenuItem({ ...item, available: !item.available })}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                item.available
                                  ? 'bg-emerald-950/60 text-emerald-400'
                                  : 'bg-stone-800 text-stone-500'
                              }`}
                            >
                              {item.available ? 'In Stock' : 'Unavailable'}
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingItem(item)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-amber-300 hover:bg-stone-800"
                                title="Edit item"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete ${item.name} from menu?`)) {
                                    onDeleteMenuItem(item.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-red-500/10"
                                title="Delete item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* DISCOUNTS TAB */}
          {activeTab === 'discounts' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 text-xs text-stone-300">
                Configure automatic quantity-based discounts applied on the customer's overall bill. Changes sync live with the Plate Builder!
              </div>

              <div className="space-y-3">
                {discountRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-4 rounded-2xl bg-[#15151c] border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-white text-sm">
                          {rule.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rule.active ? 'bg-emerald-950 text-emerald-300' : 'bg-stone-800 text-stone-500'
                        }`}>
                          {rule.active ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 font-mono">
                        Range: {rule.minQuantity} – {rule.maxQuantity >= 9000 ? 'Any higher' : rule.maxQuantity} Plates
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <label className="text-xs text-stone-400">Discount %:</label>
                        <input
                          type="number"
                          min={0}
                          max={50}
                          value={rule.discountPercentage}
                          onChange={(e) =>
                            onUpdateDiscountRule({
                              ...rule,
                              discountPercentage: Math.max(0, parseInt(e.target.value) || 0),
                            })
                          }
                          className="w-16 px-2 py-1 text-center font-mono font-bold rounded-lg bg-stone-900 border border-stone-700 text-amber-300 text-xs"
                        />
                      </div>

                      <button
                        onClick={() => onUpdateDiscountRule({ ...rule, active: !rule.active })}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          rule.active
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        {rule.active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ENQUIRIES TAB */}
          {activeTab === 'enquiries' && (
            <div className="space-y-4">
              {enquiries.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#141419] border border-stone-800 text-stone-400 space-y-2">
                  <Inbox className="w-8 h-8 text-stone-600 mx-auto" />
                  <p className="text-sm font-medium text-stone-300">No catering enquiries submitted yet</p>
                  <p className="text-xs text-stone-500">
                    When visitors request a quote from the 'Build Your Plate' section, their full event specs will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="p-5 rounded-2xl bg-[#141419] border border-amber-500/20 space-y-4 shadow-lg"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-stone-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-base text-white">
                              {enq.customerName}
                            </span>
                            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              {enq.id}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400">
                            {enq.eventType} • {enq.guestCount} Plates • Date: {enq.eventDate || 'TBD'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-xs text-stone-400">Status:</label>
                          <select
                            value={enq.status}
                            onChange={(e) => onUpdateEnquiryStatus(enq.id, e.target.value as any)}
                            className="px-3 py-1 rounded-lg bg-stone-900 border border-stone-700 text-xs text-amber-300 font-semibold focus:outline-none"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Quote Sent">Quote Sent</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-300">
                        <div>
                          <p className="text-stone-500 text-[10px] uppercase">Phone & WhatsApp</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <a href={`tel:${enq.phone}`} className="hover:text-amber-300 font-mono">
                              {enq.phone}
                            </a>
                            <a
                              href={`https://wa.me/${enq.whatsapp.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:text-emerald-300"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>

                        <div>
                          <p className="text-stone-500 text-[10px] uppercase">Venue & Time</p>
                          <p className="mt-0.5 truncate">{enq.venue} ({enq.eventTime})</p>
                        </div>

                        <div>
                          <p className="text-stone-500 text-[10px] uppercase">Estimated Proposal</p>
                          <p className="mt-0.5 font-mono font-bold text-amber-400 text-sm">
                            {formatINR(enq.pricing.finalTotal)} ({enq.pricing.discountPercentage}% discount)
                          </p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-stone-950 border border-stone-800/80 space-y-1 text-xs">
                        <p className="text-stone-400 text-[10px] uppercase font-semibold">
                          Selected Menu ({enq.selectedItems.length} dishes):
                        </p>
                        <p className="text-stone-300 leading-relaxed">
                          {enq.selectedItems.map((i) => i.foodItem.name).join(', ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* EDIT ITEM SUB-MODAL */}
        {editingItem && (
          <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <form onSubmit={handleSaveEdit} className="w-full max-w-md bg-[#16161d] border border-amber-500/40 rounded-2xl p-5 space-y-4 text-xs">
              <h4 className="text-sm font-serif font-bold text-white">Edit Food Item</h4>

              <div>
                <label className="text-stone-400 block mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-400 block mb-1">Price / Plate (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-amber-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-stone-400 block mb-1">Dietary</label>
                  <select
                    value={editingItem.dietaryType}
                    onChange={(e) => setEditingItem({ ...editingItem, dietaryType: e.target.value as DietaryType })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-100"
                  >
                    <option value="veg">Pure Veg</option>
                    <option value="non-veg">Non-Veg</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-lg text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 text-stone-950 font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ADD NEW ITEM SUB-MODAL */}
        {newItemModal && (
          <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <form onSubmit={handleCreateNewItem} className="w-full max-w-md bg-[#16161d] border border-amber-500/40 rounded-2xl p-5 space-y-4 text-xs">
              <h4 className="text-sm font-serif font-bold text-white">Add New Food Item</h4>

              <div>
                <label className="text-stone-400 block mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Saffron Rasmalai"
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-400 block mb-1">Price / Plate (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-amber-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-stone-400 block mb-1">Dietary</label>
                  <select
                    value={newItem.dietaryType}
                    onChange={(e) => setNewItem({ ...newItem, dietaryType: e.target.value as DietaryType })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-100"
                  >
                    <option value="veg">Pure Veg</option>
                    <option value="non-veg">Non-Veg</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Course / Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value as CategoryId })}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-100"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Appetizing description..."
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 resize-none"
                />
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Image URL</label>
                <input
                  type="url"
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewItemModal(false)}
                  className="px-4 py-2 rounded-lg text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 text-stone-950 font-bold"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
