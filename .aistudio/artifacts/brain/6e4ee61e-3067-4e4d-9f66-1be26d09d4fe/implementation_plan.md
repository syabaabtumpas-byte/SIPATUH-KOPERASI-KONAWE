# Sistem Informasi Pemeriksaan Kepatuhan Koperasi (SIMPATUH KOPERASI)

Aplikasi web digital resmi untuk instrumen pemeriksaan kepatuhan koperasi eksisting Dinas Koperasi dan UKM Kabupaten Konawe, mengintegrasikan seluruh 4 aspek kepatuhan, lembar wawancara singkat, kalkulasi otomatis status kelayakan, serta pengiriman data hasil pemeriksaan langsung ke Google Sheets secara fleksibel dan siap dibuka melalui tautan di Google Sites.

## User Review & Critical Decisions

> [!IMPORTANT]
> Ringkasan keputusan hasil klarifikasi pengguna:
> - **Integrasi Google Sheets Fleksibel**: Menyediakan integrasi langsung via Webhook Google Apps Script (tanpa perlu login akun yang rumit untuk petugas lapangan) + generator skrip otomatis satu klik untuk Google Sheets + opsi ekspor CSV/Excel langsung.
> - **Fokus Fitur**: Formulir digital terstruktur lengkap (4 Aspek Kepatuhan, Uji Fit & Proper Singkat, Berita Acara & Rekomendasi) dengan perhitungan otomatis skor kepatuhan tanpa membebani tanda tangan digital manual yang rumit.
> - **Integrasi Google Sites**: Dioptimalkan sebagai aplikasi web mandiri (*standalone web application*) responsif dengan tautan langsung (*direct link*) yang ringan dan cepat dibuka dari tombol atau navigasi Google Sites.

---

## 1. Overview & Core Concept

- **Apa yang Dibuat**: Sistem pengisian digital berbasis instrumen resmi Dinas Koperasi dan UKM Kabupaten Konawe (berdasarkan UU No. 25/1992, Permenkop UKM No. 09/2018, Juklak Deputi No. 15 & 33/2021, dan Permenkop UKM No. 2/2024).
- **Pengguna Sasaran**: Tim Pemeriksa Koperasi Dinas Koperasi & UKM, Pengawas Koperasi, serta Pengurus Koperasi dalam sesi verifikasi berkala.
- **Nilai Utama**: 
  - Menggantikan lembar kertas fisik yang rawan hilang dan lambat diolah menjadi arsip digital seketika.
  - Perhitungan persentase kepatuhan otomatis (*Sangat Patuh*, *Cukup Patuh*, *Kurang Patuh*, *Tidak Patuh*) secara objektif.
  - Pengiriman data ke Google Sheets instansi secara *real-time* atau tersimpan aman di penyimpanan lokal bila koneksi internet minim di lapangan.

---

## 2. User Experience & Visual Design

### Alur Kerja Petugas (Key User Flows)
1. **Identitas & Pra-Pemeriksaan**: Petugas menginput informasi dasar Koperasi (Nama, NIK/Badan Hukum, Jenis Koperasi: KSP/KSPPS/Serba Usaha/Produsen/dll., Alamat, Tanggal, dan 1–4 Anggota Tim Pemeriksa).
2. **Pengisian 4 Aspek Kepatuhan**:
   - **Aspek 1: Kelembagaan & Legalitas** (Legalitas Badan Hukum, Perizinan NIB/IUSP, RAT, Kepengurusan, Fit & Proper Test).
   - **Aspek 2: Keanggotaan & Tata Kelola (Governance)** (Buku Daftar Anggota, Batas Pemanfaat Layanan, Dokumen SOP/Persus, Pemisahan Tugas Otorisasi).
   - **Aspek 3: Kepatuhan Keuangan & Permodalan** (SAK ETAP/EP, Audit KAP, Batas Maksimum Pinjaman BMPP, Rasio Non-Anggota, Alokasi SHU).
   - **Aspek 4: Kepatuhan Prinsip Khusus PMPJ & Sektoral** (Formulir CDD, Pejabat PMPJ, Laporan ODS Kemenkop UKM). Dilengkapi tombol pintas "Wajib bagi KSP/KSPPS" atau penyesuaian otomatis.
3. **Lembar Wawancara (Uji Fit & Proper Singkat)**: 4 Pertanyaan terarah mengenai Prosedur Darurat AD/ART, Manajemen Risiko NPL & Piutang, Pemberdayaan Anggota, dan Pemisahan Tugas Pengurus/Manajer.
4. **Berita Acara & Kesimpulan Otomatis**: Sistem menghitung total kriteria yang patuh, merekomendasikan kesimpulan tingkat kepatuhan, serta input poin rekomendasi tindak lanjut (1, 2, 3).
5. **Kirim ke Google Sheets & Cetak/Simpan**: Mengirimkan seluruh data rekapan baris per baris ke Google Sheets terhubung dengan indikator sukses yang jelas.

### Identitas Visual & Desain UI
- **Gaya Desain**: Estetika instansional modern (*Government Institutional SaaS*), bersih, tegas, dan tepercaya.
- **Palet Warna**:
  - Dominan Kanvas: Slate putih bersih (`#F8FAFC` & `#FFFFFF`).
  - Warna Aksen Utama: Hijau Koperasi / Zamrud Resmi (`#047857` / `#059669`) mencerminkan lambang perkoperasian Indonesia.
  - Warna Semantik Kepatuhan: Hijau (`#16A34A` untuk Patuh), Merah Bata (`#DC2626` untuk Tidak Patuh/Temuan), Kuning Emas (`#D97706` untuk Perhatian).
- **Tipografi**: `Plus Jakarta Sans` untuk judul dan teks umum; `JetBrains Mono` / `tabular-nums` untuk angka persentase, NIK, dan tanggal pemeriksaan.
- **Kenyamanan Input Lapangan**:
  - Toggle Patuh / Tidak Patuh yang lebar dan mudah ditekan di layar sentuh ponsel maupun tablet petugas.
  - Kolom "Catatan / Temuan" yang responsif dan dapat diisi dengan cepat saat verifikasi berkas.

---

## 3. Key Product Decisions & Trade-Offs

- **Metode Integrasi Google Sheets**:
  - *Pendekatan*: Menyediakan konektor Webhook Google Apps Script bawaan dengan panduan 1-klik kode Apps Script yang siap di-paste ke Google Sheet milik Dinas, didukung fitur simpan URL Webhook di preferensi pengguna dan opsi unduh backup CSV/Excel lengkap.
  - *Alasan*: Pengawas lapangan sering kali menggunakan perangkat yang berbeda atau akun Gmail dinas tanpa izin API Console yang rumit. Dengan Webhook Apps Script, setiap kiriman data langsung masuk ke baris baru Google Sheets secara instan tanpa hambatan izin OAuth.
- **Offline Resiliency (Tahan Kondisi Sinyal Rendah)**:
  - *Pendekatan*: Setiap input disimpan otomatis di `localStorage` per draf, sehingga jika koneksi internet di pedesaan/lapangan terputus, formulir tidak akan hilang dan bisa dikirim saat sinyal pulih.

---

## 4. Technical Architecture & Data Strategy

### Diagram Arsitektur Komponen

```
┌─────────────────────────────────────────────────────────────────┐
│               SIMPATUH KOPERASI (React + Tailwind)              │
│                                                                 │
│  ┌───────────────────────┐           ┌───────────────────────┐  │
│  │   Identitas Koperasi  │           │   Indikator Skor &    │  │
│  │   & Tim Pemeriksa     │           │   Kepatuhan Otomatis  │  │
│  └───────────┬───────────┘           └───────────▲───────────┘  │
│              │                                   │              │
│  ┌───────────▼───────────────────────────────────┴───────────┐  │
│  │  Formulir 4 Aspek Kepatuhan + Lembar Wawancara Pengurus   │  │
│  │  (Verifikasi Berkas, Status Patuh/Tidak, Catatan Temuan)  │  │
│  └───────────────────────────┬───────────────────────────────┘  │
│                              │                                  │
│  ┌───────────────────────────▼───────────────────────────────┐  │
│  │  Berita Acara Pemeriksaan & Rekomendasi Tindak Lanjut     │  │
│  └───────────┬───────────────────────────────────┬───────────┘  │
│              │                                   │              │
│  ┌───────────▼───────────┐           ┌───────────▼───────────┐  │
│  │  Local Draft Storage  │           │ Google Sheets Handler │  │
│  │  (Auto-save Offline)  │           │ (Apps Script Webhook) │  │
│  └───────────────────────┘           └───────────┬───────────┘  │
└──────────────────────────────────────────────────┼──────────────┘
                                                   │ HTTPS POST
                                       ┌───────────▼───────────┐
                                       │ Google Sheets Dinamis │
                                       │ (Dinas Koperasi Konawe)│
                                       └───────────────────────┘
```

### Struktur Data Pemeriksaan (Model)
- **Metadata Pemeriksaan**: `namaKoperasi`, `nikBadanHukum`, `jenisKoperasi`, `alamat`, `tanggal`, `timPemeriksa: string[]`
- **Item Pemeriksaan (Per Aspek)**:
  - `id`: Kode parameter (misal `1.1.1`, `1.1.2`, dst.)
  - `aspek`: Kelembagaan, Tata Kelola, Keuangan, Prinsip Khusus
  - `parameter`: Pertanyaan pemeriksaan
  - `metodeVerifikasi`: Prosedur cek berkas
  - `hasil`: `'PATUH'` | `'TIDAK_PATUH'` | `'BELUM_DIPERIKSA'`
  - `catatan`: Catatan temuan / bukti pendukung
- **Lembar Wawancara Singkat**: Jawaban 4 butir pertanyaan regulasi, risiko NPL, transparansi anggota, dan tata kelola transaksi.
- **Kesimpulan Berita Acara**: Skor total, status kepatuhan final, 3 rekomendasi tindak lanjut utama, nama-nama pemeriksa dan perwakilan pengurus.
