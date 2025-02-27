
import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { 
  RegisterData, 
  UserData, 
  LoginData,
  registerUser
} from '@/services/authService';
import { loginWithExternalAPI } from '@/services/externalApi';
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [instanceId, setInstanceId] = useState('');
  const [userToken, setUserToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false);
  const [freePlanId, setFreePlanId] = useState('');
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
      // Primeiro registrar o usuário no Supabase
      const newUser = await registerUser(data);
      
      if (!newUser || !newUser.id) {
        throw new Error("Falha ao registrar usuário");
      }

      // Armazenar os dados do usuário incluindo o ID correto do Supabase
      const user = {
        id: newUser.id, // Este é o ID UUID da tabela users
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
      // Buscar usuário no Supabase primeiro
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email, phone')
        .eq('email', data.email)
        .eq('password', data.password)
        .single();

      if (error || !user) {
        throw new Error("Credenciais inválidas");
      }

      // Se encontrou o usuário, armazenar seus dados com o ID correto
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
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
    setFreePlanId,
    handleRegister,
    handleLogin,
    handleLogout,
    resetRegistrationState
  };
}
