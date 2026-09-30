import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Gem, Award, PhoneCall } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';

export const Hero = ({ onExploreClick }) => {
  const { addToCart } = useCart();

  const featuredJewel = {
    id: 'hero-featured-choker',
    title: 'Nizam Heritage Polki & Emerald Choker',
    price: 185000,
    category: 'Necklaces',
    metal: '22KT Royal Yellow Gold',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
    stock: 3
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-28 pb-16 bg-gradient-to-b from-[#FBF8F4] via-[#F6EFE6] to-[#FAF8F5]">
      {/* Opulent Ambient Warm Champagne Glows (Hardware Accelerated) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(223,183,108,0.22)_0%,transparent_70%)] pointer-events-none -z-0" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-[radial-gradient(circle,rgba(197,151,51,0.18)_0%,transparent_70%)] pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[radial-gradient(circle,rgba(232,212,190,0.35)_0%,transparent_70%)] pointer-events-none -z-0" />

      {/* Royal Lattice Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#c59733_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.08] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Headline & Indian Luxury Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 text-center lg:text-left space-y-6"
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#DFB76C] text-[#885C21] text-xs sm:text-sm font-semibold tracking-widest uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C59733] animate-spin" style={{ animationDuration: '8s' }} />
              <span>Royal Indian Festive & Bridal Collection 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#1C1917] tracking-tight leading-[1.08]">
              Elegance Forged in <br />
              <span className="gold-shimmer italic font-normal">
                Pure 22KT & 18KT Gold
              </span>
            </h1>

            {/* Description */}
            <p className="text-[#57534E] text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Explore Astrra’s hallmark-certified bridal treasures, uncut Polki diamonds, 
              and GIA-graded solitaires handcrafted by multi-generational Indian karigars.
            </p>

            {/* CTA Buttons & Video Call Feature */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#C59733] via-[#D4AB4D] to-[#AA771C] hover:from-[#B58723] hover:to-[#9A670C] text-white font-bold text-xs sm:text-sm tracking-widest uppercase rounded-full shadow-xl shadow-[#C59733]/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Shop Festive Catalogue</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-white" />
              </button>

              <button
                onClick={() => onExploreClick()}
                className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-[#FAF6F0] border border-[#DFB76C] text-[#44403C] hover:text-[#885C21] font-semibold text-xs sm:text-sm tracking-wider uppercase rounded-full transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-[#C59733]" />
                <span>Book Video Consultation</span>
              </button>
            </div>

            {/* Indian Trust & Quality Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#E3D5C4] max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left space-y-1">
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#885C21]">100% BIS</div>
                <div className="text-[10px] text-[#78716C] uppercase tracking-wider font-medium">Hallmarked 916 Gold</div>
              </div>
              <div className="text-center lg:text-left space-y-1">
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#885C21]">IGI & GIA</div>
                <div className="text-[10px] text-[#78716C] uppercase tracking-wider font-medium">Certified Solitaires</div>
              </div>
              <div className="text-center lg:text-left space-y-1">
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#885C21]">4.9 ★</div>
                <div className="text-[10px] text-[#78716C] uppercase tracking-wider font-medium">15,000+ Happy Brides</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-md lg:max-w-none aspect-[4/5] rounded-3xl overflow-hidden border border-[#DFB76C] shadow-2xl shadow-[#644B28]/15 group bg-white">
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90"
                alt="Astrra Royal Indian Jewellery"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90';
                }}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Scrim Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/90 via-[#1C1917]/25 to-transparent" />

              {/* Floating Featured Product Card */}
              <div className="absolute bottom-5 left-5 right-5 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-[#DFB76C] shadow-xl space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-[#885C21] font-bold tracking-widest uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#C59733]" />
                      <span>Bridal Masterpiece</span>
                    </span>
                    <h3 className="text-sm font-serif font-bold text-[#1C1917] mt-0.5">
                      {featuredJewel.title}
                    </h3>
                    <p className="text-sm text-[#1C1917] font-price font-extrabold">
                      {formatINR(featuredJewel.price)} <span className="text-[10px] text-[#78716C] font-sans font-medium">• 22K Hallmarked</span>
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#FAF4EA] border border-[#DFB76C] flex items-center justify-center text-[#885C21] flex-shrink-0">
                    <Gem className="w-5 h-5" />
                  </div>
                </div>

                <button
                  onClick={() => addToCart(featuredJewel, 1)}
                  className="w-full py-2.5 bg-gradient-to-r from-[#C59733] to-[#AA771C] hover:from-[#B58723] hover:to-[#9A670C] text-white font-bold text-[11px] tracking-wider uppercase rounded-xl transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Instant Add to Bag</span>
                </button>
              </div>
            </div>

            {/* Floating Trust Badges */}
            <div className="hidden sm:flex absolute -top-4 -left-6 bg-white/98 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#DFB76C] shadow-xl items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#C59733]" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#885C21]">BIS Hallmark 916</p>
                <p className="text-xs font-semibold text-[#1C1917]">Govt. Verified Purity</p>
              </div>
            </div>

            <div className="hidden sm:flex absolute -bottom-3 -right-4 bg-white/98 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#DFB76C] shadow-xl items-center gap-3">
              <Award className="w-5 h-5 text-[#C59733]" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#885C21]">IGI Diamond Graded</p>
                <p className="text-xs font-semibold text-[#1C1917]">100% Natural Solitaires</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
