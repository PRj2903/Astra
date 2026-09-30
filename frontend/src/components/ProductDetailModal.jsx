import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  Plus,
  Minus,
  Check,
  MapPin,
  Award,
  Zap,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Calculator,
  Gem
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR, getRawINR } from '../utils/formatters';

export const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedMetal, setSelectedMetal] = useState('');
  const [selectedSize, setSelectedSize] = useState('Size 14 (Indian Standard)');
  const [isAdded, setIsAdded] = useState(false);
  const [pincode, setPincode] = useState('400001');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Multi-Angle Thumbnail Gallery State
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Price Breakup Collapsible State
  const [isPriceBreakupOpen, setIsPriceBreakupOpen] = useState(false);

  // Interactive Hover Magnifier State
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  // Full Screen Image Lightbox Viewer
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  const fallbackImg = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90';

  // Reset states on product change
  useEffect(() => {
    setActiveImageIndex(0);
    setZoomScale(1);
    setIsPriceBreakupOpen(false);
    setSelectedMetal('');
  }, [product]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setLensPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const metalOptions = [
    '22KT Royal Yellow Gold',
    '18KT Rose Gold',
    '18KT White Gold',
    'Solid 950 Platinum'
  ];

  const ringSizes = [
    'Size 10 (15.9mm)',
    'Size 12 (16.5mm)',
    'Size 14 (Indian Standard)',
    'Size 16 (17.8mm)',
    'Size 18 (18.4mm)',
    'Size 20 (19.1mm)'
  ];

  const galleryLabels = [
    'Front Studio View',
    'Lifestyle / On-Model',
    'Hallmark & Karigari'
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
          setZoomScale(1);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isLightboxOpen, onClose]);

  if (!isOpen || !product) return null;

  // Images list
  const images = (product.images && product.images.length > 0)
    ? product.images
    : [product.image || fallbackImg];

  const currentActiveImage = images[activeImageIndex] || product.image || fallbackImg;

  const currentMetal = selectedMetal || product.metal || '22KT Royal Yellow Gold';
  const basePrice = getRawINR(product.price);
  const totalPrice = basePrice * quantity;
  const originalPrice = Math.round(totalPrice * 1.15);

  // Dynamic Gold Rate & Component Calculation
  const goldWeight = Number(product.goldWeight) || (
    product.category === 'Necklaces' ? 18.5 :
    product.category === 'Bracelets' ? 12.4 :
    product.category === 'Earrings' ? 8.2 :
    product.category === 'Mangalsutras' ? 9.8 : 5.4
  );

  let metalRatePerGram = 6840; // 22KT standard
  if (currentMetal.includes('18KT')) {
    metalRatePerGram = 5600;
  } else if (currentMetal.includes('Platinum')) {
    metalRatePerGram = 3850;
  }

  const rawMetalVal = Math.round(goldWeight * metalRatePerGram);
  const stoneWeightDesc = product.stoneWeight || 'Natural Diamonds & Certified Gems';
  const stoneVal = Math.max(4500, Math.round(basePrice * 0.35));
  const makingChargeGross = Math.round(rawMetalVal * 0.18);
  const makingChargeSaved = Math.round(makingChargeGross * 0.50);
  const makingChargeNet = makingChargeGross - makingChargeSaved;
  const taxableSubtotal = rawMetalVal + stoneVal + makingChargeNet;
  const gstBreakdown = Math.round(taxableSubtotal * 0.03);

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setPincodeStatus('Available! Express Insured Delivery in 2-3 Business Days.');
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code.');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, {
      metal: currentMetal,
      size: selectedSize
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const handleInstantBuy = () => {
    addToCart(product, quantity, {
      metal: currentMetal,
      size: selectedSize
    });
    onClose();
    setIsCartOpen(true);
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: 'transform, opacity' }}
          className="relative w-full max-w-5xl bg-[#FCFAF7] border border-[#DFB76C] rounded-3xl shadow-2xl shadow-[#644B28]/25 overflow-hidden z-10 my-8 max-h-[92vh] flex flex-col transform-gpu"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 text-[#78716C] hover:text-[#885C21] hover:bg-[#FAF6F0] border border-[#E3D5C4] transition-all duration-200 cursor-pointer shadow-sm"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto flex-1">
            {/* Left: Product Image Showcase with Multi-Angle Gallery & Zoom Lens */}
            <div className="md:col-span-5 relative bg-[#FAF6F0] overflow-hidden flex flex-col items-center justify-between p-5 sm:p-6 border-b md:border-b-0 md:border-r border-[#E3D5C4]">
              
              {/* Main Image Frame with Real-Time Hover Magnifier */}
              <div className="relative w-full">
                <div
                  onClick={() => setIsLightboxOpen(true)}
                  onMouseEnter={() => setIsHoveringImage(true)}
                  onMouseLeave={() => setIsHoveringImage(false)}
                  onMouseMove={handleMouseMove}
                  className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-md border border-[#DFB76C] bg-white cursor-zoom-in group"
                  title="Hover to magnify details or click for full screen"
                >
                  <img
                    src={currentActiveImage}
                    alt={product.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImg;
                    }}
                    style={{
                      transformOrigin: `${lensPos.x}% ${lensPos.y}%`,
                      transform: isHoveringImage ? 'scale(2.2)' : 'scale(1)',
                      transition: isHoveringImage ? 'none' : 'transform 0.3s ease-out'
                    }}
                    className="w-full h-full object-cover object-center will-change-transform"
                  />

                  {/* Hover overlay indicator */}
                  {!isHoveringImage && (
                    <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                      <span className="px-3 py-1.5 rounded-full bg-white/95 text-[#885C21] text-xs font-bold shadow-lg flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Hover to Zoom / Click Full-Screen</span>
                      </span>
                    </div>
                  )}

                  {/* BIS Hallmark Tag */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#DFB76C] text-[#885C21] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm pointer-events-none">
                    <ShieldCheck className="w-3 h-3 text-[#C59733]" />
                    <span>BIS 916 Hallmark</span>
                  </div>

                  {/* Image Counter Badge */}
                  {images.length > 1 && (
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium pointer-events-none">
                      {activeImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>

                {/* Left/Right Quick Gallery Arrows on image */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-white text-[#57534E] hover:text-[#1C1917] border border-[#DFB76C] shadow-md transition-colors cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-white text-[#57534E] hover:text-[#1C1917] border border-[#DFB76C] shadow-md transition-colors cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Multi-Angle Thumbnail Gallery Strip */}
              {images.length > 1 && (
                <div className="mt-3 w-full">
                  <div className="flex items-center justify-between text-[11px] text-[#78716C] font-semibold mb-1.5">
                    <span className="uppercase tracking-wider">Multi-Angle Karigari Views:</span>
                    <span className="text-[#885C21]">{galleryLabels[activeImageIndex] || `Angle ${activeImageIndex + 1}`}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 w-full">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          activeImageIndex === idx
                            ? 'border-[#AA771C] ring-2 ring-[#DFB76C]/40 shadow-md scale-102'
                            : 'border-[#E3D5C4] hover:border-[#DFB76C] opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.title} angle ${idx + 1}`}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackImg;
                          }}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white text-center py-0.5 font-bold uppercase truncate px-1">
                          {idx === 0 ? 'Studio' : idx === 1 ? 'On-Model' : 'Hallmark'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fullscreen Zoom CTA Button */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-white hover:bg-[#FAF3E8] border border-[#DFB76C] text-[#885C21] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <ZoomIn className="w-4 h-4 text-[#C59733]" />
                <span>Inspect High-Def Zoom (100% Karigari View)</span>
              </button>

              {/* Security & Authenticity guarantees under image */}
              <div className="mt-3 grid grid-cols-2 gap-2 w-full text-[11px] text-[#57534E]">
                <div className="p-2 rounded-xl bg-white border border-[#E3D5C4] flex items-center gap-2 shadow-sm">
                  <Award className="w-4 h-4 text-[#C59733] flex-shrink-0" />
                  <span className="font-medium text-[#1C1917]">IGI Graded</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-[#E3D5C4] flex items-center gap-2 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-[#C59733] flex-shrink-0" />
                  <span className="font-medium text-[#1C1917]">HUID Verified</span>
                </div>
              </div>
            </div>

            {/* Right: Product Details, Live Price Breakdown & Actions */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                
                {/* Category & Stock Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-[#885C21] font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C59733]" />
                    <span>{product.category || 'Fine Jewellery'} Collection</span>
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    Ready to Dispatch
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] leading-tight">
                  {product.title}
                </h2>

                {/* Price and GST details Banner */}
                <div className="p-4 rounded-2xl bg-white border border-[#E3D5C4] space-y-2 shadow-sm">
                  <div className="flex items-baseline justify-between flex-wrap gap-2">
                    <div className="flex items-baseline gap-3">
                      <span className="font-price text-3xl sm:text-4xl font-extrabold text-[#1C1917] tracking-tight">
                        {formatINR(totalPrice)}
                      </span>
                      <span className="text-sm text-[#8C827A] line-through font-price font-medium">
                        {formatINR(originalPrice)}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-300">
                      Flat 50% Off Making Charges
                    </span>
                  </div>
                  <p className="text-[11px] text-[#78716C]">
                    (Inclusive of 3% Indian GST & Free Insured Sequel Express Transit)
                  </p>
                </div>

                {/* LIVE GOLD & DIAMOND PRICE BREAKDOWN ACCORDIAN (Feature 1) */}
                <div className="rounded-2xl bg-[#FAF3E8] border border-[#DFB76C] overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => setIsPriceBreakupOpen(!isPriceBreakupOpen)}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#F5ECE1] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-[#885C21]" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#1C1917] block">
                          Transparent Indian Price Breakup
                        </span>
                        <span className="text-[10px] text-[#885C21] font-price font-semibold">
                          Live Rate: ₹{metalRatePerGram.toLocaleString('en-IN')}/g ({currentMetal})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#885C21]">
                      <span>{isPriceBreakupOpen ? 'Hide Breakup' : 'View Breakup'}</span>
                      {isPriceBreakupOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isPriceBreakupOpen && (
                    <div className="p-4 bg-white border-t border-[#DFB76C] text-xs space-y-2.5">
                      {/* Gold Metal Component */}
                      <div className="flex justify-between items-center py-1 border-b border-[#F5ECE1]">
                        <div>
                          <p className="font-bold text-[#1C1917] flex items-center gap-1">
                            <span>Pure Gold Component</span>
                            <span className="text-[10px] text-[#885C21] font-normal font-price">({goldWeight}g @ ₹{metalRatePerGram.toLocaleString('en-IN')}/g)</span>
                          </p>
                          <p className="text-[10px] text-[#78716C]">{currentMetal} (100% BIS Hallmarked)</p>
                        </div>
                        <span className="font-price font-bold text-[#1C1917]">{formatINR(rawMetalVal)}</span>
                      </div>

                      {/* Gemstone / Diamond Component */}
                      <div className="flex justify-between items-center py-1 border-b border-[#F5ECE1]">
                        <div>
                          <p className="font-bold text-[#1C1917] flex items-center gap-1">
                            <Gem className="w-3 h-3 text-[#C59733]" />
                            <span>Gemstone & Diamond Value</span>
                          </p>
                          <p className="text-[10px] text-[#78716C]">{stoneWeightDesc}</p>
                        </div>
                        <span className="font-price font-bold text-[#1C1917]">{formatINR(stoneVal)}</span>
                      </div>

                      {/* Making Charges */}
                      <div className="flex justify-between items-center py-1 border-b border-[#F5ECE1]">
                        <div>
                          <p className="font-bold text-[#1C1917]">Making Charges (Karigari)</p>
                          <p className="text-[10px] text-emerald-700 font-semibold">50% Special Festive Waiver (-{formatINR(makingChargeSaved)})</p>
                        </div>
                        <span className="font-price font-bold text-[#1C1917]">{formatINR(makingChargeNet)}</span>
                      </div>

                      {/* GST */}
                      <div className="flex justify-between items-center py-1 border-b border-[#F5ECE1]">
                        <div>
                          <p className="font-bold text-[#1C1917]">Applicable GST (3%)</p>
                          <p className="text-[10px] text-[#78716C]">Government of India Standard</p>
                        </div>
                        <span className="font-price font-bold text-[#1C1917]">+{formatINR(gstBreakdown)}</span>
                      </div>

                      {/* Insured Transit */}
                      <div className="flex justify-between items-center py-1 text-emerald-800 font-semibold">
                        <span>Insured Transit & Luxury Box</span>
                        <span className="text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">FREE</span>
                      </div>

                      <div className="pt-2 border-t border-[#DFB76C] flex justify-between items-baseline font-bold">
                        <span className="text-xs text-[#1C1917]">Final Calculated Piece Price:</span>
                        <span className="font-price text-lg font-extrabold text-[#1C1917]">{formatINR(basePrice)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#57534E] font-normal leading-relaxed">
                  {product.description || 'Intricately handcrafted by Indian master artisans with certified precious gems and BIS hallmarked purity.'}
                </p>

                {/* Metal Selection */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#292524] flex items-center justify-between">
                    <span>Select Metal & Purity:</span>
                    <span className="text-[#885C21] font-medium">{currentMetal}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {metalOptions.map((metal) => (
                      <button
                        key={metal}
                        onClick={() => setSelectedMetal(metal)}
                        className={`p-2.5 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                          currentMetal === metal
                            ? 'bg-[#FAF3E8] border-2 border-[#AA771C] text-[#885C21] font-bold shadow-sm'
                            : 'bg-white border border-[#E3D5C4] text-[#57534E] hover:text-[#1C1917] hover:border-[#DFB76C]'
                        }`}
                      >
                        {metal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection (for Rings) */}
                {product.category === 'Rings' && (
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold uppercase tracking-wider text-[#292524]">
                        Select Ring Size:
                      </span>
                      <span className="text-[#885C21] text-[11px] font-medium">
                        Standard Indian Sizing
                      </span>
                    </div>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#DFB76C] rounded-xl text-xs text-[#1C1917] outline-none focus:ring-2 focus:ring-[#C59733]/30"
                    >
                      {ringSizes.map((sz) => (
                        <option key={sz} value={sz} className="bg-white">
                          {sz}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* PIN Code Delivery Estimator */}
                <div className="pt-1">
                  <form onSubmit={handlePincodeCheck} className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="w-4 h-4 text-[#885C21] absolute left-3 top-3" />
                      <input
                        type="text"
                        maxLength="6"
                        placeholder="Enter Indian PIN (e.g. 400001)"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DFB76C] rounded-xl text-xs text-[#1C1917] outline-none focus:ring-2 focus:ring-[#C59733]/30"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#FAF3E8] hover:bg-[#F5ECE1] border border-[#DFB76C] text-[#885C21] rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                    >
                      Check PIN
                    </button>
                  </form>
                  {pincodeStatus && (
                    <p className={`text-[11px] mt-1.5 font-medium ${pincodeStatus.startsWith('Available') ? 'text-emerald-700' : 'text-amber-800'}`}>
                      {pincodeStatus}
                    </p>
                  )}
                </div>

              </div>

              {/* Quantity Selector & Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-[#E3D5C4]">
                <div className="flex items-center gap-3">
                  {/* Quantity Control */}
                  <div className="flex items-center bg-white border border-[#DFB76C] rounded-xl p-1 shadow-sm">
                    <button
                      onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                      disabled={quantity <= 1}
                      className="p-2 text-[#78716C] hover:text-[#1C1917] disabled:opacity-30 transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#1C1917]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-2 text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-700 text-white'
                        : 'bg-gradient-to-r from-[#C59733] via-[#D4AB4D] to-[#AA771C] hover:from-[#B58723] hover:to-[#9A670C] text-white shadow-[#C59733]/25 active:scale-98'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>

                  {/* Instant Buy Now Button */}
                  <button
                    onClick={handleInstantBuy}
                    className="py-3 px-5 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 bg-[#FAF3E8] hover:bg-[#F5ECE1] border border-[#DFB76C] text-[#885C21] transition-all cursor-pointer shadow-sm"
                  >
                    <Zap className="w-4 h-4 text-[#C59733]" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>

      {/* FULL SCREEN HIGH-DEF LIGHTBOX VIEWER */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 sm:p-8">
          {/* Top Controls Bar */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="font-serif text-lg font-bold text-[#EEDBBE]">{product.title}</span>
              <span className="hidden sm:inline text-xs px-2.5 py-0.5 rounded-full bg-white/15 text-[#DFB76C] border border-[#DFB76C]/40">
                100% High-Def Karigari View • {galleryLabels[activeImageIndex] || `Angle ${activeImageIndex + 1}`}
              </span>
            </div>

            {/* Zoom Controls & Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomScale(s => Math.min(s + 0.3, 2.5))}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() => setZoomScale(s => Math.max(s - 0.3, 0.8))}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={() => setZoomScale(1)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setIsLightboxOpen(false);
                  setZoomScale(1);
                }}
                className="p-2 rounded-full bg-[#AA771C] hover:bg-[#C59733] text-white transition-colors cursor-pointer ml-2"
                title="Close Full Screen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full Screen Image Container */}
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center overflow-hidden">
            <motion.img
              src={currentActiveImage}
              alt={product.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackImg;
              }}
              animate={{ scale: zoomScale }}
              transition={{ duration: 0.2 }}
              drag={zoomScale > 1}
              dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
              className="max-h-[82vh] max-w-full object-contain rounded-2xl shadow-2xl select-none cursor-grab active:cursor-grabbing"
            />

            {/* Lightbox Gallery Arrow Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-colors cursor-pointer z-30"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-colors cursor-pointer z-30"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Info Ribbon */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xs text-[#DFB76C] bg-black/60 px-4 py-2 rounded-full border border-white/10">
            <span>Scroll or use buttons to Zoom • Drag to inspect gemstones & BIS stamp • Click arrows for next angle</span>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
