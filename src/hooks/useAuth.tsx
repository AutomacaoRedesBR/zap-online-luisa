
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  RegisterData, 
  UserData, 
  LoginData, 
  createUserInstance, 
  getUserData, 
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
      // 1. Registrar o usuário no Supabase Auth (ainda necessário para autenticação)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
          }
        }
      });
      
      if (authError) throw authError;
      if (!authData.user?.id) throw new Error('Falha ao obter ID do usuário');
      
      // 2. Gerar um ID temporário para a instância
      const tempInstanceId = crypto.randomUUID();
      
      // 3. Enviar dados diretamente para a API externa
      const apiResponse = await sendToExternalAPI({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        instance_id: tempInstanceId
      });
      
      // 4. Atualizar o estado da aplicação indicando sucesso no registro
      setUserData({
        id: authData.user.id,
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
      // 1. Login no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      
      if (authError) throw authError;
      
      // 2. Obter dados do usuário do Supabase Auth
      const user = authData.user;
      
      // 3. Atualizar o estado da aplicação
      setUserData({
        id: user.id,
        name: user.user_metadata.name || '',
        email: user.email || '',
        phone: user.user_metadata.phone || '',
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
