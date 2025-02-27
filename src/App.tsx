
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();

const App = () => {
  const { userData, isLoggedIn, handleLogout } = useAuth();

  // Log para depuração do estado de autenticação
  useEffect(() => {
    console.log("Estado de autenticação:", { isLoggedIn, userData });
  }, [isLoggedIn, userData]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                isLoggedIn ? (
                  <Navigate to="/home" replace={true} />
                ) : (
                  <Index />
                )
              } 
            />
            <Route 
              path="/home" 
              element={
                isLoggedIn ? (
                  <Home 
                    userData={userData!}
                    onLogout={handleLogout}
                  />
                ) : (
                  <Navigate to="/" replace={true} />
                )
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
