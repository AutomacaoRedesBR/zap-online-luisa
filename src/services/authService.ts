
import { supabase } from "@/integrations/supabase/client";
import { sendToExternalAPI } from "./externalApi";

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
    // Primeiro registrar o usuário no banco de dados
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password
      })
      .select()
      .single();

    if (error) throw error;
    
    console.log("Usuário registrado com sucesso:", newUser);

    return newUser;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
}

export async function fetchFreePlan() {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('id')
      .eq('name', 'Free')
      .maybeSingle();
    
    if (error) throw error;
    return data?.id || null;
  } catch (error) {
    console.error('Erro ao carregar plano gratuito:', error);
    return null;
  }
}

export async function createUserInstance(userId: string, planId: string) {
  try {
    // Convertendo Date para string no formato ISO para compatibilidade com Supabase
    const expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: instance, error } = await supabase
      .from('instances')
      .insert({
        user_id: userId,
        plan_id: planId,
        name: 'Instância Principal',
        expiration_date: expirationDate,
        status: 'pending',
        sent_messages_number: 0,
        user_sequence_id: 1 // O trigger vai sobrescrever este valor
      })
      .select()
      .single();

    if (error) throw error;

    // Enviar dados para API externa
    if (instance) {
      // Criar objeto com dados da instância e do usuário para API externa
      const externalApiData = {
        name: instance.name,
        email: await getUserEmail(userId),
        phone: instance.phone || '',
        password: '',  // Não enviar senha real por segurança
        instance_id: instance.id
      };

      await sendToExternalAPI(externalApiData);
    }

    return instance;
  } catch (error) {
    console.error('Erro ao criar instância:', error);
    throw error;
  }
}

// Função auxiliar para obter email do usuário
async function getUserEmail(userId: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data?.email || '';
  } catch (error) {
    console.error('Erro ao buscar email do usuário:', error);
    return '';
  }
}

export async function getUserInstance(userId: string) {
  const { data, error } = await supabase
    .from('instances')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  
  return data;
}

export async function updateInstanceApiKey(instanceId: string, apiKey: string) {
  const { error } = await supabase
    .from('instances')
    .update({ evo_api_key: apiKey })
    .eq('id', instanceId);
    
  if (error) {
    console.error('Erro ao atualizar instância com apiKey:', error);
    throw error;
  }
}

export async function updateInstanceStatus(instanceId: string, status: string) {
  const { error } = await supabase
    .from('instances')
    .update({ status })
    .eq('id', instanceId);
    
  if (error) {
    console.error('Erro ao atualizar status da instância:', error);
    throw error;
  }
}
