export type ComplianceResult = 'YA' | 'TIDAK' | 'BELUM';

export interface InspectionItem {
  id: string;
  aspekId: 1 | 2 | 3 | 4;
  subAspek: string;
  parameter: string;
  metodeVerifikasi: string;
  hasil: ComplianceResult;
  catatan: string;
  // Khusus Aspek 3.2: indikator "YA" bisa berarti ada pelanggaran (BMPP melebihi batas).
  // Standard: YA = Patuh, TIDAK = Tidak Patuh.
  // Untuk BMPP: Apakah ada penyaluran pinjaman melebihi batas regulasi?
  // Jika TIDAK = Patuh (tidak ada pelanggaran). Jika YA = Tidak Patuh (ada pelanggaran).
  isReverseScoring?: boolean;
}

export type JenisKoperasi = 'KSP/KSPPS' | 'Serba Usaha' | 'Produsen' | 'Konsumen' | 'Jasa' | 'Lainnya';

export type StatusKepatuhan = 'Sangat Patuh' | 'Cukup Patuh' | 'Kurang Patuh' | 'Tidak Patuh';

export interface InterviewResponse {
  pemahamanRegulasi: string;
  manajemenRisikoNPL: string;
  pemberdayaanAnggota: string;
  kepatuhanTataKelola: string;
}

export interface InspectionRecord {
  id: string;
  timestamp: string;
  // Identitas Koperasi & Pemeriksaan
  namaKoperasi: string;
  nomorBadanHukum: string;
  jenisKoperasi: JenisKoperasi;
  alamatKoperasi: string;
  tanggalPemeriksaan: string;
  timPemeriksa: string[];
  pengurusKoperasi: string[];
  
  // Data Aspek
  items: InspectionItem[];

  // Lembar Wawancara
  wawancara: InterviewResponse;

  // Kesimpulan Berita Acara
  statusKepatuhan: StatusKepatuhan;
  rekomendasi: [string, string, string];
  catatanKesimpulan?: string;

  // Skor
  totalItem: number;
  totalPatuh: number;
  totalTidakPatuh: number;
  persentaseKepatuhan: number;
}
