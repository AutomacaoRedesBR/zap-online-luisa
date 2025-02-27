
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

  // Verificar se o usuário está logado e redirecionar se estiver
  useEffect(() => {
    if (isLoggedIn && userData) {
      navigate('/home', { replace: true });
    }
  }, [isLoggedIn, userData, navigate]);

  const handleBackToLogin = () => {
    setIsRegistering(false);
    resetRegistrationState();
  };

  // Função para processar o login com redirecionamento
  const processLogin = async (data: { email: string; password: string }) => {
    const success = await handleLogin(data);
    // Não precisamos redirecionar aqui, pois o useAuth já cuida disso
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
              onSubmit={processLogin}
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
