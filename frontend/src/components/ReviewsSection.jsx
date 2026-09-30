import { Star, ShieldCheck, Sparkles } from 'lucide-react';

export const ReviewsSection = () => {
  const reviews = [
    {
      name: 'Ananya Singhania',
      city: 'Mumbai, Maharashtra',
      rating: 5,
      title: 'Flawless 22K Bridal Heritage Set',
      review: 'Ordered our wedding choker set from Astrra. The BIS hallmark and HUID authenticity gave us complete peace of mind. Delivery via Sequel courier was white-glove and seamless.',
      item: 'Nizam Heritage Polki Choker',
      date: 'September 2026'
    },
    {
      name: 'Dr. Radhika Iyer',
      city: 'Bengaluru, Karnataka',
      rating: 5,
      title: 'Exceptional Solitaire Brilliance',
      review: 'The GIA graded VVS1 solitaire diamond ring sparkles beyond words. The 3D secure card checkout and WhatsApp updates kept me informed at every step.',
      item: 'Aura Solitaire Diamond Ring (18K)',
      date: 'August 2026'
    },
    {
      name: 'Meera Kapoor',
      city: 'New Delhi',
      rating: 5,
      title: 'Breathtaking Jhumkas & Craftsmanship',
      review: 'The intricate gold filigree work on the 22K jhumkas is masterclass karigari. Truly authentic luxury Indian jewellery experience with zero hassle.',
      item: 'Royal Sapphire Huggie Hoops',
      date: 'September 2026'
    }
  ];

  return (
    <section className="py-20 bg-[#F6EFE6] border-t border-[#E3D5C4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#885C21] border border-[#DFB76C] text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C59733]" />
            <span>Client Testimonials</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917]">
            Adorned by Over 15,000 Connoisseurs
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] font-normal">
            Read real stories from our patrons across India celebrating weddings, milestones, and timeless heirlooms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E3D5C4] hover:border-[#DFB76C] transition-all duration-300 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-lg group"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#C59733]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#1C1917] group-hover:text-[#885C21] transition-colors">
                  &ldquo;{rev.title}&rdquo;
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed font-normal">
                  {rev.review}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E3D5C4] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#1C1917] flex items-center gap-1">
                    <span>{rev.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  </h4>
                  <p className="text-[10px] text-[#78716C]">{rev.city}</p>
                </div>
                <span className="text-[10px] text-[#885C21] font-serif font-bold bg-[#FAF3E8] px-2.5 py-1 rounded-full border border-[#DFB76C]">
                  {rev.item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
