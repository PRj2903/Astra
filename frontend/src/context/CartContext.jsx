import { createContext, useContext, useState, useEffect } from 'react';
import { formatINR, getRawINR } from '../utils/formatters';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('asttra_cart_inr_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null); // { id, message, product, type }
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isGiftWrapped, setIsGiftWrapped] = useState(false);
  const [pincode, setPincode] = useState('400001'); // Mumbai default

  useEffect(() => {
    try {
      localStorage.setItem('asttra_cart_inr_v2', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Toast trigger
  const showToast = (message, product = null, type = 'success') => {
    const id = Date.now();
    setToast({ id, message, product, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3800);
  };

  const closeToast = () => setToast(null);

  const addToCart = (product, quantity = 1, options = {}) => {
    const cartItemId = `${product.id}-${options.size || 'std'}-${options.metal || product.metal || '18k'}`;
    const selectedMetal = options.metal || product.metal || '18K Yellow Gold';
    const selectedSize = options.size || (product.category === 'Rings' ? 'Size 14 (Indian)' : 'Standard');

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          cartItemId,
          quantity,
          selectedMetal,
          selectedSize,
        },
      ];
    });

    showToast(
      `Added ${quantity} × ${product.title} to your bag`,
      { ...product, selectedMetal, selectedSize }
    );
  };

  const removeFromCart = (cartItemId) => {
    const itemToRemove = cart.find((item) => item.cartItemId === cartItemId || item.id === cartItemId);
    setCart((prev) =>
      prev.filter((item) => item.cartItemId !== cartItemId && item.id !== cartItemId)
    );
    if (itemToRemove) {
      showToast(`Removed "${itemToRemove.title}" from bag`, null, 'info');
    }
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId || item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupons
  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'ASTRRA10') {
      setAppliedCoupon({ code: 'ASTRRA10', type: 'percent', value: 10, label: '10% Royal Privilege Discount' });
      showToast('🎉 Coupon "ASTRRA10" applied: 10% discount saved!');
      return { success: true, message: '10% Privilege Discount Applied!' };
    } else if (clean === 'DIWALI2026' || clean === 'FESTIVE') {
      setAppliedCoupon({ code: clean, type: 'flat', value: 2500, label: '₹2,500 Festive Celebration Off' });
      showToast('✨ Festive Coupon applied: Flat ₹2,500 off!');
      return { success: true, message: '₹2,500 Festive Bonus Applied!' };
    } else if (clean === 'ROYALGOLD' || clean === 'FIRST5') {
      setAppliedCoupon({ code: clean, type: 'percent', value: 5, label: '5% Welcome Heritage Privilege' });
      showToast('✨ Welcome Privilege applied: 5% off!');
      return { success: true, message: '5% Welcome Discount Applied!' };
    } else {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', null, 'info');
  };

  // Financial calculations
  const rawSubtotal = cart.reduce(
    (sum, item) => sum + getRawINR(item.price) * item.quantity,
    0
  );

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round((rawSubtotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = Math.min(rawSubtotal, appliedCoupon.value);
    }
  }

  const giftWrapFee = isGiftWrapped && cart.length > 0 ? 350 : 0;
  const gstAmount = Math.round((rawSubtotal - discountAmount) * 0.03);
  const totalAmount = Math.max(0, rawSubtotal - discountAmount + giftWrapFee + gstAmount);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
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
        totalItems,
        isCartOpen,
        setIsCartOpen,
        toast,
        showToast,
        closeToast,
        pincode,
        setPincode,
        formatINR,
        getRawINR,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);