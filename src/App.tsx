
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Criar um componente separado para proteger rotas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, authInitialized } = useAuth();
  const location = useLocation();
  
  // Se a autenticação ainda não foi inicializada, mostrar um loading
  if (!authInitialized) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Se não estiver logado, redirecionar para login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Se estiver logado, mostrar o conteúdo protegido
  return <>{children}</>;
};

// Componente de Dashboard separado
const Dashboard = () => {
  const { userData, handleLogout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogoutClick = () => {
    handleLogout();
    // Redirecionar para a página de login após o logout
    navigate('/login', { replace: true });
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <div className="flex items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard (Área Logada)</h1>
        <Button 
          onClick={handleLogoutClick} 
          className="ml-4"
          variant="destructive"
        >
          Logout
        </Button>
      </div>
      {userData && (
        <div className="bg-secondary/10 p-6 rounded-lg max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">Informações do Usuário</h2>
          <p><strong>Nome:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>ID:</strong> {userData.id}</p>
        </div>
      )}
    </div>
  );
};

// Componente principal da aplicação
const App = () => {
  const { isLoggedIn, authInitialized } = useAuth();
  
  useEffect(() => {
    console.log("App - Estado de autenticação:", { isLoggedIn, authInitialized });
  }, [isLoggedIn, authInitialized]);

  // Se a autenticação ainda não foi inicializada, mostrar um loading
  if (!authInitialized) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            
            <Route path="/login" element={
              isLoggedIn ? <Navigate to="/dashboard" replace /> : <Index />
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
