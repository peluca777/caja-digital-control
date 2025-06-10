
import { Transaction } from './types';

export const exportToExcel = (transactions: Transaction[]) => {
  // Crear contenido CSV
  const headers = ['Fecha', 'Hora', 'Tipo', 'Monto', 'Concepto', 'Observaciones', 'Usuario'];
  const csvContent = [
    headers.join(','),
    ...transactions.map(t => [
      t.date,
      t.time,
      t.type === 'income' ? 'Ingreso' : 'Egreso',
      t.amount.toString(),
      `"${t.concept}"`,
      `"${t.observations || ''}"`,
      `"${t.userName}"`
    ].join(','))
  ].join('\n');

  // Crear y descargar archivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `movimientos_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (transactions: Transaction[]) => {
  // Crear contenido HTML para PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Movimientos del Día</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2563eb; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #3b82f6; color: white; }
            .income { color: #059669; }
            .expense { color: #dc2626; }
        </style>
    </head>
    <body>
        <h1>Control de Caja - Movimientos del Día</h1>
        <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-AR')}</p>
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Tipo</th>
                    <th>Monto</th>
                    <th>Concepto</th>
                    <th>Observaciones</th>
                    <th>Usuario</th>
                </tr>
            </thead>
            <tbody>
                ${transactions.map(t => `
                    <tr>
                        <td>${t.date}</td>
                        <td>${t.time}</td>
                        <td class="${t.type}">${t.type === 'income' ? 'Ingreso' : 'Egreso'}</td>
                        <td>$${t.amount.toLocaleString('es-AR')}</td>
                        <td>${t.concept}</td>
                        <td>${t.observations || '-'}</td>
                        <td>${t.userName}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </body>
    </html>
  `;

  // Crear y descargar archivo HTML (que se puede imprimir como PDF)
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `movimientos_${new Date().toISOString().split('T')[0]}.html`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
