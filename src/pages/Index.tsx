
import { useEffect, useState } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { UserInfo } from '@/components/UserInfo';
import { fetchFreePlan } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { 
    userData, 
    instanceId, 
    userToken, 
    isLoading, 
    showQRCode,
    setFreePlanId, 
    handleRegister, 
    handleLogin, 
    handleQRScanComplete 
  } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);

  // Carregar o ID do plano gratuito
  useEffect(() => {
    const loadFreePlan = async () => {
      const planId = await fetchFreePlan();
      if (planId) setFreePlanId(planId);
    };

    loadFreePlan();
  }, [setFreePlanId]);

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
