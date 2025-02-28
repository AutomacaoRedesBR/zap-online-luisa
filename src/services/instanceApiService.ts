
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { isValidUUID, getUserDataFromStorage } from "@/utils/validationUtils";
import { CreateInstanceData, InstanceResponse, Instance } from "@/types/instanceTypes";
import { getPlanUUID } from "./planService";

// Endpoint da API
const API_ENDPOINT = 'https://api.teste.onlinecenter.com.br/webhook';

/**
 * Cria uma nova instância para o usuário
 */
export async function createInstanceForUser(data: CreateInstanceData): Promise<InstanceResponse> {
  try {
    console.log('Iniciando criação de instância para usuário com ID:', data.userId);
    
    // Validar e obter o UUID do usuário
    let userUUID = data.userId;
    
    if (!isValidUUID(userUUID)) {
      console.error('ID do usuário inválido ou não está no formato UUID:', userUUID);
      
      // Tentar recuperar UUID do localStorage como fallback
      const userData = getUserDataFromStorage();
      if (userData && userData.id && isValidUUID(userData.id)) {
        console.log('Usando UUID do usuário do localStorage:', userData.id);
        userUUID = userData.id;
      } else {
        const fallbackId = userData?.id || '';
        console.error('UUID inválido no localStorage:', fallbackId);
        throw new Error('UUID do usuário inválido');
      }
    }
    
    // Log para confirmação
    console.log('UUID do usuário validado:', userUUID);
    
    // Obter UUID real do plano
    const realPlanUUID = getPlanUUID(data.planId);
    
    console.log("Plano selecionado:", data.planId);
    console.log("UUID real do plano:", realPlanUUID);
    
    if (!realPlanUUID) {
      throw new Error("UUID do plano não encontrado");
    }
    
    // Gerar um ID de instância UUID único
    const instanceId = uuidv4();
    
    // Recuperar dados do usuário do localStorage
    const userData = getUserDataFromStorage();
    if (!userData) {
      throw new Error('Dados do usuário não encontrados');
    }
    
    // Verificar se temos dados suficientes para criar a instância
    if (!userData.email) {
      throw new Error('Dados incompletos do usuário');
    }
    
    // Enviar requisição para API externa com o UUID correto do usuário
    try {
      // Dados a serem enviados para a API externa
      const requestData = {
        user_id: userUUID, // UUID válido
        name: data.name,
        plan_id: realPlanUUID,
        email: userData.email,
        userName: userData.name
      };
      
      console.log("Enviando dados para API externa:", JSON.stringify(requestData));
      
      const response = await fetch(`${API_ENDPOINT}/criar-instancia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na API externa:', response.status, errorText);
        throw new Error(`Erro ao criar instância na API externa: ${errorText}`);
      }

      const apiResponse = await response.json();
      console.log('Resposta da API externa:', apiResponse);
      
      // Limpar o UUID do plano após o uso
      localStorage.removeItem("currentPlanUUID");

      // Verificar se a API retornou o QR code como base64
      if (apiResponse && apiResponse.qrCode) {
        return {
          qrCode: apiResponse.qrCode,
          instanceId: apiResponse.instance_id || instanceId
        };
      }
      
      // Fallback: se a API não retornou um QR code, criar um local
      const qrCodeData = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${instanceId}`;
      return {
        qrCode: qrCodeData,
        instanceId: instanceId
      };
    } catch (apiError) {
      console.error('API externa não disponível:', apiError);
      throw new Error('Não foi possível se conectar ao servidor. Tente novamente mais tarde.');
    }
  } catch (error: any) {
    console.error('Erro ao criar instância:', error);
    throw error;
  }
}

/**
 * Busca todas as instâncias de um usuário
 */
export async function fetchUserInstances(userId: string): Promise<Instance[]> {
  try {
    console.log('Buscando instâncias para usuário com ID:', userId);
    
    // Verificar se o ID é válido
    if (!userId) {
      console.error('ID do usuário não fornecido');
      throw new Error('ID do usuário não fornecido');
    }
    
    // Verificar se o ID é um UUID válido (para debug)
    if (!isValidUUID(userId)) {
      console.warn('O ID fornecido para busca de instâncias não parece ser um UUID válido:', userId);
    }
    
    // Usar user_id em vez de userId para seguir o formato esperado pela API
    const bodyData = {
      user_id: userId
    };
    
    console.log('Enviando requisição para API com:', bodyData);
    
    // Tenta usar XMLHttpRequest para evitar problemas com CORS
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_ENDPOINT}/get-all-instances`, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.withCredentials = false; // Importante para CORS
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            console.log('Dados de instâncias recebidos da API:', data);
            
            if (data && data.instances && Array.isArray(data.instances)) {
              // Processar os dados conforme o formato retornado pela API
              resolve(data.instances.map((item: any) => item.json));
            } else {
              resolve([]);
            }
          } catch (error) {
            console.error('Erro ao processar resposta da API:', error);
            reject(new Error('Erro ao processar resposta da API'));
          }
        } else {
          console.error('Erro na requisição:', xhr.status, xhr.responseText);
          reject(new Error(`Erro ao buscar instâncias: ${xhr.statusText}`));
        }
      };
      
      xhr.onerror = function() {
        console.error('Erro de rede na requisição para API');
        reject(new Error('Erro de conexão com o servidor'));
      };
      
      xhr.send(JSON.stringify(bodyData));
    });
  } catch (error) {
    console.error('Erro ao buscar instâncias:', error);
    throw error;
  }
}
