
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
    
    // Gerar um ID de instância UUID único
    const instanceId = uuidv4();
    
    // Criar a URL do QR Code
    const qrCodeData = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${instanceId}`;
    
    // Enviar requisição para API externa
    try {
      const response = await fetch('https://api.teste.onlinecenter.com.br/webhook/criar-instancia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.id,
          name: data.name,
          planId: data.planId,
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
    } catch (apiError) {
      console.error('API externa não disponível:', apiError);
      throw new Error('Não foi possível se conectar ao servidor. Tente novamente mais tarde.');
    }
    
    return {
      qrCode: qrCodeData,
      instanceId: instanceId
    };
  } catch (error: any) {
    console.error('Erro ao criar instância:', error);
    throw error;
  }
}
