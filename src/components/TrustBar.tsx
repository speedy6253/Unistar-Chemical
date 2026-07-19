import { ShieldCheck, Truck, Headset, Zap, Users } from "lucide-react";

export default function TrustBar() {
  const trustItems = [
    {
      icon: ShieldCheck,
      title: "High Quality Products",
      desc: "Premium grade verified formulations",
    },
    {
      icon: Truck,
      title: "Reliable Supply",
      desc: "Timely delivery across India",
    },
    {
      icon: Headset,
      title: "Technical Support",
      desc: "Expert chemical assistance",
    },
    {
      icon: Zap,
      title: "Fast Logistics",
      desc: "Efficient bulk tanker transport",
    },
    {
      icon: Users,
      title: "Customer Satisfaction",
      desc: "Long term partnership focus",
    },
  ];

  return (
    <section className="relative z-20 -mt-12 lg:-mt-[70px] px-4 max-w-[1220px] mx-auto w-full">
      <div className="bg-white rounded-[28px] border border-[#123C74]/[0.06] shadow-[0_30px_80px_rgba(0,0,0,0.08)] p-[36px] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4 lg:divide-x divide-[#123C74]/[0.06] transition-all duration-250 hover:shadow-[0_40px_100px_rgba(18,60,116,0.12)] hover:-translate-y-[3px] group">
        {trustItems.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className={`flex flex-col items-center text-center p-4 ${
                idx === 0 ? "" : "lg:pl-6"
              }`}
            >
              <div className="w-14 h-14 bg-[#DFF7FA]/50 text-[#123C74] rounded-full flex items-center justify-center mb-4 shrink-0 transition-transform duration-300 group-hover:scale-105">
                <IconComponent className="w-6 h-6 text-[#123C74]" />
              </div>
              <h3 className="font-sans font-bold text-[18px] text-[#123C74] leading-snug">
                {item.title}
              </h3>
              <p className="text-[15px] text-gray-500 font-normal mt-2 leading-relaxed max-w-[190px]">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
