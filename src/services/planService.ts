
import { toast } from "sonner";
import { Plan, PLAN_UUIDS } from "@/types/instanceTypes";

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

/**
 * Busca todos os planos disponíveis
 */
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

/**
 * Obtém o UUID real de um plano a partir do seu ID
 */
export function getPlanUUID(planId: string): string | null {
  if (!planId) return null;
  
  // Verificar se já é um UUID válido
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(planId)) return planId;
  
  // Verificar no localStorage primeiro
  const storedUUID = localStorage.getItem("currentPlanUUID");
  if (storedUUID && uuidPattern.test(storedUUID)) return storedUUID;
  
  // Usar o mapeamento para obter o UUID
  return PLAN_UUIDS[planId] || null;
}
