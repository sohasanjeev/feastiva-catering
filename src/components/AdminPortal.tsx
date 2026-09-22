import React, { useState, useMemo } from 'react';
import { FoodItem, PlateItem, DiscountRule, CustomerEnquiry, CategoryId, DietaryType } from '../types';
import { CATEGORIES } from '../data/categories';
import { 
  formatINR, 
  FESTIVA_PHONE, 
  FESTIVA_EMAIL, 
  FESTIVA_FOUNDER,
  FESTIVA_ADDRESS,
  DEFAULT_DISCOUNT_RULES 
} from '../utils/pricing';
import {
  UtensilsCrossed,
  Plus,
  Trash2,
  Edit3,
  Search,
  Check,
  X,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  Tag,
  Download,
  RotateCcw,
  Eye,
  Lock,
  LogOut,
  Sparkles,
  Layers,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface AdminPortalProps {
  menuItems: FoodItem[];
  onUpdateMenuItem: (item: FoodItem) => void;
  onAddMenuItem: (item: FoodItem) => void;
  onDeleteMenuItem: (id: string) => void;
  discountRules: DiscountRule[];
  onUpdateDiscountRule: (rule: DiscountRule) => void;
  enquiries: CustomerEnquiry[];
  onUpdateEnquiryStatus: (id: string, status: CustomerEnquiry['status']) => void;
  onResetDefaults: () => void;
  onBackToWebsite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  menuItems,
  onUpdateMenuItem,
  onAddMenuItem,
  onDeleteMenuItem,
  discountRules,
  onUpdateDiscountRule,
  enquiries,
  onUpdateEnquiryStatus,
  onResetDefaults,
  onBackToWebsite,
}) => {
  // Owner Authentication State (Stored in localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('feastiva_owner_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Portal Navigation Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'discounts' | 'enquiries' | 'settings'>('overview');

  // Menu Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  // Inline Price Editing state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // Full Item Edit Modal
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  // Add Item Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<FoodItem>>({
    name: '',
    description: '',
    category: 'starters',
    price: 180,
    dietaryType: 'veg',
    available: true,
    spiceLevel: 'medium',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
  });

  // Enquiries Filter
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>('all');

  // Owner Passcode Verification
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'feastiva2026' || passcode.trim() === '9234' || passcode.trim() === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('feastiva_owner_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Use: feastiva2026');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('feastiva_owner_auth');
  };

  // Inline Price Save
  const handleSavePrice = (item: FoodItem) => {
    if (tempPrice > 0) {
      onUpdateMenuItem({ ...item, price: tempPrice });
    }
    setEditingPriceId(null);
  };

  // Toggle Availability
  const handleToggleAvailability = (item: FoodItem) => {
    onUpdateMenuItem({ ...item, available: !item.available });
  };

  // Add Item Submit
  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;

    const created: FoodItem = {
      id: `custom-${Date.now()}`,
      name: newItem.name,
      description: newItem.description || '',
      category: (newItem.category as CategoryId) || 'starters',
      price: Number(newItem.price),
      dietaryType: (newItem.dietaryType as DietaryType) || 'veg',
      available: newItem.available ?? true,
      spiceLevel: (newItem.spiceLevel as any) || 'medium',
      image: newItem.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
    };

    onAddMenuItem(created);
    setIsAddModalOpen(false);
    setNewItem({
      name: '',
      description: '',
      category: 'starters',
      price: 180,
      dietaryType: 'veg',
      available: true,
      spiceLevel: 'medium',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
    });
  };

  // Full Edit Item Submit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onUpdateMenuItem(editingItem);
      setEditingItem(null);
    }
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const data = {
      exportDate: new Date().toISOString(),
      brand: 'Feastiva Catering Bangalore',
      founder: FESTIVA_FOUNDER,
      menuItems,
      discountRules,
      enquiries,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feastiva-catering-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered Menu Items
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesDietary = dietaryFilter === 'all' || item.dietaryType === dietaryFilter;
      return matchesSearch && matchesCategory && matchesDietary;
    });
  }, [menuItems, searchTerm, selectedCategory, dietaryFilter]);

  // Filtered Enquiries
  const filteredEnquiries = useMemo(() => {
    if (enquiryStatusFilter === 'all') return enquiries;
    return enquiries.filter((e) => e.status.toLowerCase() === enquiryStatusFilter.toLowerCase());
  }, [enquiries, enquiryStatusFilter]);

  // Overview KPI Metrics
  const totalPipelineRevenue = enquiries.reduce((sum, e) => sum + (e.pricing?.finalTotal || 0), 0);
  const totalVegItems = menuItems.filter((m) => m.dietaryType === 'veg').length;
  const totalNonVegItems = menuItems.filter((m) => m.dietaryType === 'non-veg').length;
  const pendingEnquiriesCount = enquiries.filter((e) => e.status === 'New' || e.status === 'Contacted').length;

  // 1. Passcode Gate if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08080c] text-stone-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#121217] border border-amber-500/40 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-gold-glow">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>

          <div>
            <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
              Feastiva Owner Portal
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Restricted management suite for <strong className="text-amber-300">{FESTIVA_FOUNDER}</strong>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                Owner Access Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter owner passcode"
                className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 focus:outline-none text-stone-100 text-sm font-mono tracking-widest"
                autoFocus
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Default Master Passcode: <span className="font-mono text-amber-400/90 font-bold">feastiva2026</span>
              </p>
            </div>

            {authError && (
              <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 p-2.5 rounded-xl text-center">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-gold-glow transition-all"
            >
              Sign In to Admin Dashboard
            </button>
          </form>

          <div className="pt-4 border-t border-stone-800/80">
            <button
              onClick={onBackToWebsite}
              className="text-xs text-stone-400 hover:text-amber-300 transition-colors flex items-center justify-center gap-1.5 mx-auto"
            >
              <Eye className="w-3.5 h-3.5" />
              Return to Customer Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Portal
  return (
    <div className="min-h-screen bg-[#09090d] text-stone-200 font-sans selection:bg-amber-500/20 selection:text-amber-200">
      
      {/* Top Owner Header */}
      <header className="sticky top-0 z-40 bg-[#0e0e14]/95 backdrop-blur-md border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand & Portal Label */}
          <div className="flex items-center gap-4">
            <img
              src="/assets/feastiva_official_logo.png"
              alt="Feastiva Catering"
              className="h-12 w-auto object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Owner Suite
                </span>
                <span className="text-xs text-stone-400 hidden sm:inline">• Bangalore Operations</span>
              </div>
              <h1 className="text-lg sm:text-xl font-serif font-bold text-white tracking-wide">
                Feastiva Control Hub
              </h1>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-700 hover:border-amber-500/50 text-stone-200 hover:text-amber-300 text-xs font-semibold transition-colors"
              title="Switch back to live catering customer site"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">View Live Website</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-stone-900/80 hover:bg-rose-950/40 text-stone-400 hover:text-rose-400 border border-stone-800 transition-colors"
              title="Logout from Owner Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5 border-t border-stone-800/60">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all flex-shrink-0 ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-gold-glow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Overview Dashboard
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all flex-shrink-0 ${
              activeTab === 'menu'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-gold-glow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            Menu & Price Manager ({menuItems.length})
          </button>

          <button
            onClick={() => setActiveTab('discounts')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all flex-shrink-0 ${
              activeTab === 'discounts'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-gold-glow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            Volume Discount Slabs ({discountRules.length})
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all flex-shrink-0 ${
              activeTab === 'enquiries'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-gold-glow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Customer Bookings & Leads ({enquiries.length})
            {pendingEnquiriesCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingEnquiriesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all flex-shrink-0 ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-gold-glow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Backup & Settings
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Welcome Banner */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1c140c] via-[#26190f] to-[#17110e] border border-amber-500/30 overflow-hidden shadow-2xl">
              <div className="relative z-10 max-w-2xl space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Live Storefront Connected
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Welcome, {FESTIVA_FOUNDER}
                </h2>
                <p className="text-xs sm:text-sm text-stone-300">
                  From this dashboard, you have full real-time control over food item prices, menu availability, volume discount percentages, and incoming customer catering bookings.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 top-0 w-80 opacity-10 pointer-events-none hidden md:block">
                <img src="/assets/feastiva_official_logo.png" alt="watermark" className="w-full h-full object-contain p-4" />
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              <div className="p-5 rounded-2xl bg-[#13131a] border border-stone-800 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-400 font-medium">Total Menu Items</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold font-serif text-white mt-2">{menuItems.length} Dishes</p>
                <p className="text-[11px] text-stone-500 mt-1">
                  {totalVegItems} Pure Veg • {totalNonVegItems} Non-Veg
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#13131a] border border-stone-800 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-400 font-medium">Customer Leads / Orders</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold font-serif text-white mt-2">{enquiries.length} Enquiries</p>
                <p className="text-[11px] text-amber-400 mt-1 font-medium">
                  {pendingEnquiriesCount} pending response
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#13131a] border border-stone-800 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-400 font-medium">Quotation Pipeline</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold font-serif text-amber-300 mt-2">
                  {formatINR(totalPipelineRevenue)}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  Cumulative requested quotes
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#13131a] border border-stone-800 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-400 font-medium">Bulk Discount Slabs</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Tag className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold font-serif text-white mt-2">{discountRules.length} Tiers</p>
                <p className="text-[11px] text-stone-500 mt-1">
                  5% to 20% Volume savings active
                </p>
              </div>

            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Recent Enquiries Preview */}
              <div className="p-6 rounded-3xl bg-[#121218] border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    Latest Customer Enquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    View All →
                  </button>
                </div>

                {enquiries.length === 0 ? (
                  <p className="text-xs text-stone-500 py-8 text-center">
                    No customer enquiries received yet. Quotes submitted on the customer site appear here.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {enquiries.slice(0, 3).map((enq) => (
                      <div key={enq.id} className="p-3.5 rounded-xl bg-stone-900/70 border border-stone-800/80 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-stone-200 text-xs">{enq.customerName}</p>
                          <p className="text-[11px] text-stone-400">{enq.eventType} • {enq.guestCount} Plates • {formatINR(enq.pricing.finalTotal)}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {enq.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Instant Controls Guide */}
              <div className="p-6 rounded-3xl bg-[#121218] border border-stone-800 space-y-4">
                <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Owner Controls Guide
                </h3>
                
                <div className="space-y-2.5 text-xs text-stone-300">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-900/60 border border-stone-800/60">
                    <Edit3 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Change Food Prices:</strong> Go to the Menu tab, click the price box, enter new ₹ amount, and click Save. Customers see the new rate instantly.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-900/60 border border-stone-800/60">
                    <Plus className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Add New Dishes:</strong> Click "Add New Food Item" to add special biryanis, sweets, or starters with custom photos and prices.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-900/60 border border-stone-800/60">
                    <Tag className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Tune Volume Discounts:</strong> Adjust discount slabs (50+, 100+, 200+, 500+ plates) anytime to run promotional discounts.
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. MENU & PRICE MANAGER TAB */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121218] border border-stone-800">
              
              {/* Search & Category Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search dishes..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Category Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Categories ({menuItems.length})</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* Dietary Filter */}
                <div className="flex items-center p-1 rounded-xl bg-stone-900 border border-stone-800 text-xs">
                  <button
                    onClick={() => setDietaryFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      dietaryFilter === 'all' ? 'bg-stone-800 text-white font-bold' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setDietaryFilter('veg')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      dietaryFilter === 'veg' ? 'bg-emerald-950 text-emerald-300 font-bold' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    🌱 Veg
                  </button>
                  <button
                    onClick={() => setDietaryFilter('non-veg')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      dietaryFilter === 'non-veg' ? 'bg-rose-950 text-rose-300 font-bold' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    🍗 Non-Veg
                  </button>
                </div>
              </div>

              {/* Add New Dish Button */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-gold-glow"
              >
                <Plus className="w-4 h-4" />
                Add New Food Item
              </button>
            </div>

            {/* Menu Items Table */}
            <div className="rounded-2xl border border-stone-800 bg-[#121218] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-[#171720] text-stone-400 uppercase tracking-wider text-[10px] border-b border-stone-800">
                    <tr>
                      <th className="p-4">Dish Details</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Dietary</th>
                      <th className="p-4">Price / Plate (₹)</th>
                      <th className="p-4">Availability</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {filteredMenuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-900/40 transition-colors">
                        
                        {/* Dish Details */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover bg-stone-900 border border-stone-800 flex-shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-white text-sm">{item.name}</p>
                              <p className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">{item.description}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-4">
                          <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">
                            {item.category.replace(/-/g, ' ')}
                          </span>
                        </td>

                        {/* Dietary */}
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              item.dietaryType === 'veg'
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                                : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                            }`}
                          >
                            {item.dietaryType === 'veg' ? '🌱 Pure Veg' : '🍗 Non-Veg'}
                          </span>
                        </td>

                        {/* Price (Inline Editable!) */}
                        <td className="p-4">
                          {editingPriceId === item.id ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-amber-400 font-bold">₹</span>
                              <input
                                type="number"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(Number(e.target.value))}
                                className="w-20 px-2 py-1 rounded-lg bg-stone-900 border border-amber-500 text-white font-mono font-bold text-xs focus:outline-none"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSavePrice(item);
                                  if (e.key === 'Escape') setEditingPriceId(null);
                                }}
                              />
                              <button
                                onClick={() => handleSavePrice(item)}
                                className="p-1 rounded-lg bg-amber-500 text-stone-950 hover:bg-amber-400"
                                title="Save Price"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingPriceId(null)}
                                className="p-1 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div 
                              onClick={() => {
                                setEditingPriceId(item.id);
                                setTempPrice(item.price);
                              }}
                              className="group inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-stone-900/80 border border-stone-800 hover:border-amber-500/60 cursor-pointer transition-colors"
                              title="Click to edit price directly"
                            >
                              <span className="font-mono font-bold text-amber-300 text-sm">
                                {formatINR(item.price)}
                              </span>
                              <Edit3 className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 transition-colors" />
                            </div>
                          )}
                        </td>

                        {/* Availability Toggle */}
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleAvailability(item)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                              item.available
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900'
                                : 'bg-stone-800 text-stone-400 border border-stone-700 hover:text-stone-200'
                            }`}
                          >
                            {item.available ? '✓ In Stock' : '✕ Sold Out'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-1.5 rounded-lg bg-stone-900 text-stone-400 hover:text-amber-300 hover:bg-stone-800 border border-stone-800 transition-colors"
                              title="Edit Full Dish Details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to remove "${item.name}" from the menu?`)) {
                                  onDeleteMenuItem(item.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-stone-900 text-stone-400 hover:text-rose-400 hover:bg-rose-950/30 border border-stone-800 transition-colors"
                              title="Delete Dish"
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

        {/* 3. VOLUME DISCOUNT SLABS TAB */}
        {activeTab === 'discounts' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#121218] border border-stone-800 space-y-2">
              <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-400" />
                Volume Discount Slabs Management
              </h2>
              <p className="text-xs text-stone-400">
                These volume discount rules are calculated automatically on every customer plate order. Updating the percentages or minimum guest slabs changes live pricing immediately.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discountRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-5 rounded-2xl bg-[#13131a] border border-stone-800 hover:border-amber-500/40 transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      {rule.label}
                    </span>
                    <button
                      onClick={() => onUpdateDiscountRule({ ...rule, active: !rule.active })}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rule.active
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {rule.active ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">
                        Plate Range Slabs:
                      </label>
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-200">
                        <span className="px-2 py-1 rounded bg-stone-900 border border-stone-800">
                          {rule.minQuantity} Plates
                        </span>
                        <span className="text-stone-500">to</span>
                        <span className="px-2 py-1 rounded bg-stone-900 border border-stone-800">
                          {rule.maxQuantity > 9000 ? '500+ Unlimited' : `${rule.maxQuantity} Plates`}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">
                        Discount Percentage (%):
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={rule.discountPercentage}
                          onChange={(e) =>
                            onUpdateDiscountRule({
                              ...rule,
                              discountPercentage: Number(e.target.value),
                            })
                          }
                          className="w-24 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 text-amber-300 font-mono font-bold text-sm"
                        />
                        <span className="text-xs text-stone-400">% OFF</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. CUSTOMER ENQUIRIES & ORDERS CRM TAB */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121218] border border-stone-800">
              <div>
                <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  Customer Inquiries & Catering Orders CRM
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Track client quotations, click to chat directly on WhatsApp, and update booking stages.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400">Status:</span>
                <select
                  value={enquiryStatusFilter}
                  onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Enquiries ({enquiries.length})</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {filteredEnquiries.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#121218] border border-stone-800 space-y-3">
                <Users className="w-10 h-10 text-stone-600 mx-auto" />
                <h3 className="text-base font-semibold text-stone-300">No Customer Enquiries Found</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  When customers design their plate on the customer website and submit an event quote or booking, they will appear right here with full contact details and dish lists.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEnquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="p-6 rounded-3xl bg-[#121218] border border-stone-800 hover:border-amber-500/30 transition-all space-y-4 shadow-lg"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-serif font-bold text-white">
                            {enquiry.customerName}
                          </h3>
                          <span className="text-xs font-mono text-stone-500">
                            #{enquiry.id}
                          </span>
                        </div>
                        <p className="text-xs text-amber-400/90 font-medium">
                          {enquiry.eventType} • {enquiry.guestCount} Plates • Total: {formatINR(enquiry.pricing.finalTotal)}
                        </p>
                      </div>

                      {/* Status Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-400">Stage:</span>
                        <select
                          value={enquiry.status}
                          onChange={(e) => onUpdateEnquiryStatus(enquiry.id, e.target.value as any)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold border focus:outline-none ${
                            enquiry.status === 'Confirmed'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                              : enquiry.status === 'New'
                              ? 'bg-amber-950 text-amber-300 border-amber-500'
                              : 'bg-stone-900 text-stone-300 border-stone-700'
                          }`}
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

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-stone-500 block mb-0.5">Phone & WhatsApp:</span>
                        <p className="font-mono text-stone-200">{enquiry.phone}</p>
                      </div>

                      <div>
                        <span className="text-stone-500 block mb-0.5">Event Date & Time:</span>
                        <p className="text-stone-200">{enquiry.eventDate || 'TBD'} ({enquiry.eventTime || 'Dinner'})</p>
                      </div>

                      <div>
                        <span className="text-stone-500 block mb-0.5">Venue Location:</span>
                        <p className="text-stone-200 line-clamp-1">{enquiry.venue || 'Bangalore'}</p>
                      </div>

                      <div>
                        <span className="text-stone-500 block mb-0.5">Price / Plate:</span>
                        <p className="text-amber-300 font-mono font-bold">
                          {formatINR(enquiry.pricing.finalPricePerPlate)} 
                          <span className="text-[10px] text-stone-400 font-normal ml-1">({enquiry.pricing.discountPercentage}% OFF)</span>
                        </p>
                      </div>
                    </div>

                    {/* Menu Items Breakdown */}
                    <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800/60">
                      <span className="text-[11px] text-stone-400 font-semibold block mb-1.5">
                        Selected Plate Menu ({enquiry.selectedItems.length} items):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {enquiry.selectedItems.map((pi) => (
                          <span
                            key={pi.foodItem.id}
                            className="px-2 py-0.5 rounded-md bg-stone-800 border border-stone-700 text-[11px] text-stone-300"
                          >
                            {pi.foodItem.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons: WhatsApp & Call */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <a
                        href={`https://wa.me/91${enquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${enquiry.customerName}, this is ${FESTIVA_FOUNDER} from Feastiva Catering Bangalore regarding your ${enquiry.eventType} catering enquiry (#${enquiry.id}) for ${enquiry.guestCount} plates. We would love to discuss your custom menu!`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Chat on WhatsApp
                      </a>

                      <a
                        href={`tel:+91${enquiry.phone}`}
                        className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 border border-stone-700"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                        Call Customer
                      </a>

                      {enquiry.email && (
                        <a
                          href={`mailto:${enquiry.email}?subject=Feastiva%20Catering%20Quotation%20-${enquiry.eventType}`}
                          className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 border border-stone-700"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-400" />
                          Email Quote
                        </a>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. BACKUP & SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            <div className="p-6 rounded-3xl bg-[#121218] border border-stone-800 space-y-4">
              <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-amber-400" />
                Data Backup & System Maintenance
              </h2>
              
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                  <h4 className="text-sm font-bold text-stone-200">Export Menu & CRM Data (JSON)</h4>
                  <p className="text-xs text-stone-400">
                    Download a secure local backup of your custom prices, newly added dishes, and customer bookings.
                  </p>
                  <button
                    onClick={handleExportBackup}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-gold-glow"
                  >
                    <Download className="w-4 h-4" />
                    Download Backup File
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-stone-900 border border-rose-900/30 space-y-2">
                  <h4 className="text-sm font-bold text-rose-300">Reset to Brochure Defaults</h4>
                  <p className="text-xs text-stone-400">
                    Resets all dishes and discount slabs back to the original 38+ items from Rajiv kr's official PDF brochures.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to reset all menu items and prices back to brochure defaults?')) {
                        onResetDefaults();
                        alert('Menu items and discount tiers reset to brochure defaults!');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 text-xs font-semibold flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restore Default Brochure Menu
                  </button>
                </div>
              </div>
            </div>

            {/* Official Brand Info Card */}
            <div className="p-6 rounded-3xl bg-[#121218] border border-stone-800 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">
                Official Business Credentials
              </h3>
              <div className="space-y-1.5 text-xs text-stone-300">
                <p><strong>Founder:</strong> {FESTIVA_FOUNDER}</p>
                <p><strong>Helpline:</strong> +91 {FESTIVA_PHONE}</p>
                <p><strong>Official Gmail:</strong> {FESTIVA_EMAIL}</p>
                <p><strong>HQ Address:</strong> {FESTIVA_ADDRESS}</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ADD NEW DISH MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#121217] border border-amber-500/40 shadow-2xl p-6 sm:p-8 space-y-5 text-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                Add New Dish to Feastiva Menu
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full bg-stone-900 text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={newItem.name || ''}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Malabar Fish Curry, Tawa Prawns"
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Category</label>
                  <select
                    value={newItem.category || 'starters'}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as CategoryId })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Dietary Type</label>
                  <select
                    value={newItem.dietaryType || 'veg'}
                    onChange={(e) => setNewItem({ ...newItem, dietaryType: e.target.value as DietaryType })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="veg">🌱 Pure Veg</option>
                    <option value="non-veg">🍗 Non-Veg</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Price / Plate (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newItem.price || ''}
                    onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                    placeholder="180"
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Spice Level</label>
                  <select
                    value={newItem.spiceLevel || 'medium'}
                    onChange={(e) => setNewItem({ ...newItem, spiceLevel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="mild">Mild</option>
                    <option value="medium">Medium</option>
                    <option value="spicy">Spicy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={newItem.image || ''}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newItem.description || ''}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Rich aromatic spices, slow-cooked royal delicacy..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-stone-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-gold-glow"
                >
                  Add Dish to Live Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL EDIT DISH MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#121217] border border-amber-500/40 shadow-2xl p-6 sm:p-8 space-y-5 text-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                Edit Dish: {editingItem.name}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-full bg-stone-900 text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as CategoryId })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Dietary Type</label>
                  <select
                    value={editingItem.dietaryType}
                    onChange={(e) => setEditingItem({ ...editingItem, dietaryType: e.target.value as DietaryType })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="veg">🌱 Pure Veg</option>
                    <option value="non-veg">🍗 Non-Veg</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Price / Plate (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Spice Level</label>
                  <select
                    value={editingItem.spiceLevel || 'medium'}
                    onChange={(e) => setEditingItem({ ...editingItem, spiceLevel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="mild">Mild</option>
                    <option value="medium">Medium</option>
                    <option value="spicy">Spicy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingItem.image}
                  onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-stone-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-gold-glow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
