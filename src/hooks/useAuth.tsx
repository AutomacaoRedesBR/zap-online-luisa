
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
  const [showQRCode, setShowQRCode] = useState(false);
  const [freePlanId, setFreePlanId] = useState('');

  const handleRegister = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // 1. Registrar o usuário no Supabase Auth
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
      
      // 2. Criar o perfil do usuário no banco de dados
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
        })
        .select()
        .maybeSingle();
      
      if (userError) throw userError;
      
      // 3. Criar uma instância padrão para o usuário
      const instance = await createUserInstance(userData.id, freePlanId);
      if (!instance) throw new Error('Falha ao criar instância');
      
      // 4. Enviar dados para a API externa
      await sendToExternalAPI({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        instance_id: instance.id
      });
      
      // 5. Atualizar o estado da aplicação
      setUserData({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
      });
      
      setInstanceId(instance.id);
      setShowQRCode(true);
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
      // 1. Login no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      
      if (authError) throw authError;
      
      // 2. Obter dados do usuário
      const userData = await getUserData(authData.user.id);
      
      // 3. Obter a primeira instância do usuário
      const instanceData = await getUserInstance(userData.id);
      
      // 4. Se não existir instância, criar uma
      let instance = instanceData;
      if (!instance) {
        instance = await createUserInstance(userData.id, freePlanId);
        if (!instance) throw new Error('Falha ao criar instância');
      }
      
      // 5. Atualizar o estado da aplicação
      setUserData({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
      });
      
      setInstanceId(instance.id);
      setShowQRCode(true);
      toast.success("Login realizado com sucesso!");
      
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      toast.error(`Falha ao fazer login: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRScanComplete = async (token: string, qrUserData: any) => {
    try {
      if (instanceId) {
        // Atualizar status da instância para "active"
        const { error } = await supabase
          .from('instances')
          .update({ status: 'active' })
          .eq('id', instanceId);
          
        if (error) {
          console.error('Erro ao atualizar status da instância:', error);
        }
      }
      setUserToken(token);
      setUserData(prev => ({
        ...prev!,
        ...qrUserData
      }));
    } catch (error) {
      console.error('Erro ao finalizar scan do QR Code:', error);
    }
  };

  return {
    userData,
    instanceId,
    userToken,
    isLoading,
    showQRCode,
    setFreePlanId,
    handleRegister,
    handleLogin,
    handleQRScanComplete
  };
}
