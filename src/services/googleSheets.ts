import { InspectionRecord } from '../types/inspection';

export const APPS_SCRIPT_TEMPLATE = `/**
 * GOOGLE APPS SCRIPT - SIMPATUH KOPERASI KONAWE
 * Salin dan tempel kode ini di Google Sheets:
 * Menu: Ekstensi > Apps Script > Simpan > Terapkan (Deploy) > Sebagai Web App (Akses: Siapa Saja)
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Header otomatis jika baris 1 masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Waktu Input",
        "Tanggal Pemeriksaan",
        "Nama Koperasi",
        "Nomor Badan Hukum / NIK",
        "Jenis Koperasi",
        "Alamat",
        "Tim Pemeriksa",
        "Pengurus / Perwakilan",
        "Skor Kepatuhan (%)",
        "Status Kepatuhan",
        "Total Patuh",
        "Total Parameter",
        "Rekomendasi 1",
        "Rekomendasi 2",
        "Rekomendasi 3",
        "Wawancara - Regulasi & AD/ART",
        "Wawancara - Manajemen Risiko & NPL",
        "Wawancara - Pemberdayaan Anggota",
        "Wawancara - Tata Kelola Transaksi",
        "Catatan Temuan Lengkap"
      ]);
      sheet.getRange(1, 1, 1, 20).setFontWeight("bold").setBackground("#047857").setFontColor("#FFFFFF");
    }
    
    // Gabungkan ringkasan catatan temuan
    var catatanTemuan = (data.items || [])
      .filter(function(item) { return item.catatan && item.catatan.trim() !== ""; })
      .map(function(item) { return "[" + item.id + " " + item.subAspek + "]: " + item.catatan; })
      .join(" | ");

    var row = [
      new Date(),
      data.tanggalPemeriksaan || "",
      data.namaKoperasi || "",
      "'" + (data.nomorBadanHukum || ""),
      data.jenisKoperasi || "",
      data.alamatKoperasi || "",
      (data.timPemeriksa || []).join(", "),
      (data.pengurusKoperasi || []).join(", "),
      data.persentaseKepatuhan + "%",
      data.statusKepatuhan || "",
      data.totalPatuh || 0,
      data.totalItem || 0,
      (data.rekomendasi && data.rekomendasi[0]) || "",
      (data.rekomendasi && data.rekomendasi[1]) || "",
      (data.rekomendasi && data.rekomendasi[2]) || "",
      (data.wawancara && data.wawancara.pemahamanRegulasi) || "",
      (data.wawancara && data.wawancara.manajemenRisikoNPL) || "",
      (data.wawancara && data.wawancara.pemberdayaanAnggota) || "",
      (data.wawancara && data.wawancara.kepatuhanTataKelola) || "",
      catatanTemuan
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data berhasil dicatat ke Google Sheet"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;

/**
 * Mengirim payload pemeriksaan ke Webhook Google Apps Script
 */
export async function sendToGoogleSheetsWebhook(
  webhookUrl: string,
  record: InspectionRecord
): Promise<{ success: boolean; message: string }> {
  if (!webhookUrl || !webhookUrl.startsWith('https://script.google.com/macros/s/')) {
    throw new Error('URL Google Apps Script tidak valid. Harap masukkan Web App URL yang berawalan https://script.google.com/macros/s/...');
  }

  try {
    // Google Apps Script redirects with 302, mode: 'no-cors' sends the payload securely
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
    });

    return {
      success: true,
      message: 'Data pemeriksaan berhasil dikirim ke Google Sheets!',
    };
  } catch (error: any) {
    console.error('Error sending to Google Sheet:', error);
    throw new Error('Gagal mengirim ke Google Sheets: ' + (error?.message || 'Koneksi gagal'));
  }
}

/**
 * Ekspor satu catatan pemeriksaan ke file CSV (dapat langsung dibuka di Google Sheets atau Excel)
 */
export function exportSingleRecordToCSV(record: InspectionRecord) {
  const headers = [
    'Parameter / Metadata',
    'Nilai / Hasil Verifikasi',
    'Catatan / Temuan'
  ];

  const rows: string[][] = [
    ['--- IDENTITAS PEMERIKSAAN KOPERASI ---', '', ''],
    ['Nama Koperasi', record.namaKoperasi, ''],
    ['Nomor Badan Hukum / NIK', `="${record.nomorBadanHukum}"`, ''],
    ['Jenis Koperasi', record.jenisKoperasi, ''],
    ['Alamat Koperasi', record.alamatKoperasi, ''],
    ['Tanggal Pemeriksaan', record.tanggalPemeriksaan, ''],
    ['Tim Pemeriksa 1', record.timPemeriksa[0] || '', ''],
    ['Tim Pemeriksa 2', record.timPemeriksa[1] || '', ''],
    ['Tim Pemeriksa 3', record.timPemeriksa[2] || '', ''],
    ['Tim Pemeriksa 4', record.timPemeriksa[3] || '', ''],
    ['Tim Pemeriksa 5', record.timPemeriksa[4] || '', ''],
    ['Pengurus / Perwakilan 1', record.pengurusKoperasi[0] || '', ''],
    ['Pengurus / Perwakilan 2', record.pengurusKoperasi[1] || '', ''],
    ['Pengurus / Perwakilan 3', record.pengurusKoperasi[2] || '', ''],
    ['', '', ''],
    ['--- KESIMPULAN BERITA ACARA ---', '', ''],
    ['Skor Kepatuhan', `${record.persentaseKepatuhan}% (${record.totalPatuh}/${record.totalItem} Patuh)`, ''],
    ['Status Kepatuhan', record.statusKepatuhan, ''],
    ['Rekomendasi Utama 1', record.rekomendasi[0] || '-', ''],
    ['Rekomendasi Utama 2', record.rekomendasi[1] || '-', ''],
    ['Rekomendasi Utama 3', record.rekomendasi[2] || '-', ''],
    ['', '', ''],
    ['--- LEMBAR WAWANCARA (FIT & PROPER SINGKAT) ---', '', ''],
    ['1. Pemahaman Regulasi & AD/ART', record.wawancara.pemahamanRegulasi || '-', ''],
    ['2. Manajemen Risiko & Piutang Bermasalah', record.wawancara.manajemenRisikoNPL || '-', ''],
    ['3. Pemberdayaan Anggota', record.wawancara.pemberdayaanAnggota || '-', ''],
    ['4. Kepatuhan Tata Kelola Transaksi', record.wawancara.kepatuhanTataKelola || '-', ''],
    ['', '', ''],
    ['--- RINCIAN 4 ASPEK PEMERIKSAAN ---', '', ''],
    ...record.items.map(item => [
      `[${item.id}] ${item.parameter}`,
      item.hasil === 'YA' ? (item.isReverseScoring ? 'TIDAK PATUH (Pelanggaran)' : 'PATUH') : 
      item.hasil === 'TIDAK' ? (item.isReverseScoring ? 'PATUH (Tidak Melanggar)' : 'TIDAK PATUH') : 'BELUM DIPERIKSA',
      item.catatan || '-'
    ])
  ];

  const csvContent = '\uFEFF' + [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\r\n');

  downloadCSV(csvContent, `Pemeriksaan_${sanitizeFilename(record.namaKoperasi || 'Koperasi')}_${record.tanggalPemeriksaan || 'draft'}.csv`);
}

/**
 * Ekspor seluruh riwayat pemeriksaan ke 1 tabel CSV
 */
export function exportAllRecordsToCSV(records: InspectionRecord[]) {
  if (records.length === 0) return;

  const headers = [
    'Tanggal Pemeriksaan',
    'Nama Koperasi',
    'Nomor Badan Hukum / NIK',
    'Jenis Koperasi',
    'Alamat',
    'Tim Pemeriksa',
    'Pengurus Koperasi',
    'Skor (%)',
    'Status Kepatuhan',
    'Total Patuh',
    'Total Item',
    'Rekomendasi 1',
    'Rekomendasi 2',
    'Rekomendasi 3'
  ];

  const rows = records.map(r => [
    r.tanggalPemeriksaan,
    r.namaKoperasi,
    `="${r.nomorBadanHukum}"`,
    r.jenisKoperasi,
    r.alamatKoperasi,
    r.timPemeriksa.filter(Boolean).join('; '),
    r.pengurusKoperasi.filter(Boolean).join('; '),
    `${r.persentaseKepatuhan}%`,
    r.statusKepatuhan,
    String(r.totalPatuh),
    String(r.totalItem),
    r.rekomendasi[0] || '',
    r.rekomendasi[1] || '',
    r.rekomendasi[2] || ''
  ]);

  const csvContent = '\uFEFF' + [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\r\n');

  downloadCSV(csvContent, `Rekap_Kepatuhan_Koperasi_Konawe_${new Date().toISOString().slice(0, 10)}.csv`);
}

function escapeCSV(text: string): string {
  if (text === null || text === undefined) return '""';
  const escaped = String(text).replace(/"/g, '""');
  return `"${escaped}"`;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_');
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
