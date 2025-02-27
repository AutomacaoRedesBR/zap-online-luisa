
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { 
  RegisterData, 
  UserData, 
  LoginData, 
  createUserInstance,
  getUserInstance,
  registerUser 
} from '@/services/authService';
import { sendToExternalAPI, loginWithExternalAPI } from '@/services/externalApi';

export function useAuth() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [instanceId, setInstanceId] = useState('');
  const [userToken, setUserToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false);
  const [freePlanId, setFreePlanId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verificar se o usuário já está logado quando o hook é montado
  useEffect(() => {
    // Log para depuração
    console.log("userData mudou:", userData);
    
    // Se tiver userData, então o usuário está logado
    if (userData) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [userData]);

  // Log para depuração
  useEffect(() => {
    console.log("isLoggedIn mudou:", isLoggedIn);
  }, [isLoggedIn]);

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
        // Como a API não retorna os dados do usuário, vamos criá-los com base no email
        const user = {
          id: Date.now().toString(), // ID temporário apenas para a sessão
          name: data.email.split('@')[0], // Nome temporário baseado no email
          email: data.email,
          phone: '',
        };
        
        // Importante: primeiro definir isLoggedIn para true, depois userData
        setIsLoggedIn(true);
        setUserData(user);
        
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
    // Importante: primeiro limpar userData, depois definir isLoggedIn como false
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
