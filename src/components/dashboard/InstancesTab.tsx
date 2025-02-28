
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Settings, Copy, Eye, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInstances, Instance } from "@/services/instanceService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface InstancesTabProps {
  onCreateNew: () => void;
}

export const InstancesTab = ({ onCreateNew }: InstancesTabProps) => {
  const { userData } = useAuth();
  
  const { data: instances, isLoading, error, refetch } = useQuery({
    queryKey: ['instances', userData?.id],
    queryFn: () => fetchUserInstances(userData?.id || ''),
    enabled: !!userData?.id,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (userData?.id) {
      console.log('Iniciando busca de instâncias para usuário:', userData.id);
      refetch();
    }
  }, [userData?.id, refetch]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência!");
  };

  const handleDelete = (instanceId: string) => {
    // Implementar função de delete posteriormente
    console.log("Delete instance:", instanceId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Erro ao carregar instâncias. Por favor, tente novamente.
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={() => refetch()}>Tentar novamente</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Minhas Instâncias</h2>
        <Button onClick={onCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Instância
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {instances && instances.length > 0 ? (
          instances.map((instance: Instance) => (
            <Card key={instance.id} className="bg-[#1a1a1a] text-white">
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg">{instance.name}</h3>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>

                <div className="bg-[#2a2a2a] p-3 rounded-md flex items-center justify-between">
                  <div className="flex-1 font-mono text-sm truncate pr-2">
                    {instance.evo_api_key}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(instance.evo_api_key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-3 py-1 rounded-full text-sm ${
                        instance.status === 'connected' 
                          ? 'bg-emerald-500/20 text-emerald-500'
                          : instance.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {instance.status.charAt(0).toUpperCase() + instance.status.slice(1)}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(instance.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">Nenhuma instância encontrada.</p>
              <Button onClick={onCreateNew} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Criar Nova Instância
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
