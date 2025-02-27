
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { 
  RegisterData, 
  UserData, 
  LoginData, 
  createUserInstance,
  registerUser 
} from '@/services/authService';
import { loginWithExternalAPI } from '@/services/externalApi';

export function useAuth() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [instanceId, setInstanceId] = useState('');
  const [userToken, setUserToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false);
  const [freePlanId, setFreePlanId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verificar se há dados de login no localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    const storedLoginState = localStorage.getItem('isLoggedIn');
    
    if (storedUser && storedLoginState === 'true') {
      setUserData(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleRegister = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // Primeiro registrar o usuário no banco de dados
      const registeredUser = await registerUser(data);
      
      if (!registeredUser || !registeredUser.id) {
        throw new Error("Falha ao registrar usuário");
      }
      
      // Se o plano gratuito existir, criar uma instância para o usuário
      if (freePlanId) {
        const instance = await createUserInstance(registeredUser.id, freePlanId);
        if (instance) {
          setInstanceId(instance.id);
        }
      }
      
      // Atualizar o estado da aplicação
      setUserData({
        id: registeredUser.id,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
      });
      
      setRegistrationSuccessful(true);
      toast.success("Conta criada com sucesso!");
      
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      toast.error(`Falha ao registrar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data: LoginData) => {
    setIsLoading(true);
    try {
      console.log("Tentando login com API externa:", data);
      
      // Enviar credenciais para a API externa
      const apiResponse = await loginWithExternalAPI({
        email: data.email,
        password: data.password
      });
      
      // Verificar se o login foi bem-sucedido
      if (apiResponse && apiResponse.logged === true) {
        console.log("Login bem-sucedido, atualizando estado...");
        
        // Usuário se autenticou com sucesso
        const user = {
          id: Date.now().toString(), // ID temporário apenas para a sessão
          name: data.email.split('@')[0], // Nome temporário baseado no email
          email: data.email,
          phone: '',
        };
        
        // Salvar o usuário no localStorage para persistir a sessão
        localStorage.setItem('userData', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        
        setUserData(user);
        setIsLoggedIn(true);
        
        toast.success("Login realizado com sucesso!");
        return true;
      } else {
        throw new Error("Credenciais inválidas. Por favor, tente novamente.");
      }
      
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      toast.error(`Falha ao fazer login: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    console.log("Fazendo logout...");
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    setUserData(null);
    setIsLoggedIn(false);
    setInstanceId('');
    setUserToken('');
    setRegistrationSuccessful(false);
  };

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
    setFreePlanId,
    handleRegister,
    handleLogin,
    handleLogout,
    resetRegistrationState
  };
}
