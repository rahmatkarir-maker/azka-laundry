import {
  Clock,
  FileText,
  MessageCircle,
  Minus,
  Plus,
  Truck,
} from 'lucide-react';
import {
  BRAND_INFO,
  CALCULATOR_TIERS,
  buildWhatsAppUrl,
  formatRupiah,
  type CalculatorServiceId,
} from '../data/laundryData';

interface PriceCalculatorProps {
  selectedServiceId: CalculatorServiceId;
  onChangeServiceId: (id: CalculatorServiceId) => void;
  quantity: number;
  onChangeQuantity: (qty: number) => void;
  needPickup: boolean;
  onChangeNeedPickup: (val: boolean) => void;
  onContinueToOrderForm: () => void;
}

export default function PriceCalculator({
  selectedServiceId,
  onChangeServiceId,
  quantity,
  onChangeQuantity,
  needPickup,
  onChangeNeedPickup,
  onContinueToOrderForm,
}: PriceCalculatorProps) {
  const activeTier =
    CALCULATOR_TIERS.find((t) => t.id === selectedServiceId) ??
    CALCULATOR_TIERS[0];

  const clampedQty = Math.min(
    Math.max(quantity, activeTier.minQty),
    activeTier.maxQty
  );

  const subtotal = clampedQty * activeTier.pricePerUnit;
  const qualifiesFreePickup = subtotal >= BRAND_INFO.freePickupMinRp;
  const pickupFee = needPickup
    ? qualifiesFreePickup
      ? 0
      : BRAND_INFO.estimatedPickupFeeRp
    : 0;
  const totalEstimate = subtotal + pickupFee;

  const handleSelectTier = (tierId: CalculatorServiceId) => {
    const nextTier = CALCULATOR_TIERS.find((t) => t.id === tierId);
    onChangeServiceId(tierId);
    if (nextTier) {
      const nextQty = Math.min(
        Math.max(quantity, nextTier.minQty),
        nextTier.maxQty
      );
      if (tierId === 'rumah-tangga' && quantity > 3) {
        onChangeQuantity(nextTier.defaultQty);
      } else {
        onChangeQuantity(nextQty);
      }
    }
  };

  const handleDecrement = () => {
    if (clampedQty > activeTier.minQty) {
      onChangeQuantity(clampedQty - 1);
    }
  };

  const handleIncrement = () => {
    if (clampedQty < activeTier.maxQty) {
      onChangeQuantity(clampedQty + 1);
    }
  };

  const whatsappMessage = [
    'Halo Azka Laundry Ulee Kareng, saya ingin memesan laundry dengan estimasi berikut:',
    '',
    `• Layanan: ${activeTier.name}`,
    `• Perkiraan Jumlah: ${clampedQty} ${activeTier.unitLabel}`,
    `• Estimasi Waktu Selesai: ${activeTier.turnaround}`,
    `• Antar-Jemput: ${
      needPickup
        ? qualifiesFreePickup
          ? 'Ya (Estimasi Gratis Ongkir)'
          : `Ya (Estimasi ongkir ${formatRupiah(pickupFee)})`
        : 'Tidak (Antar sendiri ke outlet)'
    }`,
    `• Total Estimasi Awal: ${formatRupiah(totalEstimate)}`,
    '',
    'Mohon konfirmasi ketersediaan jadwalnya ya. Terima kasih!',
  ].join('\n');

  const whatsappHref = buildWhatsAppUrl(whatsappMessage);

  return (
    <section
      id="kalkulator"
      className="border-t border-slate-200/80 bg-[#F8FAFC] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[#0284C7]">
            Kalkulator Estimasi Harga
          </p>
          <h2
            className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl lg:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Hitung Perkiraan Biaya Laundry Anda Sebelum Memesan
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Pilih jenis layanan, atur perkiraan berat atau jumlah item, lalu
            kirim rinciannya langsung ke WhatsApp kami dalam satu klik.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-stretch gap-6 lg:mt-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Panel: Interactive Controls */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-7">
            <div>
              {/* Step 1: Service Picker */}
              <div>
                <label className="block text-sm font-bold text-[#0F172A]">
                  1. Pilih Jenis Layanan
                </label>
                <div
                  role="radiogroup"
                  aria-label="Pilihan layanan laundry"
                  className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2"
                >
                  {CALCULATOR_TIERS.map((tier) => {
                    const isSelected = tier.id === activeTier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => handleSelectTier(tier.id)}
                        className={`flex min-h-[56px] flex-col items-start justify-center rounded-xl border px-4 py-3 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9] ${
                          isSelected
                            ? 'border-[#0EA5E9] bg-[#F0F9FF] text-[#0F172A]'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-sm font-bold text-[#0F172A]">
                          {tier.name}
                        </span>
                        <span className="mt-0.5 font-mono text-xs tabular-nums text-[#0284C7]">
                          {formatRupiah(tier.pricePerUnit)} / {tier.unitLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Quantity Stepper + Slider */}
              <div className="mt-7 border-t border-slate-100 pt-7">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <label
                      htmlFor="qty-slider"
                      className="block text-sm font-bold text-[#0F172A]"
                    >
                      2. Perkiraan Jumlah ({activeTier.unit === 'kg' ? 'Kilogram' : 'Potong / Pcs'})
                    </label>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {activeTier.description}
                    </p>
                  </div>

                  {/* Stepper Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={clampedQty <= activeTier.minQty}
                      aria-label="Kurangi jumlah"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0F172A] transition-colors hover:border-[#0EA5E9] hover:text-[#0284C7] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9]"
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>

                    <div className="min-w-[84px] rounded-xl bg-[#F8FAFC] px-3 py-2 text-center font-mono text-lg font-bold tabular-nums text-[#0F172A]">
                      {clampedQty}{' '}
                      <span className="text-xs font-medium text-slate-500">
                        {activeTier.unitLabel}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleIncrement}
                      disabled={clampedQty >= activeTier.maxQty}
                      aria-label="Tambah jumlah"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0F172A] transition-colors hover:border-[#0EA5E9] hover:text-[#0284C7] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9]"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Range Slider */}
                <div className="mt-5">
                  <input
                    id="qty-slider"
                    type="range"
                    min={activeTier.minQty}
                    max={activeTier.maxQty}
                    step={1}
                    value={clampedQty}
                    onChange={(e) => onChangeQuantity(Number(e.target.value))}
                    className="azka-slider"
                    aria-valuemin={activeTier.minQty}
                    aria-valuemax={activeTier.maxQty}
                    aria-valuenow={clampedQty}
                  />
                  <div className="mt-2 flex justify-between font-mono text-xs tabular-nums text-slate-400">
                    <span>
                      {activeTier.minQty} {activeTier.unitLabel}
                    </span>
                    <span>
                      {Math.round((activeTier.minQty + activeTier.maxQty) / 2)}{' '}
                      {activeTier.unitLabel}
                    </span>
                    <span>
                      {activeTier.maxQty} {activeTier.unitLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 3: Pickup Checkbox */}
              <div className="mt-7 border-t border-slate-100 pt-7">
                <label className="flex cursor-pointer items-start gap-3.5 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 transition-colors hover:border-[#7DD3FC]">
                  <input
                    type="checkbox"
                    checked={needPickup}
                    onChange={(e) => onChangeNeedPickup(e.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-[#0EA5E9] accent-[#0EA5E9] focus:ring-[#0EA5E9]"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0F172A]">
                        <Truck className="h-4 w-4 text-[#0284C7]" aria-hidden="true" />
                        Butuh Antar-Jemput (Sekitar Ulee Kareng)
                      </span>
                      <span className="font-mono text-xs font-semibold tabular-nums text-teal-700">
                        {qualifiesFreePickup
                          ? 'Estimasi Gratis'
                          : `+${formatRupiah(BRAND_INFO.estimatedPickupFeeRp)}`}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      Estimasi gratis antar-jemput untuk transaksi minimal{' '}
                      {formatRupiah(BRAND_INFO.freePickupMinRp)} pada area
                      jangkauan terdekat. Di bawah minimum, estimasi ongkir{' '}
                      {formatRupiah(BRAND_INFO.estimatedPickupFeeRp)}.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Panel: Live Estimate Summary */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#0F172A] p-6 text-white sm:p-8 lg:col-span-5">
            <div>
              <p className="text-xs font-semibold tracking-wide text-[#7DD3FC]">
                Ringkasan Estimasi Anda
              </p>
              <h3 className="mt-1 font-display text-xl font-bold tracking-wide text-white">
                {activeTier.name}
              </h3>

              {/* Itemized Breakdown */}
              <dl className="mt-6 space-y-3.5 border-y border-slate-700/80 py-5 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-300">Tarif Dasar</dt>
                  <dd className="font-mono tabular-nums text-white">
                    {formatRupiah(activeTier.pricePerUnit)} / {activeTier.unitLabel}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-300">Perkiraan Jumlah</dt>
                  <dd className="font-mono tabular-nums text-white">
                    {clampedQty} {activeTier.unitLabel}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-300">Subtotal Layanan</dt>
                  <dd className="font-mono tabular-nums text-white">
                    {formatRupiah(subtotal)}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-300">Antar-Jemput</dt>
                  <dd className="font-mono tabular-nums text-[#5EEAD4]">
                    {!needPickup
                      ? 'Antar sendiri'
                      : pickupFee === 0
                        ? 'Gratis (Estimasi)'
                        : formatRupiah(pickupFee)}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="inline-flex items-center gap-1.5 text-slate-300">
                    <Clock className="h-4 w-4 text-[#7DD3FC]" aria-hidden="true" />
                    Estimasi Selesai
                  </dt>
                  <dd className="text-right font-medium text-white">
                    {activeTier.turnaround}
                  </dd>
                </div>
              </dl>

              {/* Live Total */}
              <div className="mt-6">
                <p className="text-xs tracking-wide text-slate-300">
                  Total Estimasi Awal
                </p>
                <p className="mt-1 font-mono text-4xl font-semibold tracking-tight tabular-nums text-white">
                  {formatRupiah(totalEstimate)}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  Berat akhir akan ditimbang ulang secara transparan saat cucian
                  diterima atau dijemput.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#0EA5E9] px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7DD3FC]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Kirim Pesanan Ini ke WhatsApp
              </a>

              <button
                type="button"
                onClick={onContinueToOrderForm}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors duration-150 hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7DD3FC]"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                Lengkapi Alamat di Form Pemesanan
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
