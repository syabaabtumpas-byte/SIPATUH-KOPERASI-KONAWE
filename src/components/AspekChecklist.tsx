import React, { useState } from 'react';
import { InspectionItem, ComplianceResult } from '../types/inspection';
import { ASPEK_TITLES } from '../data/defaultItems';
import { CheckCircle2, XCircle, HelpCircle, FileText, CheckCheck, RotateCcw } from 'lucide-react';

interface AspekChecklistProps {
  items: InspectionItem[];
  setItems: React.Dispatch<React.SetStateAction<InspectionItem[]>>;
}

export const AspekChecklist: React.FC<AspekChecklistProps> = ({ items, setItems }) => {
  const [selectedAspek, setSelectedAspek] = useState<number | 'ALL'>('ALL');

  const handleResultChange = (id: string, hasil: ComplianceResult) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, hasil } : item))
    );
  };

  const handleCatatanChange = (id: string, catatan: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, catatan } : item))
    );
  };

  const handleMarkAllPatuh = (aspekId?: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (!aspekId || item.aspekId === aspekId) {
          // Jika reverse scoring (BMPP ada pelanggaran), patuh berarti memilih 'TIDAK' (tidak melanggar)
          return {
            ...item,
            hasil: item.isReverseScoring ? 'TIDAK' : 'YA',
          };
        }
        return item;
      })
    );
  };

  const handleResetAspek = (aspekId?: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (!aspekId || item.aspekId === aspekId) {
          return { ...item, hasil: 'BELUM' };
        }
        return item;
      })
    );
  };

  const filteredItems = selectedAspek === 'ALL'
    ? items
    : items.filter((i) => i.aspekId === selectedAspek);

  // Group by Aspek for display
  const aspekGroups = [1, 2, 3, 4].filter((num) =>
    selectedAspek === 'ALL' ? true : num === selectedAspek
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Daftar Uji Kepatuhan 4 Aspek Organisasi & Usaha
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Periksa dokumen fisik atau digital sesuai metode verifikasi yang ditetapkan
          </p>
        </div>

        {/* Global Batch Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleMarkAllPatuh()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Set Semua Patuh</span>
          </button>
          <button
            type="button"
            onClick={() => handleResetAspek()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs Aspek */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-6 pb-1">
        <button
          type="button"
          onClick={() => setSelectedAspek('ALL')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors whitespace-nowrap shrink-0 ${
            selectedAspek === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Semua Aspek (18 Item)
        </button>
        {[1, 2, 3, 4].map((num) => {
          const aspectItems = items.filter((i) => i.aspekId === num);
          const patuhCount = aspectItems.filter((i) =>
            i.isReverseScoring ? i.hasil === 'TIDAK' : i.hasil === 'YA'
          ).length;

          return (
            <button
              key={num}
              type="button"
              onClick={() => setSelectedAspek(num)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                selectedAspek === num
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>Aspek {num}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                selectedAspek === num ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
              }`}>
                {patuhCount}/{aspectItems.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Group Content */}
      <div className="space-y-8">
        {aspekGroups.map((aspekNum) => {
          const groupItems = filteredItems.filter((i) => i.aspekId === aspekNum);
          if (groupItems.length === 0) return null;

          return (
            <div key={aspekNum} className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              {/* Aspek Header */}
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {ASPEK_TITLES[aspekNum]}
                  </h3>
                  {aspekNum === 4 && (
                    <span className="text-xs font-medium text-amber-700">
                      *(Wajib bagi Koperasi Simpan Pinjam / KSP / KSPPS)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMarkAllPatuh(aspekNum)}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                  >
                    Set Aspek {aspekNum} Patuh
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100">
                {groupItems.map((item) => {
                  const isPatuh = item.isReverseScoring
                    ? item.hasil === 'TIDAK'
                    : item.hasil === 'YA';
                  const isTidakPatuh = item.isReverseScoring
                    ? item.hasil === 'YA'
                    : item.hasil === 'TIDAK';

                  return (
                    <div
                      key={item.id}
                      className={`p-4 transition-colors ${
                        item.hasil === 'BELUM'
                          ? 'hover:bg-slate-50/70'
                          : isPatuh
                          ? 'bg-emerald-50/20'
                          : 'bg-rose-50/20'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        {/* Parameter & Verification */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {item.id}
                            </span>
                            <span className="text-xs font-medium text-slate-600">
                              {item.subAspek}
                            </span>
                          </div>

                          <p className="text-sm font-semibold text-slate-900 leading-snug">
                            {item.parameter}
                          </p>

                          {/* Reverse Scoring Note if applicable */}
                          {item.isReverseScoring && (
                            <p className="text-[11px] text-amber-700 mt-0.5 font-medium">
                              Catatan BMPP: Pilihan &quot;Tidak&quot; berarti PATUH (tidak terjadi pelanggaran melebihi batas regulasi).
                            </p>
                          )}

                          <div className="mt-2 flex items-start gap-1.5 text-xs text-slate-500 bg-slate-50 p-2 rounded-md border border-slate-100">
                            <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                              <span className="font-semibold text-slate-600">Metode Verifikasi: </span>
                              <span>{item.metodeVerifikasi}</span>
                            </div>
                          </div>
                        </div>

                        {/* Hasil Cek (Patuh / Tidak) */}
                        <div className="w-full lg:w-48 shrink-0">
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                            Hasil Cek Fisik:
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleResultChange(item.id, 'YA')}
                              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                                item.hasil === 'YA'
                                  ? item.isReverseScoring
                                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                    : 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Ya</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleResultChange(item.id, 'TIDAK')}
                              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                                item.hasil === 'TIDAK'
                                  ? item.isReverseScoring
                                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                                    : 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Tidak</span>
                            </button>
                          </div>

                          {/* Status Indicator */}
                          <div className="mt-1 text-center">
                            {item.hasil === 'BELUM' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                                <HelpCircle className="w-3 h-3" />
                                <span>Belum diperiksa</span>
                              </span>
                            ) : isPatuh ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Patuh</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700">
                                <XCircle className="w-3 h-3 text-rose-600" />
                                <span>Tidak Patuh</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Catatan / Temuan */}
                        <div className="w-full lg:w-72 shrink-0">
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Catatan / Temuan Pemeriksa:
                          </label>
                          <textarea
                            rows={2}
                            value={item.catatan}
                            onChange={(e) => handleCatatanChange(item.id, e.target.value)}
                            placeholder="Tulis bukti temuan berkas atau nomor SK..."
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
