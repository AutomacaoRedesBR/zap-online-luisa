
import { useState } from 'react';
import { toast } from "sonner";
import { 
  RegisterData, 
  UserData, 
  LoginData, 
  createUserInstance,
  loginUser,
  getUserInstance 
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
      // 1. Gerar um ID temporário para a instância
      const tempInstanceId = crypto.randomUUID();
      
      // 2. Enviar dados diretamente para a API externa
      const apiResponse = await sendToExternalAPI({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        instance_id: tempInstanceId
      });
      
      // 3. Se a API retornou sucesso, atualizar o estado
      setUserData({
        name: data.name,
        email: data.email,
        phone: data.phone || '',
      });
      
      setInstanceId(tempInstanceId);
      setRegistrationSuccessful(true);
      toast.success("Conta criada com sucesso! Dados enviados para API externa.");
      
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
      // 1. Autenticar usuário usando a tabela Users
      const user = await loginUser(data);
      
      // 2. Obter a primeira instância do usuário (se existir)
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
