
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export interface Plan {
  id: string;
  name: string;
  description: string | null;
  max_messages_number: number;
}

export interface CreateInstanceData {
  userId: string;
  name: string;
  planId: string;
}

export interface InstanceResponse {
  qrCode: string;
  instanceId: string;
}

export interface Instance {
  id: string;
  user_id: string;
  plan_id: string;
  name: string;
  sequence_id: number;
  user_sequence_id: number;
  phone: string | null;
  evo_api_key: string;
  sent_messages_number: number;
  expiration_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Dados fictícios de planos (poderia vir da sua API externa)
const PLANS: Plan[] = [
  {
    id: "free-plan",
    name: "Free",
    description: "Plano gratuito com recursos básicos",
    max_messages_number: 100
  },
  {
    id: "basic-plan",
    name: "Básico",
    description: "Plano com recursos intermediários",
    max_messages_number: 1000
  },
  {
    id: "premium-plan",
    name: "Premium",
    description: "Plano com todos os recursos",
    max_messages_number: 10000
  }
];

// Mapeamento dos IDs de plano para UUIDs reais
const PLAN_UUIDS: Record<string, string> = {
  "free-plan": "95c10fdd-b92d-493a-a25d-3fee817c950a",
  "basic-plan": "741d4a3d-19b5-4a24-93ae-9b4890a40f7a",
  "premium-plan": "8d2c33c9-a6b9-448e-b76d-9c1ba92c5f03"
};

export async function fetchPlans(): Promise<Plan[]> {
  try {
    // Simula uma chamada para API externa
    // Em produção, você faria uma chamada real para sua API externa
    return new Promise(resolve => {
      setTimeout(() => resolve(PLANS), 300);
    });
  } catch (error: any) {
    console.error('Erro ao buscar planos:', error);
    toast.error(`Falha ao carregar planos: ${error.message}`);
    return [];
  }
}

export async function createInstanceForUser(data: CreateInstanceData): Promise<InstanceResponse> {
  try {
    console.log('Iniciando criação de instância para usuário com ID:', data.userId);
    
    // Verificar se o ID do usuário é um UUID válido
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    // Verificar se temos um ID de usuário válido
    if (!data.userId || data.userId.trim() === '' || !uuidPattern.test(data.userId)) {
      console.error('ID do usuário inválido ou não está no formato UUID:', data.userId);
      
      // Tentar recuperar UUID do localStorage como fallback
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        if (userData && userData.id && userData.id.trim() !== '' && uuidPattern.test(userData.id)) {
          console.log('Usando UUID do usuário do localStorage:', userData.id);
          data.userId = userData.id;
        } else {
          console.error('UUID inválido no localStorage:', userData?.id);
          throw new Error('UUID do usuário inválido');
        }
      } else {
        throw new Error('UUID do usuário não encontrado');
      }
    }
    
    // Log para confirmação
    console.log('UUID do usuário validado:', data.userId);
    
    // Obter UUID real do plano
    let realPlanUUID = localStorage.getItem("currentPlanUUID") || "";
    
    // Se não foi encontrado no localStorage, usar o mapeamento
    if (!realPlanUUID && PLAN_UUIDS[data.planId]) {
      realPlanUUID = PLAN_UUIDS[data.planId];
    }
    
    console.log("Plano selecionado:", data.planId);
    console.log("UUID real do plano:", realPlanUUID);
    
    if (!realPlanUUID) {
      throw new Error("UUID do plano não encontrado");
    }
    
    // Gerar um ID de instância UUID único
    const instanceId = uuidv4();
    
    // Recuperar dados do usuário do localStorage (apenas para email e nome)
    const storedUser = localStorage.getItem('userData');
    if (!storedUser) {
      throw new Error('Dados do usuário não encontrados');
    }
    
    const userData = JSON.parse(storedUser);
    
    // Verificar se temos dados suficientes para criar a instância
    if (!userData || !userData.email) {
      throw new Error('Dados incompletos do usuário');
    }
    
    // Enviar requisição para API externa com o UUID correto do usuário
    try {
      // Dados a serem enviados para a API externa
      const requestData = {
        user_id: data.userId, // Este deve ser um UUID válido
        name: data.name,
        plan_id: realPlanUUID,
        email: userData.email,
        userName: userData.name
      };
      
      console.log("Enviando dados para API externa:", JSON.stringify(requestData));
      
      const response = await fetch('https://api.teste.onlinecenter.com.br/webhook/criar-instancia', {
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

// Função modificada para corrigir o formato do user_id
export async function fetchUserInstances(userId: string): Promise<Instance[]> {
  try {
    console.log('Buscando instâncias para usuário com ID:', userId);
    
    // Verificar se o ID é válido
    if (!userId) {
      console.error('ID do usuário não fornecido');
      throw new Error('ID do usuário não fornecido');
    }
    
    // Verificar se o ID é um UUID válido (para debug)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(userId)) {
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
      xhr.open('POST', 'https://api.teste.onlinecenter.com.br/webhook/get-all-instances', true);
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
