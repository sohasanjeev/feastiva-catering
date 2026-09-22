import React, { useState, useEffect } from 'react';
import { 
  PlateItem, 
  PricingBreakdown, 
  CustomerEnquiry, 
  UserProfile, 
  OrderType, 
  PaymentMethod 
} from '../types';
import { 
  X, 
  Send, 
  MessageCircle, 
  Printer, 
  CheckCircle2, 
  CreditCard, 
  Mail, 
  QrCode, 
  Building2, 
  Calendar,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { 
  formatINR, 
  generateWhatsAppLink, 
  FESTIVA_PHONE, 
  FESTIVA_FOUNDER, 
  FESTIVA_EMAIL, 
  FESTIVA_GMAIL_COMPOSE_URL 
} from '../utils/pricing';

interface EventEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  plateItems: PlateItem[];
  pricing: PricingBreakdown;
  onSubmitEnquiry: (enquiry: CustomerEnquiry) => void;
  currentUser: UserProfile | null;
}

export const EventEnquiryModal: React.FC<EventEnquiryModalProps> = ({
  isOpen,
  onClose,
  plateItems,
  pricing,
  onSubmitEnquiry,
  currentUser,
}) => {
  const [orderType, setOrderType] = useState<OrderType>('confirmed_booking');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('advance_deposit_25');

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    whatsapp: '',
    email: '',
    eventType: 'Wedding Reception / Banquet',
    eventDate: '',
    eventTime: 'Dinner (7:30 PM)',
    venue: '',
    specialInstructions: '',
    spicePreference: 'medium' as 'mild' | 'medium' | 'spicy',
    breadPreference: 'Butter Naan & Garlic Naan',
    ricePreference: 'Hyderabadi Dum Biryani & Ghee Jeera Rice',
  });

  // Pre-fill user details if logged in
  useEffect(() => {
    if (currentUser?.isLoggedIn) {
      setFormData((prev) => ({
        ...prev,
        customerName: prev.customerName || currentUser.name,
        phone: prev.phone || currentUser.phone,
        email: prev.email || currentUser.email,
        whatsapp: prev.whatsapp || currentUser.phone,
      }));
    }
  }, [currentUser, isOpen]);

  const [confirmedOrder, setConfirmedOrder] = useState<CustomerEnquiry | null>(null);

  if (!isOpen) return null;

  const eventTypes = [
    'Wedding Reception / Banquet',
    'Pre-Wedding / Sangeet / Mehendi',
    'Corporate Gala / Conference',
    'Birthday Celebration',
    'House Party & Family Gathering',
    'Religious Ceremony / Puja',
    'Anniversary / Engagement',
    'Other Special Event',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEnquiry: CustomerEnquiry = {
      id: orderType === 'confirmed_booking' ? `ORD-${Date.now().toString().slice(-6)}` : `QUO-${Date.now().toString().slice(-6)}`,
      orderType,
      customerName: formData.customerName,
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone,
      email: formData.email || FESTIVA_EMAIL,
      eventType: formData.eventType,
      eventDate: formData.eventDate,
      eventTime: formData.eventTime,
      guestCount: pricing.quantity,
      venue: formData.venue,
      specialInstructions: formData.specialInstructions,
      spicePreference: formData.spicePreference,
      breadPreference: formData.breadPreference,
      ricePreference: formData.ricePreference,
      selectedItems: plateItems,
      pricing: pricing,
      paymentMethod: orderType === 'confirmed_booking' ? paymentMethod : undefined,
      status: orderType === 'confirmed_booking' ? 'Confirmed' : 'New',
      createdAt: new Date().toISOString(),
    };

    onSubmitEnquiry(newEnquiry);
    setConfirmedOrder(newEnquiry);
  };

  const handlePrint = () => {
    window.print();
  };

  const advanceAmount = Math.round(pricing.finalTotal * 0.25);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-3xl my-8 rounded-3xl bg-[#121217] border border-amber-500/40 shadow-2xl overflow-hidden text-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-900/90 text-stone-400 hover:text-white border border-stone-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with official logo */}
        <div className="p-6 bg-gradient-to-r from-[#1c120c] via-[#24160d] to-[#1a0f0d] border-b border-amber-500/20">
          <div className="flex items-center gap-4">
            <img 
              src="/assets/feastiva_official_logo.png" 
              alt="Feastiva Logo" 
              className="h-12 w-auto object-contain" 
            />
            <div>
              <h3 className="text-xl font-serif font-bold text-white tracking-wide">
                {confirmedOrder 
                  ? (confirmedOrder.orderType === 'confirmed_booking' ? 'Catering Order Booked Successfully!' : 'Catering Quote Registered!') 
                  : 'Book Catering Order / Request Official Proposal'}
              </h3>
              <p className="text-xs text-amber-300/80">
                FEASTIVA CATERING • Bangalore • {FESTIVA_EMAIL} • +91 {FESTIVA_PHONE}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        {confirmedOrder ? (
          /* SUCCESS STATE */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold font-mono">
                Booking ID: {confirmedOrder.id}
              </span>
              <h4 className="text-2xl font-serif font-bold text-white">
                Congratulations, {confirmedOrder.customerName}!
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Your catering event for <strong>{confirmedOrder.guestCount} guests</strong> has been locked into Feastiva's calendar. Rajiv kr and our head banquet chef will coordinate with you.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-5 rounded-2xl bg-stone-900/90 border border-amber-500/30 text-xs text-left max-w-md mx-auto space-y-2.5">
              <div className="flex justify-between">
                <span className="text-stone-400">Order Type:</span>
                <span className="font-semibold text-emerald-400 uppercase">
                  {confirmedOrder.orderType === 'confirmed_booking' ? 'Confirmed Booking' : 'Quotation Request'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Occasion:</span>
                <span className="font-semibold text-stone-200">{confirmedOrder.eventType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Date & Venue:</span>
                <span className="font-semibold text-stone-200">{confirmedOrder.eventDate || 'TBD'} • {confirmedOrder.venue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Total Plates:</span>
                <span className="font-semibold text-stone-200">{confirmedOrder.guestCount} Plates</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-800 text-sm font-bold">
                <span className="text-white">Estimated Total:</span>
                <span className="text-amber-400 font-mono">{formatINR(confirmedOrder.pricing.finalTotal)}</span>
              </div>
              {confirmedOrder.orderType === 'confirmed_booking' && (
                <div className="flex justify-between text-xs text-stone-400">
                  <span>25% Booking Advance:</span>
                  <span className="font-mono text-emerald-300">{formatINR(advanceAmount)}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
              <a
                href={generateWhatsAppLink(confirmedOrder)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3.5 px-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Notify Rajiv kr on WhatsApp</span>
              </a>

              <button
                onClick={handlePrint}
                className="py-3.5 px-5 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
            </div>

            <div className="text-[11px] text-stone-400 flex items-center justify-center gap-4 flex-wrap">
              <a href={FESTIVA_GMAIL_COMPOSE_URL} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">
                Email: {FESTIVA_EMAIL}
              </a>
              <span>•</span>
              <a href={`tel:${FESTIVA_PHONE}`} className="text-amber-400 hover:underline">
                Call: +91 {FESTIVA_PHONE}
              </a>
            </div>
          </div>
        ) : (
          /* BOOKING & ENQUIRY FORM */
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Choose Between Instant Online Booking vs Requesting a Quote */}
            <div className="p-1 rounded-2xl bg-stone-900 border border-stone-800 grid grid-cols-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setOrderType('confirmed_booking')}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  orderType === 'confirmed_booking'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Book / Order Catering</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('quote_request')}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  orderType === 'quote_request'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Request Custom Quote</span>
              </button>
            </div>

            {/* Selected Plate Snapshot */}
            <div className="p-4 rounded-2xl bg-[#171720] border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-wider text-amber-300 font-bold font-serif">
                  Configured Plate ({plateItems.length} courses)
                </span>
                <span className="text-stone-400 font-mono">
                  {pricing.quantity} Plates • {pricing.discountPercentage}% OFF
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {plateItems.map((item) => (
                  <span
                    key={item.foodItem.id}
                    className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-[11px] text-stone-300 flex items-center gap-1.5"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.foodItem.dietaryType === 'veg' ? 'bg-emerald-400' : 'bg-red-400'
                      }`}
                    />
                    {item.foodItem.name}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-800/80 flex items-baseline justify-between text-xs">
                <span className="text-stone-400">Per Plate: <strong>{formatINR(pricing.finalPricePerPlate)}</strong></span>
                <span className="text-sm font-bold text-amber-300 font-mono">
                  Estimated Total: {formatINR(pricing.finalTotal)}
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-wider text-amber-400 font-semibold border-b border-stone-800 pb-1">
                1. Customer Contact Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-stone-300 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Anand Varma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-300 block mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value, whatsapp: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-stone-300 block mb-1">Gmail / Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. anand@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Event & Location */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-wider text-amber-400 font-semibold border-b border-stone-800 pb-1">
                2. Event & Venue Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-stone-300 block mb-1">Event Type</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500/50"
                  >
                    {eventTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-stone-300 block mb-1">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-300 block mb-1">Event Time</label>
                  <input
                    type="text"
                    value={formData.eventTime}
                    onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    placeholder="e.g. Lunch (1:00 PM) / Dinner (7:30 PM)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-300 block mb-1">Bangalore Venue Address *</label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. Chinnappa Plaza area, Hebbal, Indiranagar, Whitefield banquet hall"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            {/* If Order Now: Payment Option Selection */}
            {orderType === 'confirmed_booking' && (
              <div className="space-y-4 p-4 rounded-2xl bg-[#171720] border border-amber-500/30">
                <h4 className="text-xs uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  3. Select Booking Confirmation Preference
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                    paymentMethod === 'advance_deposit_25'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-200'
                      : 'bg-stone-900 border-stone-800 text-stone-400'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'advance_deposit_25'}
                      onChange={() => setPaymentMethod('advance_deposit_25')}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-bold text-white">25% Advance Booking ({formatINR(advanceAmount)})</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">Locks your event date immediately into our commercial kitchen schedule.</p>
                    </div>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                    paymentMethod === 'upi_transfer'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-200'
                      : 'bg-stone-900 border-stone-800 text-stone-400'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'upi_transfer'}
                      onChange={() => setPaymentMethod('upi_transfer')}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-bold text-white">Instant UPI (GPay / PhonePe)</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">Direct to Feastiva Official account (9234076376@upi).</p>
                    </div>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                    paymentMethod === 'pay_on_event'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-200'
                      : 'bg-stone-900 border-stone-800 text-stone-400'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'pay_on_event'}
                      onChange={() => setPaymentMethod('pay_on_event')}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-bold text-white">Pay After In-Person Consultation</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">Meet Rajiv kr or banquet chef to inspect tasting before paying.</p>
                    </div>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                    paymentMethod === 'bank_neft'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-200'
                      : 'bg-stone-900 border-stone-800 text-stone-400'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bank_neft'}
                      onChange={() => setPaymentMethod('bank_neft')}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-bold text-white">Corporate Bank Transfer (NEFT/IMPS)</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">Official GST invoice and corporate vendor setup.</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-6 rounded-full text-stone-400 hover:text-white text-xs font-semibold"
              >
                Back
              </button>

              <button
                type="submit"
                className="flex-1 py-4 px-8 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-sm shadow-gold-glow flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
              >
                <Send className="w-4 h-4" />
                <span>
                  {orderType === 'confirmed_booking'
                    ? `Confirm Booking (${formatINR(pricing.finalTotal)})`
                    : `Submit Quote Request (${formatINR(pricing.finalTotal)})`}
                </span>
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};
