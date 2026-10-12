import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Filter items by date field based on selected date range preset or custom date bounds
 */
export function filterDataByDate(items, dateField = 'date', rangePreset = 'all', customStart = '', customEnd = '') {
  if (!items || !Array.isArray(items)) return [];
  if (rangePreset === 'all' && !customStart && !customEnd) return items;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;

  return items.filter((item) => {
    const rawDate = item[dateField] || item.requestedDate || item.date || item.createdAt || item.bookingDate || item.dateRequested;
    if (!rawDate) return true;

    const itemDate = new Date(rawDate).getTime();
    if (isNaN(itemDate)) return true;

    if (rangePreset === 'today') {
      return itemDate >= todayStart && itemDate < todayStart + oneDayMs;
    }
    if (rangePreset === 'yesterday') {
      return itemDate >= todayStart - oneDayMs && itemDate < todayStart;
    }
    if (rangePreset === '7days') {
      return itemDate >= todayStart - 7 * oneDayMs;
    }
    if (rangePreset === '30days') {
      return itemDate >= todayStart - 30 * oneDayMs;
    }
    if (rangePreset === 'thisMonth') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      return itemDate >= monthStart;
    }
    if (rangePreset === 'quarter') {
      const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1).getTime();
      return itemDate >= quarterStart;
    }
    if (rangePreset === 'custom') {
      let match = true;
      if (customStart) {
        const startTs = new Date(customStart).getTime();
        if (!isNaN(startTs)) match = match && itemDate >= startTs;
      }
      if (customEnd) {
        const endTs = new Date(customEnd).getTime() + oneDayMs;
        if (!isNaN(endTs)) match = match && itemDate < endTs;
      }
      return match;
    }

    return true;
  });
}

/**
 * Download formatted Excel (.xlsx) file
 */
export function exportToExcel({
  filename = 'MediUnify_Report',
  sheetName = 'Report Data',
  title = 'MediUnify Healthcare Report',
  columns = [], // [{ header: 'Name', key: 'name', width: 20 }]
  data = [],
  metadata = {}
}) {
  const wb = XLSX.utils.book_new();

  const todayStr = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const wsData = [];
  
  // Title & Metadata rows
  wsData.push([title.toUpperCase()]);
  wsData.push([`Generated On: ${todayStr}`, `Portal: ${metadata.portal || 'All Portals'}`]);
  if (metadata.dateRange) {
    wsData.push([`Date Range Filter: ${metadata.dateRange}`, `Total Records: ${data.length}`]);
  }
  wsData.push([]); // blank line

  // Column Headers
  const headers = columns.map((col) => col.header);
  wsData.push(headers);

  // Data rows
  data.forEach((row) => {
    const rowValues = columns.map((col) => {
      const val = row[col.key || col.accessor];
      if (val === null || val === undefined) return '';
      if (typeof val === 'object') return JSON.stringify(val);
      return val;
    });
    wsData.push(rowValues);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  const colWidths = columns.map((col) => ({
    wch: Math.max(col.width || 18, String(col.header).length + 4)
  }));
  ws['!cols'] = [{ wch: 25 }, ...colWidths];

  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));

  const validFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  XLSX.writeFile(wb, validFilename);
}

/**
 * Download styled, branded PDF report using jsPDF & autoTable
 */
export function exportToPDF({
  filename = 'MediUnify_Report',
  title = 'MediUnify Operational Report',
  subtitle = 'Healthcare Unified Administrative Summary',
  columns = [], // [{ header: 'Patient Name', dataKey: 'patientName' }]
  data = [],
  summaryCards = [], // [{ label: 'Total Inquiries', value: '45' }]
  metadata = {}
}) {
  const orientation = columns.length > 5 ? 'landscape' : 'portrait';
  const doc = new jsPDF({
    orientation,
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36; // 0.5 inch

  const primaryTeal = [13, 148, 136]; // #0D9488
  const darkNavy = [15, 23, 42];      // #0F172A
  const slateMuted = [100, 116, 139]; // #64748B
  const lightBg = [248, 250, 252];    // #F8FAFC

  // 1. Top Header Banner
  doc.setFillColor(...primaryTeal);
  doc.rect(0, 0, pageWidth, 48, 'F');

  // Brand Logo Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text('MEDIUNIFY HEALTHCARE PLATFORM', margin, 30);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(204, 251, 241);
  const genTime = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
  doc.text(`Generated: ${genTime}`, pageWidth - margin, 30, { align: 'right' });

  // 2. Report Title & Subtitle
  let currentY = 75;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...darkNavy);
  doc.text(title, margin, currentY);

  currentY += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...slateMuted);
  doc.text(subtitle, margin, currentY);

  // Metadata
  if (metadata.dateRange || metadata.portal) {
    currentY += 15;
    doc.setFontSize(8.5);
    doc.setTextColor(...primaryTeal);
    const metaStr = `Scope: ${metadata.portal || 'All Portals'}  |  Date Filter: ${metadata.dateRange || 'All Time'}  |  Total Records: ${data.length}`;
    doc.text(metaStr, margin, currentY);
  }

  // 3. Summary Cards (KPI Metrics)
  if (summaryCards && summaryCards.length > 0) {
    currentY += 16;
    const cardWidth = (pageWidth - margin * 2 - (summaryCards.length - 1) * 10) / summaryCards.length;
    const cardHeight = 36;

    summaryCards.forEach((card, idx) => {
      const cardX = margin + idx * (cardWidth + 10);
      doc.setFillColor(...lightBg);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 4, 4, 'FD');

      doc.setFillColor(...primaryTeal);
      doc.rect(cardX, currentY, cardWidth, 2, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...slateMuted);
      doc.text(card.label.toUpperCase(), cardX + 6, currentY + 13);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...darkNavy);
      doc.text(String(card.value), cardX + 6, currentY + 28);
    });

    currentY += cardHeight + 12;
  } else {
    currentY += 12;
  }

  // 4. AutoTable Data Grid
  const tableHeaders = columns.map((col) => col.header);
  const tableRows = data.map((row) =>
    columns.map((col) => {
      const val = row[col.key || col.dataKey || col.accessor];
      if (val === null || val === undefined) return '—';
      if (typeof val === 'object') return JSON.stringify(val);
      return String(val);
    })
  );

  autoTable(doc, {
    startY: currentY,
    head: [tableHeaders],
    body: tableRows,
    theme: 'grid',
    margin: { left: margin, right: margin, bottom: 40 },
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 4.5,
      overflow: 'linebreak',
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.5
    },
    headStyles: {
      fillColor: primaryTeal,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didDrawPage: (dataObj) => {
      const footerY = pageHeight - 16;
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('MediUnify Healthcare Unified Operating System • Confidential & Verified Report', margin, footerY);
      doc.text(
        `Page ${dataObj.pageNumber} of ${doc.internal.getNumberOfPages()}`,
        pageWidth - margin,
        footerY,
        { align: 'right' }
      );
    }
  });

  const validFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  doc.save(validFilename);
}
