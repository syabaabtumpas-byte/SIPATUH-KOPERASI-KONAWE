/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import {
  InspectionItem,
  JenisKoperasi,
  StatusKepatuhan,
  InterviewResponse,
  InspectionRecord,
} from './types/inspection';
import { INITIAL_INSPECTION_ITEMS } from './data/defaultItems';
import { Header } from './components/Header';
import { IdentitySection } from './components/IdentitySection';
import { AspekChecklist } from './components/AspekChecklist';
import { InterviewSection } from './components/InterviewSection';
import { BeritaAcaraView } from './components/BeritaAcaraView';
import { GoogleIntegrationGuide } from './components/GoogleIntegrationGuide';
import { HistoryList } from './components/HistoryList';
import {
  sendToGoogleSheetsWebhook,
  exportSingleRecordToCSV,
  exportAllRecordsToCSV,
} from './services/googleSheets';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

const STORAGE_KEY_DRAFT = 'simpatuh_current_draft';
const STORAGE_KEY_WEBHOOK = 'simpatuh_webhook_url';
const STORAGE_KEY_HISTORY = 'simpatuh_history_records';

export default function App() {
  const [, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'form' | 'rekap' | 'google' | 'history'>('form');

  // Form State
  const [namaKoperasi, setNamaKoperasi] = useState('');
  const [nomorBadanHukum, setNomorBadanHukum] = useState('');
  const [jenisKoperasi, setJenisKoperasi] = useState<JenisKoperasi>('KSP/KSPPS');
  const [alamatKoperasi, setAlamatKoperasi] = useState('');
  const [tanggalPemeriksaan, setTanggalPemeriksaan] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [timPemeriksa, setTimPemeriksa] = useState<string[]>(['', '', '', '', '']);
  const [pengurusKoperasi, setPengurusKoperasi] = useState<string[]>(['', '', '']);
  const [items, setItems] = useState<InspectionItem[]>(INITIAL_INSPECTION_ITEMS);
  const [wawancara, setWawancara] = useState<InterviewResponse>({
    pemahamanRegulasi: '',
    manajemenRisikoNPL: '',
    pemberdayaanAnggota: '',
    kepatuhanTataKelola: '',
  });

  const [rekomendasi, setRekomendasi] = useState<[string, string, string]>([
    'Melengkapi dan memutakhirkan Buku Daftar Anggota (BDA) secara berkala.',
    'Menyampaikan laporan keuangan periodik melalui sistem ODS Kemenkop UKM.',
    'Memastikan pelaksanaan RAT diselenggarakan tepat waktu maksimal 6 bulan setelah tutup buku.',
  ]);
  const [catatanKesimpulan, setCatatanKesimpulan] = useState('');
  const [manualStatus, setManualStatus] = useState<StatusKepatuhan | null>(null);

  // Webhook & History State
  const [webhookUrl, setWebhookUrlState] = useState('');
  const [historyRecords, setHistoryRecords] = useState<InspectionRecord[]>([]);

  // Feedback notifications
  const [isSendingToSheets, setIsSendingToSheets] = useState(false);
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingStatus, setPingStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [alertNotification, setAlertNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load from localStorage on initial render
  useEffect(() => {
    try {
      const savedUrl = localStorage.getItem(STORAGE_KEY_WEBHOOK);
      if (savedUrl) setWebhookUrlState(savedUrl);

      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (savedHistory) setHistoryRecords(JSON.parse(savedHistory));

      const savedDraft = localStorage.getItem(STORAGE_KEY_DRAFT);
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        if (draft.namaKoperasi) setNamaKoperasi(draft.namaKoperasi);
        if (draft.nomorBadanHukum) setNomorBadanHukum(draft.nomorBadanHukum);
        if (draft.jenisKoperasi) setJenisKoperasi(draft.jenisKoperasi);
        if (draft.alamatKoperasi) setAlamatKoperasi(draft.alamatKoperasi);
        if (draft.tanggalPemeriksaan) setTanggalPemeriksaan(draft.tanggalPemeriksaan);
        if (draft.timPemeriksa) setTimPemeriksa(draft.timPemeriksa);
        if (draft.pengurusKoperasi) setPengurusKoperasi(draft.pengurusKoperasi);
        if (draft.items && Array.isArray(draft.items)) setItems(draft.items);
        if (draft.wawancara) setWawancara(draft.wawancara);
        if (draft.rekomendasi) setRekomendasi(draft.rekomendasi);
        if (draft.catatanKesimpulan) setCatatanKesimpulan(draft.catatanKesimpulan);
        if (draft.manualStatus) setManualStatus(draft.manualStatus);
      }
    } catch (e) {
      console.warn('Failed loading initial state from storage:', e);
    }
  }, []);

  const setWebhookUrl = (url: string) => {
    setWebhookUrlState(url);
    localStorage.setItem(STORAGE_KEY_WEBHOOK, url);
  };

  // Auto-save draft debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const currentDraft = {
          namaKoperasi,
          nomorBadanHukum,
          jenisKoperasi,
          alamatKoperasi,
          tanggalPemeriksaan,
          timPemeriksa,
          pengurusKoperasi,
          items,
          wawancara,
          rekomendasi,
          catatanKesimpulan,
          manualStatus,
        };
        localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(currentDraft));
      } catch (err) {
        console.warn('Failed auto-saving draft:', err);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [
    namaKoperasi,
    nomorBadanHukum,
    jenisKoperasi,
    alamatKoperasi,
    tanggalPemeriksaan,
    timPemeriksa,
    pengurusKoperasi,
    items,
    wawancara,
    rekomendasi,
    catatanKesimpulan,
    manualStatus,
  ]);

  // Compute Scores
  const { totalPatuh, totalTidakPatuh, totalItem, persentaseKepatuhan, calculatedStatus } = useMemo(() => {
    let patuh = 0;
    let tidakPatuh = 0;
    const total = items.length;

    items.forEach((item) => {
      if (item.isReverseScoring) {
        if (item.hasil === 'TIDAK') patuh++;
        else if (item.hasil === 'YA') tidakPatuh++;
      } else {
        if (item.hasil === 'YA') patuh++;
        else if (item.hasil === 'TIDAK') tidakPatuh++;
      }
    });

    const percent = total > 0 ? Math.round((patuh / total) * 100) : 0;

    let status: StatusKepatuhan = 'Kurang Patuh';
    if (percent >= 85) status = 'Sangat Patuh';
    else if (percent >= 70) status = 'Cukup Patuh';
    else if (percent >= 55) status = 'Kurang Patuh';
    else status = 'Tidak Patuh';

    return {
      totalPatuh: patuh,
      totalTidakPatuh: tidakPatuh,
      totalItem: total,
      persentaseKepatuhan: percent,
      calculatedStatus: status,
    };
  }, [items]);

  const currentStatusKepatuhan = manualStatus || calculatedStatus;

  // Build current InspectionRecord object
  const buildCurrentRecord = (): InspectionRecord => {
    return {
      id: 'insp_' + Date.now(),
      timestamp: new Date().toISOString(),
      namaKoperasi: namaKoperasi || 'Koperasi Tanpa Nama',
      nomorBadanHukum,
      jenisKoperasi,
      alamatKoperasi,
      tanggalPemeriksaan,
      timPemeriksa,
      pengurusKoperasi,
      items,
      wawancara,
      statusKepatuhan: currentStatusKepatuhan,
      rekomendasi,
      catatanKesimpulan,
      totalItem,
      totalPatuh,
      totalTidakPatuh,
      persentaseKepatuhan,
    };
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setAlertNotification({ type, message });
    setTimeout(() => setAlertNotification(null), 5000);
  };

  // Actions
  const handleSendToGoogleSheets = async (targetRecord?: InspectionRecord) => {
    const record = targetRecord || buildCurrentRecord();

    if (!webhookUrl) {
      setActiveTab('google');
      showNotification('error', 'Silakan masukkan Webhook URL Google Apps Script Anda terlebih dahulu.');
      return;
    }

    setIsSendingToSheets(true);
    try {
      await sendToGoogleSheetsWebhook(webhookUrl, record);
      // Auto-save to history archive as well
      handleSaveToLocal(record, false);
      showNotification('success', `Berhasil! Data pemeriksaan ${record.namaKoperasi} telah terkirim ke Google Sheets.`);
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal mengirim ke Google Sheets.');
    } finally {
      setIsSendingToSheets(false);
    }
  };

  const handleTestPing = async (url: string) => {
    setIsTestingPing(true);
    setPingStatus(null);
    try {
      const dummyRecord = buildCurrentRecord();
      dummyRecord.namaKoperasi = '[UJI KONEKSI PING] ' + (namaKoperasi || 'Koperasi Test Konawe');
      await sendToGoogleSheetsWebhook(url, dummyRecord);
      setPingStatus({
        success: true,
        message: 'Koneksi Berhasil! Baris uji coba telah ditambahkan ke spreadsheet Google Sheets Anda.',
      });
    } catch (err: any) {
      setPingStatus({
        success: false,
        message: err.message || 'Koneksi gagal. Periksa kembali URL Webhook Anda.',
      });
    } finally {
      setIsTestingPing(false);
    }
  };

  const handleSaveToLocal = (targetRecord?: InspectionRecord, notify: boolean = true) => {
    const record = targetRecord || buildCurrentRecord();
    const updated = [record, ...historyRecords.filter((r) => r.id !== record.id)];
    setHistoryRecords(updated);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    if (notify) {
      showNotification('success', `Pemeriksaan ${record.namaKoperasi} berhasil disimpan di arsip perangkat.`);
    }
  };

  const handleLoadRecord = (record: InspectionRecord) => {
    startTransition(() => {
      setNamaKoperasi(record.namaKoperasi);
      setNomorBadanHukum(record.nomorBadanHukum);
      setJenisKoperasi(record.jenisKoperasi);
      setAlamatKoperasi(record.alamatKoperasi);
      setTanggalPemeriksaan(record.tanggalPemeriksaan);
      const paddedTim = Array.isArray(record.timPemeriksa)
        ? [...record.timPemeriksa, '', '', '', '', ''].slice(0, 5)
        : ['', '', '', '', ''];
      setTimPemeriksa(paddedTim);
      setPengurusKoperasi(record.pengurusKoperasi);
      setItems(record.items);
      setWawancara(record.wawancara);
      setRekomendasi(record.rekomendasi);
      setCatatanKesimpulan(record.catatanKesimpulan || '');
      setManualStatus(record.statusKepatuhan);
      setActiveTab('form');
    });
    showNotification('success', `Arsip ${record.namaKoperasi} dimuat ke formulir aktif.`);
  };

  const handleDeleteRecord = (id: string) => {
    const updated = historyRecords.filter((r) => r.id !== id);
    setHistoryRecords(updated);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    showNotification('success', 'Catatan pemeriksaan dihapus dari arsip.');
  };

  const handleNewForm = () => {
    if (window.confirm('Buat formulir baru? Data yang belum disimpan ke arsip akan diganti.')) {
      setNamaKoperasi('');
      setNomorBadanHukum('');
      setJenisKoperasi('KSP/KSPPS');
      setAlamatKoperasi('');
      setTanggalPemeriksaan(new Date().toISOString().slice(0, 10));
      setTimPemeriksa(['', '', '', '', '']);
      setPengurusKoperasi(['', '', '']);
      setItems(INITIAL_INSPECTION_ITEMS);
      setWawancara({
        pemahamanRegulasi: '',
        manajemenRisikoNPL: '',
        pemberdayaanAnggota: '',
        kepatuhanTataKelola: '',
      });
      setManualStatus(null);
      setCatatanKesimpulan('');
      localStorage.removeItem(STORAGE_KEY_DRAFT);
      setActiveTab('form');
      showNotification('success', 'Formulir baru telah siap.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100/60 pb-16">
      {/* Official Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        persentaseKepatuhan={persentaseKepatuhan}
        statusKepatuhan={currentStatusKepatuhan}
        totalPatuh={totalPatuh}
        totalItem={totalItem}
        onPrint={handlePrint}
      />

      {/* Floating Notification */}
      {alertNotification && (
        <div className="no-print fixed bottom-4 right-4 z-50 max-w-md animate-fade-in">
          <div
            className={`p-4 rounded-xl shadow-lg border flex items-start gap-3 ${
              alertNotification.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : 'bg-rose-900 text-white border-rose-700'
            }`}
          >
            {alertNotification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs leading-relaxed">
              {alertNotification.message}
            </div>
            <button
              onClick={() => setAlertNotification(null)}
              className="text-white/60 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main View Container */}
      <main className="max-w-6xl mx-auto px-4 pt-6">
        {activeTab === 'form' && (
          <div className="space-y-6">
            {/* Bagian Identitas */}
            <IdentitySection
              namaKoperasi={namaKoperasi}
              setNamaKoperasi={setNamaKoperasi}
              nomorBadanHukum={nomorBadanHukum}
              setNomorBadanHukum={setNomorBadanHukum}
              jenisKoperasi={jenisKoperasi}
              setJenisKoperasi={setJenisKoperasi}
              alamatKoperasi={alamatKoperasi}
              setAlamatKoperasi={setAlamatKoperasi}
              tanggalPemeriksaan={tanggalPemeriksaan}
              setTanggalPemeriksaan={setTanggalPemeriksaan}
              timPemeriksa={timPemeriksa}
              setTimPemeriksa={setTimPemeriksa}
              pengurusKoperasi={pengurusKoperasi}
              setPengurusKoperasi={setPengurusKoperasi}
            />

            {/* Checklist 4 Aspek */}
            <AspekChecklist items={items} setItems={setItems} />

            {/* Lembar Wawancara Pengurus */}
            <InterviewSection
              wawancara={wawancara}
              setWawancara={setWawancara}
            />

            {/* Bottom Next Step Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
              <div className="text-xs text-slate-500">
                Pemeriksaan selesai diisi? Lanjut ke rekapitulasi nilai dan pengesahan Berita Acara.
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('rekap')}
                className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
              >
                <span>Lihat Berita Acara &amp; Rekap Nilai</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'rekap' && (
          <BeritaAcaraView
            record={buildCurrentRecord()}
            statusKepatuhan={currentStatusKepatuhan}
            setStatusKepatuhan={(val) => setManualStatus(val)}
            rekomendasi={rekomendasi}
            setRekomendasi={setRekomendasi}
            catatanKesimpulan={catatanKesimpulan}
            setCatatanKesimpulan={setCatatanKesimpulan}
            onSendToGoogleSheets={() => handleSendToGoogleSheets()}
            onExportCSV={() => exportSingleRecordToCSV(buildCurrentRecord())}
            onSaveToLocal={() => handleSaveToLocal()}
            onPrint={handlePrint}
            isSendingToSheets={isSendingToSheets}
            sheetsUrlConfigured={Boolean(webhookUrl)}
          />
        )}

        {activeTab === 'google' && (
          <GoogleIntegrationGuide
            webhookUrl={webhookUrl}
            setWebhookUrl={setWebhookUrl}
            onTestPing={handleTestPing}
            isTestingPing={isTestingPing}
            pingStatus={pingStatus}
          />
        )}

        {activeTab === 'history' && (
          <HistoryList
            records={historyRecords}
            onLoadRecord={handleLoadRecord}
            onDeleteRecord={handleDeleteRecord}
            onExportAllCSV={() => exportAllRecordsToCSV(historyRecords)}
            onExportSingleCSV={(r) => exportSingleRecordToCSV(r)}
            onResendToSheets={(r) => handleSendToGoogleSheets(r)}
            onNewForm={handleNewForm}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-12 border-t border-slate-200 text-center py-6 text-xs text-slate-500 max-w-6xl mx-auto px-4">
        <p className="font-semibold text-slate-700">
          SIMPATUH KOPERASI — Dinas Koperasi dan UKM Pemerintah Kabupaten Konawe
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          Instrumen Digital Pemeriksaan Kepatuhan Koperasi Eksisting • Sesuai Permenkop UKM No. 2/2024 &amp; Juklak No. 15/2021
        </p>
      </footer>
    </div>
  );
}
