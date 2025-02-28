
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { Instance, CreateInstanceData, InstanceResponse } from "./types/instance.types";
import { PLAN_UUIDS } from "./planService";
import { isValidUUID, getUserIdFromLocalStorage, getUserDataFromLocalStorage } from "./utils/instanceUtils";
import { fetchUserInstances } from "./userInstanceService";

export { fetchUserInstances } from "./userInstanceService";
export type { Plan, CreateInstanceData, InstanceResponse, Instance } from "./types/instance.types";
export { fetchPlans, PLAN_UUIDS } from "./planService";

export async function createInstanceForUser(data: CreateInstanceData): Promise<InstanceResponse> {
  try {
    console.log('Iniciando criação de instância para usuário com ID:', data.userId);
    
    // Verificar se temos um ID de usuário válido
    if (!data.userId || data.userId.trim() === '') {
      console.error('ID do usuário não fornecido ou vazio:', data.userId);
      
      // Tentar recuperar do localStorage como fallback
      const userId = getUserIdFromLocalStorage();
      if (userId) {
        console.log('Usando ID do usuário do localStorage como fallback:', userId);
        data.userId = userId;
      } else {
        throw new Error('ID do usuário não fornecido e não há dados no localStorage');
      }
    }
    
    // Log adicional para depuração
    console.log('Confirmação do ID de usuário que será enviado:', data.userId);
    
    // Verificar se o ID é um UUID válido (para debug)
    if (!isValidUUID(data.userId)) {
      console.warn('O ID fornecido não parece ser um UUID válido:', data.userId);
    }
    
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
    
    // Recuperar dados do usuário do localStorage (apenas para email e nome)
    const userData = getUserDataFromLocalStorage();
    
    // Verificar se temos dados suficientes para criar a instância
    if (!userData || !userData.email) {
      throw new Error('Dados incompletos do usuário');
    }
    
    // Enviar requisição para API externa com o ID correto do usuário
    try {
      // Dados a serem enviados para a API externa
      const requestData = {
        user_id: data.userId, // Usar o ID exato recebido como parâmetro ou recuperado do localStorage
        name: data.name,
        plan_id: realPlanUUID,
        email: userData.email,
        userName: userData.name
      };
      
      console.log("Enviando dados para API externa:", JSON.stringify(requestData));
      
      const response = await fetch('https://api.teste.onlinecenter.com.br/webhook/criar-instancia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
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
