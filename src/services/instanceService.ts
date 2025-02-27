
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
    console.log('Iniciando criação de instância para usuário:', data.userId);
    // Ao invés de buscar os dados do usuário do banco, usaremos os dados da sessão local
    // ou dados que são passados diretamente
    
    // Recuperar dados do usuário do localStorage como um backup
    const storedUser = localStorage.getItem('userData');
    const userData = storedUser ? JSON.parse(storedUser) : null;
    
    if (!userData) {
      console.error('Não foi possível recuperar os dados do usuário do localStorage');
      throw new Error('Usuário não encontrado ou sessão expirada');
    }
    
    // Garantir que temos um UUID válido para o userId
    // Se o ID armazenado não for um UUID válido, vamos gerar um novo
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const userUUID = uuidPattern.test(data.userId) ? data.userId : uuidv4();
    
    console.log('Dados do usuário recuperados do localStorage:', userData);
    console.log('Enviando requisição para API externa com dados:', {
      userId: userUUID, // Usando o UUID válido aqui
      name: data.name,
      planId: data.planId,
      email: userData.email,
      userName: userData.name
    });

    // Enviar requisição para API externa - URL ATUALIZADA
    const response = await fetch('https://api.teste.onlinecenter.com.br/webhook/criar-instancia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userUUID, // Usando o UUID válido aqui
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
    console.log('Resposta recebida da API externa:', instanceData);
    
    // Verificar se a resposta contém os campos esperados
    if (!instanceData.qrCode || !instanceData.instanceId) {
      console.error('Resposta inválida da API:', instanceData);
      throw new Error('Resposta inválida da API');
    }
    
    // Na versão atual, evitaremos tentar salvar no banco de dados Supabase
    // já que o ID do usuário pode não ser um UUID válido quando logado via API externa
    // Se ainda quiser tentar salvar (opcional), podemos usar um try-catch para não interromper o fluxo
    try {
      // Criar instância no banco de dados local (se possível)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30); // 30 dias a partir de hoje
      
      await supabase
        .from('instances')
        .insert({
          user_id: userUUID, // Usando o UUID válido aqui também
          plan_id: data.planId,
          name: data.name,
          expiration_date: expirationDate.toISOString(),
          status: 'pending',
          sent_messages_number: 0,
          user_sequence_id: 1, // O trigger vai sobrescrever este valor
          instance_id: instanceData.instanceId // Salvar o ID retornado pela API
        });
      
      console.log('Instância salva no banco de dados com sucesso');
    } catch (dbError) {
      console.error('Erro ao salvar instância no banco (não crítico):', dbError);
      // Não interrompe o fluxo, pois a instância já foi criada na API externa
    }
    
    return instanceData;
  } catch (error: any) {
    console.error('Erro ao criar instância:', error);
    throw error;
  }
}
