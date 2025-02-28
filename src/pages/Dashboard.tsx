
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "@/services/planService";
import { createInstanceForUser } from "@/services/instanceApiService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UserInfo } from "@/components/UserInfo";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { InstancesTab } from "@/components/dashboard/InstancesTab";
import { CreateInstanceDialog } from "@/components/dashboard/CreateInstanceDialog";
import { isValidUUID } from "@/utils/validationUtils";

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

    // Verificar se o userData existe e tem um ID válido
    if (!userData || !userData.id) {
      console.error("Dados do usuário ausentes ou ID inválido:", userData);
      toast.error("ID do usuário não disponível. Por favor, faça login novamente.");
      return;
    }

    // Verificar se o ID do usuário é um UUID válido
    if (!isValidUUID(userData.id)) {
      console.error("ID do usuário não é um UUID válido:", userData.id);
      toast.error("ID do usuário inválido. Por favor, faça login novamente.");
      return;
    }

    console.log("Criando instância com ID de usuário:", userData.id);
    
    setIsCreatingInstance(true);
    try {
      // Verificar mais uma vez se o ID não é vazio antes de enviar
      if (!userData.id || userData.id.trim() === "") {
        throw new Error("ID do usuário está vazio");
      }
      
      console.log("Confirmação - userData:", userData);
      console.log("Confirmação - ID para criação de instância:", userData.id);
      
      const result = await createInstanceForUser({
        userId: userData.id, // Garantir que este ID está sendo passado corretamente
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
        <DashboardHeader
          userData={userData}
          onProfileClick={() => setShowProfileDialog(true)}
          onCreateNew={handleCreateNew}
          onLogout={handleLogoutClick}
        />

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="instances">Minhas Instâncias</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab userData={userData} onCreateNew={handleCreateNew} />
          </TabsContent>

          <TabsContent value="instances" className="space-y-6">
            <InstancesTab onCreateNew={handleCreateNew} />
          </TabsContent>
        </Tabs>
      </div>

      <CreateInstanceDialog
        open={showCreateInstanceDialog}
        onOpenChange={setShowCreateInstanceDialog}
        instanceName={instanceName}
        onInstanceNameChange={setInstanceName}
        selectedPlanId={selectedPlanId}
        onPlanSelect={setSelectedPlanId}
        isCreatingInstance={isCreatingInstance}
        onCreateInstance={handleCreateInstance}
        plans={plans}
        isLoadingPlans={isLoadingPlans}
        qrCodeData={qrCodeData}
        instanceId={instanceId}
      />

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
