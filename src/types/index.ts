export type DietaryType = 'veg' | 'non-veg';

export type CategoryId = 
  | 'welcome-drinks'
  | 'soups'
  | 'starters'
  | 'main-curries'
  | 'tandoor-breads'
  | 'rice-biryani'
  | 'chaats-counters'
  | 'accompaniments'
  | 'desserts-kulfi';

export interface Category {
  id: CategoryId;
  name: string;
  shortDesc: string;
  icon: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  category: CategoryId;
  price: number;
  image: string;
  dietaryType: DietaryType;
  available: boolean;
  ingredients?: string[];
  allergens?: string[];
  spiceLevel?: 'mild' | 'medium' | 'spicy';
  isPopular?: boolean;
  isChefSpecial?: boolean;
}

export interface PlateItem {
  foodItem: FoodItem;
  quantityPerPlate: number;
}

export interface DiscountRule {
  id: string;
  minQuantity: number;
  maxQuantity: number;
  discountPercentage: number;
  label: string;
  active: boolean;
}

export interface NextDiscountTier {
  requiredPlates: number;
  nextDiscount: number;
  morePlatesNeeded: number;
  potentialSavings: number;
}

export interface PricingBreakdown {
  basePricePerPlate: number;
  quantity: number;
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  finalPricePerPlate: number;
  finalTotal: number;
  savings: number;
  nextTier?: NextDiscountTier;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  isLoggedIn: boolean;
}

export type OrderType = 'quote_request' | 'confirmed_booking';

export type PaymentMethod = 'advance_deposit_25' | 'pay_on_event' | 'upi_transfer' | 'bank_neft';

export interface CustomerEnquiry {
  id: string;
  orderType: OrderType;
  customerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  venue: string;
  specialInstructions: string;
  spicePreference: 'mild' | 'medium' | 'spicy';
  breadPreference: string;
  ricePreference: string;
  selectedItems: PlateItem[];
  pricing: PricingBreakdown;
  paymentMethod?: PaymentMethod;
  status: 'New' | 'Contacted' | 'Quote Sent' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}
