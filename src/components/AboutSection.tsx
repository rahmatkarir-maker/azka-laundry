import { CheckCircle2, HeartHandshake, ShieldCheck, Target } from 'lucide-react';
import { BRAND_INFO } from '../data/laundryData';

const MISSIONS = [
  'Memberikan hasil cucian yang bersih, higienis, rapi, dan wangi di setiap pesanan.',
  'Menjaga pakaian pelanggan dengan proses kerja yang teratur, berlabel khusus, dan terpisah.',
  'Melayani setiap pelanggan secara ramah, jujur, dan transparan sejak penimbangan awal.',
  'Mengembangkan layanan laundry yang praktis, mudah dijangkau, dan tepat waktu di Ulee Kareng.',
];

const GUARANTEES = [
  {
    title: 'Keamanan Pakaian Terjaga',
    desc: 'Pencatatan detail dan label kode unik di setiap kantong cucian mencegah risiko pakaian tertukar.',
  },
  {
    title: 'Standar Kebersihan Konsisten',
    desc: 'Pemisahan pakaian dan pemeriksaan hasil sebelum dikemas memastikan pakaian siap langsung dipakai.',
  },
  {
    title: 'Penanganan Keluhan Responsif',
    desc: 'Jika ada hasil yang belum sesuai harapan, hubungi kami via WhatsApp agar segera kami tindak lanjuti dengan baik.',
  },
];

export default function AboutSection() {
  return (
    <section id="tentang" className="border-t border-slate-100 bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Vision & Mission */}
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold text-[#0284C7]">Tentang Kami</p>
            <h2
              className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl lg:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Mitra Laundry Lokal yang Mengutamakan Kerapian &amp; Kepercayaan
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Hadir untuk masyarakat {BRAND_INFO.locationShort},{' '}
              <strong className="font-semibold text-[#0F172A]">
                {BRAND_INFO.name}
              </strong>{' '}
              membawa semangat <em>&ldquo;{BRAND_INFO.tagline}&rdquo;</em>. Kami
              percaya layanan laundry yang baik bukan sekadar mencuci, tetapi
              menjaga kenyamanan dan waktu berharga Anda setiap hari.
            </p>

            {/* Visi Block */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6">
              <div className="flex items-center gap-2.5 text-[#0284C7]">
                <Target className="h-5 w-5" aria-hidden="true" />
                <h3 className="font-display text-base font-bold text-[#0F172A]">
                  Visi Kami
                </h3>
              </div>
              <p className="mt-2.5 text-base leading-relaxed text-slate-700">
                Menjadi layanan laundry lokal yang terpercaya, mudah dijangkau,
                dan dikenal karena kebersihan, kerapian, serta ketepatan waktu.
              </p>
            </div>

            {/* Misi List */}
            <div className="mt-8">
              <div className="flex items-center gap-2.5">
                <HeartHandshake
                  className="h-5 w-5 text-teal-600"
                  aria-hidden="true"
                />
                <h3 className="font-display text-lg font-bold text-[#0F172A]">
                  Misi Kami
                </h3>
              </div>

              <ol className="mt-4 space-y-3">
                {MISSIONS.map((mission, idx) => (
                  <li
                    key={mission}
                    className="flex items-start gap-3 text-sm leading-relaxed text-slate-600 sm:text-base"
                  >
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#F0F9FF] font-mono text-xs font-bold tabular-nums text-[#0284C7]">
                      0{idx + 1}
                    </span>
                    <span>{mission}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right Column: Jaminan Layanan Box */}
          <div className="flex lg:col-span-5">
            <div className="flex w-full flex-col justify-between rounded-2xl border border-teal-200 bg-[#F0FDFA] p-6 sm:p-8">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white">
                  <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                </div>

                <h3 className="mt-5 font-display text-2xl font-extrabold text-[#0F172A]">
                  Jaminan Layanan
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-teal-900/85">
                  Komitmen nyata Azka Laundry agar Anda merasa tenang setiap
                  kali menitipkan pakaian kepada kami.
                </p>

                <div className="mt-6 space-y-5 border-t border-teal-200/80 pt-6">
                  {GUARANTEES.map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-teal-700"
                        aria-hidden="true"
                      />
                      <div>
                        <h4 className="font-display text-sm font-bold text-[#0F172A]">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-sm leading-relaxed text-slate-700">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-teal-200/80 pt-5 text-xs font-medium text-teal-900">
                Nilai Utama: {BRAND_INFO.values.join(' · ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
