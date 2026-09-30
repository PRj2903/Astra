import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Tag,
  Gift,
  CheckCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';

export const CartDrawer = ({ onCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    rawSubtotal,
    discountAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isGiftWrapped,
    setIsGiftWrapped,
    giftWrapFee,
    gstAmount,
    totalAmount,
    totalItems
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const availableCoupons = [
    { code: 'ASTRRA10', desc: '10% Royal Privilege Off' },
    { code: 'DIWALI2026', desc: 'Flat ₹2,500 Festive Bonus' },
    { code: 'ROYALGOLD', desc: '5% Welcome Heritage Off' }
  ];

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
          {/* Backdrop (High performance opacity transition without heavy blur lag) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60"
          />

          {/* Slide-over Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10 pointer-events-none">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: 'transform' }}
              className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#DFB76C] shadow-2xl flex flex-col justify-between pointer-events-auto transform-gpu"
            >
              {/* Drawer Header */}
              <div className="p-5 sm:p-6 border-b border-[#E3D5C4] flex items-center justify-between bg-[#F5ECE1]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-full bg-white text-[#885C21] border border-[#DFB76C] shadow-sm">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#1C1917] flex items-center gap-2">
                      <span>Shopping Bag</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#FAF3E8] text-[#885C21] border border-[#DFB76C] font-sans font-bold">
                        {totalItems}
                      </span>
                    </h2>
                    <p className="text-[11px] text-[#78716C]">
                      100% Insured Delivery Across India
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-white transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping & BIS Badge Bar */}
              <div className="px-6 py-2.5 bg-[#FAF3E8] border-b border-[#E3D5C4] text-xs flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Free Insured Sequel Dispatch Unlocked</span>
                </div>
                <span className="text-[10px] text-[#885C21] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-[#DFB76C]">
                  BIS 916
                </span>
              </div>

              {/* Items List / Empty State */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                    <div className="w-20 h-20 rounded-full bg-white border border-[#DFB76C] flex items-center justify-center text-[#885C21] shadow-sm">
                      <ShoppingBag className="w-10 h-10 opacity-70" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-serif text-xl font-bold text-[#1C1917]">
                        Your Bag is Empty
                      </p>
                      <p className="text-xs text-[#78716C] max-w-xs">
                        Indulge in our BIS Hallmarked gold, uncut Polki, and certified solitaire jewellery.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-3 bg-gradient-to-r from-[#C59733] to-[#AA771C] text-white font-bold text-xs tracking-wider uppercase rounded-full shadow-md hover:brightness-105 transition-all duration-200 cursor-pointer"
                    >
                      Discover Creations
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.cartItemId || item.id} className="p-3.5 rounded-2xl bg-white border border-[#E3D5C4] shadow-sm flex gap-4">
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-xl bg-[#FAF8F5] border border-[#E3D5C4] overflow-hidden flex-shrink-0 relative">
                          <img
                            src={item.image}
                            alt={item.title}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80';
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-serif text-sm font-bold text-[#1C1917] line-clamp-1">
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-[#885C21] font-medium">
                                {item.selectedMetal || item.metal || '22K Gold'} {item.selectedSize ? `• ${item.selectedSize}` : ''}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.cartItemId || item.id)}
                              className="text-[#A8A29E] hover:text-red-500 transition-colors p-1 cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price & Quantity Controls */}
                          <div className="flex items-center justify-between pt-2">
                            <span className="font-price text-base font-extrabold text-[#1C1917]">
                              {formatINR(item.price * item.quantity)}
                            </span>

                            <div className="flex items-center bg-[#FAF8F5] border border-[#DFB76C] rounded-lg p-0.5 shadow-xs">
                              <button
                                onClick={() => updateQuantity(item.cartItemId || item.id, -1)}
                                className="p-1.5 text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold text-[#1C1917]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.cartItemId || item.id, 1)}
                                className="p-1.5 text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Gift Wrap Option */}
                    <div className="p-3.5 rounded-2xl bg-white border border-[#E3D5C4] shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Gift className="w-5 h-5 text-[#885C21]" />
                        <div>
                          <p className="text-xs font-bold text-[#1C1917]">
                            Royal Velvet Gift Box & Card (+₹350)
                          </p>
                          <p className="text-[10px] text-[#78716C]">
                            Wax-sealed certificate & personalized greeting
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isGiftWrapped}
                        onChange={(e) => setIsGiftWrapped(e.target.checked)}
                        className="w-4 h-4 accent-[#AA771C] rounded cursor-pointer"
                      />
                    </div>

                    {/* Promo Coupon Section */}
                    <div className="p-3.5 rounded-2xl bg-white border border-[#E3D5C4] shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#44403C]">
                        <span className="font-bold flex items-center gap-1.5 text-[#1C1917]">
                          <Tag className="w-3.5 h-3.5 text-[#885C21]" />
                          <span>Apply Privilege Coupon</span>
                        </span>
                        {appliedCoupon && (
                          <button
                            onClick={removeCoupon}
                            className="text-[11px] text-red-600 hover:underline font-semibold cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      {appliedCoupon ? (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                            <CheckCircle className="w-4 h-4 text-emerald-700" />
                            <span>{appliedCoupon.label}</span>
                          </div>
                          <span className="font-bold text-emerald-800 font-price">
                            -{formatINR(discountAmount)}
                          </span>
                        </div>
                      ) : (
                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. ASTRRA10 or DIWALI2026"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#DFB76C] rounded-xl text-xs text-[#1C1917] outline-none focus:ring-2 focus:ring-[#C59733]/30"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#FAF3E8] hover:bg-[#F5ECE1] border border-[#DFB76C] text-[#885C21] text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer shadow-sm"
                          >
                            Apply
                          </button>
                        </form>
                      )}

                      {couponError && (
                        <p className="text-[11px] text-red-600">{couponError}</p>
                      )}

                      {/* Quick Coupon Suggestions */}
                      {!appliedCoupon && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {availableCoupons.map((c) => (
                            <button
                              key={c.code}
                              onClick={() => applyCoupon(c.code)}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF3E8] border border-[#DFB76C] text-[#885C21] hover:bg-[#F5ECE1] transition-colors cursor-pointer font-medium"
                            >
                              {c.code} ({c.desc})
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer Summary */}
              {cart.length > 0 && (
                <div className="p-5 sm:p-6 bg-[#F5ECE1] border-t border-[#E3D5C4] space-y-4">
                  <div className="space-y-1.5 text-xs text-[#57534E]">
                    <div className="flex justify-between">
                      <span>Item Total (Gross Value)</span>
                      <span className="text-[#1C1917] font-price font-bold">{formatINR(rawSubtotal)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-800 font-semibold">
                        <span>Privilege Discount</span>
                        <span className="font-price font-bold">-{formatINR(discountAmount)}</span>
                      </div>
                    )}

                    {isGiftWrapped && (
                      <div className="flex justify-between text-[#1C1917]">
                        <span>Royal Velvet Gift Packaging</span>
                        <span className="font-price font-bold">+{formatINR(giftWrapFee)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#57534E]">
                      <span>Applicable GST (3% Indian Standard)</span>
                      <span className="text-[#1C1917] font-price font-bold">+{formatINR(gstAmount)}</span>
                    </div>

                    <div className="flex justify-between text-[#57534E]">
                      <span>Insured Sequel Express Delivery</span>
                      <span className="text-emerald-800 font-bold uppercase text-[10px]">
                        FREE
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline pt-2.5 border-t border-[#E3D5C4]">
                      <div>
                        <span className="font-serif text-base text-[#1C1917] font-bold block">
                          Total Amount
                        </span>
                        <span className="text-[10px] text-[#78716C]">
                          (Inclusive of all taxes & certification)
                        </span>
                      </div>
                      <span className="font-price text-2xl font-extrabold text-[#1C1917]">
                        {formatINR(totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => {
                      if (onCheckout) onCheckout();
                    }}
                    className="w-full py-4 bg-gradient-to-r from-[#C59733] via-[#D4AB4D] to-[#AA771C] hover:from-[#B58723] hover:to-[#9A670C] text-white font-bold text-xs tracking-widest uppercase rounded-2xl shadow-xl shadow-[#C59733]/25 flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-98 cursor-pointer"
                  >
                    <span>Proceed to Indian Checkout</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-[#78716C] pt-1">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#885C21]" />
                      <span>UPI, RuPay, NetBanking & Cards</span>
                    </div>
                    <button
                      onClick={clearCart}
                      className="text-[#78716C] hover:text-red-600 uppercase tracking-wider underline text-[10px] cursor-pointer"
                    >
                      Clear Bag
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
