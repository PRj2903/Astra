import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Search,
  Gem,
  Award,
  Mail,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ReviewsSection } from './components/ReviewsSection';
import { Toast } from './components/Toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const categories = [
  'All',
  'Necklaces',
  'Earrings',
  'Rings',
  'Bracelets',
  'Mangalsutras',
  'Polki & Bridal',
  'Solitaires'
];

// Rich High-Aesthetic Indian Fine Jewellery Catalog Fallback with Unique High-Res Imagery
const fallbackJewels = [
  {
    id: 'jewel-1',
    title: 'Nizam Heritage Polki & Emerald Choker',
    category: 'Necklaces',
    metal: '22KT Royal Yellow Gold',
    goldWeight: 18.5,
    stoneWeight: '2.40 ct Polki & Zambian Emeralds',
    price: 185000,
    description: 'Imperial Rajputana choker handcrafted with natural uncut Polki diamonds, Zambian emerald drops, and micro-pearl seed clusters.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1611591475865-c322b64d1f2e?auto=format&fit=crop&w=1200&q=90'
    ],
    stock: 3
  },
  {
    id: 'jewel-2',
    title: 'Kundan Peacock Chandbali Earrings',
    category: 'Earrings',
    metal: '22KT Hallmarked Gold',
    goldWeight: 8.2,
    stoneWeight: '1.15 ct Kundan & Tourmaline Drops',
    price: 74500,
    description: 'Majestic Mughal motif chandbalis studded with hand-set Kundan stones, tourmaline beads, and delicate golden jhumki bells.',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=90',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90'
    ],
    stock: 5
  },
  {
    id: 'jewel-3',
    title: 'Aura Solitaire Diamond Ring (1.20 Carat)',
    category: 'Solitaires',
    metal: '18KT Rose Gold',
    goldWeight: 4.5,
    stoneWeight: '1.20 ct GIA Solitaire VVS1 E-Color',
    price: 148000,
    description: 'GIA Graded VVS1 clarity, E-color round brilliant solitaire diamond mounted on a hand-polished micro-pavé band.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=90',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=90'
    ],
    stock: 4
  },
  {
    id: 'jewel-4',
    title: 'Padmavati Traditional Temple Mangalsutra',
    category: 'Mangalsutras',
    metal: '22KT Yellow Gold',
    goldWeight: 9.8,
    stoneWeight: '0.45 ct Brilliant Diamonds & Black Spinel',
    price: 92000,
    description: 'Auspicious black onyx spinel beads intertwined with solid 22KT gold Lakshmi motifs and certified brilliant cut diamond florets.',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=90',
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1611591475865-c322b64d1f2e?auto=format&fit=crop&w=1200&q=90'
    ],
    stock: 6
  },
  {
    id: 'jewel-5',
    title: 'Royal Jadau Openable Kada Bangle',
    category: 'Bracelets',
    metal: '22KT Yellow Gold',
    goldWeight: 14.6,
    stoneWeight: '1.80 ct Burmese Rubies & Jadau Polki',
    price: 125000,
    description: 'Heavy traditional openable bridal kada adorned with cabochon rubies, uncut polki diamonds, and Meenakari enamel on inner curve.',
    image: 'https://images.unsplash.com/photo-1611591475865-c322b64d1f2e?auto=format&fit=crop&w=1200&q=90',
    images: [
      'https://images.unsplash.com/photo-1611591475865-c322b64d1f2e?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90'
    ],
    stock: 2
  },
  {
    id: 'jewel-6',
    title: 'Celeste Diamond Tennis Bracelet (3.5 Ct)',
    category: 'Bracelets',
    metal: '18KT White Gold',
    goldWeight: 11.2,
    stoneWeight: '3.50 ct IGI Graded Natural Diamonds',
    price: 215000,
    description: 'Continuous river of IGI-certified natural diamonds in four-prong basket settings with safety double-latch clasp.',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1200&q=90',
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1611591475865-c322b64d1f2e?auto=format&fit=crop&w=1200&q=90'
    ],
    stock: 3
  },
  {
    id: 'jewel-7',
    title: 'Maharani Polki Maang Tikka & Passa',
    category: 'Polki & Bridal',
    metal: '22KT Royal Gold',
    goldWeight: 6.9,
    stoneWeight: '1.10 ct Syndicate Polki & Basra Pearls',
    price: 64000,
    description: 'Royal bridal headpiece with syndicate polki crystals, hand-strung basra pearl tulles, and red spinel teardrop.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=90',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=90'
    ],
    stock: 4
  },
  {
    id: 'jewel-8',
    title: 'Gulmohar Navratna Diamond Cocktail Ring',
    category: 'Rings',
    metal: '18KT Yellow Gold',
    goldWeight: 5.8,
    stoneWeight: '0.95 ct Navratna Gems & Center Ruby',
    price: 88000,
    description: 'Nine celestial astrological gems encircling an exceptional center Burmese ruby in a handcrafted gold floral bloom.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=90',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=90'
    ],
    stock: 6
  }
];

function MainContent() {
  const { setIsCartOpen } = useCart();
  const [products, setProducts] = useState(fallbackJewels);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'low-high' | 'high-low'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const collectionRef = useRef(null);

  const filterFallback = useCallback(() => {
    let list = [...fallbackJewels];
    if (selectedCategory !== 'All') {
      list = list.filter((item) =>
        item.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(item.category.toLowerCase())
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.metal.toLowerCase().includes(q)
      );
    }
    setProducts(list);
  }, [selectedCategory, searchQuery]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const res = await fetch(`${API_URL}/api/products?${params.toString()}`);
      if (!res.ok) throw new Error('API catalogue unavailable');
      const data = await res.json();
      if (data && Array.isArray(data) && data.length > 0) {
        setProducts(data);
      } else {
        filterFallback();
      }
    } catch (err) {
      console.warn('Using luxury catalog fallback:', err);
      filterFallback();
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, filterFallback]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Apply Sorting
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'low-high') return Number(a.price) - Number(b.price);
    if (sortBy === 'high-low') return Number(b.price) - Number(a.price);
    return 0;
  });

  const handleExploreClick = () => {
    collectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#292524] flex flex-col selection:bg-[#DFB76C] selection:text-[#1C1917] font-sans">
      {/* Toast Notification Container */}
      <Toast />

      {/* Navigation Bar with Live Gold Rates & Indian Catalogue */}
      <Navbar
        onSearch={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          collectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Hero Section */}
      <Hero onExploreClick={handleExploreClick} />

      {/* Trust & Certification Bar (100% BIS Hallmarked, IGI Certified) */}
      <TrustBar />

      {/* Main Product Catalogue Section */}
      <section ref={collectionRef} className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Section Header & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 border-b border-[#E3D5C4] pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#885C21] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#C59733]" />
              <span>Certified Indian Fine Jewellery</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917]">
              {selectedCategory === 'All' ? 'Signature Indian Creations' : `${selectedCategory} Collection`}
            </h2>
            <p className="text-xs text-[#57534E]">
              {searchQuery ? (
                <span>Showing search results matching &ldquo;<strong className="text-[#885C21]">{searchQuery}</strong>&rdquo;</span>
              ) : (
                <span>100% BIS Hallmarked 22KT & 18KT Gold • IGI Diamond Graded • Insured Express Transit</span>
              )}
            </p>
          </div>

          {/* Controls: Category Filter Pills + Price Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
            {/* Category Pills */}
            <div className="flex items-center flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 text-xs font-bold tracking-wider uppercase rounded-full transition-all duration-300 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-[#C59733] to-[#AA771C] text-white shadow-md shadow-[#C59733]/25'
                      : 'bg-white text-[#44403C] hover:text-[#885C21] border border-[#E3D5C4] hover:border-[#DFB76C]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-[#E3D5C4] rounded-full px-3 py-1.5 text-xs text-[#44403C] shadow-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#885C21]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-[#1C1917] cursor-pointer font-medium"
              >
                <option value="featured" className="bg-white">Featured Curations</option>
                <option value="low-high" className="bg-white">Price: Low to High</option>
                <option value="high-low" className="bg-white">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid / Loading / Error / Empty States */}
        {loading ? (
          /* Shimmer Skeleton Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {[...Array(8)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-[#E3D5C4] space-y-4 animate-pulse shadow-sm"
              >
                <div className="aspect-square bg-[#FAF8F5] rounded-xl w-full" />
                <div className="h-4 bg-[#F5ECE1] rounded w-1/3" />
                <div className="h-5 bg-[#F5ECE1] rounded w-3/4" />
                <div className="h-4 bg-[#F5ECE1] rounded w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-[#F5ECE1] rounded w-1/4" />
                  <div className="h-8 bg-[#F5ECE1] rounded-lg w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          /* Empty Results State */
          <div className="py-20 text-center rounded-3xl bg-white border border-[#E3D5C4] max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#DFB76C] mx-auto flex items-center justify-center text-[#885C21]">
              <Search className="w-6 h-6 opacity-70" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">No Treasures Found</h3>
              <p className="text-xs text-[#57534E]">
                We couldn&apos;t find any items matching your selected criteria.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-[#C59733] to-[#AA771C] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-105 transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Populated Product Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* Brand Heritage & Pillars Section */}
      <section id="about" className="py-20 bg-[#FAF8F5] border-t border-[#E3D5C4] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-[#885C21] font-bold">
              The Astrra Heritage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917]">
              Three Decades of Karigari & Purity
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E] font-normal leading-relaxed">
              Every jewel is an eternal testament to Indian heritage, forged in 100% BIS hallmarked gold and certified diamonds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-[#E3D5C4] hover:border-[#DFB76C] transition-all duration-300 space-y-4 group shadow-sm hover:shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF3E8] border border-[#DFB76C] flex items-center justify-center text-[#885C21] group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">100% BIS 916 & 750 Hallmark</h3>
              <p className="text-xs text-[#57534E] leading-relaxed font-normal">
                Every gold jewel features the official Government of India BIS Hallmark, Karat purity stamp, and unique 6-digit HUID code.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E3D5C4] hover:border-[#DFB76C] transition-all duration-300 space-y-4 group shadow-sm hover:shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF3E8] border border-[#DFB76C] flex items-center justify-center text-[#885C21] group-hover:scale-110 transition-transform">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">IGI & GIA Graded Solitaires</h3>
              <p className="text-xs text-[#57534E] leading-relaxed font-normal">
                Hand-inspected VVS-EF natural diamonds and vibrant uncut Polki stones graded according to the most stringent international standards.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E3D5C4] hover:border-[#DFB76C] transition-all duration-300 space-y-4 group shadow-sm hover:shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF3E8] border border-[#DFB76C] flex items-center justify-center text-[#885C21] group-hover:scale-110 transition-transform">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">Lifetime 100% Exchange & Buyback</h3>
              <p className="text-xs text-[#57534E] leading-relaxed font-normal">
                Complete transparency with zero metal deduction and guaranteed prevailing gold rates for lifetime upgrades and buybacks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Bridal Stories */}
      <ReviewsSection />

      {/* Newsletter VIP Club with 5% Welcome Privilege */}
      <section className="py-16 bg-[#F6EFE6] border-t border-[#E3D5C4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 p-2.5 rounded-full bg-white text-[#885C21] border border-[#DFB76C] shadow-sm">
            <Mail className="w-4 h-4" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
            Join the Astrra Royal Privilege Circle
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] max-w-md mx-auto">
            Receive complimentary jewellery cleaning kits, festive private previews, and <strong className="text-[#885C21]">5% OFF</strong> on your first acquisition with code <strong className="text-[#885C21] font-mono">ROYALGOLD</strong>.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your VIP email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              className="flex-1 px-5 py-3.5 bg-white rounded-full border border-[#DFB76C] text-xs sm:text-sm text-[#1C1917] placeholder-[#78716C] outline-none focus:ring-2 focus:ring-[#C59733]/30 transition-all"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-gradient-to-r from-[#C59733] to-[#AA771C] hover:from-[#B58723] hover:to-[#9A670C] text-white font-bold text-xs tracking-widest uppercase rounded-full shadow-lg shadow-[#C59733]/25 transition-all cursor-pointer"
            >
              Join Salon
            </button>
          </form>

          {newsletterSubscribed && (
            <p className="text-xs text-emerald-700 font-bold">
              ✨ Welcome to the Privilege Circle. Use promo code <strong>ROYALGOLD</strong> at checkout for 5% off!
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F5ECE1] border-t border-[#E3D5C4] py-12 px-4 sm:px-6 lg:px-8 text-xs text-[#57534E]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-3">
            <span className="font-heading text-2xl font-bold tracking-[0.22em] text-[#1C1917] block">
              Astrra
            </span>
            <p className="text-[11px] leading-relaxed text-[#57534E]">
              Bespoke Indian Diamond & Gold Jewellery House • Certified BIS Hallmark 916 (22KT) & 750 (18KT).
            </p>
            <div className="pt-2 text-[10px] text-[#78716C]">
              GSTIN: 27AABCA1234F1Z8 | CIN: U36911MH2026PTC123456
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-[#1C1917] uppercase tracking-wider text-[11px]">Royal Collections</p>
            <ul className="space-y-1.5 text-[#57534E]">
              <li><a href="#" className="hover:text-[#885C21] transition-colors">22KT Gold Jhumkas & Chandbalis</a></li>
              <li><a href="#" className="hover:text-[#885C21] transition-colors">Nizam Polki & Emerald Chokers</a></li>
              <li><a href="#" className="hover:text-[#885C21] transition-colors">GIA Solitaire Engagement Rings</a></li>
              <li><a href="#" className="hover:text-[#885C21] transition-colors">Traditional & Modern Mangalsutras</a></li>
              <li><a href="#" className="hover:text-[#885C21] transition-colors">Solid 18K Diamond Tennis Bracelets</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-[#1C1917] uppercase tracking-wider text-[11px]">Client Concierge</p>
            <ul className="space-y-1.5 text-[#57534E]">
              <li><a href="#" className="hover:text-[#885C21] transition-colors">Virtual Video Call Shopping</a></li>
              <li><a href="#" className="hover:text-[#885C21] transition-colors">Try at Home (Selected Cities)</a></li>
              <li><a href="#" className="hover:text-[#885C21] transition-colors">Indian Ring Size Guide</a></li>
              <li><a href="#" className="hover:text-[#885C21] transition-colors">Daily Live Gold Rate Tracker</a></li>
              <li><a href="#" className="hover:text-[#885C21] transition-colors">Track Insured Sequel Delivery</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-[#1C1917] uppercase tracking-wider text-[11px]">Certifications & Trust</p>
            <ul className="space-y-1.5 text-[#57534E]">
              <li><span className="text-[#885C21] font-medium">✓ 100% BIS Hallmarked (Govt of India)</span></li>
              <li><span className="text-[#885C21] font-medium">✓ IGI & GIA Natural Solitaire Report</span></li>
              <li><span className="text-[#885C21] font-medium">✓ 100% Insured Sequel / Blue Dart Transit</span></li>
              <li><span className="text-[#885C21] font-medium">✓ 15-Day Money Back Guarantee</span></li>
              <li><span className="text-[#885C21] font-medium">✓ Zero Deduction Lifetime Exchange</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-[#E3D5C4] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Astrra Fine Jewellery House India Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3 text-[#885C21]">
            <span className="px-2 py-0.5 rounded bg-white border border-[#DFB76C] font-medium">⚡ UPI (GPay/PhonePe)</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#DFB76C] font-medium">💳 RuPay & Cards</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#DFB76C] font-medium">🏦 NetBanking</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#DFB76C] font-medium">🛍️ No Cost EMI</span>
          </div>
        </div>
      </footer>

      {/* Cart Drawer Slide-over */}
      <CartDrawer onCheckout={handleCheckout} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Indian Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainContent />
    </CartProvider>
  );
}
