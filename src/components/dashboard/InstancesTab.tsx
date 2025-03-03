
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Settings, Copy, Eye, Trash, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInstances, Instance } from "@/services/instanceService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface InstancesTabProps {
  onCreateNew: () => void;
}

export const InstancesTab = ({ onCreateNew }: InstancesTabProps) => {
  const { userData } = useAuth();
  const [isManuallyRefetching, setIsManuallyRefetching] = useState(false);
  
  const { data: instances, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['instances', userData?.id],
    queryFn: () => {
      // Sempre tenta buscar usando o ID do localStorage (dentro da função fetchUserInstances)
      console.log('Executando query para buscar instâncias do usuário:', userData?.id);
      return fetchUserInstances(userData?.id || '');
    },
    enabled: true, // Sempre habilitado, pois fetchUserInstances irá verificar localStorage
    refetchOnWindowFocus: true,
    retry: 2,
    staleTime: 30000, // 30 segundos
  });

  useEffect(() => {
    console.log('Iniciando busca de instâncias para usuário:', userData?.id);
    refetch();
  }, [userData?.id, refetch]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência!");
  };

  const handleDelete = (instanceId: string) => {
    // Implementar função de delete posteriormente
    console.log("Delete instance:", instanceId);
    toast.success("Função de exclusão será implementada em breve!");
  };

  const handleManualRefetch = async () => {
    setIsManuallyRefetching(true);
    try {
      console.log('Iniciando refresh manual das instâncias...');
      await refetch();
      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      toast.error("Falha ao atualizar dados. Tente novamente.");
    } finally {
      setIsManuallyRefetching(false);
    }
  };

  if (isLoading || isManuallyRefetching) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-gray-500">Carregando suas instâncias...</p>
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
            <Button 
              onClick={handleManualRefetch} 
              disabled={isRefetching}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  console.log("Instâncias recebidas:", instances);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Minhas Instâncias</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleManualRefetch}
            disabled={isRefetching}
            title="Atualizar dados"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={onCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Instância
          </Button>
        </div>
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
