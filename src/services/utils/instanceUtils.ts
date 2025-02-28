
/**
 * Verifica se uma string é um UUID válido
 */
export function isValidUUID(id: string): boolean {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(id);
}

/**
 * Obtém o ID do usuário do localStorage
 */
export function getUserIdFromLocalStorage(): string | null {
  try {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      if (userData && userData.id && userData.id.trim() !== '') {
        return userData.id;
      }
    }
    return null;
  } catch (error) {
    console.error('Erro ao obter ID do usuário do localStorage:', error);
    return null;
  }
}

/**
 * Obtém os dados do usuário do localStorage
 */
export function getUserDataFromLocalStorage(): any {
  try {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  } catch (error) {
    console.error('Erro ao obter dados do usuário do localStorage:', error);
    return null;
  }
}
