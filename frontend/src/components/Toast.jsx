import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, X, Sparkles, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';

export const Toast = () => {
  const { toast, closeToast, setIsCartOpen } = useCart();

  if (!toast) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white/98 backdrop-blur-xl border border-[#DFB76C] rounded-2xl shadow-2xl shadow-[#644B28]/25 p-4 overflow-hidden"
      >
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C59733] via-[#DFB76C] to-[#AA771C]" />

        <div className="flex items-start gap-3">
          {toast.product ? (
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#DFB76C] flex-shrink-0 relative shadow-sm">
              <img
                src={toast.product.image}
                alt={toast.product.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80';
                }}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 p-0.5 bg-emerald-600 rounded-tl text-white">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#FAF3E8] border border-[#DFB76C] flex items-center justify-center text-[#885C21] flex-shrink-0">
              {toast.type === 'info' ? <Info className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
          )}

          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#885C21]">
              <Sparkles className="w-3 h-3 text-[#C59733]" />
              <span>{toast.type === 'info' ? 'Astrra Concierge' : 'Added to Shopping Bag'}</span>
            </div>
            <p className="text-xs text-[#1C1917] font-bold truncate mt-0.5">
              {toast.product ? toast.product.title : toast.message}
            </p>
            {toast.product && (
              <p className="text-[12px] text-[#1C1917] font-price font-extrabold">
                {formatINR(toast.product.price)} <span className="text-[11px] text-[#885C21] font-sans font-medium">• {toast.product.selectedMetal || '18K Gold'}</span>
              </p>
            )}

            {toast.product && (
              <button
                onClick={() => {
                  closeToast();
                  setIsCartOpen(true);
                }}
                className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#C59733] to-[#AA771C] text-white text-[11px] font-bold uppercase tracking-wider shadow-md hover:brightness-105 transition-all cursor-pointer"
              >
                <span>View Bag</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={closeToast}
            className="text-[#78716C] hover:text-[#1C1917] p-1 rounded-lg hover:bg-[#FAF6F0] transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
