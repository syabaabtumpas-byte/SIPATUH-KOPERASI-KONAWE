import React from 'react';
import { FileCheck, Award, Sheet, History, Printer } from 'lucide-react';

interface HeaderProps {
  activeTab: 'form' | 'rekap' | 'google' | 'history';
  setActiveTab: (tab: 'form' | 'rekap' | 'google' | 'history') => void;
  persentaseKepatuhan: number;
  statusKepatuhan: string;
  totalPatuh: number;
  totalItem: number;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  persentaseKepatuhan,
  statusKepatuhan,
  totalPatuh,
  totalItem,
  onPrint,
}) => {
  const getStatusColor = (status: string) => {
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
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      {/* Top Banner Pemerintah Kabupaten Konawe */}
      <div className="bg-emerald-900 text-white px-4 py-2">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <img
              src="/assets/aistudio/logo_konawe_kecil_a819e4b8.png"
              alt="Logo Kabupaten Konawe"
              className="w-5 h-6 object-contain shrink-0 drop-shadow-xs"
            />
            <span className="font-bold tracking-wide">PEMERINTAH KABUPATEN KONAWE</span>
            <span className="hidden sm:inline text-emerald-300">•</span>
            <span className="text-emerald-100">DINAS KOPERASI DAN UKM</span>
          </div>
          <div className="text-emerald-200 text-center sm:text-right text-[11px]">
            <span>Jl. Jend. Sudirman Kel. Tobeu Kec. Unaaha</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/aistudio/logo_konawe_kecil_a819e4b8.png"
              alt="Logo Daerah Kabupaten Konawe"
              className="w-12 h-14 sm:w-14 sm:h-16 object-contain shrink-0 drop-shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  INSTRUMEN RESMI
                </span>
                <span className="text-xs text-slate-500">Permenkop UKM No. 2/2024</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
                Pemeriksaan Kepatuhan Koperasi Eksisting
              </h1>
              <p className="text-xs text-emerald-800 font-medium">
                Dinas Koperasi dan UKM Pemerintah Kabupaten Konawe
              </p>
            </div>
          </div>

          {/* Quick Score Meter */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-right">
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                Skor Kepatuhan
              </div>
              <div className="flex items-baseline gap-1 justify-end font-mono">
                <span className="text-xl font-bold text-slate-900 tabular-nums">
                  {persentaseKepatuhan}%
                </span>
                <span className="text-xs text-slate-500">
                  ({totalPatuh}/{totalItem})
                </span>
              </div>
            </div>

            <div className={`px-3 py-2 rounded-lg border text-xs font-semibold ${getStatusColor(statusKepatuhan)}`}>
              {statusKepatuhan}
            </div>

            <button
              onClick={onPrint}
              type="button"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="Cetak Berita Acara"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'form'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>1. Formulir Pemeriksaan</span>
          </button>

          <button
            onClick={() => setActiveTab('rekap')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'rekap'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>2. Berita Acara & Kesimpulan</span>
          </button>

          <button
            onClick={() => setActiveTab('google')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'google'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sheet className="w-4 h-4" />
            <span>3. Integrasi Google Sheets & Sites</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'history'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span>4. Riwayat Arsip</span>
          </button>
        </div>
      </div>
    </header>
  );
};
