
import { useEffect, useState } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { RegistrationSuccess } from '@/components/RegistrationSuccess';
import { fetchFreePlan } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { 
    userData, 
    isLoading, 
    registrationSuccessful,
    isLoggedIn,
    setFreePlanId, 
    handleRegister, 
    handleLogin,
    resetRegistrationState
  } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  // Carregar o ID do plano gratuito
  useEffect(() => {
    const loadFreePlan = async () => {
      const planId = await fetchFreePlan();
      if (planId) setFreePlanId(planId);
    };

    loadFreePlan();
  }, [setFreePlanId]);

  // Redirecionar para a página home se o usuário estiver logado
  useEffect(() => {
    if (isLoggedIn && userData) {
      navigate('/home');
    }
  }, [isLoggedIn, userData, navigate]);

  const handleBackToLogin = () => {
    setIsRegistering(false);
    resetRegistrationState();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        {registrationSuccessful ? (
          <RegistrationSuccess onBackToLogin={handleBackToLogin} />
        ) : (
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
      </div>
    </div>
  );
};

export default Index;
