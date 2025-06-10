
export interface GoogleSheetsConfig {
  webhookUrl: string;
}

export const sendToGoogleSheets = async (data: any, action: string) => {
  const config = getGoogleSheetsConfig();
  if (!config?.webhookUrl) {
    console.log('Google Sheets webhook not configured');
    return;
  }

  try {
    const payload = {
      action,
      timestamp: new Date().toISOString(),
      data
    };

    await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify(payload),
    });

    console.log('Data sent to Google Sheets successfully');
  } catch (error) {
    console.error('Error sending data to Google Sheets:', error);
  }
};

export const getGoogleSheetsConfig = (): GoogleSheetsConfig | null => {
  const config = localStorage.getItem('googleSheetsConfig');
  return config ? JSON.parse(config) : null;
};

export const saveGoogleSheetsConfig = (config: GoogleSheetsConfig) => {
  localStorage.setItem('googleSheetsConfig', JSON.stringify(config));
};
