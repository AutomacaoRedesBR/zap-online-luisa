
import { useState } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { UserInfo } from '@/components/UserInfo';
import { toast } from "sonner";

const Index = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [instanceId, setInstanceId] = useState('');
  const [userToken, setUserToken] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createInstance = async (userData: { name?: string; email: string; phone?: string; password?: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://n8n-editor.teste.onlinecenter.com.br/webhook-test/criar-instancia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar instância');
      }

      const data = await response.json();
      console.log('Resposta da API:', data);
      
      // Supondo que a API retorne um instanceId
      setInstanceId(data.instanceId || 'instance-' + Date.now());
      setShowQRCode(true);
      toast.success("Instância criada com sucesso!");
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      toast.error("Falha ao criar instância. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (data: { email: string; password: string }) => {
    console.log('Login:', data);
    // Envia os dados de login para a API externa
    createInstance({
      email: data.email,
      password: data.password
    });
  };

  const handleRegister = (data: { name: string; email: string; phone: string }) => {
    console.log('Register:', data);
    // Envia os dados de registro para a API externa
    createInstance({
      name: data.name,
      email: data.email,
      phone: data.phone
    });
  };

  const handleQRScanComplete = (token: string, userData: any) => {
    setUserToken(token);
    setUserData(userData);
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
        
        {showQRCode && !userData && (
          <QRCodeDisplay
            instanceId={instanceId}
            onScanComplete={handleQRScanComplete}
          />
        )}
        
        {userData && (
          <UserInfo token={userToken} userData={userData} />
        )}
      </div>
    </div>
  );
};

export default Index;
