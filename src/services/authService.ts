
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

export async function createUserInstance(userId: string, freePlanId: string) {
  try {
    // Verificar se existe um plano gratuito
    if (!freePlanId) {
      toast.error("Erro interno: Plano gratuito não encontrado");
      return null;
    }

    // Calcular data de expiração (1 mês a partir de agora)
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);

    // Criar nova instância
    const { data, error } = await supabase
      .from('instances')
      .insert({
        user_id: userId,
        plan_id: freePlanId,
        name: 'Instância Principal',
        expiration_date: expirationDate.toISOString(),
        status: 'pending',
        sent_messages_number: 0,
        user_sequence_id: 1 // Definindo valor inicial
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Erro ao criar instância:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao criar instância:', error);
    return null;
  }
}

export async function getUserData(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (error) throw error;
  if (!data) throw new Error('Usuário não encontrado');
  
  return data;
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
