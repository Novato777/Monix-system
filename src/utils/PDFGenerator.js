import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDF = (data) => {
  const { income, expenses, balance, savings, transactions, logo, startDate } = data;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Logo (Si existe)
  if (logo) {
    try {
      doc.addImage(logo, 'PNG', (pageWidth / 2) - 20, 10, 40, 40);
    } catch (e) {
      console.error("Error al añadir logo al PDF", e);
    }
  }

  // 2. Título Principal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(79, 70, 229); 
  doc.text('MONIX', pageWidth / 2, 60, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(100);
  doc.setFont("helvetica", "normal");
  doc.text('Reporte de Control Financiero Quincenal', pageWidth / 2, 68, { align: 'center' });

  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(0.5);
  doc.line(20, 75, pageWidth - 20, 75);

  // 3. Información del Periodo
  doc.setFontSize(10);
  doc.text(`Fecha de Inicio: ${startDate || 'N/A'}`, 20, 82);
  doc.text(`Fecha de Reporte: ${new Date().toLocaleDateString('es-CO')}`, pageWidth - 20, 82, { align: 'right' });

  // 4. Resumen Estadístico
  autoTable(doc, {
    startY: 90,
    head: [['RESUMEN GENERAL', 'VALOR']],
    body: [
      ['INGRESOS TOTALES', `$${(income || 0).toLocaleString('es-CO')}`],
      ['GASTOS REGISTRADOS', `$${(expenses || 0).toLocaleString('es-CO')}`],
      ['SALDO DISPONIBLE', `$${(balance || 0).toLocaleString('es-CO')}`],
      ['AHORRO RECOMENDADO (20%)', `$${(savings || 0).toLocaleString('es-CO')}`],
    ],
    theme: 'striped',
    headStyles: { 
      fillColor: [79, 70, 229], 
      textColor: [255, 255, 255],
      fontSize: 12,
      halign: 'center'
    },
    styles: { 
      fontSize: 11,
      cellPadding: 5
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'right', fontStyle: 'bold', textColor: [79, 70, 229] }
    }
  });

  // 5. Detalle de Movimientos
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); 
  doc.setFont("helvetica", "bold");
  doc.text('Detalle de Movimientos', 20, doc.lastAutoTable.finalY + 15);

  const tableData = (transactions || []).length > 0 
    ? transactions.map(t => [
        t.date,
        t.name,
        t.category,
        t.type === 'fixed' ? 'Fijo' : 'Variable',
        `$${t.amount.toLocaleString('es-CO')}`
      ])
    : [['-', 'Sin movimientos registrados', '-', '-', '$0']];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [['Fecha', 'Descripción', 'Categoría', 'Tipo', 'Monto']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    styles: { fontSize: 10 },
    columnStyles: {
      4: { halign: 'right', fontStyle: 'bold' }
    }
  });

  // 6. Footer
  const finalY = doc.lastAutoTable.finalY + 30;
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); 
  doc.setFont("helvetica", "italic");
  doc.text('Este reporte fue generado automáticamente por Monix.', pageWidth / 2, finalY, { align: 'center' });
  doc.text('© 2026 Monix - Gestión Financiera Inteligente', pageWidth / 2, finalY + 7, { align: 'center' });

  doc.save(`Reporte_Monix_${new Date().toISOString().slice(0,10)}.pdf`);
};
