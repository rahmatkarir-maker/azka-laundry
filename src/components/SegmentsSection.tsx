import { useState } from 'react';
import {
  ArrowRight,
  Bed,
  Briefcase,
  Check,
  GraduationCap,
  Home,
} from 'lucide-react';
import {
  CUSTOMER_SEGMENTS,
  type CalculatorServiceId,
} from '../data/laundryData';

interface SegmentsSectionProps {
  onOrderForSegment: (serviceId: CalculatorServiceId, segmentTitle: string) => void;
}

const SEGMENT_ICONS: Record<string, typeof Home> = {
  keluarga: Home,
  pekerja: Briefcase,
  mahasiswa: GraduationCap,
  penginapan: Bed,
};

export default function SegmentsSection({
  onOrderForSegment,
}: SegmentsSectionProps) {
  const [activeId, setActiveId] = useState<string>(CUSTOMER_SEGMENTS[0].id);

  const activeSegment =
    CUSTOMER_SEGMENTS.find((s) => s.id === activeId) ?? CUSTOMER_SEGMENTS[0];
  const ActiveIcon = SEGMENT_ICONS[activeSegment.id] ?? Home;

  return (
    <section
      id="segmen"
      className="border-t border-slate-200/80 bg-[#F8FAFC] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[#0284C7]">Untuk Siapa</p>
          <h2
            className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl lg:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Layanan Sesuai Kebutuhan Anda di Kawasan Ulee Kareng
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Kami merancang ritme pencucian dan pilihan paket yang relevan untuk
            rutinitas setiap pelanggan, mulai dari rumah tangga hingga mitra
            penginapan.
          </p>
        </div>

        {/* Interactive Tab Selector */}
        <div
          role="tablist"
          aria-label="Segmen pelanggan Azka Laundry"
          className="mt-8 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 sm:grid-cols-4"
        >
          {CUSTOMER_SEGMENTS.map((segment) => {
            const Icon = SEGMENT_ICONS[segment.id] ?? Home;
            const isActive = segment.id === activeId;
            return (
              <button
                key={segment.id}
                type="button"
                role="tab"
                id={`tab-${segment.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${segment.id}`}
                onClick={() => setActiveId(segment.id)}
                className={`flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9] ${
                  isActive
                    ? 'bg-[#0EA5E9] text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#0F172A]'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{segment.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Segment Spotlight Panel */}
        <div
          role="tabpanel"
          id={`panel-${activeSegment.id}`}
          aria-labelledby={`tab-${activeSegment.id}`}
          className="mt-6 grid grid-cols-1 gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 lg:grid-cols-12 lg:items-center"
        >
          <div className="lg:col-span-7">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F9FF] text-[#0284C7]">
              <ActiveIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold text-[#0F172A]">
              {activeSegment.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-teal-700">
              {activeSegment.subtitle}
            </p>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
              {activeSegment.description}
            </p>

            <div className="mt-5 text-xs text-slate-500">
              <span>Rekomendasi layanan: </span>
              <strong className="font-semibold text-[#0F172A]">
                {activeSegment.recommendedLabel}
              </strong>
            </div>
          </div>

          <div className="flex flex-col justify-between border-t border-slate-100 pt-6 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div>
              <p className="text-sm font-bold text-[#0F172A]">
                Yang Paling Dibutuhkan:
              </p>
              <ul className="mt-3 space-y-2.5">
                {activeSegment.needs.map((need) => (
                  <li
                    key={need}
                    className="flex items-start gap-2.5 text-sm text-slate-600"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-teal-600"
                      aria-hidden="true"
                    />
                    <span>{need}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() =>
                onOrderForSegment(
                  activeSegment.recommendedService,
                  activeSegment.title
                )
              }
              className="mt-6 inline-flex min-h-[46px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9]"
            >
              {activeSegment.ctaLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* 4-Card Quick Overview Grid for Full Scannability */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CUSTOMER_SEGMENTS.map((segment) => {
            const Icon = SEGMENT_ICONS[segment.id] ?? Home;
            const isSelected = segment.id === activeId;
            return (
              <button
                key={segment.id}
                type="button"
                onClick={() => setActiveId(segment.id)}
                className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9] ${
                  isSelected
                    ? 'border-[#0EA5E9] bg-[#F0F9FF]/60'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 ${
                      isSelected ? 'text-[#0284C7]' : 'text-slate-500'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="font-display text-sm font-bold text-[#0F172A]">
                    {segment.title}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {segment.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
