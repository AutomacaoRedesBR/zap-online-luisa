
import { useState } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { UserInfo } from '@/components/UserInfo';

const Index = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [instanceId, setInstanceId] = useState('');
  const [userToken, setUserToken] = useState('');
  const [userData, setUserData] = useState<any>(null);

  const handleLogin = (data: { email: string; password: string }) => {
    console.log('Login:', data);
    // Aqui você deve integrar com a API do Evolution Manager
    setInstanceId('instance-123');
    setShowQRCode(true);
  };

  const handleRegister = (data: { name: string; email: string; phone: string }) => {
    console.log('Register:', data);
    // Aqui você deve integrar com a API do Evolution Manager
    setInstanceId('instance-123');
    setShowQRCode(true);
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
            />
          ) : (
            <LoginForm
              onSubmit={handleLogin}
              onToggleForm={() => setIsRegistering(true)}
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
