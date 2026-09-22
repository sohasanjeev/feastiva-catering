import { PlateItem, DiscountRule, PricingBreakdown, NextDiscountTier, CustomerEnquiry } from '../types';

export const DEFAULT_DISCOUNT_RULES: DiscountRule[] = [
  {
    id: 'tier-1',
    minQuantity: 1,
    maxQuantity: 49,
    discountPercentage: 0,
    label: 'Standard Catering',
    active: true,
  },
  {
    id: 'tier-2',
    minQuantity: 50,
    maxQuantity: 99,
    discountPercentage: 5,
    label: '5% Bulk Savings',
    active: true,
  },
  {
    id: 'tier-3',
    minQuantity: 100,
    maxQuantity: 199,
    discountPercentage: 10,
    label: '10% Celebration Tier',
    active: true,
  },
  {
    id: 'tier-4',
    minQuantity: 200,
    maxQuantity: 499,
    discountPercentage: 15,
    label: '15% Grand Event Savings',
    active: true,
  },
  {
    id: 'tier-5',
    minQuantity: 500,
    maxQuantity: 99999,
    discountPercentage: 20,
    label: '20% Mega Celebration / VIP',
    active: true,
  },
];

export function calculatePricing(
  items: PlateItem[],
  quantity: number,
  rules: DiscountRule[] = DEFAULT_DISCOUNT_RULES
): PricingBreakdown {
  const safeQty = Math.max(0, quantity);

  // Base price per plate = sum of item prices in plate
  const basePricePerPlate = items.reduce(
    (sum, item) => sum + item.foodItem.price * item.quantityPerPlate,
    0
  );

  const subtotal = Math.round(basePricePerPlate * safeQty);

  // Find applicable discount
  const activeRules = rules.filter((r) => r.active).sort((a, b) => a.minQuantity - b.minQuantity);
  
  let discountPercentage = 0;
  for (const rule of activeRules) {
    if (safeQty >= rule.minQuantity && safeQty <= rule.maxQuantity) {
      discountPercentage = rule.discountPercentage;
      break;
    }
  }

  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const finalTotal = subtotal - discountAmount;
  const finalPricePerPlate = safeQty > 0 ? Math.round(finalTotal / safeQty) : basePricePerPlate;
  const savings = discountAmount;

  // Find next tier if applicable
  let nextTier: NextDiscountTier | undefined;
  const higherTiers = activeRules.filter((r) => r.minQuantity > safeQty && r.discountPercentage > discountPercentage);
  
  if (higherTiers.length > 0 && safeQty > 0) {
    const next = higherTiers[0];
    const morePlatesNeeded = next.minQuantity - safeQty;
    const potentialSubtotal = basePricePerPlate * next.minQuantity;
    const potentialDiscount = Math.round((potentialSubtotal * next.discountPercentage) / 100);
    nextTier = {
      requiredPlates: next.minQuantity,
      nextDiscount: next.discountPercentage,
      morePlatesNeeded,
      potentialSavings: potentialDiscount,
    };
  }

  return {
    basePricePerPlate,
    quantity: safeQty,
    subtotal,
    discountPercentage,
    discountAmount,
    finalPricePerPlate,
    finalTotal,
    savings,
    nextTier,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const FESTIVA_PHONE = '9234076376';
export const FESTIVA_WHATSAPP_NUMBER = '919234076376';
export const FESTIVA_EMAIL = 'feastivaofficial@gmail.com';
export const FESTIVA_GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${FESTIVA_EMAIL}&su=Catering%20Enquiry%20-%20Feastiva%20Catering`;
export const FESTIVA_INSTAGRAM = '@feastivaofficial';
export const FESTIVA_ADDRESS = '#1 Chinnappa Plaza, Mother Theresa Road, Mariyannapaliya, Bangalore - 560024';
export const FESTIVA_FOUNDER = 'Rajiv kr';

export function generateWhatsAppLink(enquiry: CustomerEnquiry): string {
  const isOrder = enquiry.orderType === 'confirmed_booking';
  const header = isOrder ? '🚨 *NEW CATERING BOOKING CONFIRMED!*' : '🎉 *NEW CATERING ENQUIRY & QUOTE REQUEST*';

  const itemsSummary = enquiry.selectedItems
    .map((item) => `• ${item.foodItem.name} (₹${item.foodItem.price})`)
    .join('\n');

  const message = `${header}
*Feastiva Catering Bangalore*

*📋 Customer & Event Details:*
• *Reference ID:* ${enquiry.id}
• *Customer Name:* ${enquiry.customerName}
• *Phone:* ${enquiry.phone}
• *Email:* ${enquiry.email || 'N/A'}
• *Event Type:* ${enquiry.eventType}
• *Date:* ${enquiry.eventDate || 'To be scheduled'}
• *Time:* ${enquiry.eventTime || 'Dinner'}
• *Guests / Plates:* ${enquiry.guestCount} Plates
• *Venue Address:* ${enquiry.venue}

*🍽️ Selected Menu (${enquiry.selectedItems.length} items):*
${itemsSummary}

*💰 Bill Estimate:*
• *Base Price / Plate:* ${formatINR(enquiry.pricing.basePricePerPlate)}
• *Volume Offer:* ${enquiry.pricing.discountPercentage}% OFF
• *Price / Plate:* ${formatINR(enquiry.pricing.finalPricePerPlate)}
• *Grand Total:* ${formatINR(enquiry.pricing.finalTotal)}
${enquiry.pricing.savings > 0 ? `• *Total Savings:* ${formatINR(enquiry.pricing.savings)}\n` : ''}${enquiry.paymentMethod ? `• *Booking Option:* ${enquiry.paymentMethod.replace(/_/g, ' ').toUpperCase()}\n` : ''}
*Preferences:*
• *Spice Level:* ${enquiry.spicePreference}
• *Bread Preference:* ${enquiry.breadPreference}
• *Rice Preference:* ${enquiry.ricePreference}
${enquiry.specialInstructions ? `• *Instructions:* ${enquiry.specialInstructions}\n` : ''}
Looking forward to making our celebration extraordinary with Feastiva!`;

  return `https://wa.me/${FESTIVA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
