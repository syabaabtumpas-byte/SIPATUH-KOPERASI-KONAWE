import React from 'react';
import { InspectionRecord } from '../types/inspection';
import { History, Download, Trash2, Send, ExternalLink, Calendar, Building2, AlertCircle } from 'lucide-react';

interface HistoryListProps {
  records: InspectionRecord[];
  onLoadRecord: (record: InspectionRecord) => void;
  onDeleteRecord: (id: string) => void;
  onExportAllCSV: () => void;
  onExportSingleCSV: (record: InspectionRecord) => void;
  onResendToSheets: (record: InspectionRecord) => void;
  onNewForm: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  records,
  onLoadRecord,
  onDeleteRecord,
  onExportAllCSV,
  onExportSingleCSV,
  onResendToSheets,
  onNewForm,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sangat Patuh':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Cukup Patuh':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Kurang Patuh':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Tidak Patuh':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-700" />
            <span>Riwayat Arsip Pemeriksaan Kepatuhan</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar pemeriksaan yang tersimpan secara lokal di browser perangkat Anda
          </p>
        </div>

        <div className="flex items-center gap-2">
          {records.length > 0 && (
            <button
              type="button"
              onClick={onExportAllCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Semua Rekap (CSV)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNewForm}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            <span>+ Formulir Baru</span>
          </button>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">Belum Ada Riwayat Tersimpan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Isi formulir pemeriksaan koperasi dan klik &quot;Simpan Arsip&quot; atau &quot;Kirim ke Google Sheets&quot; untuk menyimpannya di sini.
          </p>
          <button
            type="button"
            onClick={onNewForm}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
          >
            Mulai Isi Formulir Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors bg-white hover:bg-slate-50/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusBadge(rec.statusKepatuhan)}`}>
                    {rec.statusKepatuhan}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {rec.jenisKoperasi}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{rec.tanggalPemeriksaan || 'Tanpa tanggal'}</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{rec.namaKoperasi || '(Nama Koperasi Belum Diisi)'}</span>
                </h3>

                <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                  <span>NIK / BH: <strong className="font-mono text-slate-700">{rec.nomorBadanHukum || '-'}</strong></span>
                  <span>•</span>
                  <span>Skor: <strong className="font-mono text-slate-700">{rec.persentaseKepatuhan}% ({rec.totalPatuh}/{rec.totalItem} Patuh)</strong></span>
                  {rec.timPemeriksa.filter(Boolean).length > 0 && (
                    <>
                      <span>•</span>
                      <span>Pemeriksa: {rec.timPemeriksa.filter(Boolean).join(', ')}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onLoadRecord(rec)}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1"
                  title="Buka kembali di formulir"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka</span>
                </button>

                <button
                  type="button"
                  onClick={() => onExportSingleCSV(rec)}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                  title="Unduh CSV"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onResendToSheets(rec)}
                  className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded border border-emerald-200 transition-colors"
                  title="Kirim ke Google Sheets"
                >
                  <Send className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteRecord(rec.id)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded border border-rose-200 transition-colors"
                  title="Hapus dari arsip"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
