
export interface GoogleSheetsConfig {
  webhookUrl: string;
}

export const sendToGoogleSheets = async (data: any, action: string) => {
  const webhookUrl = 'https://script.google.com/macros/s/AKfycby4OLMCZPz0Ip9vxNXOC6F8A8rhrNlENrFcoBFkmtIMjdthe5oaP6MWYax0GyDkjwwP/exec';

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
