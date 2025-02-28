
/**
 * Funções utilitárias para validação
 */

/**
 * Verifica se uma string é um UUID válido
 */
export function isValidUUID(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(id);
}

/**
 * Recupera dados de usuário do localStorage
 */
export function getUserDataFromStorage() {
  try {
    const storedUser = localStorage.getItem('userData');
    if (!storedUser) return null;
    
    return JSON.parse(storedUser);
  } catch (error) {
    console.error('Erro ao recuperar dados do usuário do localStorage:', error);
    return null;
  }
}

/**
 * Recupera o UUID do usuário do localStorage
 */
export function getUserUUIDFromStorage(): string | null {
  const userData = getUserDataFromStorage();
  if (!userData || !userData.id) return null;
  
  return isValidUUID(userData.id) ? userData.id : null;
}
