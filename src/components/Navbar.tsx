import { useState } from 'react';
import { Menu, MessageCircle, WashingMachine, X } from 'lucide-react';
import { BRAND_INFO, buildWhatsAppUrl } from '../data/laundryData';

const NAV_LINKS = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Layanan', href: '#layanan' },
  { label: 'Proses Kerja', href: '#proses' },
  { label: 'Kalkulator Harga', href: '#kalkulator' },
  { label: 'Untuk Siapa', href: '#segmen' },
  { label: 'Tentang Kami', href: '#tentang' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const quickWaUrl = buildWhatsAppUrl(
    'Halo Azka Laundry Ulee Kareng, saya ingin menanyakan info layanan dan jadwal laundry.'
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#beranda"
          className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0EA5E9]"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0EA5E9] text-white"
            aria-hidden="true"
          >
            <WashingMachine className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">
            {BRAND_INFO.name}
          </span>
        </a>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav
          aria-label="Navigasi utama"
          className="hidden items-center lg:flex lg:gap-4 xl:gap-6"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 whitespace-nowrap py-1 text-sm font-medium text-slate-600 transition-colors duration-150 hover:text-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0EA5E9]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Button */}
        <div className="flex shrink-0 items-center gap-3">
          <a
            href={quickWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-[40px] shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-[#0EA5E9] px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9] sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Pesan via WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors duration-150 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9] lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-5 pt-3 lg:hidden">
          <nav aria-label="Navigasi seluler" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#0284C7]"
              >
                {link.label}
              </a>
            ))}
            <a
              href={quickWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0284C7]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Pesan via WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
