
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

  // Calcular totales por método de pago
  const calculateTotals = () => {
    const totals = {
      efectivo: 0,
      transferencia: 0,
      tarjeta: 0,
      otros: 0,
      totalEfectivo: 0, // Solo ingresos - egresos en efectivo
      totalDelDia: 0    // Todos los ingresos
    };

    sortedTransactions.forEach(transaction => {
      const method = transaction.paymentMethod || 'Efectivo';
      const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;

      switch (method) {
        case 'Efectivo':
          totals.efectivo += amount;
          totals.totalEfectivo += amount;
          if (transaction.type === 'income') totals.totalDelDia += transaction.amount;
          break;
        case 'Transferencia':
          totals.transferencia += amount;
          if (transaction.type === 'income') totals.totalDelDia += transaction.amount;
          break;
        case 'Tarjeta':
          totals.tarjeta += amount;
          if (transaction.type === 'income') totals.totalDelDia += transaction.amount;
          break;
        default:
          totals.otros += amount;
          if (transaction.type === 'income') totals.totalDelDia += transaction.amount;
          break;
      }
    });

    return totals;
  };

  const totals = calculateTotals();

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

      // Colorear según método de pago
      if (colNumber === 3) { // Método de pago
        const method = transaction.paymentMethod || 'Efectivo';
        if (method === 'Efectivo') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE8F5E8' } // Verde claro
          };
        } else if (method === 'Transferencia') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE8F0FF' } // Azul claro
          };
        } else if (method === 'Tarjeta') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF0E8FF' } // Morado claro
          };
        }
      }

      // Alinear monto a la derecha y aplicar formato numérico
      if (colNumber === 4) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.numFmt = '#,##0'; // Formato sin decimales
        
        // Colorear montos negativos en rojo
        if (transaction.type === 'expense') {
          cell.font = { 
            color: { argb: 'FFCC0000' }, 
            size: 11 
          };
        }
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
    });
  });

  // 3. FILA VACÍA
  worksheet.addRow([]);

  // 4. BLOQUE DE TOTALES POR MÉTODO
  const totalMethodRow = worksheet.addRow(['TOTALES POR MÉTODO DE PAGO', '', '', '']);
  
  // Formato para el título de totales
  totalMethodRow.eachCell((cell, colNumber) => {
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

  // Totales individuales por método
  const paymentMethods = [
    { name: 'Efectivo', total: totals.efectivo, color: 'FFE8F5E8' },
    { name: 'Transferencias', total: totals.transferencia, color: 'FFE8F0FF' },
    { name: 'Tarjetas', total: totals.tarjeta, color: 'FFF0E8FF' }
  ];

  paymentMethods.forEach(method => {
    if (method.total !== 0) {
      const methodRow = worksheet.addRow([`${method.name}:`, '', '', method.total]);
      
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

        if (colNumber === 1) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: method.color }
          };
        }

        if (colNumber === 4) {
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          cell.numFmt = '#,##0'; // Formato sin decimales
        } else {
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
        }
      });
    }
  });

  // 5. TOTALES ESPECIALES
  worksheet.addRow([]);
  
  const specialTotalsRow = worksheet.addRow(['RESUMEN FINANCIERO', '', '', '']);
  specialTotalsRow.eachCell((cell, colNumber) => {
    cell.font = { 
      bold: true, 
      color: { argb: 'FF000000' }, 
      size: 12 
    };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFCC99' } // Naranja claro
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  // Total efectivo en caja
  const cashRow = worksheet.addRow(['Total Efectivo en Caja:', '', '', totals.totalEfectivo]);
  cashRow.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE8F5E8' } // Verde claro
  };

  // Total del día
  const dayRow = worksheet.addRow(['Total Ventas del Día:', '', '', totals.totalDelDia]);
  dayRow.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE8F0FF' } // Azul claro
  };

  // Aplicar formato a las filas de resumen
  [cashRow, dayRow].forEach(row => {
    row.eachCell((cell, colNumber) => {
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
  });

  // 6. CONFIGURAR ANCHO DE COLUMNAS
  worksheet.columns = [
    { width: 18 }, // Fecha
    { width: 35 }, // Concepto
    { width: 18 }, // Método de Pago
    { width: 15 }  // Monto
  ];

  // 7. GENERAR Y DESCARGAR EL ARCHIVO
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
