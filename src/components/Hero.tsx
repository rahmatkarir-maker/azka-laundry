import {
  ArrowRight,
  Calculator,
  Clock,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
} from 'lucide-react';
import { BRAND_INFO } from '../data/laundryData';

interface HeroProps {
  onQuickEstimate: () => void;
  onQuickPickup: () => void;
}

const TRUST_HIGHLIGHTS = [
  {
    icon: Tag,
    title: 'Pencatatan & Label Aman',
    desc: 'Timbang transparan dan kode label khusus di setiap pesanan agar pakaian tidak tertukar.',
  },
  {
    icon: Sparkles,
    title: 'Pemisahan Cucian',
    desc: 'Pakaian putih, berwarna, dan bahan sensitif dipisah agar warna tetap cerah dan kain awet.',
  },
  {
    icon: MessageCircle,
    title: 'Notifikasi WhatsApp',
    desc: 'Kabar langsung lewat WhatsApp begitu cucian selesai dan siap diambil atau diantar.',
  },
  {
    icon: ShieldCheck,
    title: 'Garansi Keluhan',
    desc: 'Penanganan cepat dan bertanggung jawab jika hasil cucian belum sesuai standar kami.',
  },
];

export default function Hero({ onQuickEstimate, onQuickPickup }: HeroProps) {
  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-gradient-to-b from-[#F0F9FF]/70 via-white to-white pt-10 pb-14 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Balanced Split */}
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Core Proposition */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <div className="mb-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm font-medium text-[#0369A1]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#0EA5E9]" aria-hidden="true" />
                <span>{BRAND_INFO.locationShort}</span>
              </span>
              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>
              <span className="text-teal-700">
                {BRAND_INFO.values.join(' · ')}
              </span>
            </div>

            <h1
              className="font-display text-[#0F172A] font-extrabold tracking-tight"
              style={{
                fontSize: 'clamp(2.2rem, 4.2vw, 3.45rem)',
                lineHeight: 1.12,
                textWrap: 'balance',
              }}
            >
              Cucian Bersih, Rapi, Wangi &amp; Tepat Waktu — Tanpa Repot.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              <strong className="font-semibold text-[#0F172A]">
                Azka Laundry — {BRAND_INFO.tagline}.
              </strong>{' '}
              Solusi laundry kiloan terpercaya untuk keluarga, pekerja,
              mahasiswa, dan penginapan di sekitar Ulee Kareng.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onQuickPickup}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#0EA5E9] px-6 py-3 text-base font-semibold text-white transition-all duration-150 hover:bg-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9]"
              >
                <Truck className="h-5 w-5" aria-hidden="true" />
                Pesan Antar-Jemput
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onQuickEstimate}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-[#0F172A] transition-colors duration-150 hover:border-[#0EA5E9] hover:text-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9]"
              >
                <Calculator className="h-5 w-5 text-[#0EA5E9]" aria-hidden="true" />
                Hitung Estimasi Biaya
              </button>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Estimasi operasional: {BRAND_INFO.hours}
            </p>
          </div>

          {/* Right Column: Clean Editorial Service Overview Visual */}
          <div className="flex lg:col-span-5">
            <div className="relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              {/* Subtle Geometric Fresh-Water Accent Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <p className="text-xs font-semibold text-teal-700">
                    Standar Perawatan Pakaian
                  </p>
                  <h2 className="mt-1 font-display text-xl font-bold text-[#0F172A]">
                    Layanan Utama Ulee Kareng
                  </h2>
                </div>
                {/* Minimal Clean Laundry Drum Vector Emblem */}
                <svg
                  viewBox="0 0 56 56"
                  className="h-12 w-12 shrink-0"
                  aria-hidden="true"
                >
                  <rect
                    x="4"
                    y="4"
                    width="48"
                    height="48"
                    rx="14"
                    fill="#F0F9FF"
                    stroke="#BAE6FD"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="28"
                    cy="31"
                    r="13"
                    fill="#FFFFFF"
                    stroke="#0EA5E9"
                    strokeWidth="2"
                  />
                  <path
                    d="M17.5 32.5C20.5 29.5 24 30 28 32C32 34 35.5 33.5 38.5 31C38.2 37 33.6 41.5 28 41.5C22.4 41.5 17.8 37.5 17.5 32.5Z"
                    fill="#CCFBF1"
                  />
                  <circle cx="15" cy="12" r="2" fill="#0EA5E9" />
                  <circle cx="21" cy="12" r="2" fill="#5EEAD4" />
                  <rect x="33" y="10.5" width="11" height="3" rx="1.5" fill="#CBD5E1" />
                </svg>
              </div>

              {/* Rate Snapshot Rows */}
              <div className="my-5 divide-y divide-slate-100">
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">
                      Cuci + Setrika Reguler
                    </p>
                    <p className="text-xs text-slate-500">
                      Paling populer · Estimasi 2–3 hari
                    </p>
                  </div>
                  <p className="font-mono text-base font-semibold tabular-nums text-[#0284C7]">
                    Rp7.000<span className="text-xs font-normal text-slate-500">/kg</span>
                  </p>
                </div>

                <div className="flex items-baseline justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">
                      Cuci Kering Lipat
                    </p>
                    <p className="text-xs text-slate-500">
                      Hemat tanpa setrika · 1–2 hari
                    </p>
                  </div>
                  <p className="font-mono text-base font-semibold tabular-nums text-[#0F172A]">
                    Rp5.000<span className="text-xs font-normal text-slate-500">/kg</span>
                  </p>
                </div>

                <div className="flex items-baseline justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">
                      Layanan Express
                    </p>
                    <p className="text-xs text-slate-500">
                      Prioritas 6–24 jam · Kuota harian
                    </p>
                  </div>
                  <p className="font-mono text-base font-semibold tabular-nums text-[#0F172A]">
                    Rp12.000<span className="text-xs font-normal text-slate-500">/kg</span>
                  </p>
                </div>

                <div className="flex items-baseline justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">
                      Bed Cover &amp; Selimut
                    </p>
                    <p className="text-xs text-slate-500">
                      Dicuci terpisah · Mulai dari
                    </p>
                  </div>
                  <p className="font-mono text-base font-semibold tabular-nums text-[#0F172A]">
                    Rp25.000<span className="text-xs font-normal text-slate-500">/pcs</span>
                  </p>
                </div>
              </div>

              {/* Hygienic Assurance Footer Strip */}
              <div className="flex items-center justify-between gap-3 rounded-xl bg-[#F0FDFA] px-4 py-3 text-xs text-teal-900">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
                  <span>Gratis jemput sekitar Ulee Kareng untuk min. Rp35.000*</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Trust Strip Below Hero Split */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white lg:mt-16">
          <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {TRUST_HIGHLIGHTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`p-5 sm:p-6 ${
                    idx === 2 || idx === 3 ? 'sm:border-t sm:border-slate-200 lg:border-t-0' : ''
                  } ${idx === 1 || idx === 3 ? 'sm:border-l sm:border-slate-200' : ''}`}
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0F9FF] text-[#0284C7]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-base font-bold text-[#0F172A]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
