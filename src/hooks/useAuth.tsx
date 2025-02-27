
import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { 
  RegisterData, 
  UserData, 
  LoginData, 
  createUserInstance,
  registerUser 
} from '@/services/authService';
import { loginWithExternalAPI, registerWithExternalAPI } from '@/services/externalApi';
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [instanceId, setInstanceId] = useState('');
  const [userToken, setUserToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false);
  const [freePlanId, setFreePlanId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    // Inicializar o estado com base no localStorage logo na criação do componente
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [authInitialized, setAuthInitialized] = useState(false);

  // Verificar se há dados de login no localStorage ao iniciar (apenas uma vez)
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
      // Enviar dados para a API externa para registro
      const registeredUser = await registerWithExternalAPI({
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        password: data.password
      });
      
      if (!registeredUser) {
        throw new Error("Falha ao registrar usuário");
      }

      // Também vamos criar um usuário no Supabase para autenticação
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone || ''
          }
        }
      });

      if (authError) {
        console.warn("Erro ao registrar no Supabase Auth:", authError);
        // Não vamos falhar o registro só por causa do Supabase Auth
      } else {
        console.log("Usuário registrado no Supabase Auth:", authData);
      }
      
      // Agora vamos criar uma instância gratuita para o usuário se tivermos um plano gratuito
      if (freePlanId && authData.user) {
        try {
          const instance = await createUserInstance(authData.user.id, freePlanId);
          if (instance) {
            setInstanceId(instance.id);
          }
        } catch (instanceError) {
          console.error("Erro ao criar instância:", instanceError);
          // Não vamos falhar o registro só porque não conseguimos criar a instância
        }
      }
      
      // Definir dados do usuário no estado
      const user = {
        id: authData.user?.id || registeredUser.id || Date.now().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone || '',
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
      console.log("Auth - Iniciando processo de login com API externa");
      
      const apiResponse = await loginWithExternalAPI({
        email: data.email,
        password: data.password
      });
      
      if (apiResponse && apiResponse.logged === true) {
        console.log("Auth - Login bem-sucedido na API externa");
        
        // Também autenticar no Supabase para ter acesso ao banco de dados
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password
        });

        if (authError) {
          console.warn("Erro ao autenticar no Supabase:", authError);
          // Tentar criá-lo caso não exista
          const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password
          });

          if (signupError) {
            console.error("Erro ao criar usuário no Supabase:", signupError);
            // Não falhar o login por isso
          } else {
            console.log("Usuário criado no Supabase:", signupData);
          }
        } else {
          console.log("Autenticado no Supabase:", authData);
        }
        
        const user = {
          id: authData?.user?.id || Date.now().toString(),
          name: apiResponse.name || data.email.split('@')[0],
          email: data.email,
          phone: apiResponse.phone || '',
        };
        
        // Atualizar localStorage primeiro
        localStorage.setItem('userData', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Depois atualizar o estado
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

  const handleLogout = useCallback(() => {
    console.log("Fazendo logout...");
    // Também fazer logout do Supabase
    supabase.auth.signOut()
      .then(() => console.log("Logout do Supabase realizado"))
      .catch(error => console.error("Erro ao fazer logout do Supabase:", error));
    
    // Limpar o localStorage
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    
    // Atualizar os estados
    setUserData(null);
    setIsLoggedIn(false);
    setInstanceId('');
    setUserToken('');
    setRegistrationSuccessful(false);
    
    // Mostrar mensagem de sucesso
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
