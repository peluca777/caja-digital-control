
import * as XLSX from 'xlsx';
import { Transaction } from './types';

export const exportToExcel = (transactions: Transaction[]) => {
  // Crear un nuevo libro de trabajo
  const workbook = XLSX.utils.book_new();
  
  // Formatear moneda sin decimales
  const formatCurrency = (amount: number) => {
    return Math.round(amount); // Sin decimales como en la imagen
  };

  // Preparar los datos base
  const today = new Date().toLocaleDateString('es-AR');
  const fileName = `CajaDiaria_${new Date().toISOString().split('T')[0]}.xlsx`;

  // Crear encabezados principales
  const headers = ['Fecha', 'Concepto', 'Método de Pago', 'Monto'];
  
  // Preparar datos de transacciones ordenados por fecha/hora
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateTimeA = `${a.date} ${a.time}`;
    const dateTimeB = `${b.date} ${b.time}`;
    return dateTimeA.localeCompare(dateTimeB);
  });

  const transactionData = sortedTransactions.map(transaction => [
    `${transaction.date} ${transaction.time}`,
    transaction.concept,
    transaction.paymentMethod || 'Efectivo',
    formatCurrency(transaction.amount)
  ]);

  // Calcular totales por método de pago
  const paymentMethods = ['Efectivo', 'Transferencia', 'Tarjeta', 'Otros'];
  const paymentTotals = paymentMethods.reduce((acc, method) => {
    const total = transactions
      .filter(t => (t.paymentMethod || 'Efectivo') === method)
      .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
    if (total !== 0) {
      acc[method] = total;
    }
    return acc;
  }, {} as Record<string, number>);

  // Crear la estructura de datos para Excel
  const excelData = [
    // Encabezados
    headers,
    // Datos de transacciones
    ...transactionData,
    // Espacio en blanco
    [],
    // Título de totales
    ['Totales por método', '', '', ''],
    // Totales por método
    ...Object.entries(paymentTotals).map(([method, total]) => [
      `${method}:`,
      '',
      '',
      formatCurrency(total)
    ])
  ];

  // Crear la hoja de cálculo
  const worksheet = XLSX.utils.aoa_to_sheet(excelData);

  // Configurar el ancho de las columnas
  const columnWidths = [
    { wch: 18 }, // Fecha
    { wch: 35 }, // Concepto
    { wch: 18 }, // Método de Pago
    { wch: 12 }  // Monto
  ];
  worksheet['!cols'] = columnWidths;

  // Aplicar estilos a las celdas
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  
  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      
      if (!worksheet[cellAddress]) {
        worksheet[cellAddress] = { t: 's', v: '' };
      }

      // Aplicar estilos según la posición
      if (row === 0) {
        // Encabezados: fondo gris claro y negrita
        worksheet[cellAddress].s = {
          fill: { fgColor: { rgb: 'D3D3D3' } },
          font: { bold: true, color: { rgb: '000000' } },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
          },
          alignment: { horizontal: 'center' }
        };
      } else if (row >= transactionData.length + 2) {
        // Filas de totales: negrita
        worksheet[cellAddress].s = {
          font: { bold: true, color: { rgb: '000000' } },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
          },
          alignment: col === 3 ? { horizontal: 'right' } : { horizontal: 'left' }
        };
      } else {
        // Filas normales de datos
        worksheet[cellAddress].s = {
          font: { color: { rgb: '000000' } },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
          },
          alignment: col === 3 ? { horizontal: 'right' } : { horizontal: 'left' }
        };
      }

      // Formato numérico para la columna de montos (columna 3)
      if (col === 3 && row > 0 && worksheet[cellAddress].v !== '') {
        worksheet[cellAddress].t = 'n';
        worksheet[cellAddress].z = '#,##0'; // Formato sin decimales
      }
    }
  }

  // Agregar la hoja al libro con el nombre "Caja Diaria"
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Caja Diaria');

  // Generar y descargar el archivo
  XLSX.writeFile(workbook, fileName);

  return fileName;
};
