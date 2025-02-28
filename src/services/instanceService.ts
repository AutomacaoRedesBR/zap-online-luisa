
// Este arquivo agora serve como um ponto de entrada para todas as funções relacionadas a instâncias
// Importamos e re-exportamos para manter a compatibilidade com o código existente

import { fetchPlans } from './planService';
import { createInstanceForUser, fetchUserInstances } from './instanceApiService';
import type { Plan, CreateInstanceData, InstanceResponse, Instance, PLAN_UUIDS } from '@/types/instanceTypes';

// Re-exportamos os tipos e funções para manter a compatibilidade com o código existente
export type { Plan, CreateInstanceData, InstanceResponse, Instance };
export { fetchPlans, createInstanceForUser, fetchUserInstances, PLAN_UUIDS };
