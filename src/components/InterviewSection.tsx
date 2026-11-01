import React from 'react';
import { InterviewResponse } from '../types/inspection';
import { MessageSquareText } from 'lucide-react';

interface InterviewSectionProps {
  wawancara: InterviewResponse;
  setWawancara: React.Dispatch<React.SetStateAction<InterviewResponse>>;
}

export const InterviewSection: React.FC<InterviewSectionProps> = ({
  wawancara,
  setWawancara,
}) => {
  const handleChange = (field: keyof InterviewResponse, value: string) => {
    setWawancara((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 mb-6">
      <div className="flex items-center gap-2 mb-2 pb-3 border-b border-slate-100">
        <MessageSquareText className="w-5 h-5 text-emerald-700" />
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          Lembar Wawancara (Uji Fit &amp; Proper Singkat)
        </h2>
      </div>
      <p className="text-xs text-slate-500 mb-5">
        Ditujukan kepada Pengurus dan Pengawas Koperasi untuk mengukur pemahaman tata kelola dan manajemen risiko.
      </p>

      <div className="space-y-5">
        {/* Pertanyaan 1 */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <label className="block text-xs font-bold text-slate-900 mb-1">
            1. Pemahaman Regulasi &amp; AD/ART:
          </label>
          <p className="text-xs text-slate-600 italic mb-2">
            &ldquo;Bagaimana prosedur pengambilan keputusan strategis di koperasi jika terjadi kondisi darurat, dan apa dasar hukum/pasal AD-ART yang dirujuk?&rdquo;
          </p>
          <textarea
            rows={3}
            value={wawancara.pemahamanRegulasi}
            onChange={(e) => handleChange('pemahamanRegulasi', e.target.value)}
            placeholder="Ketik ringkasan jawaban pengurus/pengawas..."
            className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Pertanyaan 2 */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <label className="block text-xs font-bold text-slate-900 mb-1">
            2. Manajemen Risiko &amp; Piutang Bermasalah:
          </label>
          <p className="text-xs text-slate-600 italic mb-2">
            &ldquo;Berapa NPL (Non-Performing Loan / Kredit Macet) koperasi saat ini? Langkah spesifik apa yang diambil pengurus terhadap pinjaman macet yang melibatkan anggota/pihak berelasi?&rdquo;
          </p>
          <textarea
            rows={3}
            value={wawancara.manajemenRisikoNPL}
            onChange={(e) => handleChange('manajemenRisikoNPL', e.target.value)}
            placeholder="Ketik ringkasan jawaban pengurus/pengawas..."
            className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Pertanyaan 3 */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <label className="block text-xs font-bold text-slate-900 mb-1">
            3. Pemberdayaan Anggota:
          </label>
          <p className="text-xs text-slate-600 italic mb-2">
            &ldquo;Sebutkan manfaat langsung dan bentuk transparansi informasi keuangan yang diterima anggota selain pembagian SHU pada akhir tahun!&rdquo;
          </p>
          <textarea
            rows={3}
            value={wawancara.pemberdayaanAnggota}
            onChange={(e) => handleChange('pemberdayaanAnggota', e.target.value)}
            placeholder="Ketik ringkasan jawaban pengurus/pengawas..."
            className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Pertanyaan 4 */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <label className="block text-xs font-bold text-slate-900 mb-1">
            4. Kepatuhan Tata Kelola Transaksi:
          </label>
          <p className="text-xs text-slate-600 italic mb-2">
            &ldquo;Apakah ada pemisahan tegas antara kewenangan operasional harian (manajer) dengan kewenangan pengawasan/kebijakan (pengurus)?&rdquo;
          </p>
          <textarea
            rows={3}
            value={wawancara.kepatuhanTataKelola}
            onChange={(e) => handleChange('kepatuhanTataKelola', e.target.value)}
            placeholder="Ketik ringkasan jawaban pengurus/pengawas..."
            className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
          />
        </div>
      </div>
    </div>
  );
};
