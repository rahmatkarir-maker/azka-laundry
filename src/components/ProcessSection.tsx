import {
  CheckCircle2,
  Layers,
  MessageSquare,
  PackageCheck,
  Scale,
  Tag,
} from 'lucide-react';
import { PROCESS_STEPS } from '../data/laundryData';

const STEP_ICONS = [
  Scale,
  Tag,
  Layers,
  CheckCircle2,
  PackageCheck,
  MessageSquare,
];

export default function ProcessSection() {
  return (
    <section id="proses" className="border-t border-slate-100 bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-teal-700">
              Standar Proses Kami
            </p>
            <h2
              className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl lg:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              6 Langkah Teratur Agar Pakaian Anda Tetap Aman &amp; Tidak Tertukar
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600">
            Setiap pesanan melewati alur pencatatan dan pemeriksaan yang
            konsisten sejak pertama kali ditimbang hingga diterima kembali.
          </p>
        </div>

        {/* Visual Timeline / Stepper Grid */}
        <ol className="relative mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {PROCESS_STEPS.map((item, index) => {
            const Icon = STEP_ICONS[index] ?? CheckCircle2;
            const isLast = index === PROCESS_STEPS.length - 1;

            return (
              <li
                key={item.step}
                className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6"
              >
                {/* Step Number & Connector Bar */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0F9FF] font-mono text-sm font-bold tabular-nums text-[#0284C7]">
                      {item.step}
                    </span>
                    <Icon
                      className="h-5 w-5 text-teal-600"
                      aria-hidden="true"
                    />
                  </div>
                  {!isLast && (
                    <span
                      className="hidden h-px flex-1 bg-slate-200 lg:block"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <h3 className="mt-5 font-display text-lg font-bold text-[#0F172A]">
                  {item.step}. {item.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
