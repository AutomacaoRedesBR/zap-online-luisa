
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "@/hooks/useAuth";
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
