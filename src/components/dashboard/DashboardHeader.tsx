
import { Button } from "@/components/ui/button";
import { UserIcon, LogOut, Plus, User } from "lucide-react";
import { UserData } from "@/services/authService";

interface DashboardHeaderProps {
  userData: UserData | null;
  onProfileClick: () => void;
  onCreateNew: () => void;
  onLogout: () => void;
}

export const DashboardHeader = ({
  userData,
  onProfileClick,
  onCreateNew,
  onLogout
}: DashboardHeaderProps) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-lg shadow-sm mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bem-vindo, {userData?.name || "Usuário"}!</p>
      </div>
      <div className="flex mt-4 md:mt-0 gap-2">
        <Button variant="outline" onClick={onProfileClick}>
          <User className="mr-2 h-4 w-4" />
          Meu Perfil
        </Button>
        <Button variant="outline" onClick={onCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Instância
        </Button>
        <Button variant="destructive" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
};
