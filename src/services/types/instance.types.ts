
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
