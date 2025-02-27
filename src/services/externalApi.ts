
import { updateInstanceApiKey } from './authService';

export interface ExternalApiData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  instance_id: string;
}

export async function sendToExternalAPI(data: ExternalApiData) {
  try {
    console.log('Enviando dados para API externa:', data);
    
    const response = await fetch('https://n8n-editor.teste.onlinecenter.com.br/webhook-test/criar-instancia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resposta da API não ok:', response.status, errorText);
      throw new Error(`Falha ao enviar dados para API externa: ${response.status} ${errorText}`);
    }

    const responseData = await response.json();
    console.log('Resposta da API externa:', responseData);
    
    // Atualizar a instância com a chave da API, se disponível
    if (responseData.apiKey) {
      await updateInstanceApiKey(data.instance_id, responseData.apiKey);
    }
    
    return responseData;
  } catch (error) {
    console.error('Erro ao enviar para API externa:', error);
    throw error;
  }
}
