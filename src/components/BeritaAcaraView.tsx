import React from 'react';
import { InspectionRecord, StatusKepatuhan } from '../types/inspection';
import { Award, Send, Download, Save, Printer, CheckCircle, AlertTriangle } from 'lucide-react';

interface BeritaAcaraViewProps {
  record: InspectionRecord;
  statusKepatuhan: StatusKepatuhan;
  setStatusKepatuhan: (val: StatusKepatuhan) => void;
  rekomendasi: [string, string, string];
  setRekomendasi: React.Dispatch<React.SetStateAction<[string, string, string]>>;
  catatanKesimpulan: string;
  setCatatanKesimpulan: (val: string) => void;
  onSendToGoogleSheets: () => void;
  onExportCSV: () => void;
  onSaveToLocal: () => void;
  onPrint: () => void;
  isSendingToSheets: boolean;
  sheetsUrlConfigured: boolean;
}

const STATUS_LIST: StatusKepatuhan[] = [
  'Sangat Patuh',
  'Cukup Patuh',
  'Kurang Patuh',
  'Tidak Patuh',
];

export const BeritaAcaraView: React.FC<BeritaAcaraViewProps> = ({
  record,
  statusKepatuhan,
  setStatusKepatuhan,
  rekomendasi,
  setRekomendasi,
  catatanKesimpulan,
  setCatatanKesimpulan,
  onSendToGoogleSheets,
  onExportCSV,
  onSaveToLocal,
  onPrint,
  isSendingToSheets,
  sheetsUrlConfigured,
}) => {
  const handleRekomendasiChange = (index: number, val: string) => {
    const updated = [...rekomendasi] as [string, string, string];
    updated[index] = val;
    setRekomendasi(updated);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="no-print bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-700" />
            <span>Berita Acara &amp; Tindak Lanjut Hasil Pemeriksaan</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Hasil rekapitulasi penilaian kepatuhan dan pengesahan berita acara
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onSendToGoogleSheets}
            disabled={isSendingToSheets}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg text-white transition-all shadow-xs ${
              isSendingToSheets
                ? 'bg-slate-400 cursor-not-allowed'
                : sheetsUrlConfigured
                ? 'bg-emerald-700 hover:bg-emerald-800'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{isSendingToSheets ? 'Mengirim...' : 'Kirim ke Google Sheets'}</span>
          </button>

          <button
            type="button"
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Unduh CSV</span>
          </button>

          <button
            type="button"
            onClick={onSaveToLocal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            <Save className="w-4 h-4 text-slate-600" />
            <span>Simpan Arsip</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>

      {/* Sheet URL Alert if not configured */}
      {!sheetsUrlConfigured && (
        <div className="no-print bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              URL Webhook Google Sheets belum diatur. Anda tetap bisa mengisi formulir, mengunduh file CSV, atau mengatur integrasi di tab ke-3.
            </span>
          </div>
        </div>
      )}

      {/* Main Berita Acara Document Layout (Formatted like Official Form) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 shadow-2xs print:shadow-none print:border-none print:p-0">
        {/* Kop Surat Resmi Sesuai Format Fisik Dokumen */}
        <div className="border-b-4 border-double border-slate-900 pb-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="shrink-0 w-20 sm:w-24 flex items-center justify-center">
              <img
                src="/assets/aistudio/logo_konawe_kecil_a819e4b8.png"
                alt="Logo Pemerintah Kabupaten Konawe"
                className="w-16 h-20 sm:w-20 sm:h-24 object-contain"
              />
            </div>
            <div className="flex-1 text-center pr-0 sm:pr-8">
              <h2 className="text-sm sm:text-base font-bold tracking-wider text-slate-900 uppercase">
                Pemerintah Kabupaten Konawe
              </h2>
              <h1 className="text-base sm:text-xl font-extrabold tracking-wide text-slate-900 uppercase">
                Dinas Koperasi dan UKM
              </h1>
              <p className="text-xs text-slate-700 mt-1">
                Alamat : Jl. Jend. Sudirman Kel. Tobeu Kec. Unaaha Kabupaten Konawe
              </p>
              <p className="text-[11px] text-slate-600">
                E-mail : dinkopumkm@konawekab.go.id • Instagram : @dinkopukmkonawe
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wide">
            Berita Acara Hasil Pemeriksaan Kepatuhan Koperasi Eksisting
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tahun Anggaran {new Date().getFullYear()}
          </p>
        </div>

        {/* Ringkasan Data Koperasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div>
            <span className="font-semibold text-slate-500 block">Nama Koperasi:</span>
            <span className="font-bold text-slate-900 text-sm">
              {record.namaKoperasi || '(Belum diisi)'}
            </span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 block">Nomor Badan Hukum / NIK:</span>
            <span className="font-mono text-slate-800">
              {record.nomorBadanHukum || '-'}
            </span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 block">Jenis Koperasi:</span>
            <span className="text-slate-800 font-medium">
              {record.jenisKoperasi}
            </span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 block">Tanggal Pemeriksaan:</span>
            <span className="text-slate-800 font-medium">
              {record.tanggalPemeriksaan || '-'}
            </span>
          </div>
          <div className="md:col-span-2">
            <span className="font-semibold text-slate-500 block">Alamat Koperasi:</span>
            <span className="text-slate-800">
              {record.alamatKoperasi || '-'}
            </span>
          </div>
        </div>

        {/* Skor & Kesimpulan Kepatuhan */}
        <div className="border border-slate-300 rounded-lg p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Kesimpulan Pemeriksaan:
              </span>
              <div className="text-xs text-slate-600 mt-0.5">
                Tingkat Kepatuhan Regulasi &amp; Kelayakan Operasional
              </div>
            </div>

            {/* Status Selector */}
            <div className="flex flex-wrap items-center gap-2">
              {STATUS_LIST.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusKepatuhan(st)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md border transition-all ${
                    statusKepatuhan === st
                      ? st === 'Sangat Patuh'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : st === 'Cukup Patuh'
                        ? 'bg-blue-700 text-white border-blue-700'
                        : st === 'Kurang Patuh'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-rose-700 text-white border-rose-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-center">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Total Parameter</span>
              <span className="text-lg font-bold text-slate-900 font-mono">
                {record.totalItem}
              </span>
            </div>
            <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
              <span className="text-[11px] text-emerald-700 block">Patuh</span>
              <span className="text-lg font-bold text-emerald-800 font-mono">
                {record.totalPatuh}
              </span>
            </div>
            <div className="bg-rose-50/70 p-2.5 rounded-lg border border-rose-200">
              <span className="text-[11px] text-rose-700 block">Tidak Patuh</span>
              <span className="text-lg font-bold text-rose-800 font-mono">
                {record.totalTidakPatuh}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Persentase</span>
              <span className="text-lg font-bold text-slate-900 font-mono">
                {record.persentaseKepatuhan}%
              </span>
            </div>
          </div>
        </div>

        {/* Rekomendasi Tindak Lanjut Utama */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
            Rekomendasi Tindak Lanjut Utama:
          </label>
          <div className="space-y-2">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-xs font-mono font-bold text-slate-500 pt-2 w-5">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={rekomendasi[idx] || ''}
                  onChange={(e) => handleRekomendasiChange(idx, e.target.value)}
                  placeholder={`Rekomendasi ${idx + 1} (contoh: Pembaruan sertifikat NIK melalui ODS...)`}
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Catatan Kesimpulan Tambahan */}
        <div className="mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
            Catatan Ringkasan Pemeriksaan:
          </label>
          <textarea
            rows={2}
            value={catatanKesimpulan}
            onChange={(e) => setCatatanKesimpulan(e.target.value)}
            placeholder="Catatan umum kondisi operasional koperasi..."
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
          />
        </div>

        {/* Kolom Tanda Tangan Resmi (Cetak / Verifikasi) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-200 text-xs">
          {/* Tim Pemeriksa */}
          <div>
            <div className="font-bold text-slate-900 uppercase tracking-wide mb-3 text-center sm:text-left">
              Tim Pemeriksa Dinas:
            </div>
            <div className="space-y-4">
              {[0, 1, 2, 3, 4].map((idx) => {
                const nama = record.timPemeriksa[idx];
                return (
                  <div key={idx} className="flex items-end justify-between border-b border-dotted border-slate-400 pb-1">
                    <span className="text-slate-500 font-mono">{idx + 1}.</span>
                    <span className="font-semibold text-slate-800">
                      {nama || '...........................................'}
                    </span>
                    <span className="text-slate-400 text-[10px] italic">(Tanda Tangan)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pengurus / Perwakilan Koperasi */}
          <div>
            <div className="font-bold text-slate-900 uppercase tracking-wide mb-3 text-center sm:text-left">
              Pengurus / Perwakilan Koperasi:
            </div>
            <div className="space-y-4">
              {[0, 1, 2].map((idx) => {
                const nama = record.pengurusKoperasi[idx];
                return (
                  <div key={idx} className="flex items-end justify-between border-b border-dotted border-slate-400 pb-1">
                    <span className="text-slate-500 font-mono">{idx + 1}.</span>
                    <span className="font-semibold text-slate-800">
                      {nama || '...........................................'}
                    </span>
                    <span className="text-slate-400 text-[10px] italic">(Tanda Tangan)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lembar Wawancara Ringkas saat cetak */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">
            Lampiran Ringkasan Uji Fit &amp; Proper Singkat:
          </h4>
          <div className="space-y-2 text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <span className="font-semibold">1. Pemahaman Regulasi: </span>
              <span>{record.wawancara.pemahamanRegulasi || '-'}</span>
            </div>
            <div>
              <span className="font-semibold">2. Manajemen Risiko/NPL: </span>
              <span>{record.wawancara.manajemenRisikoNPL || '-'}</span>
            </div>
            <div>
              <span className="font-semibold">3. Pemberdayaan Anggota: </span>
              <span>{record.wawancara.pemberdayaanAnggota || '-'}</span>
            </div>
            <div>
              <span className="font-semibold">4. Pemisahan Kewenangan: </span>
              <span>{record.wawancara.kepatuhanTataKelola || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
