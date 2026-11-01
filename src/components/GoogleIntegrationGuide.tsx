import React, { useState } from 'react';
import { APPS_SCRIPT_TEMPLATE } from '../services/googleSheets';
import { Sheet, Globe, Copy, Check, ExternalLink, Send, ShieldCheck, Sparkles, AlertCircle, Download } from 'lucide-react';

interface GoogleIntegrationGuideProps {
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  onTestPing: (url: string) => Promise<void>;
  isTestingPing: boolean;
  pingStatus: { success: boolean; message: string } | null;
}

export const GoogleIntegrationGuide: React.FC<GoogleIntegrationGuideProps> = ({
  webhookUrl,
  setWebhookUrl,
  onTestPing,
  isTestingPing,
  pingStatus,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const currentAppUrl = window.location.origin;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentAppUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const embedCode = `<iframe src="${currentAppUrl}" width="100%" height="800px" frameborder="0" style="border:none; border-radius:12px;" allowfullscreen></iframe>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-2 pb-3 border-b border-slate-100">
          <Sheet className="w-5 h-5 text-emerald-700" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Koneksi Google Sheets (Google Apps Script Webhook)
          </h2>
        </div>
        <p className="text-xs text-slate-600 mb-4">
          Masukkan URL Webhook Google Apps Script Anda. Setiap formulir pemeriksaan yang disimpan akan otomatis terkirim dan tercatat sebagai baris baru di spreadsheet Anda secara instan.
        </p>

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700">
            Webhook Web App URL Google Sheets:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => onTestPing(webhookUrl)}
              disabled={isTestingPing || !webhookUrl}
              className={`flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-white transition-all whitespace-nowrap ${
                isTestingPing || !webhookUrl
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-emerald-700 hover:bg-emerald-800 shadow-xs'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isTestingPing ? 'Menguji...' : 'Uji Koneksi (Test Ping)'}</span>
            </button>
          </div>

          {/* Ping Status Alert */}
          {pingStatus && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                pingStatus.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {pingStatus.success ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{pingStatus.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tutorial 3 Langkah Siapkan Google Sheets */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Panduan 3 Menit Menyiapkan Google Sheets
            </h3>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Tersalin!' : 'Salin Kode Script'}</span>
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-700">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </span>
            <div>
              <p className="font-semibold text-slate-900">
                Buat Spreadsheet Baru di Google Sheets
              </p>
              <p className="text-slate-500 mt-0.5">
                Buka akun Google Anda lalu buat spreadsheet kosong baru (bisa klik pintasan berikut:
                {' '}
                <a
                  href="https://sheets.new"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 font-semibold underline inline-flex items-center gap-0.5"
                >
                  sheets.new <ExternalLink className="w-3 h-3" />
                </a>
                ). Beri judul dokumen misalnya: <strong>&ldquo;Rekap Kepatuhan Koperasi Konawe&rdquo;</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </span>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">
                Buka Menu Apps Script &amp; Tempel Kode Otomatis
              </p>
              <p className="text-slate-500 mt-0.5 mb-2">
                Di Google Sheet Anda, klik menu atas: <strong>Ekstensi (Extensions)</strong> &gt; <strong>Apps Script</strong>. Hapus semua teks default di editor kode tersebut, lalu tempelkan kode di bawah ini:
              </p>
              <div className="bg-slate-900 text-slate-100 rounded-lg p-3 font-mono text-[11px] max-h-48 overflow-y-auto">
                <pre>{APPS_SCRIPT_TEMPLATE}</pre>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </span>
            <div>
              <p className="font-semibold text-slate-900">
                Terapkan Sebagai Web App (Deploy)
              </p>
              <p className="text-slate-500 mt-0.5">
                Di pojok kanan atas Apps Script, klik tombol biru <strong>Terapkan (Deploy)</strong> &gt; <strong>Deployment baru (New deployment)</strong> &gt; Pilih jenis roda gigi <strong>Aplikasi Web (Web App)</strong>.
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-600">
                <li>Deskripsi: <em>SIMPATUH Webhook</em></li>
                <li>Jalankan sebagai: <strong>Saya (Email Anda)</strong></li>
                <li>Siapa yang memiliki akses: <strong>Siapa saja (Anyone)</strong></li>
              </ul>
              <p className="text-slate-500 mt-1">
                Klik <strong>Terapkan</strong>, berikan izin Google Anda sekali, lalu salin <strong>URL Aplikasi Web</strong> yang dihasilkan dan tempelkan pada kolom URL di atas!
              </p>

              {/* Troubleshooting Warning 'Google hasn't verified this app' */}
              <div className="mt-4 p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-950 mb-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Jika Muncul Peringatan: &ldquo;Google hasn&apos;t verified this app&rdquo;</span>
                </div>
                <p className="text-[11px] text-amber-800 mb-2 leading-relaxed">
                  Peringatan ini <strong>sangat normal</strong> untuk semua skrip Apps Script buatan sendiri yang belum didaftarkan publik ke Google Cloud Console. Skrip ini 100% aman karena berjalan di Google Sheet Anda sendiri.
                </p>
                <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200 space-y-1.5 text-[11px] text-slate-800">
                  <p><strong>Langkah Melewatinya (Hanya 3 Klik):</strong></p>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-700">
                    <li>Klik tulisan kecil di pojok kiri bawah: <strong>&ldquo;Advanced&rdquo; (Lanjutan)</strong>.</li>
                    <li>Klik tautan di bawahnya: <strong>&ldquo;Go to ... (unsafe)&rdquo;</strong> atau <strong>&ldquo;Buka ... (tidak aman)&rdquo;</strong>.</li>
                    <li>Klik tombol biru <strong>&ldquo;Allow&rdquo; (Izinkan)</strong>.</li>
                  </ol>
                  <p className="text-[10px] text-emerald-800 font-semibold pt-1">
                    ✓ Setelah itu, URL Webhook resmi Google Sheet Anda akan langsung muncul!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panduan Google Sites */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              File &amp; Panduan Sematkan ke Google Sites
            </h3>
          </div>
          <a
            href="/simpatuh_embed_google_sites.html"
            download="simpatuh_embed_google_sites.html"
            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh File HTML Embed</span>
          </a>
        </div>

        <p className="text-xs text-slate-600 mb-5 leading-relaxed">
          Google Sites menyediakan fitur penyematan yang sangat mudah. Anda dapat memilih salah satu dari 2 metode di bawah ini:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Metode A: Sematkan dengan URL (Paling Mudah) */}
          <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-emerald-900 text-sm">
                  Metode 1: Sematkan Melalui URL (Rekomendasi)
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-2 py-1 text-[11px] font-bold rounded bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center gap-1"
                >
                  {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink ? 'Tersalin!' : 'Salin URL'}</span>
                </button>
              </div>

              <ol className="list-decimal pl-4 space-y-1.5 text-slate-700 text-[11px] mb-3">
                <li>Buka editor <strong>Google Sites</strong> Anda.</li>
                <li>Klik menu kanan <strong>Sisipkan (Insert)</strong> &gt; pilih <strong>Sematkan (Embed)</strong>.</li>
                <li>Pilih tab <strong>Dengan URL (By URL)</strong>.</li>
                <li>Tempelkan URL aplikasi di bawah ini lalu pilih <strong>Seluruh Halaman (Whole Page)</strong>.</li>
              </ol>
            </div>

            <div className="bg-white border border-slate-300 rounded-lg p-2.5 font-mono text-[11px] text-slate-800 break-all select-all">
              {currentAppUrl}
            </div>
          </div>

          {/* Metode B: Sematkan dengan Kode HTML (Iframe) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm">
                  Metode 2: Sematkan Kode HTML (Embed Code)
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmbed}
                  className="px-2 py-1 text-[11px] font-bold rounded bg-slate-800 text-white hover:bg-slate-900 transition-colors flex items-center gap-1"
                >
                  {copiedEmbed ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEmbed ? 'Tersalin!' : 'Salin Kode'}</span>
                </button>
              </div>

              <ol className="list-decimal pl-4 space-y-1.5 text-slate-700 text-[11px] mb-3">
                <li>Di Google Sites, pilih <strong>Sematkan (Embed)</strong> &gt; tab <strong>Sematkan kode (Embed code)</strong>.</li>
                <li>Tempelkan potongan kode HTML iframe berikut, lalu klik <strong>Berikutnya</strong> &gt; <strong>Sisipkan</strong>.</li>
                <li>Tarik bingkai ke bawah agar tinggi formulir terlihat leluasa.</li>
              </ol>
            </div>

            <div className="bg-white border border-slate-300 rounded-lg p-2.5 font-mono text-[10px] text-slate-800 break-all select-all max-h-20 overflow-y-auto">
              {embedCode}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
