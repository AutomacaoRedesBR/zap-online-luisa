
import { toast } from "sonner";
import { Instance } from "./types/instance.types";
import { isValidUUID, getUserIdFromLocalStorage } from "./utils/instanceUtils";

// Função para buscar as instâncias do usuário garantindo que sempre usa o ID do localStorage
export async function fetchUserInstances(userId: string): Promise<Instance[]> {
  try {
    console.log('Buscando instâncias para usuário com ID:', userId);
    
    // SEMPRE verificar localStorage primeiro, independente do userId passado como parâmetro
    let userIdToUse = userId;
    const localStorageUserId = getUserIdFromLocalStorage();
    
    if (localStorageUserId) {
      console.log('Usando ID do usuário do localStorage:', localStorageUserId);
      userIdToUse = localStorageUserId;
    }
    
    // Verificar se o ID é válido após tentar localStorage
    if (!userIdToUse || userIdToUse.trim() === '') {
      throw new Error('ID do usuário não disponível nem no localStorage');
    }
    
    // Verificar se o ID é um UUID válido (para debug)
    if (!isValidUUID(userIdToUse)) {
      console.warn('O ID fornecido para busca de instâncias não parece ser um UUID válido:', userIdToUse);
    }
    
    // Dados para enviar à API
    const requestData = {
      user_id: userIdToUse  // Sempre usar o ID do localStorage
    };
    
    console.log('Enviando requisição para API de instâncias com dados:', JSON.stringify(requestData));
    
    // Usar fetch para fazer a requisição
    const response = await fetch('https://api.teste.onlinecenter.com.br/webhook/get-all-instances', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na API de instâncias:', response.status, errorText);
      throw new Error(`Erro ao buscar instâncias: ${errorText}`);
    }

    const data = await response.json();
    console.log('Dados de instâncias recebidos da API:', data);
    
    if (data && data.instances && Array.isArray(data.instances)) {
      // Processar os dados conforme o formato retornado pela API
      return data.instances;
    } else {
      console.warn('API retornou dados em formato inesperado:', data);
      return [];
    }
  } catch (error: any) {
    console.error('Erro ao buscar instâncias:', error);
    toast.error(`Falha ao carregar instâncias: ${error.message}`);
    return [];
  }
}
