import React from 'react';
import { JenisKoperasi } from '../types/inspection';
import { Building2, Calendar, Users, MapPin, Hash, ShieldCheck } from 'lucide-react';

interface IdentitySectionProps {
  namaKoperasi: string;
  setNamaKoperasi: (val: string) => void;
  nomorBadanHukum: string;
  setNomorBadanHukum: (val: string) => void;
  jenisKoperasi: JenisKoperasi;
  setJenisKoperasi: (val: JenisKoperasi) => void;
  alamatKoperasi: string;
  setAlamatKoperasi: (val: string) => void;
  tanggalPemeriksaan: string;
  setTanggalPemeriksaan: (val: string) => void;
  timPemeriksa: string[];
  setTimPemeriksa: (val: string[]) => void;
  pengurusKoperasi: string[];
  setPengurusKoperasi: (val: string[]) => void;
}

const JENIS_OPTIONS: JenisKoperasi[] = [
  'KSP/KSPPS',
  'Serba Usaha',
  'Produsen',
  'Konsumen',
  'Jasa',
  'Lainnya',
];

export const IdentitySection: React.FC<IdentitySectionProps> = ({
  namaKoperasi,
  setNamaKoperasi,
  nomorBadanHukum,
  setNomorBadanHukum,
  jenisKoperasi,
  setJenisKoperasi,
  alamatKoperasi,
  setAlamatKoperasi,
  tanggalPemeriksaan,
  setTanggalPemeriksaan,
  timPemeriksa,
  setTimPemeriksa,
  pengurusKoperasi,
  setPengurusKoperasi,
}) => {
  const handleTimChange = (index: number, value: string) => {
    const updated = [...timPemeriksa];
    updated[index] = value;
    setTimPemeriksa(updated);
  };

  const handlePengurusChange = (index: number, value: string) => {
    const updated = [...pengurusKoperasi];
    updated[index] = value;
    setPengurusKoperasi(updated);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <Building2 className="w-5 h-5 text-emerald-700" />
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          Identitas Koperasi & Pelaksanaan Pemeriksaan
        </h2>
      </div>

      {/* Rujukan Hukum */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-3 text-xs text-emerald-900 mb-5 leading-relaxed">
        <div className="font-semibold flex items-center gap-1.5 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Dasar Hukum Pemeriksaan:</span>
        </div>
        <p className="text-emerald-800">
          UU No. 25/1992, Permenkop UKM No. 09/2018, Juklak Deputi Perkoperasian No. 15 & 33 Tahun 2021 Tentang Uji Kelayakan dan Kepatutan/Pemeriksaan Kesehatan Koperasi, serta Ketentuan Permenkop UKM No. 2/2024.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nama Koperasi */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nama Koperasi <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={namaKoperasi}
            onChange={(e) => setNamaKoperasi(e.target.value)}
            placeholder="Contoh: KSP Harapan Bersama Konawe"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Nomor Badan Hukum / NIK */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Hash className="w-3.5 h-3.5 text-slate-400" />
            <span>Nomor Badan Hukum / NIK</span>
          </label>
          <input
            type="text"
            value={nomorBadanHukum}
            onChange={(e) => setNomorBadanHukum(e.target.value)}
            placeholder="Contoh: AHU-0012345.AH.01.26.TAHUN 2021 / NIK..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Jenis Koperasi */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Jenis Koperasi
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {JENIS_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setJenisKoperasi(opt)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors text-center ${
                  jenisKoperasi === opt
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Tanggal Pemeriksaan */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Tanggal Pemeriksaan</span>
          </label>
          <input
            type="date"
            value={tanggalPemeriksaan}
            onChange={(e) => setTanggalPemeriksaan(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Alamat Koperasi */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Alamat Koperasi</span>
          </label>
          <input
            type="text"
            value={alamatKoperasi}
            onChange={(e) => setAlamatKoperasi(e.target.value)}
            placeholder="Jalan, Desa/Kelurahan, Kecamatan, Kabupaten Konawe"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Tim Pemeriksa & Pengurus */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 pt-4 border-t border-slate-100">
        {/* Tim Pemeriksa */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Users className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Nama Tim Pemeriksa Dinas (1 s/d 5)
            </h3>
          </div>
          <div className="space-y-2">
            {[0, 1, 2, 3, 4].map((idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono w-5">{idx + 1}.</span>
                <input
                  type="text"
                  value={timPemeriksa[idx] || ''}
                  onChange={(e) => handleTimChange(idx, e.target.value)}
                  placeholder={`Nama Petugas Pemeriksa ${idx + 1}`}
                  className="flex-1 px-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Pengurus / Perwakilan */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Users className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Pengurus / Perwakilan Koperasi (1 s/d 3)
            </h3>
          </div>
          <div className="space-y-2">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono w-5">{idx + 1}.</span>
                <input
                  type="text"
                  value={pengurusKoperasi[idx] || ''}
                  onChange={(e) => handlePengurusChange(idx, e.target.value)}
                  placeholder={`Nama Pengurus / Pengawas ${idx + 1}`}
                  className="flex-1 px-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
