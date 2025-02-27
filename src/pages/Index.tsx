
import { useState, useEffect } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { UserInfo } from '@/components/UserInfo';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const PLAN_FREE_ID = ''; // Será preenchido dinamicamente

interface UserData {
  id?: string;
  name: string;
  email: string;
  phone: string;
}

const Index = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [instanceId, setInstanceId] = useState('');
  const [userToken, setUserToken] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [freePlanId, setFreePlanId] = useState('');

  // Carregar o ID do plano gratuito
  useEffect(() => {
    const fetchFreePlan = async () => {
      try {
        const { data, error } = await supabase
          .from('plans')
          .select('id')
          .eq('name', 'Free')
          .single();
        
        if (error) throw error;
        if (data) setFreePlanId(data.id);
      } catch (error) {
        console.error('Erro ao carregar plano gratuito:', error);
      }
    };

    fetchFreePlan();
  }, []);

  const createInstance = async (userId: string) => {
    try {
      // Verificar se existe um plano gratuito
      if (!freePlanId) {
        toast.error("Erro interno: Plano gratuito não encontrado");
        return null;
      }

      // Calcular data de expiração (1 mês a partir de agora)
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);

      // Criar nova instância
      const { data, error } = await supabase
        .from('instances')
        .insert({
          user_id: userId,
          plan_id: freePlanId,
          name: 'Instância Principal',
          expiration_date: expirationDate.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      return null;
    }
  };

  const handleRegister = async (data: { name: string; email: string; phone: string; password: string }) => {
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
      
      // 2. Criar o perfil do usuário no banco de dados
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user?.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
        })
        .select()
        .single();
      
      if (userError) throw userError;
      
      // 3. Criar uma instância padrão para o usuário
      const instance = await createInstance(userData.id);
      if (!instance) throw new Error('Falha ao criar instância');
      
      // 4. Enviar dados para a API externa
      await sendToExternalAPI({
        name: data.name,
        email: data.email,
        phone: data.phone,
        instance_id: instance.id
      });
      
      // 5. Atualizar o estado da aplicação
      setUserData({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone
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

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      // 1. Login no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      
      if (authError) throw authError;
      
      // 2. Obter dados do usuário
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      if (userError) throw userError;
      
      // 3. Obter a primeira instância do usuário
      const { data: instanceData, error: instanceError } = await supabase
        .from('instances')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();
      
      if (instanceError && instanceError.code !== 'PGRST116') { // Ignorar erro de "nenhum resultado"
        throw instanceError;
      }
      
      // 4. Se não existir instância, criar uma
      let instance = instanceData;
      if (!instance) {
        instance = await createInstance(userData.id);
        if (!instance) throw new Error('Falha ao criar instância');
      }
      
      // 5. Atualizar o estado da aplicação
      setUserData({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone
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

  const sendToExternalAPI = async (data: { name: string; email: string; phone: string; instance_id: string }) => {
    try {
      const response = await fetch('https://n8n-editor.teste.onlinecenter.com.br/webhook-test/criar-instancia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar dados para API externa');
      }

      const responseData = await response.json();
      console.log('Resposta da API externa:', responseData);
      
      // Atualizar a instância com a chave da API, se disponível
      if (responseData.apiKey && userData?.id) {
        await supabase
          .from('instances')
          .update({ evo_api_key: responseData.apiKey })
          .eq('id', data.instance_id);
      }
      
      return responseData;
    } catch (error) {
      console.error('Erro ao enviar para API externa:', error);
      throw error;
    }
  };

  const handleQRScanComplete = async (token: string, qrUserData: any) => {
    try {
      if (userData?.id && instanceId) {
        // Atualizar status da instância para "active"
        await supabase
          .from('instances')
          .update({ status: 'active' })
          .eq('id', instanceId);
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

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        {!showQRCode && !userData && (
          isRegistering ? (
            <RegisterForm
              onSubmit={handleRegister}
              onToggleForm={() => setIsRegistering(false)}
              isLoading={isLoading}
            />
          ) : (
            <LoginForm
              onSubmit={handleLogin}
              onToggleForm={() => setIsRegistering(true)}
              isLoading={isLoading}
            />
          )
        )}
        
        {showQRCode && !userToken && (
          <QRCodeDisplay
            instanceId={instanceId}
            onScanComplete={handleQRScanComplete}
          />
        )}
        
        {userData && userToken && (
          <UserInfo token={userToken} userData={userData} />
        )}
      </div>
    </div>
  );
};

export default Index;
