import { useState } from 'react';
import { ShoppingBag, Eye, Heart, Sparkles, Check, ShieldCheck, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR, getRawINR } from '../utils/formatters';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const priceNum = getRawINR(product.price);
  const originalPrice = Math.round(priceNum * 1.15); // 15% promotional strike-through
  const savings = originalPrice - priceNum;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsAdded(true);
    addToCart(product, 1, {
      metal: product.metal || '18K Yellow Gold',
      size: product.category === 'Rings' ? 'Size 14 (Indian)' : 'Standard'
    });
    setTimeout(() => setIsAdded(false), 1400);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsCartOpen(true);
  };

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#E3D5C4] hover:border-[#C59733] transition-all duration-300 hover:shadow-xl hover:shadow-[#C59733]/15 flex flex-col h-full transform-gpu"
    >
      {/* Image Showcase Container */}
      <div 
        onClick={() => onQuickView && onQuickView(product)}
        className="relative aspect-square w-full overflow-hidden bg-[#FAF8F5] cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85';
          }}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Ambient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex flex-col gap-1 items-start">
            {product.category && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-white/95 backdrop-blur-md text-[#885C21] border border-[#DFB76C] shadow-sm">
                {product.category}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-emerald-50/95 backdrop-blur-md text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-sm">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-700" />
              <span>BIS 916 Hallmark</span>
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm cursor-pointer ${
              isLiked
                ? 'bg-rose-50 text-rose-600 border border-rose-300 scale-110'
                : 'bg-white/90 text-[#78716C] hover:text-[#885C21] border border-[#E3D5C4] hover:border-[#DFB76C]'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/98 backdrop-blur-md border border-[#DFB76C] hover:border-[#AA771C] rounded-full text-xs font-semibold text-[#885C21] hover:text-[#5C3D1E] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-lg cursor-pointer z-10"
          >
            <Eye className="w-3.5 h-3.5 text-[#C59733]" />
            <span>Quick View & Specs</span>
          </button>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Metal Purity & Diamonds */}
          <div className="flex items-center justify-between text-[11px] text-[#885C21] font-medium tracking-wider uppercase">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C59733]" />
              <span>{product.metal || '18K Yellow Gold'}</span>
            </span>
            <span className="text-[10px] text-[#78716C] font-normal lowercase">free insured delivery</span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView && onQuickView(product)}
            className="font-serif text-base sm:text-lg font-bold text-[#1C1917] group-hover:text-[#885C21] transition-colors line-clamp-1 cursor-pointer"
          >
            {product.title}
          </h3>

          {/* Short Description */}
          {product.description && (
            <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed font-normal">
              {product.description}
            </p>
          )}
        </div>

        {/* Price Breakdown & Action Buttons */}
        <div className="pt-3 border-t border-[#E3D5C4] space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-price text-xl sm:text-2xl font-extrabold text-[#1C1917] tracking-tight">
                  {formatINR(product.price)}
                </span>
                <span className="text-xs text-[#8C827A] line-through font-price font-medium">
                  {formatINR(originalPrice)}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 block">
                Save {formatINR(savings)} • 50% Off Making Charges
              </span>
            </div>

            <span className="text-[10px] uppercase font-bold text-[#885C21] bg-[#FAF3E8] px-2 py-0.5 rounded border border-[#DFB76C]">
              In Stock
            </span>
          </div>

          {/* Action Button: Smooth Add to Bag */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all duration-300 shadow-sm ${
                isAdded
                  ? 'bg-emerald-700 text-white scale-102'
                  : product.stock === 0
                  ? 'bg-[#EFE6DC] text-[#A8A29E] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#C59733] via-[#D4AB4D] to-[#AA771C] hover:from-[#B58723] hover:to-[#9A670C] text-white hover:shadow-md hover:shadow-[#C59733]/25 active:scale-95 cursor-pointer'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Added to Bag</span>
                </>
              ) : product.stock === 0 ? (
                <span>Sold Out</span>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="p-2.5 rounded-xl bg-[#FAF3E8] hover:bg-[#F5ECE1] border border-[#DFB76C] text-[#885C21] hover:text-[#5C3D1E] transition-colors cursor-pointer"
              title="Instant Buy Now with UPI / Cards"
            >
              <Zap className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
