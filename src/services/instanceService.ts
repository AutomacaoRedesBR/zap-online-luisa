
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    // Primeiro obter informações do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, name, phone')
      .eq('id', data.userId)
      .single();
    
    if (userError) {
      console.error('Erro ao buscar dados do usuário:', userError);
      throw new Error('Erro ao buscar dados do usuário');
    }
    
    if (!userData) {
      throw new Error('Usuário não encontrado');
    }
    
    console.log('Enviando requisição para API externa com dados:', {
      userId: data.userId,
      name: data.name,
      planId: data.planId,
      email: userData.email,
      userName: userData.name
    });

    // Enviar requisição para API externa
    const response = await fetch('https://n8n-editor.teste.onlinecenter.com.br/webhook-test/criar-instancia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: data.userId,
        name: data.name,
        planId: data.planId,
        email: userData.email,
        userName: userData.name
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resposta da API:', errorText);
      throw new Error(`Falha ao criar instância: ${response.status} - ${errorText}`);
    }

    const instanceData = await response.json();
    
    // Verificar se a resposta contém os campos esperados
    if (!instanceData.qrCode || !instanceData.instanceId) {
      console.error('Resposta inválida da API:', instanceData);
      throw new Error('Resposta inválida da API');
    }
    
    // Criar instância no banco de dados local
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30); // 30 dias a partir de hoje
    
    const { error: instanceError } = await supabase
      .from('instances')
      .insert({
        user_id: data.userId,
        plan_id: data.planId,
        name: data.name,
        expiration_date: expirationDate.toISOString(),
        status: 'pending',
        sent_messages_number: 0,
        user_sequence_id: 1, // O trigger vai sobrescrever este valor
        instance_id: instanceData.instanceId // Salvar o ID retornado pela API
      });
    
    if (instanceError) {
      console.error('Erro ao salvar instância no banco:', instanceError);
      // Não vamos lançar erro aqui para não interromper o fluxo,
      // já que a instância foi criada na API externa
    }
    
    return instanceData;
  } catch (error: any) {
    console.error('Erro ao criar instância:', error);
    throw error;
  }
}
