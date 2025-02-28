
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
    
    // Recuperar dados do usuário do localStorage
    const storedUser = localStorage.getItem('userData');
    if (!storedUser) {
      throw new Error('Dados do usuário não encontrados');
    }
    
    const userData = JSON.parse(storedUser);
    console.log('Dados do usuário recuperados do localStorage:', userData);
    
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
    
    // Enviar requisição para API externa
    try {
      console.log("Enviando dados para API externa:", {
        userId: userData.id,
        name: data.name,
        planId: realPlanUUID,
        email: userData.email,
        userName: userData.name
      });
      
      const response = await fetch('https://api.teste.onlinecenter.com.br/webhook/criar-instancia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.id,
          name: data.name,
          planId: realPlanUUID,
          email: userData.email,
          userName: userData.name
        }),
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

export async function fetchUserInstances(userId: string): Promise<Instance[]> {
  try {
    console.log('Buscando instâncias para usuário com ID:', userId);
    
    const response = await fetch('https://api.teste.onlinecenter.com.br/webhook/get-all-instances', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar instâncias');
    }

    const data = await response.json();
    console.log('Dados de instâncias recebidos da API:', data);
    
    if (data && data.instances && Array.isArray(data.instances)) {
      // Processar os dados conforme o formato retornado pela API
      return data.instances.map((item: any) => item.json);
    }
    
    return [];
  } catch (error) {
    console.error('Erro ao buscar instâncias:', error);
    throw error;
  }
}
