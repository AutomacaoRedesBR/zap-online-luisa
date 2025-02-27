
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
    console.log('Iniciando criação de instância para usuário com ID:', data.userId);
    
    // Recuperar dados do usuário do localStorage para confirmar ID
    const storedUser = localStorage.getItem('userData');
    if (!storedUser) {
      throw new Error('Dados do usuário não encontrados');
    }
    
    const userData = JSON.parse(storedUser);
    console.log('Dados do usuário recuperados do localStorage:', userData);
    
    // Verificar se o usuário existe na tabela users antes de criar a instância
    // Para garantir que estamos usando um ID válido
    const { data: userFromDb, error: userError } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('email', userData.email)
      .maybeSingle();
    
    if (userError) {
      console.error("Erro ao verificar usuário no banco:", userError);
      throw new Error(`Erro ao verificar usuário: ${userError.message}`);
    }
    
    // Se não encontrou o usuário pelo email, tentamos pelo ID
    if (!userFromDb) {
      const { data: userById, error: userByIdError } = await supabase
        .from('users')
        .select('id, email, name')
        .eq('id', userData.id)
        .maybeSingle();
        
      if (userByIdError || !userById) {
        console.error("Usuário não encontrado no banco de dados");
        throw new Error("Usuário não encontrado. Por favor, faça login novamente.");
      }
    }
    
    // Usar o ID do banco de dados se disponível, caso contrário usar o do localStorage
    const validUserId = userFromDb?.id || userData.id;
    console.log("ID válido do usuário para criar instância:", validUserId);
    
    // Validar formato do UUID para evitar erros
    if (!isValidUUID(validUserId)) {
      console.error("ID do usuário não é um UUID válido:", validUserId);
      throw new Error("ID de usuário inválido. Por favor, faça login novamente.");
    }

    // Gerar um ID de instância UUID único
    const instanceId = uuidv4();
    
    // Criar a URL do QR Code
    const qrCodeData = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${instanceId}`;
    
    // Calcular data de expiração
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    
    // Criar instância no banco de dados
    console.log("Tentando inserir instância com user_id:", validUserId);
    
    const { data: newInstance, error: insertError } = await supabase
      .from('instances')
      .insert({
        user_id: validUserId,
        plan_id: data.planId,
        name: data.name,
        expiration_date: expirationDate.toISOString(),
        status: 'pending',
        sent_messages_number: 0,
        user_sequence_id: 1 // O trigger vai sobrescrever este valor
      })
      .select()
      .maybeSingle();

    if (insertError) {
      console.error('Erro ao salvar instância no banco:', insertError);
      throw insertError;
    }
    
    console.log("Instância criada com sucesso:", newInstance);
    
    // Enviar requisição para API externa (com tratamento de erro)
    try {
      const response = await fetch('https://api.teste.onlinecenter.com.br/webhook/criar-instancia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: validUserId,
          name: data.name,
          planId: data.planId,
          email: userData.email,
          userName: userData.name
        }),
      });

      if (response.ok) {
        const apiResponse = await response.json();
        console.log('Resposta da API externa:', apiResponse);
      }
    } catch (apiError) {
      console.warn('API externa não disponível, continuando fluxo local:', apiError);
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

// Função para validar UUID
function isValidUUID(uuid: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
