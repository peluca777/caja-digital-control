
import * as ExcelJS from 'exceljs';
import { Transaction } from './types';

export const exportToExcel = async (transactions: Transaction[]) => {
  // Crear un nuevo libro de trabajo
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Caja Diaria');

  // Configurar propiedades del libro
  workbook.creator = 'Control de Caja';
  workbook.created = new Date();

  // Preparar datos ordenados por fecha/hora
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateTimeA = `${a.date} ${a.time}`;
    const dateTimeB = `${b.date} ${b.time}`;
    return dateTimeA.localeCompare(dateTimeB);
  });

  // 1. ENCABEZADOS
  const headers = ['Fecha', 'Concepto', 'Método de Pago', 'Monto'];
  const headerRow = worksheet.addRow(headers);

  // Aplicar formato a los encabezados
  headerRow.eachCell((cell, colNumber) => {
    cell.font = { 
      bold: true, 
      color: { argb: 'FF000000' }, 
      size: 12 
    };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' } // Gris claro
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  // 2. DATOS DE TRANSACCIONES
  sortedTransactions.forEach(transaction => {
    const row = worksheet.addRow([
      `${transaction.date} ${transaction.time}`,
      transaction.concept,
      transaction.paymentMethod || 'Efectivo',
      transaction.type === 'income' ? transaction.amount : -transaction.amount
    ]);

    // Aplicar formato a cada celda de datos
    row.eachCell((cell, colNumber) => {
      cell.font = { 
        color: { argb: 'FF000000' }, 
        size: 11 
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      };

      // Alinear monto a la derecha y aplicar formato numérico
      if (colNumber === 4) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.numFmt = '#,##0'; // Formato sin decimales
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
    });
  });

  // 3. FILA VACÍA
  worksheet.addRow([]);

  // 4. BLOQUE DE TOTALES
  const totalRow = worksheet.addRow(['Totales por método', '', '', '']);
  
  // Formato para el título de totales
  totalRow.eachCell((cell, colNumber) => {
    cell.font = { 
      bold: true, 
      color: { argb: 'FF000000' }, 
      size: 11 
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } }
    };
    cell.alignment = { horizontal: 'left', vertical: 'middle' };
  });

  // Calcular totales por método de pago
  const paymentMethods = ['Efectivo', 'Transferencia', 'Tarjeta', 'Otros'];
  const dataStartRow = 2; // Primera fila de datos (después del encabezado)
  const dataEndRow = sortedTransactions.length + 1; // Última fila de datos

  paymentMethods.forEach(method => {
    const total = transactions
      .filter(t => (t.paymentMethod || 'Efectivo') === method)
      .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);

    // Solo mostrar métodos que tengan movimientos
    if (total !== 0) {
      const methodRow = worksheet.addRow([`${method}:`, '', '', total]);
      
      // Aplicar formato a la fila de método
      methodRow.eachCell((cell, colNumber) => {
        cell.font = { 
          bold: true, 
          color: { argb: 'FF000000' }, 
          size: 11 
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };

        if (colNumber === 4) {
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          cell.numFmt = '#,##0'; // Formato sin decimales
        } else {
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
        }
      });
    }
  });

  // 5. CONFIGURAR ANCHO DE COLUMNAS
  worksheet.columns = [
    { width: 18 }, // Fecha
    { width: 35 }, // Concepto
    { width: 18 }, // Método de Pago
    { width: 12 }  // Monto
  ];

  // 6. GENERAR Y DESCARGAR EL ARCHIVO
  const today = new Date().toISOString().split('T')[0];
  const fileName = `CajaDiaria_${today}.xlsx`;

  // Generar el buffer del archivo
  const buffer = await workbook.xlsx.writeBuffer();
  
  // Crear blob y descargar
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  return fileName;
};
