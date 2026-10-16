/**
 * 1Tiket Design System Data Formatters
 */

// Format Rupiah: "Rp1.250.000"
export function formatRupiah(amount) {
    if (amount === undefined || amount === null) return 'Rp0';
    const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount);

    // Replace "Rp " with "Rp" per design specification
    return formatted.replace(/\s+/g, '');
}

// Format Tanggal: "Sabtu, 17 Okt 2026"
export function formatDate(dateStr, options = {}) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
        weekday: options.weekday || 'short',
        day: 'numeric',
        month: options.month || 'short',
        year: options.year || 'numeric',
    }).format(date);
}

// Format Jam: "19:30 WIB"
export function formatTimeWithTz(timeStr, timezone = 'Asia/Jakarta') {
    if (!timeStr) return '';
    let tzCode = 'WIB';
    if (timezone.includes('Makassar') || timezone.includes('Ujung_Pandang') || timezone.includes('Bali')) {
        tzCode = 'WITA';
    } else if (timezone.includes('Jayapura')) {
        tzCode = 'WIT';
    }
    return `${timeStr} ${tzCode}`;
}

// Clean copy text: strip any em dash or double dash
export function cleanCopy(text) {
    if (!text) return '';
    return text.replace(/—|--/g, ' • ').replace(/\s{2,}/g, ' ');
}
