import { Clock, MapPin, MessageCircle, WashingMachine } from 'lucide-react';
import {
  BRAND_INFO,
  WHATSAPP_DISPLAY,
  buildWhatsAppUrl,
} from '../data/laundryData';

const FOOTER_LINKS = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Daftar Layanan', href: '#layanan' },
  { label: 'Kalkulator Harga', href: '#kalkulator' },
  { label: 'Standar Proses', href: '#proses' },
  { label: 'Untuk Siapa', href: '#segmen' },
  { label: 'Tentang Kami', href: '#tentang' },
  { label: 'Form Pemesanan', href: '#pesan' },
];

export default function Footer() {
  const floatingWaUrl = buildWhatsAppUrl(
    'Halo Azka Laundry Ulee Kareng, saya ingin bertanya atau memesan layanan laundry.'
  );

  return (
    <>
      <footer className="bg-[#0F172A] text-slate-300">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            {/* Brand Identity */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-2.5 text-white">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0EA5E9] text-white"
                  aria-hidden="true"
                >
                  <WashingMachine className="h-5 w-5" />
                </span>
                <span className="font-display text-lg font-extrabold tracking-wide">
                  {BRAND_INFO.name}
                </span>
              </div>

              <p className="mt-3 text-sm font-medium tracking-wide text-[#7DD3FC]">
                {BRAND_INFO.tagline}
              </p>

              <p className="mt-2 text-sm tracking-wide text-slate-400">
                {BRAND_INFO.values.join(' • ')}
              </p>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                Layanan laundry kiloan, setrika, bed cover, dan antar-jemput
                untuk masyarakat sekitar Ulee Kareng, Banda Aceh.
              </p>
            </div>

            {/* Address & Operational Hours */}
            <div className="space-y-4 md:col-span-4">
              <h3 className="font-display text-sm font-bold tracking-wide text-white">
                Lokasi &amp; Jam Operasional
              </h3>

              <div className="flex items-start gap-3 text-sm text-slate-300">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#7DD3FC]"
                  aria-hidden="true"
                />
                <p className="leading-relaxed">{BRAND_INFO.addressNote}</p>
              </div>

              <div className="flex items-start gap-3 text-sm text-slate-300">
                <Clock
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#5EEAD4]"
                  aria-hidden="true"
                />
                <p>{BRAND_INFO.hours}</p>
              </div>

              <div className="flex items-start gap-3 text-sm text-slate-300">
                <MessageCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#5EEAD4]"
                  aria-hidden="true"
                />
                <a
                  href={floatingWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono tabular-nums text-slate-200 underline-offset-4 hover:text-white hover:underline"
                >
                  WhatsApp: {WHATSAPP_DISPLAY}
                </a>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="md:col-span-3">
              <h3 className="font-display text-sm font-bold tracking-wide text-white">
                Navigasi Cepat
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-slate-800 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
            <p>
              &copy; {new Date().getFullYear()} {BRAND_INFO.name} ·{' '}
              {BRAND_INFO.locationShort}
            </p>
            <p>{BRAND_INFO.values.join(' · ')}</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button (compact on mobile to respect sticky height cap) */}
      <a
        href={floatingWaUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi Azka Laundry via WhatsApp"
        className="fixed bottom-5 right-5 z-40 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-teal-600 px-3.5 text-sm font-semibold text-white shadow-lg transition-transform duration-150 hover:scale-[1.03] hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400 sm:px-5"
      >
        <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="hidden whitespace-nowrap sm:inline">
          Chat WhatsApp
        </span>
      </a>
    </>
  );
}
