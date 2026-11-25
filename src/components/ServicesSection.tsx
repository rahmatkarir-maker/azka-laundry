import {
  ArrowUpRight,
  BedDouble,
  Check,
  Flame,
  Shirt,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react';
import {
  SERVICES,
  type CalculatorServiceId,
  type ServiceId,
} from '../data/laundryData';

interface ServicesSectionProps {
  onSelectForCalculator: (calcId: CalculatorServiceId) => void;
  onSelectPickupService: () => void;
}

const SERVICE_ICONS: Record<ServiceId, typeof Shirt> = {
  'cuci-setrika': Sparkles,
  'cuci-lipat': Shirt,
  express: Zap,
  'setrika-saja': Flame,
  'rumah-tangga': BedDouble,
  'antar-jemput': Truck,
};

export default function ServicesSection({
  onSelectForCalculator,
  onSelectPickupService,
}: ServicesSectionProps) {
  return (
    <section id="layanan" className="border-t border-slate-100 bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[#0284C7]">
            Pilihan Layanan
          </p>
          <h2
            className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl lg:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Layanan Laundry Lengkap untuk Setiap Kebutuhan Harian Anda
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Dari cucian kiloan harian hingga bed cover dan penjemputan langsung
            di kawasan Ulee Kareng. Pilih layanan di bawah untuk langsung
            menghitung estimasi biaya.
          </p>
        </div>

        {/* 6 Interactive Service Cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          {SERVICES.map((service) => {
            const Icon = SERVICE_ICONS[service.id];
            const isFeatured = Boolean(service.featured);

            const handleAction = () => {
              if (service.calcId) {
                onSelectForCalculator(service.calcId);
              } else {
                onSelectPickupService();
              }
            };

            return (
              <article
                key={service.id}
                className={`group flex flex-col justify-between rounded-2xl border p-6 transition-all duration-150 ${
                  isFeatured
                    ? 'border-[#0EA5E9] bg-[#F0F9FF]/55 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-[#7DD3FC]'
                }`}
              >
                <div>
                  {/* Top Row: Icon + Optional Quiet Popular Text */}
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                        isFeatured
                          ? 'bg-[#0EA5E9] text-white'
                          : 'bg-[#F0F9FF] text-[#0284C7]'
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    {service.featuredLabel && (
                      <span className="text-xs font-bold text-[#0369A1]">
                        {service.featuredLabel}
                      </span>
                    )}
                  </div>

                  {/* Title & Quiet Metadata */}
                  <h3 className="mt-5 font-display text-lg font-bold text-[#0F172A]">
                    {service.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
                    <span className="font-mono font-semibold tabular-nums text-[#0284C7]">
                      {service.priceLabel}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{service.turnaround}</span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {service.shortDesc}
                  </p>

                  {/* Key Points */}
                  <ul className="mt-4 space-y-2 border-t border-slate-200/70 pt-4">
                    {service.detailPoints.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-xs leading-relaxed text-slate-600"
                      >
                        <Check
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600"
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interactive Action Footer */}
                <div className="mt-6 pt-2">
                  <button
                    type="button"
                    onClick={handleAction}
                    className={`inline-flex min-h-[42px] w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9] ${
                      isFeatured
                        ? 'bg-[#0EA5E9] text-white hover:bg-[#0284C7]'
                        : 'bg-slate-50 text-[#0F172A] hover:bg-[#E0F2FE] hover:text-[#0369A1]'
                    }`}
                  >
                    <span>
                      {service.calcId
                        ? 'Hitung Estimasi Layanan Ini'
                        : 'Jadwalkan Antar-Jemput'}
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Required Pricing Disclaimer */}
        <p className="mt-6 text-sm italic text-slate-500">
          *Tarif tertera bersifat estimasi awal dan dapat disesuaikan dengan
          ketentuan lokasi.
        </p>
      </div>
    </section>
  );
}
