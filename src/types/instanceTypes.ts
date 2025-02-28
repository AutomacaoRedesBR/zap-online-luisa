
// Definições de tipos compartilhados para instâncias e planos

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

export interface Instance {
  id: string;
  user_id: string;
  plan_id: string;
  name: string;
  sequence_id: number;
  user_sequence_id: number;
  phone: string | null;
  evo_api_key: string;
  sent_messages_number: number;
  expiration_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Constantes relacionadas a planos
export const PLAN_UUIDS: Record<string, string> = {
  "free-plan": "95c10fdd-b92d-493a-a25d-3fee817c950a",
  "basic-plan": "741d4a3d-19b5-4a24-93ae-9b4890a40f7a",
  "premium-plan": "8d2c33c9-a6b9-448e-b76d-9c1ba92c5f03"
};
