
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

const App = () => {
  const { userData, isLoggedIn, handleLogout } = useAuth();

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
            <Route 
              path="/dashboard" 
              element={
                isLoggedIn ? (
                  <div className="min-h-screen w-full flex items-center justify-center">
                    <h1 className="text-4xl font-bold">Dashboard (Área Logada)</h1>
                    <Button 
                      onClick={handleLogout} 
                      className="ml-4"
                      variant="destructive"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Navigate to="/login" replace />
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
