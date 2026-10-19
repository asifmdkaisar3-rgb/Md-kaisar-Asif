import React from 'react';
import { Film, User, Palette, Layers, Sparkles, Scissors, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectService: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectService
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'film':
        return <Film className="w-6 h-6 text-[#E8913C]" />;
      case 'user':
        return <User className="w-6 h-6 text-[#E8913C]" />;
      case 'palette':
        return <Palette className="w-6 h-6 text-[#E8913C]" />;
      case 'layers':
        return <Layers className="w-6 h-6 text-[#E8913C]" />;
      case 'sparkles':
        return <Sparkles className="w-6 h-6 text-[#E8913C]" />;
      case 'scissors':
        return <Scissors className="w-6 h-6 text-[#E8913C]" />;
      default:
        return <Film className="w-6 h-6 text-[#E8913C]" />;
    }
  };

  const enabledServices = services.filter(s => s.enabled);

  if (enabledServices.length === 0) return null;

  return (
    <section id="services" className="py-24 sm:py-32 bg-[#101317] border-t border-[rgba(237,231,220,0.08)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[rgba(237,231,220,0.1)]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#E8913C]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#E8913C] font-semibold">
                PROFESSIONAL OFFERINGS
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#EDE7DC] tracking-tight">
              Animation & Creative Services
            </h2>
            <p className="text-sm text-[#9EA5A8] max-w-xl">
              Available for independent film productions, YouTube animation series, advertising campaigns, and custom illustration commissions.
            </p>
          </div>

          <div className="text-xs font-mono text-[#2E6B72]">
            <span>Pipeline: Concept → Rigging → 24fps Delivery</span>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enabledServices.map((service, index) => (
            <div
              key={service.id}
              className="group relative flex flex-col justify-between p-8 rounded-2xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.12)] hover:border-[#E8913C]/40 transition-all duration-300 hover:shadow-2xl hover:shadow-black/60"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-[#101317] border border-[rgba(237,231,220,0.1)] group-hover:scale-110 transition-transform">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="font-mono text-xs text-[#6C7378]">
                    0{index + 1}.
                  </span>
                </div>

                <div className="space-y-2.5">
                  <h3 className="font-display text-xl font-bold text-[#EDE7DC] group-hover:text-[#E8913C] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9EA5A8] leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[rgba(237,231,220,0.08)]">
                <button
                  onClick={() => onSelectService(service.title)}
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#EDE7DC] group-hover:text-[#E8913C] transition-colors cursor-pointer"
                >
                  <span>Inquire for Project</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
