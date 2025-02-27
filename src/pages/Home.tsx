
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from 'lucide-react';
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

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-4xl glass-card fade-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Seja bem vindo a Techify</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-lg text-gray-600 mb-6">
            Obrigado por fazer login, {userData.name}!
          </p>
          <Button onClick={handleLogout} variant="secondary">Sair</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
