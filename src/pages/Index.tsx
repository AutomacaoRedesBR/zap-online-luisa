
import { useEffect, useState } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { RegistrationSuccess } from '@/components/RegistrationSuccess';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { 
    userData, 
    isLoading, 
    registrationSuccessful,
    isLoggedIn,
    handleRegister, 
    handleLogin,
    resetRegistrationState
  } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();

  // Verificar se o usuário já está logado ao iniciar (apenas uma vez)
  useEffect(() => {
    if (isLoggedIn && userData && !isAuthenticating) {
      console.log("Login - Já está autenticado, redirecionando para Dashboard");
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, userData, navigate, isAuthenticating]);

  const handleBackToLogin = () => {
    setIsRegistering(false);
    resetRegistrationState();
  };

  const processLogin = async (data: { email: string; password: string }) => {
    setIsAuthenticating(true);
    try {
      console.log("Login - Iniciando processo de login");
      const success = await handleLogin(data);
      
      if (success) {
        console.log("Login - Login bem-sucedido, redirecionando...");
        navigate('/dashboard', { replace: true });
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Se estiver autenticando, mostra um estado de loading
  if (isAuthenticating) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Autenticando...</p>
        </div>
      </div>
    );
  }

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
