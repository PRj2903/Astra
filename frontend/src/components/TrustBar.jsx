import { Gem, Truck, RotateCcw, Award } from 'lucide-react';

export const TrustBar = () => {
  const trustItems = [
    {
      icon: <Award className="w-5 h-5 text-[#885C21]" />,
      title: "100% BIS Hallmarked",
      subtitle: "Govt. of India Certified 916 (22KT) & 750 (18KT) Gold with HUID",
      badge: "Govt. Verified"
    },
    {
      icon: <Gem className="w-5 h-5 text-[#885C21]" />,
      title: "IGI & GIA Certified",
      subtitle: "100% Natural Conflict-Free Diamonds with Individual Certificates",
      badge: "VVS-EF Graded"
    },
    {
      icon: <Truck className="w-5 h-5 text-[#885C21]" />,
      title: "Insured Transit Delivery",
      subtitle: "100% Insured priority dispatch via Sequel & Blue Dart across 24,000+ PINs",
      badge: "Free Pan-India"
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-[#885C21]" />,
      title: "Lifetime Exchange & Buyback",
      subtitle: "Guaranteed transparent valuation with zero metal deduction policy",
      badge: "100% Value Assurance"
    }
  ];

  return (
    <section className="border-y border-[#E3D5C4] bg-[#F7EFE6]/70 backdrop-blur-md relative overflow-hidden py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {trustItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#E3D5C4] hover:border-[#DFB76C] shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FAF3E8] border border-[#DFB76C] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-sm sm:text-base font-bold text-[#1C1917] group-hover:text-[#885C21] transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF3E8] text-[#885C21] border border-[#DFB76C]">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-[#57534E] leading-relaxed font-normal">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
