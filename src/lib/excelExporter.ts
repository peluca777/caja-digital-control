
import * as ExcelJS from 'exceljs';
import { Transaction } from './types';

export const exportToExcel = async (transactions: Transaction[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Caja Diaria');

  // Configurar propiedades del libro
  workbook.creator = 'Control de Caja';
  workbook.created = new Date();

  // Configurar ancho de columnas (basado en el archivo de referencia)
  worksheet.columns = [
    { width: 8 },   // A - FECHA
    { width: 12 },  // B - DETALLE
    { width: 18 },  // C - CLIENTE (Expedido)
    { width: 12 },  // D - EFECTIVO
    { width: 15 },  // E - DOMICILIADO
    { width: 12 },  // F - TARJETA
    { width: 12 },  // G - CHEQUE
    { width: 12 }   // H - TOTAL
  ];

  // 1. HEADER PRINCIPAL - Fila 1
  const headerRow = worksheet.getRow(1);
  headerRow.height = 25;
  
  // Combinar celdas para el título
  worksheet.mergeCells('A1:E1');
  worksheet.getCell('A1').value = 'Hoja de CAJA DIARIA';
  worksheet.getCell('A1').font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getCell('A1').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF008080' } // Color teal como en la imagen
  };
  worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getCell('A1').border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  // Fecha en F1
  worksheet.getCell('F1').value = 'Fecha:';
  worksheet.getCell('F1').font = { name: 'Arial', size: 10, bold: true };
  worksheet.getCell('F1').border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  // Fecha actual en G1:H1
  worksheet.mergeCells('G1:H1');
  const today = new Date().toLocaleDateString('es-AR');
  worksheet.getCell('G1').value = today;
  worksheet.getCell('G1').font = { name: 'Arial', size: 10 };
  worksheet.getCell('G1').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getCell('G1').border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  // 2. ENCABEZADOS DE COLUMNAS - Fila 2
  const columnHeaders = ['FECHA', 'DETALLE', 'CLIENTE (Expedido)', 'EFECTIVO', 'DOMICILIADO', 'TARJETA', 'CHEQUE', 'TOTAL'];
  const headerRow2 = worksheet.getRow(2);
  headerRow2.height = 20;

  columnHeaders.forEach((header, index) => {
    const cell = headerRow2.getCell(index + 1);
    cell.value = header;
    cell.font = { name: 'Arial', size: 9, bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' } // Gris claro
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // 3. DATOS DE TRANSACCIONES
  let currentRow = 3;
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateTimeA = `${a.date} ${a.time}`;
    const dateTimeB = `${b.date} ${b.time}`;
    return dateTimeA.localeCompare(dateTimeB);
  });

  // Totales por método de pago
  const totals = {
    efectivo: 0,
    domiciliado: 0, // Transferencias
    tarjeta: 0,
    cheque: 0
  };

  sortedTransactions.forEach(transaction => {
    const row = worksheet.getRow(currentRow);
    
    // Fecha (A)
    row.getCell(1).value = `${transaction.date} ${transaction.time}`;
    row.getCell(1).font = { name: 'Arial', size: 9 };
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    
    // Detalle/Concepto (B)
    row.getCell(2).value = transaction.concept;
    row.getCell(2).font = { name: 'Arial', size: 9 };
    row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
    
    // Cliente (C) - Usamos el nombre del usuario
    row.getCell(3).value = transaction.userName;
    row.getCell(3).font = { name: 'Arial', size: 9 };
    row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };

    // Determinar el monto según el tipo (income positivo, expense negativo)
    const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
    
    // Distribuir en las columnas según método de pago
    const method = transaction.paymentMethod || 'Efectivo';
    
    // Efectivo (D)
    if (method === 'Efectivo') {
      row.getCell(4).value = amount;
      totals.efectivo += amount;
    } else {
      row.getCell(4).value = '';
    }
    
    // Domiciliado/Transferencia (E)
    if (method === 'Transferencia') {
      row.getCell(5).value = amount;
      totals.domiciliado += amount;
    } else {
      row.getCell(5).value = '';
    }
    
    // Tarjeta (F)
    if (method === 'Tarjeta') {
      row.getCell(6).value = amount;
      totals.tarjeta += amount;
    } else {
      row.getCell(6).value = '';
    }
    
    // Cheque (G) - Por ahora vacío
    row.getCell(7).value = '';
    
    // Total (H) - Suma de todos los métodos para esta transacción
    row.getCell(8).value = amount;

    // Aplicar formato a todas las celdas
    for (let col = 1; col <= 8; col++) {
      const cell = row.getCell(col);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      
      // Formato numérico para columnas de montos
      if (col >= 4 && col <= 8 && cell.value !== '') {
        cell.numFmt = '#,##0';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      }
    }

    currentRow++;
  });

  // 4. FILA SEPARADORA
  currentRow += 2;

  // 5. SECCIÓN "CAJA CHICA" (como en el archivo original)
  const cajaChicaRow = worksheet.getRow(currentRow);
  worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
  cajaChicaRow.getCell(1).value = 'CAJA CHICA';
  cajaChicaRow.getCell(1).font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  cajaChicaRow.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF808000' } // Color oliva como en la imagen
  };
  cajaChicaRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  cajaChicaRow.getCell(1).border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  currentRow++;

  // 6. SECCIÓN DE TOTALES
  const totalRow = worksheet.getRow(currentRow);
  totalRow.getCell(1).value = 'TOTAL';
  totalRow.getCell(1).font = { name: 'Arial', size: 10, bold: true };
  totalRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  
  // Totales por columna
  totalRow.getCell(4).value = totals.efectivo; // Efectivo
  totalRow.getCell(5).value = totals.domiciliado; // Transferencias
  totalRow.getCell(6).value = totals.tarjeta; // Tarjetas
  totalRow.getCell(7).value = totals.cheque; // Cheques (0)
  
  // Total general
  const totalGeneral = totals.efectivo + totals.domiciliado + totals.tarjeta + totals.cheque;
  totalRow.getCell(8).value = totalGeneral;

  // Aplicar formato a la fila de totales
  for (let col = 1; col <= 8; col++) {
    const cell = totalRow.getCell(col);
    cell.font = { name: 'Arial', size: 10, bold: true };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    
    if (col >= 4 && col <= 8) {
      cell.numFmt = '#,##0';
      cell.alignment = { horizontal: 'right', vertical: 'middle' };
    }
  }

  currentRow++;

  // 7. CUADRO EFECTIVO con fondo verde
  const cuadroEfectivoRow = worksheet.getRow(currentRow);
  worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
  cuadroEfectivoRow.getCell(1).value = 'CUADRO EFECTIVO';
  cuadroEfectivoRow.getCell(1).font = { name: 'Arial', size: 10, bold: true };
  cuadroEfectivoRow.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF90EE90' } // Verde claro como en la imagen
  };
  cuadroEfectivoRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  cuadroEfectivoRow.getCell(1).border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  // Sección "INGRESOS BANCO" con fondo amarillo
  worksheet.mergeCells(`D${currentRow}:F${currentRow}`);
  cuadroEfectivoRow.getCell(4).value = 'INGRESOS BANCO';
  cuadroEfectivoRow.getCell(4).font = { name: 'Arial', size: 10, bold: true };
  cuadroEfectivoRow.getCell(4).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFF00' } // Amarillo como en la imagen
  };
  cuadroEfectivoRow.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
  cuadroEfectivoRow.getCell(4).border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  // Fecha en G
  cuadroEfectivoRow.getCell(7).value = `martes, ${today}`;
  cuadroEfectivoRow.getCell(7).font = { name: 'Arial', size: 9 };
  cuadroEfectivoRow.getCell(7).alignment = { horizontal: 'center', vertical: 'middle' };
  cuadroEfectivoRow.getCell(7).border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  currentRow++;

  // Detalles del cuadro efectivo
  const detallesEfectivo = [
    { label: 'SALDO INICIAL:', valor: '' },
    { label: 'COBROS EFECTIVO:', valor: totals.efectivo > 0 ? totals.efectivo : '' },
    { label: 'TOTAL CAJA:', valor: '' },
    { label: 'CUADRO REND CAJA:', valor: '' },
    { label: 'NUEVO SALDO CAJA:', valor: '' }
  ];

  const detallesBanco = [
    { label: 'DOMICILIADO:', valor: totals.domiciliado > 0 ? totals.domiciliado : '' },
    { label: 'EFECTIVO:', valor: totals.efectivo > 0 ? totals.efectivo : '' },
    { label: 'CHEQUES:', valor: totals.cheque > 0 ? totals.cheque : '' },
    { label: 'TARJETA:', valor: totals.tarjeta > 0 ? totals.tarjeta : '' },
    { label: 'TOTAL:', valor: totalGeneral },
    { label: 'FECHA:', valor: '' },
    { label: 'REND/ACIONES:', valor: '' }
  ];

  // Agregar filas de detalles
  detallesEfectivo.forEach((detalle, index) => {
    const row = worksheet.getRow(currentRow + index);
    
    // Columnas A-C para efectivo
    worksheet.mergeCells(`A${currentRow + index}:B${currentRow + index}`);
    row.getCell(1).value = detalle.label;
    row.getCell(1).font = { name: 'Arial', size: 9, bold: true };
    row.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
    row.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    row.getCell(3).value = detalle.valor;
    row.getCell(3).font = { name: 'Arial', size: 9 };
    row.getCell(3).numFmt = detalle.valor ? '#,##0' : '';
    row.getCell(3).alignment = { horizontal: 'right', vertical: 'middle' };
    row.getCell(3).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // Columnas D-F para banco (si hay detalle correspondiente)
    if (detallesBanco[index]) {
      row.getCell(4).value = detallesBanco[index].label;
      row.getCell(4).font = { name: 'Arial', size: 9, bold: true };
      row.getCell(4).alignment = { horizontal: 'left', vertical: 'middle' };
      row.getCell(4).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };

      worksheet.mergeCells(`E${currentRow + index}:F${currentRow + index}`);
      row.getCell(5).value = detallesBanco[index].valor;
      row.getCell(5).font = { name: 'Arial', size: 9 };
      row.getCell(5).numFmt = detallesBanco[index].valor ? '#,##0' : '';
      row.getCell(5).alignment = { horizontal: 'right', vertical: 'middle' };
      row.getCell(5).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
  });

  // Generar y descargar el archivo
  const fileName = `CajaDiaria_${today.replace(/\//g, '-')}.xlsx`;
  const buffer = await workbook.xlsx.writeBuffer();
  
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
