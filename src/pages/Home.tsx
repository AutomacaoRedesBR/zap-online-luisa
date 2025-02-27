
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Plus, Briefcase, Settings, Bell, Calendar, Server, MessageSquare, HelpCircle } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState("dashboard");

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
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r p-4 space-y-6">
        <div className="flex items-center space-x-2">
          <Server className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold">Techify</h2>
        </div>
        
        <div className="flex flex-col space-y-1">
          <Button 
            variant={activeTab === "dashboard" ? "default" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab("dashboard")}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button 
            variant={activeTab === "profile" ? "default" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab("profile")}
          >
            <User className="mr-2 h-4 w-4" />
            Meu Perfil
          </Button>
          <Button 
            variant={activeTab === "instances" ? "default" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab("instances")}
          >
            <Server className="mr-2 h-4 w-4" />
            Instâncias
          </Button>
          <Button 
            variant={activeTab === "messages" ? "default" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab("messages")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Mensagens
            <Badge className="ml-auto" variant="secondary">5</Badge>
          </Button>
          <Button 
            variant={activeTab === "calendar" ? "default" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab("calendar")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Calendário
          </Button>
          <Button 
            variant={activeTab === "settings" ? "default" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Button>
          <Button 
            variant={activeTab === "help" ? "default" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab("help")}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Ajuda
          </Button>
        </div>
        
        <div className="mt-auto">
          <Separator className="my-4" />
          <div className="flex items-center space-x-2 mb-4">
            <Avatar>
              <AvatarImage src={`https://ui-avatars.com/api/?name=${userData.name}`} />
              <AvatarFallback>{userData.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{userData.name}</p>
              <p className="text-xs text-gray-500">{userData.email}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex md:hidden items-center space-x-2">
            <Server className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold">Techify</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="md:hidden">
              <Avatar>
                <AvatarImage src={`https://ui-avatars.com/api/?name=${userData.name}`} />
                <AvatarFallback>{userData.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4">
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="dashboard" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Bem-vindo(a), {userData.name}!</CardTitle>
                    <CardDescription>
                      Veja um resumo da sua conta e atividades.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium">{userData.email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Status da conta:</span>
                        <Badge>Ativo</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Último acesso:</span>
                        <span className="font-medium">Hoje</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Instâncias</CardTitle>
                    <CardDescription>
                      Gerencie seus serviços ativos.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-3">Você ainda não possui instâncias ativas.</p>
                      <Button onClick={handleCreateInstance}>
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Instância
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Alertas</CardTitle>
                    <CardDescription>
                      Notificações importantes do sistema.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[180px]">
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-start gap-2 pb-3 border-b last:border-0">
                            <div className="rounded-full bg-blue-100 p-1">
                              <Bell className="h-3 w-3 text-blue-700" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Alerta de sistema #{i}</p>
                              <p className="text-xs text-gray-500">
                                Temos novidades sobre nossos planos de serviço!
                              </p>
                              <p className="text-xs text-gray-400 mt-1">Há {i} dia{i > 1 ? 's' : ''}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Ações rápidas</CardTitle>
                  <CardDescription>
                    Acesse as principais funcionalidades da plataforma.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button onClick={handleCreateInstance} className="h-24 flex flex-col items-center justify-center gap-2">
                      <Server className="h-8 w-8" />
                      <span>Nova Instância</span>
                    </Button>
                    
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                      <MessageSquare className="h-8 w-8" />
                      <span>Suporte</span>
                    </Button>
                    
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                      <User className="h-8 w-8" />
                      <span>Meu Perfil</span>
                    </Button>
                    
                    <Button variant="secondary" onClick={handleLogout} className="h-24 flex flex-col items-center justify-center gap-2">
                      <LogOut className="h-8 w-8" />
                      <span>Sair</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Meu Perfil</CardTitle>
                  <CardDescription>
                    Gerencie suas informações pessoais e preferências.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${userData.name}&size=92`} />
                      <AvatarFallback className="text-2xl">{userData.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold">{userData.name}</h3>
                    <Badge>Usuário Premium</Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Informações da Conta</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{userData.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="font-medium">{userData.phone || "Não informado"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Alterar senha</Button>
                  <Button>Editar perfil</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="instances">
              <Card>
                <CardHeader>
                  <CardTitle>Minhas Instâncias</CardTitle>
                  <CardDescription>
                    Gerencie suas instâncias e serviços ativos.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <Server className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma instância encontrada</h3>
                  <p className="text-gray-500 mb-6">
                    Você ainda não possui instâncias ativas. Crie uma nova instância para começar.
                  </p>
                  <Button onClick={handleCreateInstance}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Instância
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Mensagens</CardTitle>
                  <CardDescription>
                    Gerencie suas mensagens e comunicações.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-start gap-3 pb-4 border-b last:border-0">
                          <Avatar>
                            <AvatarImage src={`https://ui-avatars.com/api/?name=Suporte&background=random`} />
                            <AvatarFallback>S</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">Equipe de Suporte</h4>
                              <span className="text-xs text-gray-500">há {i} hora{i > 1 ? 's' : ''}</span>
                            </div>
                            <p className="text-sm">
                              Olá! Estamos aqui para ajudar com qualquer dúvida sobre a plataforma.
                            </p>
                            <div className="flex items-center space-x-2 pt-1">
                              <Button variant="outline" size="sm">Responder</Button>
                              <Button variant="ghost" size="sm">Marcar como lido</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                  <CardDescription>
                    Gerencie as configurações da sua conta.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Notificações por email</h4>
                        <p className="text-sm text-gray-500">Receba atualizações por email</p>
                      </div>
                      <Button variant="outline">Configurar</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Privacidade</h4>
                        <p className="text-sm text-gray-500">Gerencie suas configurações de privacidade</p>
                      </div>
                      <Button variant="outline">Configurar</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Segurança</h4>
                        <p className="text-sm text-gray-500">Defina suas opções de segurança</p>
                      </div>
                      <Button variant="outline">Configurar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="help">
              <Card>
                <CardHeader>
                  <CardTitle>Central de Ajuda</CardTitle>
                  <CardDescription>
                    Encontre respostas para suas dúvidas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Como criar uma instância?</h4>
                        <p className="text-sm text-gray-500">
                          Para criar uma instância, acesse a seção "Instâncias" e clique no botão "Criar Instância".
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Como alterar minha senha?</h4>
                        <p className="text-sm text-gray-500">
                          Acesse seu perfil, clique em "Alterar senha" e siga as instruções na tela.
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Como contatar o suporte?</h4>
                        <p className="text-sm text-gray-500">
                          Você pode contatar nosso suporte através da seção "Mensagens" ou enviar um email para suporte@techify.com.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Contatar Suporte</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Home;
