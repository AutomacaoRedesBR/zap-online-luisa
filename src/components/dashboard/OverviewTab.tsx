
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserIcon, Plus } from "lucide-react";
import { UserData } from "@/services/authService";

interface OverviewTabProps {
  userData: UserData | null;
  onCreateNew: () => void;
}

export const OverviewTab = ({ userData, onCreateNew }: OverviewTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bem-vindo ao seu painel</CardTitle>
        <CardDescription>
          Este é seu painel de controle, onde você pode gerenciar suas instâncias.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="rounded-xl bg-primary/10 p-6">
            <div className="flex items-center gap-4">
              <UserIcon className="h-12 w-12 text-primary" />
              <div>
                <h3 className="text-xl font-semibold">{userData?.name}</h3>
                <p className="text-gray-500">{userData?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Nova Instância
        </Button>
      </CardFooter>
    </Card>
  );
};
