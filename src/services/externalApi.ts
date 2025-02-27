
export interface ExternalApiData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  instance_id: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterUserData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export async function sendToExternalAPI(data: ExternalApiData) {
  try {
    console.log('Enviando dados para API externa:', data);
    
    const response = await fetch('https://api.teste.onlinecenter.com.br/webhook/criar-instancia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resposta da API não ok:', response.status, errorText);
      throw new Error(`Falha ao enviar dados para API externa: ${response.status} ${errorText}`);
    }

    const responseData = await response.json();
    console.log('Resposta da API externa:', responseData);
    
    return responseData;
  } catch (error) {
    console.error('Erro ao enviar para API externa:', error);
    throw error;
  }
}

export async function loginWithExternalAPI(credentials: LoginCredentials) {
  try {
    console.log('Enviando credenciais de login para API externa:', credentials);
    
    const response = await fetch('https://api.teste.onlinecenter.com.br/webhook/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resposta da API não ok:', response.status, errorText);
      throw new Error(`Falha ao autenticar: ${response.status} ${errorText}`);
    }

    const userData = await response.json();
    console.log('Resposta de login da API externa:', userData);
    
    return userData;
  } catch (error) {
    console.error('Erro ao fazer login com API externa:', error);
    throw error;
  }
}

export async function registerWithExternalAPI(userData: RegisterUserData) {
  try {
    console.log('Enviando dados de registro para API externa:', userData);
    
    const response = await fetch('https://api.teste.onlinecenter.com.br/webhook/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resposta da API não ok:', response.status, errorText);
      throw new Error(`Falha ao registrar usuário: ${response.status} ${errorText}`);
    }

    const responseData = await response.json();
    console.log('Resposta de registro da API externa:', responseData);
    
    // Armazenar os dados do usuário no localStorage para uso posterior
    localStorage.setItem('userData', JSON.stringify({
      id: responseData.id || userData.email, // Usa o ID retornado ou o email como fallback
      name: userData.name,
      email: userData.email,
      phone: userData.phone
    }));
    
    return responseData;
  } catch (error) {
    console.error('Erro ao registrar com API externa:', error);
    throw error;
  }
}
