import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, Sparkles, Phone, MapPin, Heart, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar = ({ onSearch, selectedCategory, onSelectCategory }) => {
  const { totalItems, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeWishlistCount] = useState(2);

  const categories = [
    'All',
    'Rings',
    'Necklaces',
    'Earrings',
    'Bracelets',
    'Mangalsutras',
    'Polki & Bridal',
    'Solitaires'
  ];

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 25;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Top Announcement & Live Rate Ticker */}
      <div className="bg-[#F5ECE1] border-b border-[#E3D5C4] py-1.5 px-4 text-[11px] text-[#57534E]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-3 text-[#78541D] font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Live Gold (22K):</span>
              <strong className="text-[#1C1917] font-serif font-bold">₹6,840/g</strong>
            </span>
            <span className="text-[#D2C0AB]">|</span>
            <span className="flex items-center gap-1">
              <span>24K:</span>
              <strong className="text-[#1C1917] font-serif font-bold">₹7,460/g</strong>
            </span>
          </div>

          <div className="flex-1 text-center truncate">
            <span className="inline-flex items-center gap-1.5 text-[#6B4E1F] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#C59733]" />
              <span>100% BIS Hallmarked 22KT Gold • Free Insured Delivery Across India • 15-Day Easy Returns</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[#57534E]">
            <a href="tel:18002660123" className="flex items-center gap-1 hover:text-[#AA771C] transition-colors">
              <Phone className="w-3 h-3 text-[#C59733]" />
              <span className="font-medium">1800-266-0123</span>
            </a>
            <span className="text-[#D2C0AB]">|</span>
            <span className="flex items-center gap-1 hover:text-[#AA771C] cursor-pointer">
              <MapPin className="w-3 h-3 text-[#C59733]" />
              <span>Boutiques</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Luxury Header */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-xl border-b border-[#E3D5C4] shadow-sm shadow-[#644B28]/10 py-3'
            : 'bg-gradient-to-b from-[#FAF8F5]/98 via-[#FAF8F5]/90 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#44403C] hover:text-[#AA771C] transition-colors focus:outline-none rounded-lg hover:bg-[#F2E8DC]"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <div className="flex items-center">
              <a href="#" className="group">
                <span className="font-heading text-2xl sm:text-3xl tracking-[0.22em] font-bold text-[#1C1917] hover:text-[#885C21] transition-colors block">
                  Astrra
                </span>
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onSelectCategory && onSelectCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200 rounded-full cursor-pointer ${
                    selectedCategory === cat
                      ? 'text-white bg-gradient-to-r from-[#C59733] to-[#AA771C] font-bold shadow-md shadow-[#C59733]/25'
                      : 'text-[#44403C] hover:text-[#885C21] hover:bg-[#F2E8DC]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>

            {/* Right Action Icons (Search, Wishlist, Cart) */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search Widget */}
              <div className="relative">
                {isSearchOpen ? (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center bg-white border border-[#C59733] rounded-full px-3 py-1.5 text-sm text-[#1C1917] shadow-lg shadow-[#644B28]/5 focus-within:ring-2 focus-within:ring-[#C59733]/30 transition-all duration-300"
                  >
                    <Search className="w-4 h-4 text-[#C59733] mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search gold, solitaire, jhumkas..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (onSearch) onSearch(e.target.value);
                      }}
                      autoFocus
                      className="bg-transparent border-none outline-none text-xs sm:text-sm text-[#1C1917] placeholder-[#78716C] w-36 sm:w-56 focus:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                        if (onSearch) onSearch('');
                      }}
                      className="text-[#78716C] hover:text-[#1C1917] ml-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-[#44403C] hover:text-[#885C21] hover:bg-[#F2E8DC] rounded-full transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                    aria-label="Search Catalogue"
                  >
                    <Search className="w-5 h-5 text-[#885C21]" />
                    <span className="hidden sm:inline text-[11px] text-[#57534E]">Search</span>
                  </button>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => {
                  if (onSelectCategory) onSelectCategory('All');
                }}
                className="p-2 text-[#44403C] hover:text-[#885C21] hover:bg-[#F2E8DC] rounded-full transition-colors relative cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 text-[#885C21]" />
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#885C21] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {activeWishlistCount}
                </span>
              </button>

              {/* Shopping Bag Button with Glowing Counter */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FDF9F3] border border-[#DFB76C] hover:border-[#AA771C] rounded-full text-[#885C21] transition-all duration-300 shadow-sm shadow-[#644B28]/10 group cursor-pointer"
                aria-label="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110 text-[#AA771C]" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-gradient-to-r from-[#C59733] to-[#AA771C] text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white animate-bounce">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-bold tracking-wider uppercase text-[#292524] group-hover:text-[#885C21]">
                  Bag {totalItems > 0 && `(${totalItems})`}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-3 pt-3 pb-3 bg-white/98 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-[#E3D5C4] animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="space-y-1">
                <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-[#885C21]">
                  Explore Collections
                </div>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(cat);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium tracking-wider uppercase transition-colors flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-[#F5ECE1] text-[#885C21] font-bold border border-[#DFB76C]'
                        : 'text-[#44403C] hover:text-[#885C21] hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Sparkles className="w-3.5 h-3.5 text-[#C59733]" />}
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#E3D5C4] text-xs text-[#57534E] space-y-2">
                <div className="flex items-center gap-2 text-[#885C21] font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#C59733]" />
                  <span>100% BIS Hallmarked 22K & 18K Gold</span>
                </div>
                <p className="text-[11px] text-[#78716C]">Free White-Glove Insured Delivery Across India</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
