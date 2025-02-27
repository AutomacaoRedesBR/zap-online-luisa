
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, Plus } from 'lucide-react';
import { toast } from "sonner";

interface HomeProps {
  userData: {
    id?: string;
    name: string;
    email: string;
    phone?: string;
  };
  onLogout: () => void;
}

const Home = ({ userData, onLogout }: HomeProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      onLogout();
      toast.success("Logout realizado com sucesso!");
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error("Erro ao fazer logout");
    }
  };

  const handleCreateInstance = () => {
    toast.info("Funcionalidade em desenvolvimento");
    // Aqui você implementaria a lógica para criar uma instância
  };

  const handleViewProfile = () => {
    toast.info("Funcionalidade em desenvolvimento");
    // Aqui você implementaria a lógica para visualizar o perfil
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-4xl glass-card fade-in mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Bem-vindo, {userData.name}</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={handleCreateInstance} className="h-24 flex flex-col items-center justify-center gap-2">
              <Plus className="h-8 w-8" />
              <span>Criar Instância</span>
            </Button>
            
            <Button onClick={handleViewProfile} variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
              <User className="h-8 w-8" />
              <span>Meu Perfil</span>
            </Button>
            
            <Button onClick={handleLogout} variant="secondary" className="h-24 flex flex-col items-center justify-center gap-2">
              <LogOut className="h-8 w-8" />
              <span>Sair</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
