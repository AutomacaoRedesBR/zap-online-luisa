
import { sendToExternalAPI, registerWithExternalAPI } from "./externalApi";

export interface UserData {
  id?: string;
  name: string;
  email: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export async function registerUser(userData: RegisterData) {
  try {
    // Registrar o usuário apenas na API externa
    const response = await registerWithExternalAPI({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password
    });
    
    if (!response || !response.id) {
      throw new Error('Falha ao criar usuário na API externa');
    }
    
    // Retornar o usuário com o ID gerado pela API externa
    const newUser = {
      id: response.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone
    };
    
    console.log("Usuário registrado com sucesso na API externa:", newUser);
    return newUser;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
}

export async function fetchFreePlan() {
  try {
    // Poderíamos buscar isso da sua API externa
    // Por enquanto, vamos retornar um valor padrão para plano gratuito
    return "free-plan";
  } catch (error) {
    console.error('Erro ao carregar plano gratuito:', error);
    return null;
  }
}

export async function createUserInstance(userId: string, planId: string) {
  try {
    // Criar instância apenas na API externa
    const expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    // Recuperar email do usuário do localStorage
    const storedUser = localStorage.getItem('userData');
    if (!storedUser) {
      throw new Error('Dados do usuário não encontrados');
    }
    
    const userData = JSON.parse(storedUser);
    
    // Dados para enviar à API externa
    const externalApiData = {
      name: 'Instância Principal', 
      email: userData.email,
      phone: userData.phone || '',
      instance_id: `instance-${Date.now()}` // Gerar um ID temporário
    };

    // Enviar para API externa
    const response = await sendToExternalAPI(externalApiData);
    
    // Retornar dados da instância criada
    return {
      id: externalApiData.instance_id,
      user_id: userId,
      plan_id: planId,
      name: externalApiData.name,
      expiration_date: expirationDate,
      status: 'pending',
      sent_messages_number: 0,
      user_sequence_id: 1
    };
  } catch (error) {
    console.error('Erro ao criar instância:', error);
    throw error;
  }
}

// Função auxiliar para obter email do usuário
function getUserEmail(userId: string): string {
  try {
    const storedUser = localStorage.getItem('userData');
    if (!storedUser) return '';
    
    const userData = JSON.parse(storedUser);
    return userData.email || '';
  } catch (error) {
    console.error('Erro ao buscar email do usuário:', error);
    return '';
  }
}

export async function getUserInstance(userId: string) {
  // Poderíamos buscar isso da sua API externa
  // Por enquanto, vamos retornar uma instância fictícia
  const storedUser = localStorage.getItem('userData');
  if (!storedUser) return null;
  
  return {
    id: `instance-${Date.now()}`,
    user_id: userId,
    name: 'Instância Principal',
    status: 'active',
    sent_messages_number: 0
  };
}

export async function updateInstanceApiKey(instanceId: string, apiKey: string) {
  // Esta função poderia fazer uma chamada para sua API externa
  console.log(`API Key ${apiKey} atualizada para instância ${instanceId}`);
  return true;
}

export async function updateInstanceStatus(instanceId: string, status: string) {
  // Esta função poderia fazer uma chamada para sua API externa
  console.log(`Status ${status} atualizado para instância ${instanceId}`);
  return true;
}
