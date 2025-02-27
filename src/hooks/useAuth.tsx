
import { useState } from 'react';
import { toast } from "sonner";
import { 
  RegisterData, 
  UserData, 
  LoginData, 
  createUserInstance,
  loginUser,
  getUserInstance,
  registerUser 
} from '@/services/authService';
import { sendToExternalAPI } from '@/services/externalApi';

export function useAuth() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [instanceId, setInstanceId] = useState('');
  const [userToken, setUserToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false);
  const [freePlanId, setFreePlanId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      console.log("Tentando login com:", data);
      
      // 1. Autenticar usuário usando a tabela Users
      const user = await loginUser(data);
      
      console.log("Usuário autenticado:", user);
      
      // 2. Obter a primeira instância do usuário (se existir)
      if (user && user.id) {
        const instanceData = await getUserInstance(user.id);
        
        // 3. Se existir uma instância, armazenar seu ID
        if (instanceData) {
          setInstanceId(instanceData.id);
        }
        
        // 4. Atualizar o estado da aplicação
        setUserData({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
        });
        
        setIsLoggedIn(true);
        toast.success("Login realizado com sucesso!");
      } else {
        throw new Error("Usuário não encontrado");
      }
      
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      toast.error(`Falha ao fazer login: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
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
