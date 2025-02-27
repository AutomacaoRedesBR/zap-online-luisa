
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface InstancesTabProps {
  onCreateNew: () => void;
}

export const InstancesTab = ({ onCreateNew }: InstancesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Instâncias</CardTitle>
        <CardDescription>
          Gerencie suas instâncias criadas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <Button onClick={onCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Nova Instância
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
