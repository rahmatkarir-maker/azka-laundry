/**
 * Konfigurasi utama dan data layanan AZKA LAUNDRY
 * Ganti nomor WhatsApp di bawah ini dengan nomor resmi outlet saat beroperasi.
 */
export const WHATSAPP_NUMBER = '6281234567890';
export const WHATSAPP_DISPLAY = '0812-3456-7890';

export const BRAND_INFO = {
  name: 'AZKA LAUNDRY',
  tagline: 'Kami Siap Sedia Melayani Anda',
  values: ['Bersih', 'Rapi', 'Wangi', 'Tepat Waktu'],
  locationShort: 'Ulee Kareng, Banda Aceh',
  addressNote:
    'Kawasan Ulee Kareng, Banda Aceh (Alamat lengkap ruko akan segera diumumkan).',
  hours: 'Setiap Hari, 08.00 – 21.00 WIB (Estimasi)',
  freePickupMinRp: 35000,
  estimatedPickupFeeRp: 5000,
};

export type ServiceId =
  | 'cuci-setrika'
  | 'cuci-lipat'
  | 'express'
  | 'setrika-saja'
  | 'rumah-tangga'
  | 'antar-jemput';

export type CalculatorServiceId =
  | 'cuci-setrika'
  | 'cuci-lipat'
  | 'setrika-saja'
  | 'express'
  | 'rumah-tangga';

export interface ServiceItem {
  id: ServiceId;
  calcId?: CalculatorServiceId;
  title: string;
  shortDesc: string;
  detailPoints: string[];
  priceLabel: string;
  turnaround: string;
  featured?: boolean;
  featuredLabel?: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'cuci-setrika',
    calcId: 'cuci-setrika',
    title: 'Cuci + Setrika Reguler',
    shortDesc:
      'Layanan utama untuk pakaian sehari-hari. Dicuci higienis, disetrika uap hingga licin, diberi pewangi lembut, dan dikemas rapi siap simpan.',
    detailPoints: [
      'Pemisahan pakaian putih & berwarna',
      'Setrika uap rapi anti-kusut',
      'Kemasan plastik bersih & wangi tahan lama',
    ],
    priceLabel: 'Rp7.000 / kg',
    turnaround: 'Estimasi 2–3 hari',
    featured: true,
    featuredLabel: 'Paling Populer',
  },
  {
    id: 'cuci-lipat',
    calcId: 'cuci-lipat',
    title: 'Cuci Kering Lipat',
    shortDesc:
      'Pilihan ekonomis dan praktis bagi pelanggan yang membutuhkan cucian bersih, kering tuntas, wangi, dan terlipat rapi tanpa setrika.',
    detailPoints: [
      'Cocok untuk kaos, pakaian santai & harian',
      'Pengeringan higienis bebas bau apek',
    ],
    priceLabel: 'Rp5.000 / kg',
    turnaround: 'Estimasi 1–2 hari',
  },
  {
    id: 'express',
    calcId: 'express',
    title: 'Layanan Express',
    shortDesc:
      'Pengerjaan prioritas bagi Anda yang membutuhkan pakaian bersih dan rapi dalam waktu singkat, dengan kuota harian terbatas dan biaya tambahan.',
    detailPoints: [
      'Antrean khusus prioritas pencucian & setrika',
      'Konfirmasi ketersediaan kuota via WhatsApp',
    ],
    priceLabel: 'Rp12.000 / kg',
    turnaround: 'Estimasi 6–24 jam',
  },
  {
    id: 'setrika-saja',
    calcId: 'setrika-saja',
    title: 'Setrika Saja',
    shortDesc:
      'Khusus pakaian yang sudah bersih dari rumah dan ingin dirapikan menggunakan setrika uap serta diberi sentuhan pewangi segar.',
    detailPoints: [
      'Hemat waktu untuk kemeja, seragam & gamis',
      'Dilipat rapi atau digantung sesuai permintaan',
    ],
    priceLabel: 'Rp5.000 / kg',
    turnaround: 'Estimasi 1–2 hari',
  },
  {
    id: 'rumah-tangga',
    calcId: 'rumah-tangga',
    title: 'Barang Rumah Tangga',
    shortDesc:
      'Pencucian menyeluruh untuk bed cover, selimut tebal, sprei, dan perlengkapan tidur. Tarif dihitung berdasarkan ukuran dan kondisi kain.',
    detailPoints: [
      'Dicuci terpisah per item agar tetap higienis',
      'Pengeringan tuntas agar lembut & tidak lembap',
    ],
    priceLabel: 'Mulai Rp25.000 / pcs',
    turnaround: 'Estimasi 2–4 hari',
  },
  {
    id: 'antar-jemput',
    title: 'Antar-Jemput',
    shortDesc:
      'Layanan praktis jemput dan antar langsung ke rumah, kos, atau kantor di sekitar Ulee Kareng sesuai area jangkauan, jadwal, dan minimum transaksi.',
    detailPoints: [
      'Penimbangan & pencatatan dikonfirmasi via WhatsApp',
      'Gratis ongkir untuk transaksi ≥ Rp35.000 (estimasi area dekat)',
    ],
    priceLabel: 'Sesuai area & min. order',
    turnaround: 'Sesuai jadwal harian',
  },
];

export interface CalculatorTier {
  id: CalculatorServiceId;
  name: string;
  unit: 'kg' | 'pcs';
  unitLabel: string;
  pricePerUnit: number;
  minQty: number;
  maxQty: number;
  defaultQty: number;
  turnaround: string;
  description: string;
}

export const CALCULATOR_TIERS: CalculatorTier[] = [
  {
    id: 'cuci-setrika',
    name: 'Cuci + Setrika Reguler',
    unit: 'kg',
    unitLabel: 'kg',
    pricePerUnit: 7000,
    minQty: 1,
    maxQty: 25,
    defaultQty: 4,
    turnaround: '2–3 hari kerja',
    description: 'Pakaian sehari-hari bersih, licin, dan wangi.',
  },
  {
    id: 'cuci-lipat',
    name: 'Cuci Kering Lipat',
    unit: 'kg',
    unitLabel: 'kg',
    pricePerUnit: 5000,
    minQty: 1,
    maxQty: 25,
    defaultQty: 5,
    turnaround: '1–2 hari kerja',
    description: 'Pilihan hemat, kering tuntas dan lipat rapi.',
  },
  {
    id: 'setrika-saja',
    name: 'Setrika Saja',
    unit: 'kg',
    unitLabel: 'kg',
    pricePerUnit: 5000,
    minQty: 1,
    maxQty: 20,
    defaultQty: 3,
    turnaround: '1–2 hari kerja',
    description: 'Khusus merapikan pakaian bersih dengan setrika uap.',
  },
  {
    id: 'express',
    name: 'Layanan Express',
    unit: 'kg',
    unitLabel: 'kg',
    pricePerUnit: 12000,
    minQty: 1,
    maxQty: 15,
    defaultQty: 3,
    turnaround: '6–24 jam (kuota prioritas)',
    description: 'Pengerjaan kilat untuk kebutuhan mendesak.',
  },
  {
    id: 'rumah-tangga',
    name: 'Bed Cover / Selimut',
    unit: 'pcs',
    unitLabel: 'pcs',
    pricePerUnit: 25000,
    minQty: 1,
    maxQty: 10,
    defaultQty: 1,
    turnaround: '2–4 hari kerja',
    description: 'Tarif awal standar; menyesuaikan ukuran & kondisi.',
  },
];

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Timbang & Catat Transparan',
    description:
      'Setiap cucian ditimbang secara terbuka dan dicatat rincian layanan beserta jumlah potongannya sejak awal penerimaan.',
  },
  {
    step: '02',
    title: 'Beri Label Khusus',
    description:
      'Pesanan Anda langsung diberi tanda pengenal khusus yang terikat selama proses berlangsung agar pakaian tidak tertukar.',
  },
  {
    step: '03',
    title: 'Pisahkan Cucian',
    description:
      'Pakaian putih, berwarna gelap, dan bahan halus dipisahkan sesuai kebutuhan kain agar warna tetap awet dan tidak luntur.',
  },
  {
    step: '04',
    title: 'Periksa Kebersihan & Kerapian',
    description:
      'Setelah pencucian dan penyetrikaan, tim kami memeriksa ulang kebersihan noda, kerapian lipatan, serta kesegaran aroma.',
  },
  {
    step: '05',
    title: 'Kemas Rapi & Wangi',
    description:
      'Pakaian yang lolos pemeriksaan langsung dikemas dalam plastik bersih pelindung debu sehingga siap langsung masuk lemari.',
  },
  {
    step: '06',
    title: 'Notifikasi via WhatsApp',
    description:
      'Kami segera mengabarkan Anda lewat WhatsApp saat cucian selesai dan siap diambil di ruko atau diantar ke lokasi Anda.',
  },
];

export interface CustomerSegment {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  needs: string[];
  recommendedService: CalculatorServiceId;
  recommendedLabel: string;
  ctaLabel: string;
}

export const CUSTOMER_SEGMENTS: CustomerSegment[] = [
  {
    id: 'keluarga',
    title: 'Keluarga Sekitar',
    subtitle: 'Cucian harian rumah tangga tanpa menumpuk',
    description:
      'Solusi rutin untuk membantu aktivitas rumah tangga di kawasan Ulee Kareng. Mulai dari pakaian harian seluruh anggota keluarga hingga selimut dan bed cover.',
    needs: [
      'Pakaian harian rutin keluarga',
      'Selimut, sprei, dan bed cover besar',
      'Opsi antar-jemput praktis ke rumah',
    ],
    recommendedService: 'cuci-setrika',
    recommendedLabel: 'Cuci + Setrika Reguler & Barang Rumah Tangga',
    ctaLabel: 'Pesan untuk Keluarga',
  },
  {
    id: 'pekerja',
    title: 'Pekerja & ASN',
    subtitle: 'Seragam dan pakaian kantor selalu siap pakai',
    description:
      'Hemat waktu setelah pulang kerja. Kemeja, celana bahan, dan seragam dinas ditangani rapi dengan setrika uap, tersedia layanan express dan jadwal mingguan.',
    needs: [
      'Kemeja kerja dan seragam rapi bebas kusut',
      'Tersedia layanan Express saat mendesak',
      'Bisa penjemputan rutin mingguan',
    ],
    recommendedService: 'express',
    recommendedLabel: 'Cuci + Setrika Reguler / Express',
    ctaLabel: 'Jadwalkan Penjemputan',
  },
  {
    id: 'mahasiswa',
    title: 'Mahasiswa & Penghuni Kos',
    subtitle: 'Hemat biaya, praktis, dan tidak repot jemur',
    description:
      'Cocok untuk jadwal kuliah yang padat atau cuaca hujan di Banda Aceh. Harga kiloan terjangkau dengan pilihan cuci kering lipat maupun cuci setrika.',
    needs: [
      'Tarif hemat ramah kantong mahasiswa',
      'Pilihan Cuci Kering Lipat Rp5.000/kg',
      'Notifikasi WhatsApp begitu cucian selesai',
    ],
    recommendedService: 'cuci-lipat',
    recommendedLabel: 'Cuci Kering Lipat / Paket Hemat Kiloan',
    ctaLabel: 'Pesan Paket Hemat',
  },
  {
    id: 'penginapan',
    title: 'Penginapan & Homestay',
    subtitle: 'Standar bersih untuk kenyamanan tamu Anda',
    description:
      'Pencucian berkala untuk kebutuhan linen seperti sprei, sarung bantal, selimut, dan handuk dengan jadwal penjemputan teratur serta opsi kerja sama kontrak.',
    needs: [
      'Pencucian rutin sprei, sarung bantal & handuk',
      'Penanganan terpisah agar higienis dan cerah',
      'Skema kerja sama berkala / tarif khusus',
    ],
    recommendedService: 'rumah-tangga',
    recommendedLabel: 'Layanan Linen & Kerja Sama Berkala',
    ctaLabel: 'Diskusi Kerja Sama',
  },
];

export const ULEE_KARENG_AREAS = [
  'Simpang Tujuh Ulee Kareng',
  'Ceurih',
  'Ilie',
  'Pango Raya',
  'Lambhuk',
  'Lamglumpang',
  'Doy',
];

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\s+/g, '');
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
