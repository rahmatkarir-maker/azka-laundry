import { useEffect, useState, type FormEvent } from 'react';
import {
  Check,
  Clock,
  Copy,
  MapPin,
  MessageCircle,
  Send,
  Truck,
} from 'lucide-react';
import {
  BRAND_INFO,
  SERVICES,
  ULEE_KARENG_AREAS,
  WHATSAPP_DISPLAY,
  buildWhatsAppUrl,
  type ServiceId,
} from '../data/laundryData';

interface OrderFormSectionProps {
  prefillService: ServiceId;
  prefillPickup: boolean;
  prefillNote: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
}

export default function OrderFormSection({
  prefillService,
  prefillPickup,
  prefillNote,
}: OrderFormSectionProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [serviceId, setServiceId] = useState<ServiceId>(prefillService);
  const [needPickup, setNeedPickup] = useState<boolean>(prefillPickup);
  const [notes, setNotes] = useState(prefillNote);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedData, setSubmittedData] = useState<{
    message: string;
    waUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync external selections from Hero, Services, Calculator, or Segments
  useEffect(() => {
    setServiceId(prefillService);
  }, [prefillService]);

  useEffect(() => {
    setNeedPickup(prefillPickup);
  }, [prefillPickup]);

  useEffect(() => {
    if (prefillNote) {
      setNotes(prefillNote);
    }
  }, [prefillNote]);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!name.trim() || name.trim().length < 2) {
      nextErrors.name = 'Mohon masukkan nama lengkap atau nama panggilan Anda.';
    }
    const cleanDigits = phone.replace(/[\s\-+()]/g, '');
    if (!cleanDigits || !/^(08|628|8)[0-9]{7,13}$/.test(cleanDigits)) {
      nextErrors.phone =
        'Masukkan nomor WhatsApp yang valid (contoh: 081234567890).';
    }
    if (!address.trim() || address.trim().length < 5) {
      nextErrors.address =
        'Mohon tuliskan area atau alamat lengkap di sekitar Ulee Kareng.';
    }
    return nextErrors;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const selectedService =
      SERVICES.find((s) => s.id === serviceId)?.title ?? 'Cuci + Setrika Reguler';

    const message = [
      'Halo Azka Laundry Ulee Kareng, saya ingin melakukan pemesanan laundry:',
      '',
      `• Nama: ${name.trim()}`,
      `• No. WhatsApp: ${phone.trim()}`,
      `• Area / Alamat: ${address.trim()}`,
      `• Pilihan Layanan: ${selectedService}`,
      `• Antar-Jemput: ${needPickup ? 'Ya, mohon dijemput ke alamat' : 'Tidak, antar sendiri ke outlet'}`,
      `• Catatan Khusus: ${notes.trim() ? notes.trim() : 'Tidak ada catatan khusus'}`,
      '',
      'Mohon informasi jadwal penjemputan / konfirmasinya ya. Terima kasih!',
    ].join('\n');

    const waUrl = buildWhatsAppUrl(message);
    setSubmittedData({ message, waUrl });
    setCopied(false);

    // Open WhatsApp safely via a user-initiated synthetic anchor click (avoids window.open blockers)
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyMessage = async () => {
    if (!submittedData) return;
    try {
      await navigator.clipboard.writeText(submittedData.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleQuickArea = (areaName: string) => {
    setAddress((prev) => {
      if (!prev.trim()) return `${areaName}, Ulee Kareng`;
      if (prev.toLowerCase().includes(areaName.toLowerCase())) return prev;
      return `${prev.trim()} (${areaName})`;
    });
    if (errors.address) {
      setErrors((prev) => ({ ...prev, address: undefined }));
    }
  };

  return (
    <section
      id="pesan"
      className="border-t border-slate-200/80 bg-[#F8FAFC] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Guidance & Operational Details */}
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold text-[#0284C7]">
              Pemesanan &amp; Jemput Cucian
            </p>
            <h2
              className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl lg:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Pesan atau Jadwalkan Jemput Cucian via WhatsApp
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Isi formulir singkat di samping. Pesan WhatsApp Anda akan tersusun
              otomatis dan rapi sehingga tim kami bisa segera mengonfirmasi
              jadwal penjemputan atau penerimaan cucian.
            </p>

            <div className="mt-8 space-y-5 border-t border-slate-200 pt-6 text-sm">
              <div className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#0284C7]"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-[#0F172A]">Area Layanan</p>
                  <p className="mt-0.5 leading-relaxed text-slate-600">
                    {BRAND_INFO.addressNote}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#0284C7]"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-[#0F172A]">
                    Jam Operasional
                  </p>
                  <p className="mt-0.5 text-slate-600">{BRAND_INFO.hours}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle
                  className="mt-0.5 h-5 w-5 shrink-0 text-teal-600"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-[#0F172A]">
                    WhatsApp Resmi
                  </p>
                  <a
                    href={buildWhatsAppUrl(
                      'Halo Azka Laundry, saya ingin bertanya tentang layanan laundry.'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-block font-mono tabular-nums text-[#0284C7] underline-offset-4 hover:underline"
                  >
                    {WHATSAPP_DISPLAY}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Nama Pelanggan */}
                  <div>
                    <label
                      htmlFor="order-name"
                      className="block text-sm font-semibold text-[#0F172A]"
                    >
                      Nama Pelanggan <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="order-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name)
                          setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      placeholder="Contoh: Cut Nadia / Bapak Rizal"
                      aria-invalid={Boolean(errors.name)}
                      className={`mt-1.5 block min-h-[44px] w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                        errors.name
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                          : 'border-slate-300 focus:border-[#0EA5E9] focus:ring-[#0EA5E9]/20'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs font-medium text-rose-600">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Nomor WhatsApp */}
                  <div>
                    <label
                      htmlFor="order-phone"
                      className="block text-sm font-semibold text-[#0F172A]"
                    >
                      Nomor WhatsApp <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="order-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone)
                          setErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      placeholder="Contoh: 081234567890"
                      aria-invalid={Boolean(errors.phone)}
                      className={`mt-1.5 block min-h-[44px] w-full rounded-xl border px-3.5 py-2.5 font-mono text-sm text-[#0F172A] placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                        errors.phone
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                          : 'border-slate-300 focus:border-[#0EA5E9] focus:ring-[#0EA5E9]/20'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-xs font-medium text-rose-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Area / Alamat di Ulee Kareng */}
                <div>
                  <label
                    htmlFor="order-address"
                    className="block text-sm font-semibold text-[#0F172A]"
                  >
                    Area / Alamat di Ulee Kareng{' '}
                    <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="order-address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address)
                        setErrors((prev) => ({ ...prev, address: undefined }));
                    }}
                    placeholder="Contoh: Jl. T. Iskandar, Lorong ..., Ceurih, Ulee Kareng"
                    aria-invalid={Boolean(errors.address)}
                    className={`mt-1.5 block min-h-[44px] w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      errors.address
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                        : 'border-slate-300 focus:border-[#0EA5E9] focus:ring-[#0EA5E9]/20'
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1.5 text-xs font-medium text-rose-600">
                      {errors.address}
                    </p>
                  )}

                  {/* Quick Area Helper Buttons */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 text-xs text-slate-500">
                      Pilih cepat area:
                    </span>
                    {ULEE_KARENG_AREAS.map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => handleQuickArea(area)}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-[#0EA5E9] hover:bg-[#F0F9FF] hover:text-[#0369A1]"
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pilihan Layanan */}
                <div>
                  <label
                    htmlFor="order-service"
                    className="block text-sm font-semibold text-[#0F172A]"
                  >
                    Pilihan Layanan
                  </label>
                  <select
                    id="order-service"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value as ServiceId)}
                    className="mt-1.5 block min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#0F172A] focus:border-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20"
                  >
                    {SERVICES.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.title} ({service.priceLabel})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pickup Checkbox */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3">
                  <input
                    type="checkbox"
                    checked={needPickup}
                    onChange={(e) => setNeedPickup(e.target.checked)}
                    className="h-5 w-5 shrink-0 rounded border-slate-300 accent-[#0EA5E9]"
                  />
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[#0F172A]">
                    <Truck className="h-4 w-4 text-[#0284C7]" aria-hidden="true" />
                    Saya butuh layanan jemput &amp; antar ke alamat di atas
                  </span>
                </label>

                {/* Catatan Khusus */}
                <div>
                  <label
                    htmlFor="order-notes"
                    className="block text-sm font-semibold text-[#0F172A]"
                  >
                    Catatan Khusus{' '}
                    <span className="font-normal text-slate-400">(Opsional)</span>
                  </label>
                  <textarea
                    id="order-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Misal: pakaian putih dipisah, sensitif pewangi menyengat, atau jam jemput sekitar pukul 16.00 WIB."
                    className="mt-1.5 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#0EA5E9] px-6 py-3 text-base font-semibold text-white transition-colors duration-150 hover:bg-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9]"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Kirim Pesanan ke WhatsApp
                </button>
              </form>

              {/* Post-Submit Confirmation & Fallback Direct Link */}
              {submittedData && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-6 rounded-xl border border-teal-200 bg-[#F0FDFA] p-5"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-teal-900">
                    <Check className="h-4 w-4 text-teal-700" aria-hidden="true" />
                    Format Pesanan Siap Dikirim ke WhatsApp
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-teal-800">
                    Jika jendela WhatsApp tidak terbuka otomatis, klik tombol di
                    bawah atau salin teks pesanan Anda.
                  </p>

                  <pre className="mt-3 max-h-44 overflow-y-auto whitespace-pre-wrap rounded-lg border border-teal-200/80 bg-white p-3 font-sans text-xs leading-relaxed text-slate-700">
                    {submittedData.message}
                  </pre>

                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <a
                      href={submittedData.waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-700"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      Buka WhatsApp Sekarang
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="inline-flex min-h-[42px] items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-teal-300 bg-white px-4 py-2 text-xs font-semibold text-teal-900 transition-colors hover:bg-teal-50"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-teal-700" aria-hidden="true" />
                          Pesan Tersalin
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" aria-hidden="true" />
                          Salin Pesan
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
