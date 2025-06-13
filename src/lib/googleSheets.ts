
export interface GoogleSheetsConfig {
  webhookUrl: string;
}

export const sendToGoogleSheets = async (data: any, action: string) => {
  const webhookUrl = 'https://script.google.com/macros/s/AKfycby4OLMCZPz0Ip9vxNXOC6F8A8rhrNlENrFcoBFkmtIMjdthe5oaP6MWYax0GyDkjwwP/exec';
  const sheetId = '1inGBl7rwmDG75en-F78zH-s5zIuWeF6wfhBj4OlrEqM';

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify(data),
    });

    console.log('Data sent to Google Sheets successfully');
    
    // Abrir la hoja de cálculo en una nueva pestaña
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
    window.open(sheetUrl, '_blank');
    
  } catch (error) {
    console.error('Error sending data to Google Sheets:', error);
    throw error;
  }
};

export const getGoogleSheetsConfig = (): GoogleSheetsConfig | null => {
  const config = localStorage.getItem('googleSheetsConfig');
  return config ? JSON.parse(config) : null;
};

export const saveGoogleSheetsConfig = (config: GoogleSheetsConfig) => {
  localStorage.setItem('googleSheetsConfig', JSON.stringify(config));
};
