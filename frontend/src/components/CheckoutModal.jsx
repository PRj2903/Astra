import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Smartphone,
  Building2,
  Calendar,
  Banknote,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const CheckoutModal = ({ isOpen, onClose }) => {
  const { cart, totalAmount, rawSubtotal, discountAmount, gstAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [copied, setCopied] = useState(false);

  // Steps: 'details' -> 'payment' -> 'otp_verify' -> 'confirmed'
  const [currentStep, setCurrentStep] = useState('details');

  // Customer Delivery Info
  const [formData, setFormData] = useState({
    fullName: 'Pratham Sharma',
    email: 'pratham@jewellery.in',
    phone: '+91 98765 43210',
    address: 'Flat 402, Royal Residency, Altamount Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400026'
  });

  const [errors, setErrors] = useState({});

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'emi' | 'cod'
  const [upiSubOption, setUpiSubOption] = useState('qr'); // 'qr' | 'id' | 'apps'
  const [upiId, setUpiId] = useState('pratham@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [selectedEmiPlan, setSelectedEmiPlan] = useState('3_months');
  const [selectedUpiApp, setSelectedUpiApp] = useState('GPay');

  // Card Inputs
  const [cardData, setCardData] = useState({
    cardNumber: '4532 •••• •••• 8892',
    cardName: 'PRATHAM SHARMA',
    expiry: '09/29',
    cvv: '884'
  });

  // OTP Verification Simulation State
  const [otpValue, setOtpValue] = useState('749201');
  const [otpTimer, setOtpTimer] = useState(45);

  const indianStates = [
    'Maharashtra', 'Delhi NCR', 'Karnataka', 'Gujarat', 'Tamil Nadu',
    'Rajasthan', 'Telangana', 'West Bengal', 'Uttar Pradesh', 'Punjab', 'Kerala'
  ];

  const popularBanks = [
    { id: 'HDFC', name: 'HDFC Bank', logo: '🏦' },
    { id: 'SBI', name: 'State Bank of India', logo: '🏛️' },
    { id: 'ICICI', name: 'ICICI Bank', logo: '💳' },
    { id: 'AXIS', name: 'Axis Bank', logo: '🏢' },
    { id: 'KOTAK', name: 'Kotak Mahindra Bank', logo: '🏦' },
    { id: 'PNB', name: 'Punjab National Bank', logo: '🏛️' }
  ];

  const upiApps = [
    { id: 'GPay', name: 'Google Pay' },
    { id: 'PhonePe', name: 'PhonePe' },
    { id: 'Paytm', name: 'Paytm UPI' },
    { id: 'CRED', name: 'CRED UPI' }
  ];

  const handleModalClose = useCallback(() => {
    if (orderConfirmation) {
      clearCart();
    }
    setOrderConfirmation(null);
    setCurrentStep('details');
    setError('');
    onClose();
  }, [orderConfirmation, clearCart, onClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) {
        handleModalClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, loading, handleModalClose]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval;
    if (currentStep === 'otp_verify' && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, otpTimer]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required for invoice & tracking';
    }
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Valid 10-digit mobile number required for OTP';
    }
    if (!formData.address.trim()) newErrors.address = 'Complete delivery address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim() || formData.postalCode.replace(/\D/g, '').length !== 6) {
      newErrors.postalCode = '6-digit Indian PIN code required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDetailsProceed = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setCurrentStep('payment');
    }
  };

  const handleTriggerPayment = () => {
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (paymentMethod === 'cod') {
        finalizeOrder();
      } else {
        setOtpTimer(45);
        setCurrentStep('otp_verify');
      }
    }, 1200);
  };

  const finalizeOrder = async () => {
    setLoading(true);
    setError('');

    const orderPayload = {
      customer_name: formData.fullName,
      customer_email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      postal_code: formData.postalCode,
      total_amount: totalAmount,
      currency: 'INR',
      payment_method: paymentMethod,
      payment_provider:
        paymentMethod === 'upi'
          ? `UPI (${upiSubOption === 'apps' ? selectedUpiApp : upiId})`
          : paymentMethod === 'card'
          ? 'RuPay / 3D-Secure Card'
          : paymentMethod === 'netbanking'
          ? `${selectedBank} NetBanking`
          : paymentMethod === 'emi'
          ? `No Cost EMI (${selectedEmiPlan})`
          : 'Cash on Delivery (Insured)',
      items: cart.map((item) => ({
        product_id: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        metal: item.selectedMetal || item.metal || '22K Gold'
      }))
    };

    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      let data;
      if (res.ok) {
        data = await res.json();
      } else {
        data = {
          id: `AST-IN-${Math.floor(100000 + Math.random() * 900000)}`,
          order_number: `AST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          tracking_id: `SQL-IN-${Math.floor(10000000 + Math.random() * 90000000)}`,
          huid_certificate: `HUID-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          ...orderPayload
        };
      }

      setOrderConfirmation(data);
      setCurrentStep('confirmed');
    } catch (err) {
      console.warn('Backend order sync fallback:', err);
      const fallbackData = {
        id: `AST-IN-${Math.floor(100000 + Math.random() * 900000)}`,
        order_number: `AST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        tracking_id: `SQL-IN-${Math.floor(10000000 + Math.random() * 90000000)}`,
        huid_certificate: `HUID-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        ...orderPayload
      };
      setOrderConfirmation(fallbackData);
      setCurrentStep('confirmed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOrderId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={handleModalClose}
          className="fixed inset-0 bg-black/60"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: 'transform, opacity' }}
          className="relative w-full max-w-4xl bg-[#FCFAF7] border border-[#DFB76C] rounded-3xl shadow-2xl shadow-[#644B28]/25 overflow-hidden z-10 my-8 max-h-[92vh] flex flex-col transform-gpu"
        >
          {/* Close Icon Button */}
          <button
            onClick={handleModalClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white text-[#78716C] hover:text-[#885C21] hover:bg-[#FAF6F0] border border-[#E3D5C4] transition-all duration-200 cursor-pointer shadow-sm"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="p-6 border-b border-[#E3D5C4] bg-[#F5ECE1] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white border border-[#DFB76C] text-[#885C21] shadow-sm">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#885C21] uppercase tracking-widest block">
                  Encrypted Indian Payment Gateway
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
                  {currentStep === 'details' && '1. Delivery Coordinates & GST Invoice'}
                  {currentStep === 'payment' && '2. Select Indian Payment Method'}
                  {currentStep === 'otp_verify' && '3. Bank 3D-Secure Authentication'}
                  {currentStep === 'confirmed' && '✨ Order Confirmed & Receipt Dispatched'}
                </h2>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#57534E]">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span className="font-medium">RBI & NPCI Compliant</span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1">
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-300 text-red-700 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: Delivery Details */}
            {currentStep === 'details' && (
              <form onSubmit={handleDetailsProceed} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#885C21] flex items-center gap-2">
                      <span>Shipping Address (Across 24,000+ Indian Pincodes)</span>
                    </h3>
                    <span className="text-[10px] text-[#78716C]">Free White-Glove Insured Delivery</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#292524]">
                        Full Recipient Name <span className="text-[#885C21]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Pratham Sharma"
                        className="w-full px-4 py-3 bg-white rounded-xl border border-[#DFB76C] focus:ring-2 focus:ring-[#C59733]/30 text-sm text-[#1C1917] outline-none transition-colors"
                      />
                      {errors.fullName && <p className="text-[11px] text-red-600">{errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#292524]">
                        Email Address (for GST Invoice & GIA Certificate) <span className="text-[#885C21]">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="pratham@example.com"
                        className="w-full px-4 py-3 bg-white rounded-xl border border-[#DFB76C] focus:ring-2 focus:ring-[#C59733]/30 text-sm text-[#1C1917] outline-none transition-colors"
                      />
                      {errors.email && <p className="text-[11px] text-red-600">{errors.email}</p>}
                    </div>

                    {/* Mobile Phone */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#292524]">
                        Mobile Number (for Delivery OTP & WhatsApp Updates) <span className="text-[#885C21]">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 bg-white rounded-xl border border-[#DFB76C] focus:ring-2 focus:ring-[#C59733]/30 text-sm text-[#1C1917] outline-none transition-colors"
                      />
                      {errors.phone && <p className="text-[11px] text-red-600">{errors.phone}</p>}
                    </div>

                    {/* PIN Code */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#292524]">
                        Indian PIN Code <span className="text-[#885C21]">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength="6"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value.replace(/\D/g, '') })}
                        placeholder="400026"
                        className="w-full px-4 py-3 bg-white rounded-xl border border-[#DFB76C] focus:ring-2 focus:ring-[#C59733]/30 text-sm text-[#1C1917] outline-none transition-colors font-mono"
                      />
                      {errors.postalCode && <p className="text-[11px] text-red-600">{errors.postalCode}</p>}
                    </div>

                    {/* Street Address */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-[#292524]">
                        Complete Delivery Address (House / Flat No, Street, Landmark) <span className="text-[#885C21]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Flat 402, Royal Residency, Altamount Road, Near Cumballa Hill"
                        className="w-full px-4 py-3 bg-white rounded-xl border border-[#DFB76C] focus:ring-2 focus:ring-[#C59733]/30 text-sm text-[#1C1917] outline-none transition-colors"
                      />
                      {errors.address && <p className="text-[11px] text-red-600">{errors.address}</p>}
                    </div>

                    {/* City */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#292524]">
                        City <span className="text-[#885C21]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Mumbai"
                        className="w-full px-4 py-3 bg-white rounded-xl border border-[#DFB76C] focus:ring-2 focus:ring-[#C59733]/30 text-sm text-[#1C1917] outline-none transition-colors"
                      />
                      {errors.city && <p className="text-[11px] text-red-600">{errors.city}</p>}
                    </div>

                    {/* State */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#292524]">
                        State <span className="text-[#885C21]">*</span>
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-3 bg-white rounded-xl border border-[#DFB76C] focus:ring-2 focus:ring-[#C59733]/30 text-sm text-[#1C1917] outline-none transition-colors"
                      >
                        {indianStates.map((st) => (
                          <option key={st} value={st} className="bg-white">
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown Snapshot */}
                <div className="p-4 rounded-2xl bg-white border border-[#E3D5C4] text-xs space-y-2 shadow-sm">
                  <div className="flex justify-between text-[#57534E]">
                    <span>Gross Jewellery Value ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="font-price font-bold text-[#1C1917]">{formatINR(rawSubtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-semibold">
                      <span>Privilege Coupon Applied</span>
                      <span className="font-price font-bold">-{formatINR(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#57534E]">
                    <span>GST (3% Indian Standard) & BIS Certification</span>
                    <span className="font-price font-bold text-[#1C1917]">+{formatINR(gstAmount)}</span>
                  </div>
                  <div className="flex justify-between text-[#57534E]">
                    <span>Insured Sequel Express Delivery</span>
                    <span className="text-emerald-800 font-bold uppercase text-[10px]">Free</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-[#E3D5C4] text-sm font-bold">
                    <span className="text-[#1C1917]">Total Payable</span>
                    <span className="font-price text-2xl font-extrabold text-[#1C1917]">{formatINR(totalAmount)}</span>
                  </div>
                </div>

                {/* Proceed Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#C59733] via-[#D4AB4D] to-[#AA771C] hover:from-[#B58723] hover:to-[#9A670C] text-white font-bold text-xs tracking-widest uppercase rounded-2xl shadow-xl shadow-[#C59733]/25 flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-98 cursor-pointer"
                >
                  <span>Proceed to Payment Options ({formatINR(totalAmount)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: Indian Payment Gateways */}
            {currentStep === 'payment' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Tabs: Payment Options */}
                  <div className="md:col-span-4 space-y-2">
                    {[
                      { id: 'upi', name: '⚡ UPI (GPay / PhonePe / QR)', icon: <Smartphone className="w-4 h-4" /> },
                      { id: 'card', name: '💳 Cards (RuPay / Visa / MC)', icon: <CreditCard className="w-4 h-4" /> },
                      { id: 'netbanking', name: '🏦 Net Banking (50+ Banks)', icon: <Building2 className="w-4 h-4" /> },
                      { id: 'emi', name: '🛍️ No Cost EMI / Pay Later', icon: <Calendar className="w-4 h-4" /> },
                      { id: 'cod', name: '💵 Cash on Delivery', icon: <Banknote className="w-4 h-4" /> }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setPaymentMethod(tab.id)}
                        className={`w-full p-3.5 rounded-xl text-left text-xs font-semibold tracking-wider transition-all flex items-center gap-2.5 cursor-pointer ${
                          paymentMethod === tab.id
                            ? 'bg-gradient-to-r from-[#C59733] to-[#AA771C] text-white shadow-md shadow-[#C59733]/20 font-bold'
                            : 'bg-white border border-[#E3D5C4] text-[#44403C] hover:text-[#885C21] hover:border-[#DFB76C]'
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Right Panel: Selected Payment Form */}
                  <div className="md:col-span-8 p-6 rounded-2xl bg-white border border-[#E3D5C4] space-y-6 shadow-sm">
                    {/* UPI MODE */}
                    {paymentMethod === 'upi' && (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between border-b border-[#E3D5C4] pb-3">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-[#885C21]">
                            Instant UPI Payment
                          </h4>
                          <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                            Zero Transaction Fee
                          </span>
                        </div>

                        {/* UPI Sub tabs */}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setUpiSubOption('qr')}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                              upiSubOption === 'qr'
                                ? 'bg-[#FAF3E8] border-[#AA771C] text-[#885C21]'
                                : 'bg-[#FAF8F5] border-[#E3D5C4] text-[#57534E]'
                            }`}
                          >
                            Dynamic QR Code
                          </button>
                          <button
                            type="button"
                            onClick={() => setUpiSubOption('apps')}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                              upiSubOption === 'apps'
                                ? 'bg-[#FAF3E8] border-[#AA771C] text-[#885C21]'
                                : 'bg-[#FAF8F5] border-[#E3D5C4] text-[#57534E]'
                            }`}
                          >
                            UPI Apps
                          </button>
                          <button
                            type="button"
                            onClick={() => setUpiSubOption('id')}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                              upiSubOption === 'id'
                                ? 'bg-[#FAF3E8] border-[#AA771C] text-[#885C21]'
                                : 'bg-[#FAF8F5] border-[#E3D5C4] text-[#57534E]'
                            }`}
                          >
                            Enter UPI ID
                          </button>
                        </div>

                        {/* QR Code Option */}
                        {upiSubOption === 'qr' && (
                          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DFB76C] flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                            <div className="w-36 h-36 bg-white p-2.5 rounded-xl shadow-md border border-[#E3D5C4] flex items-center justify-center relative flex-shrink-0">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=astrrajewels@okhdfcbank&pn=AstrraJewelleryHouse&am=${totalAmount}&cu=INR`}
                                alt="UPI QR Code"
                                className="w-full h-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <span className="text-[10px] text-[#885C21] font-bold uppercase tracking-widest block">
                                Scan with any UPI App
                              </span>
                              <p className="text-xs text-[#57534E]">
                                Open Google Pay, PhonePe, Paytm, CRED, or BHIM and scan the QR code to authorize <strong className="text-[#885C21]">{formatINR(totalAmount)}</strong>.
                              </p>
                              <div className="flex items-center gap-2 justify-center sm:justify-start pt-1 text-[10px] text-[#78716C]">
                                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                                <span>Awaiting authorization...</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Direct UPI Apps */}
                        {upiSubOption === 'apps' && (
                          <div className="grid grid-cols-2 gap-3">
                            {upiApps.map((app) => (
                              <button
                                key={app.id}
                                type="button"
                                onClick={() => setSelectedUpiApp(app.id)}
                                className={`p-4 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                                  selectedUpiApp === app.id
                                    ? 'bg-[#FAF3E8] border-2 border-[#AA771C] text-[#885C21] font-bold shadow-sm'
                                    : 'bg-white border-[#E3D5C4] text-[#44403C] hover:border-[#DFB76C]'
                                }`}
                              >
                                <span className="text-xs font-bold">{app.name}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-[#DFB76C] text-[#885C21] font-medium">
                                  Instant Pay
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Enter UPI ID */}
                        {upiSubOption === 'id' && (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-xs text-[#292524] font-semibold">
                                Enter Virtual Payment Address (VPA) / UPI ID
                              </label>
                              <input
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="username@okhdfcbank"
                                className="w-full px-4 py-3 bg-white border border-[#DFB76C] focus:ring-2 focus:ring-[#C59733]/30 rounded-xl text-xs text-[#1C1917] outline-none font-mono"
                              />
                            </div>
                            <div className="flex flex-wrap gap-2 text-[10px]">
                              {['@okhdfcbank', '@okaxis', '@ybl', '@paytm'].map((suf) => (
                                <button
                                  key={suf}
                                  type="button"
                                  onClick={() => setUpiId(`pratham${suf}`)}
                                  className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#DFB76C] text-[#885C21] hover:bg-[#FAF3E8] cursor-pointer font-medium"
                                >
                                  {suf}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* CARD PAYMENT MODE */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-[#E3D5C4] pb-3">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-[#885C21]">
                            RuPay, Visa, Mastercard & Amex
                          </h4>
                          <span className="text-[10px] text-[#78716C] font-mono">
                            RBI Tokenized & 3D-Secure
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-[#292524] font-semibold block mb-1">
                              Card Number
                            </label>
                            <input
                              type="text"
                              value={cardData.cardNumber}
                              onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                              placeholder="4532 0000 0000 0000"
                              className="w-full px-4 py-3 bg-white border border-[#DFB76C] focus:ring-2 focus:ring-[#C59733]/30 rounded-xl text-xs text-[#1C1917] outline-none font-mono"
                            />
                          </div>

                          <div>
                            <label className="text-xs text-[#292524] font-semibold block mb-1">
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              value={cardData.cardName}
                              onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
                              placeholder="PRATHAM SHARMA"
                              className="w-full px-4 py-3 bg-white border border-[#DFB76C] focus:ring-2 focus:ring-[#C59733]/30 rounded-xl text-xs text-[#1C1917] outline-none uppercase"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-[#292524] font-semibold block mb-1">
                                Valid Thru (MM/YY)
                              </label>
                              <input
                                type="text"
                                value={cardData.expiry}
                                onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                                placeholder="12/28"
                                className="w-full px-4 py-3 bg-white border border-[#DFB76C] focus:ring-2 focus:ring-[#C59733]/30 rounded-xl text-xs text-[#1C1917] outline-none font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-[#292524] font-semibold block mb-1">
                                CVV / Security Code
                              </label>
                              <input
                                type="password"
                                maxLength="4"
                                value={cardData.cvv}
                                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                                placeholder="•••"
                                className="w-full px-4 py-3 bg-white border border-[#DFB76C] focus:ring-2 focus:ring-[#C59733]/30 rounded-xl text-xs text-[#1C1917] outline-none font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* NET BANKING MODE */}
                    {paymentMethod === 'netbanking' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-[#E3D5C4] pb-3">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-[#885C21]">
                            Select Your Bank
                          </h4>
                          <span className="text-[10px] text-[#78716C]">Direct Bank Gateway</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {popularBanks.map((bank) => (
                            <button
                              key={bank.id}
                              type="button"
                              onClick={() => setSelectedBank(bank.id)}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                selectedBank === bank.id
                                  ? 'bg-[#FAF3E8] border-2 border-[#AA771C] text-[#885C21] font-bold shadow-sm'
                                  : 'bg-white border-[#E3D5C4] text-[#44403C] hover:border-[#DFB76C]'
                              }`}
                            >
                              <span className="text-lg block mb-1">{bank.logo}</span>
                              <span className="text-xs">{bank.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* EMI MODE */}
                    {paymentMethod === 'emi' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-[#E3D5C4] pb-3">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-[#885C21]">
                            No Cost EMI Options (0% Interest)
                          </h4>
                          <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                            Zero Processing Fee
                          </span>
                        </div>

                        <div className="space-y-2">
                          {[
                            { id: '3_months', tenure: '3 Months No Cost EMI', perMonth: Math.round(totalAmount / 3) },
                            { id: '6_months', tenure: '6 Months No Cost EMI', perMonth: Math.round(totalAmount / 6) },
                            { id: '9_months', tenure: '9 Months Standard EMI', perMonth: Math.round((totalAmount * 1.04) / 9) },
                            { id: '12_months', tenure: '12 Months Jewellery Plan', perMonth: Math.round((totalAmount * 1.06) / 12) }
                          ].map((plan) => (
                            <button
                              key={plan.id}
                              type="button"
                              onClick={() => setSelectedEmiPlan(plan.id)}
                              className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                selectedEmiPlan === plan.id
                                  ? 'bg-[#FAF3E8] border-2 border-[#AA771C] text-[#885C21] shadow-sm'
                                  : 'bg-white border-[#E3D5C4] text-[#44403C] hover:border-[#DFB76C]'
                              }`}
                            >
                              <div>
                                <p className="text-xs font-bold text-[#1C1917]">{plan.tenure}</p>
                                <p className="text-[10px] text-[#78716C]">HDFC, ICICI, Axis, Bajaj Finserv</p>
                              </div>
                              <span className="font-serif text-sm font-bold text-[#885C21]">
                                {formatINR(plan.perMonth)}/mo
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* COD MODE */}
                    {paymentMethod === 'cod' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-[#E3D5C4] pb-3">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-[#885C21]">
                            Insured Cash on Delivery
                          </h4>
                          <span className="text-[10px] text-[#885C21] font-mono font-bold">Available up to ₹50,000</span>
                        </div>

                        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E3D5C4] text-xs text-[#57534E] space-y-2">
                          <p>
                            • Our certified security courier (Sequel Logistics) will collect payment at your doorstep via Cash, UPI QR, or Card on Delivery.
                          </p>
                          <p>
                            • A verified PIN Code OTP will be requested upon handing over your sealed hallmark parcel.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-[#E3D5C4] flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep('details')}
                        className="px-5 py-3.5 bg-white hover:bg-[#FAF6F0] border border-[#E3D5C4] text-[#44403C] rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={handleTriggerPayment}
                        disabled={loading}
                        className="flex-1 py-4 bg-gradient-to-r from-[#C59733] via-[#D4AB4D] to-[#AA771C] hover:from-[#B58723] hover:to-[#9A670C] text-white font-bold text-xs tracking-widest uppercase rounded-xl shadow-xl shadow-[#C59733]/25 flex items-center justify-center gap-2 transition-all duration-300 active:scale-98 disabled:opacity-60 cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Connecting to Banking Network...</span>
                          </>
                        ) : (
                          <>
                            <span>Authorize & Pay {formatINR(totalAmount)}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Bank 3D-Secure OTP Screen Simulation */}
            {currentStep === 'otp_verify' && (
              <div className="max-w-md mx-auto py-6 space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-white border border-[#DFB76C] mx-auto flex items-center justify-center text-[#885C21] shadow-md">
                  <ShieldCheck className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#885C21] font-bold tracking-widest uppercase">
                    Bank 3D-Secure Authentication
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                    Verify Your Transaction
                  </h3>
                  <p className="text-xs text-[#57534E]">
                    We sent a 6-digit one-time password to mobile ending in <strong className="text-[#1C1917]">...43210</strong> to authorize payment of <strong className="text-[#885C21]">{formatINR(totalAmount)}</strong>.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[#E3D5C4] space-y-4 shadow-sm">
                  <div className="space-y-2">
                    <label className="text-xs text-[#292524] font-semibold block">
                      Enter 6-Digit Banking OTP
                    </label>
                    <input
                      type="text"
                      maxLength="6"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      className="w-48 mx-auto px-4 py-3 bg-[#FAF8F5] border border-[#DFB76C] rounded-xl text-center text-lg font-bold text-[#885C21] tracking-[0.35em] font-mono outline-none focus:ring-2 focus:ring-[#C59733]/30"
                    />
                  </div>

                  <p className="text-[11px] text-[#78716C]">
                    Resend OTP in <span className="text-[#885C21] font-bold">{otpTimer}s</span>
                  </p>

                  <button
                    type="button"
                    onClick={finalizeOrder}
                    disabled={loading || otpValue.length < 6}
                    className="w-full py-3.5 bg-gradient-to-r from-[#C59733] via-[#D4AB4D] to-[#AA771C] hover:from-[#B58723] hover:to-[#9A670C] text-white font-bold text-xs tracking-widest uppercase rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying with Bank...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Submit OTP & Confirm Order</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Order Confirmation & Indian GST Receipt */}
            {currentStep === 'confirmed' && orderConfirmation && (
              <div className="py-4 space-y-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                  className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center text-emerald-700 shadow-xl"
                >
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </motion.div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#885C21] font-bold tracking-widest uppercase">
                    Payment Verified & Insured Dispatch Booked
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
                    Congratulations, {orderConfirmation.customer_name}
                  </h2>
                  <p className="text-xs text-[#57534E] max-w-lg mx-auto leading-relaxed">
                    Your royal jewellery acquisition is confirmed. An official BIS Hallmark Certificate, GST Tax Invoice, and Sequel tracking dossier have been dispatched to{' '}
                    <span className="text-[#885C21] font-semibold">{orderConfirmation.customer_email}</span>.
                  </p>
                </div>

                {/* Reference & Courier Tracker */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 rounded-2xl bg-white border border-[#DFB76C] text-left flex items-center justify-between shadow-sm">
                    <div>
                      <span className="text-[10px] text-[#78716C] uppercase tracking-widest block font-medium">
                        Order Reference ID
                      </span>
                      <span className="font-mono text-sm font-bold text-[#885C21]">
                        {orderConfirmation.order_number || orderConfirmation.id}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyOrderId(orderConfirmation.order_number || orderConfirmation.id)}
                      className="p-2 rounded-lg bg-[#FAF8F5] text-[#57534E] hover:text-[#1C1917] text-xs flex items-center gap-1 border border-[#E3D5C4] cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#DFB76C] text-left shadow-sm">
                    <span className="text-[10px] text-[#78716C] uppercase tracking-widest block font-medium">
                      Insured Courier Tracker
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-800 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{orderConfirmation.tracking_id}</span>
                    </span>
                  </div>
                </div>

                {/* Indian GST Tax Invoice Breakdown */}
                <div className="p-5 rounded-2xl bg-white border border-[#E3D5C4] max-w-2xl mx-auto text-left space-y-2 text-xs text-[#57534E] shadow-sm">
                  <div className="flex justify-between font-semibold text-[#1C1917] border-b border-[#E3D5C4] pb-2">
                    <span>GSTIN: 27AABCA1234F1Z8 (Astrra Fine Jewels Ltd)</span>
                    <span className="text-[#885C21] font-mono font-bold">HUID: {orderConfirmation.huid_certificate}</span>
                  </div>
                  <div className="flex justify-between text-[#57534E] pt-1">
                    <span>Payment Gateway:</span>
                    <span className="text-[#1C1917] font-mono font-medium">{orderConfirmation.payment_provider}</span>
                  </div>
                  <div className="flex justify-between text-[#57534E]">
                    <span>Delivery Address:</span>
                    <span className="text-[#1C1917] text-right font-medium">{orderConfirmation.city}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-[#E3D5C4]">
                    <span className="text-sm font-bold text-[#1C1917]">Total Amount Paid:</span>
                    <span className="font-price text-xl font-extrabold text-[#1C1917]">
                      {formatINR(orderConfirmation.total_amount)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                  <button
                    onClick={handleModalClose}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#C59733] to-[#AA771C] hover:from-[#B58723] hover:to-[#9A670C] text-white font-bold text-xs tracking-widest uppercase rounded-full shadow-lg shadow-[#C59733]/20 cursor-pointer"
                  >
                    Continue Exploring
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
