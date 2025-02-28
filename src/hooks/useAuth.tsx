
import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { 
  RegisterData, 
  UserData, 
  LoginData,
  registerUser
} from '@/services/authService';
import { loginWithExternalAPI } from '@/services/externalApi';

export function useAuth() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [instanceId, setInstanceId] = useState('');
  const [userToken, setUserToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    if (authInitialized) return;

    const storedUser = localStorage.getItem('userData');
    
    if (storedUser && localStorage.getItem('isLoggedIn') === 'true') {
      setUserData(JSON.parse(storedUser));
      console.log("Auth - Credenciais recuperadas do localStorage");
    }
    
    setAuthInitialized(true);
  }, [authInitialized]);

  const handleRegister = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // Registrar o usuário na API externa
      const newUser = await registerUser(data);
      
      if (!newUser || !newUser.id) {
        throw new Error("Falha ao registrar usuário");
      }

      // Armazenar os dados do usuário retornados pela API
      const user = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || '',
      };
      
      setUserData(user);
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      
      setRegistrationSuccessful(true);
      toast.success("Conta criada com sucesso!");
      
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      toast.error(`Falha ao registrar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data: LoginData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Fazer login utilizando a API externa
      console.log("Tentando login com API externa:", data);
      const response = await loginWithExternalAPI(data);
      
      if (!response || !response.logged) {
        throw new Error("Credenciais inválidas");
      }

      // Se o login foi bem-sucedido, armazenar dados do usuário
      const userData = {
        id: response.id,
        name: response.name || data.email.split('@')[0],
        email: response.email || data.email,
        phone: response.phone || '',
      };
      
      // Atualizar localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      
      // Atualizar estado
      setUserData(userData);
      setIsLoggedIn(true);
      
      toast.success("Login realizado com sucesso!");
      return true;
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      toast.error(`Falha ao fazer login: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = useCallback(() => {
    console.log("Fazendo logout...");
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    
    setUserData(null);
    setIsLoggedIn(false);
    setInstanceId('');
    setUserToken('');
    setRegistrationSuccessful(false);
    
    toast.success("Logout realizado com sucesso!");
  }, []);

  const resetRegistrationState = () => {
    setRegistrationSuccessful(false);
  };

  return {
    userData,
    instanceId,
    userToken,
    isLoading,
    registrationSuccessful,
    isLoggedIn,
    authInitialized,
    handleRegister,
    handleLogin,
    handleLogout,
    resetRegistrationState
  };
}
