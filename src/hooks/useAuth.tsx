
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
      await sendToExternalAPI({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        instance_id: tempInstanceId
      });
      
      // 4. Atualizar o estado da aplicação com os dados do usuário
      setUserData({
        id: authData.user.id,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
      });
      
      setInstanceId(tempInstanceId);
      setShowQRCode(true);
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
        // Para novos usuários, não precisamos atualizar o status no Supabase
        // já que não estamos criando a instância lá
        console.log('QR Code escaneado com sucesso para a instância:', instanceId);
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
