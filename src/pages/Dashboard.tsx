
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { fetchPlans, createInstanceForUser } from "@/services/instanceService";
import { toast } from "sonner";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { UserInfo } from "@/components/UserInfo";
import { Separator } from "@/components/ui/separator";
import { UserIcon, LogOut, Plus, User } from "lucide-react";

const Dashboard = () => {
  const { userData, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateInstanceDialog, setShowCreateInstanceDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [instanceName, setInstanceName] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [isCreatingInstance, setIsCreatingInstance] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [instanceId, setInstanceId] = useState<string | null>(null);

  // Buscar planos disponíveis
  const { data: plans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login", { replace: true });
  };

  const handleCreateInstance = async () => {
    if (!instanceName) {
      toast.error("Por favor, insira um nome para a instância");
      return;
    }

    if (!selectedPlanId) {
      toast.error("Por favor, selecione um plano");
      return;
    }

    setIsCreatingInstance(true);
    try {
      const result = await createInstanceForUser({
        userId: userData?.id || "",
        name: instanceName,
        planId: selectedPlanId
      });
      
      if (result && result.qrCode && result.instanceId) {
        setQrCodeData(result.qrCode);
        setInstanceId(result.instanceId);
        toast.success("Instância criada com sucesso!");
      } else {
        throw new Error("Resposta inválida da API");
      }
    } catch (error: any) {
      console.error("Erro ao criar instância:", error);
      toast.error(`Falha ao criar instância: ${error.message}`);
    } finally {
      setIsCreatingInstance(false);
    }
  };

  const handleCreateNew = () => {
    setQrCodeData(null);
    setInstanceId(null);
    setInstanceName("");
    setSelectedPlanId("");
    setShowCreateInstanceDialog(true);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-lg shadow-sm mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Bem-vindo, {userData?.name || "Usuário"}!</p>
          </div>
          <div className="flex mt-4 md:mt-0 gap-2">
            <Button variant="outline" onClick={() => setShowProfileDialog(true)}>
              <User className="mr-2 h-4 w-4" />
              Meu Perfil
            </Button>
            <Button variant="outline" onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Instância
            </Button>
            <Button variant="destructive" onClick={handleLogoutClick}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="instances">Minhas Instâncias</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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
                <Button className="w-full" onClick={handleCreateNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Nova Instância
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="instances" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Minhas Instâncias</CardTitle>
                <CardDescription>
                  Gerencie suas instâncias criadas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Button onClick={handleCreateNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Nova Instância
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Diálogo para criar instância */}
      <Dialog open={showCreateInstanceDialog} onOpenChange={setShowCreateInstanceDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Criar Nova Instância</DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para criar uma nova instância.
            </DialogDescription>
          </DialogHeader>

          {qrCodeData && instanceId ? (
            <div className="py-4">
              <h3 className="text-lg font-medium mb-4 text-center">Escaneie o QR Code para ativar sua instância</h3>
              <QRCodeDisplay 
                qrCodeData={qrCodeData} 
                instanceId={instanceId} 
              />
              <p className="text-sm text-gray-500 mt-4 text-center">
                ID da instância: {instanceId}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome da Instância</Label>
                <Input
                  id="name"
                  placeholder="Ex: Minha Instância Principal"
                  value={instanceName}
                  onChange={(e) => setInstanceName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan">Plano</Label>
                <Select 
                  value={selectedPlanId} 
                  onValueChange={setSelectedPlanId}
                  disabled={isLoadingPlans}
                >
                  <SelectTrigger id="plan">
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingPlans ? (
                      <SelectItem value="loading" disabled>Carregando planos...</SelectItem>
                    ) : (
                      plans?.filter(plan => plan.name !== 'Free').map(plan => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} {plan.description ? `- ${plan.description}` : ''}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            {qrCodeData ? (
              <Button onClick={() => setShowCreateInstanceDialog(false)}>
                Concluído
              </Button>
            ) : (
              <Button onClick={handleCreateInstance} disabled={isCreatingInstance}>
                {isCreatingInstance ? 'Criando...' : 'Criar Instância'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para exibir perfil */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Meu Perfil</DialogTitle>
            <DialogDescription>
              Detalhes da sua conta
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <UserInfo 
              name={userData?.name || ''} 
              email={userData?.email || ''} 
              id={userData?.id || ''} 
              phone={userData?.phone || ''} 
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowProfileDialog(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
