
import { supabase } from "@/integrations/supabase/client";
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

export async function fetchPlans(): Promise<Plan[]> {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('id, name, description, max_messages_number')
      .order('name');
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error('Erro ao buscar planos:', error);
    toast.error(`Falha ao carregar planos: ${error.message}`);
    return [];
  }
}

export async function createInstanceForUser(data: CreateInstanceData): Promise<InstanceResponse> {
  try {
    // Primeiro, vamos verificar se o usuário está autenticado
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      throw new Error('Usuário não está autenticado');
    }

    console.log('Iniciando criação de instância para usuário:', session.session.user.id);
    
    // Recuperar dados do usuário do localStorage
    const storedUser = localStorage.getItem('userData');
    const userData = storedUser ? JSON.parse(storedUser) : null;
    
    if (!userData) {
      throw new Error('Dados do usuário não encontrados');
    }

    // Enviar requisição para API externa
    const response = await fetch('https://api.teste.onlinecenter.com.br/webhook/criar-instancia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: session.session.user.id,
        name: data.name,
        planId: data.planId,
        email: userData.email,
        userName: userData.name
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Falha ao criar instância: ${response.status} - ${errorText}`);
    }

    const instanceData = await response.json();
    
    if (!instanceData.qrCode || !instanceData.instanceId) {
      throw new Error('Resposta inválida da API');
    }
    
    // Criar instância no banco de dados usando o ID do usuário autenticado
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    
    const { error: insertError } = await supabase
      .from('instances')
      .insert({
        user_id: session.session.user.id, // Usando o ID do usuário autenticado
        plan_id: data.planId,
        name: data.name,
        expiration_date: expirationDate.toISOString(),
        status: 'pending',
        sent_messages_number: 0,
        user_sequence_id: 1, // O trigger vai sobrescrever este valor
        instance_id: instanceData.instanceId
      });

    if (insertError) {
      console.error('Erro ao salvar instância no banco:', insertError);
      throw insertError;
    }
    
    return instanceData;
  } catch (error: any) {
    console.error('Erro ao criar instância:', error);
    throw error;
  }
}
