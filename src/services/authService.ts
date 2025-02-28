
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { registerWithExternalAPI, loginWithExternalAPI } from "./externalApi";
import { isValidUUID } from "@/utils/validationUtils";

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

/**
 * Registra um novo usuário
 */
export async function registerUser(data: RegisterData): Promise<UserData> {
  try {
    console.log('Registrando usuário:', data);

    // Enviar dados para a API externa
    const response = await registerWithExternalAPI(data);
    
    if (!response || !response.id) {
      throw new Error('Falha ao registrar usuário: resposta inválida');
    }
    
    // Garantir que o ID seja um UUID válido
    let userId = response.id;
    if (!isValidUUID(userId)) {
      console.warn('API retornou ID não-UUID:', userId);
      userId = uuidv4(); // Gerar um UUID válido
      console.log('Substituído por UUID válido:', userId);
    }
    
    // Preparar os dados do usuário para retorno
    const userData: UserData = {
      id: userId,
      name: data.name,
      email: data.email,
      phone: data.phone
    };
    
    // Armazenar dados do usuário no localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log('Dados do usuário armazenados com UUID válido:', userData);
    
    return userData;
  } catch (error: any) {
    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
}

/**
 * Realiza login de um usuário
 */
export async function loginUser(data: LoginData): Promise<UserData> {
  try {
    console.log('Realizando login:', data);
    
    // Fazer login na API externa
    const response = await loginWithExternalAPI(data);
    
    if (!response || !response.logged) {
      throw new Error('Credenciais inválidas');
    }
    
    // Garantir que o ID seja um UUID válido
    let userId = response.id;
    if (!isValidUUID(userId)) {
      console.warn('API retornou ID não-UUID:', userId);
      userId = uuidv4(); // Gerar um UUID válido
      console.log('Substituído por UUID válido:', userId);
    }
    
    // Preparar os dados do usuário para retorno
    const userData: UserData = {
      id: userId,
      name: response.name || data.email.split('@')[0],
      email: response.email || data.email,
      phone: response.phone || ''
    };
    
    // Armazenar dados do usuário no localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    console.log('Login realizado com sucesso. Dados armazenados:', userData);
    
    return userData;
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
}

/**
 * Recupera dados do usuário
 */
export function getUserData(): UserData | null {
  try {
    const userDataStr = localStorage.getItem('userData');
    if (!userDataStr) return null;
    
    const userData = JSON.parse(userDataStr) as UserData;
    
    // Verificar se o ID é um UUID válido
    if (userData && userData.id && !isValidUUID(userData.id)) {
      console.warn('ID do usuário armazenado não é um UUID válido:', userData.id);
      // Corrigir o ID para um UUID válido
      userData.id = uuidv4();
      // Atualizar o localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      console.log('UUID do usuário corrigido:', userData.id);
    }
    
    return userData;
  } catch (error) {
    console.error('Erro ao recuperar dados do usuário:', error);
    return null;
  }
}
