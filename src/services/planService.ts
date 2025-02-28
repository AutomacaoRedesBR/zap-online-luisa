
import { toast } from "sonner";
import { Plan } from "./types/instance.types";

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

// Mapeamento dos IDs de plano para UUIDs reais
export const PLAN_UUIDS: Record<string, string> = {
  "free-plan": "95c10fdd-b92d-493a-a25d-3fee817c950a",
  "basic-plan": "741d4a3d-19b5-4a24-93ae-9b4890a40f7a",
  "premium-plan": "8d2c33c9-a6b9-448e-b76d-9c1ba92c5f03"
};

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
