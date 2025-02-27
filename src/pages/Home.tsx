
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Globe, Users, Rocket, BarChart3 } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Zap Online</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium">Home</Link>
            <Link to="#features" className="text-sm font-medium">Recursos</Link>
            <Link to="#pricing" className="text-sm font-medium">Planos</Link>
            <Link to="#about" className="text-sm font-medium">Sobre nós</Link>
          </nav>
          <div>
            <Link to="/login">
              <Button>Entrar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container px-4 md:px-6 flex flex-col items-center text-center">
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Zap Online
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-[600px] mx-auto">
              Conecte múltiplos números de WhatsApp e envie mensagens através de nossa API simples e eficiente.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/login">
              <Button size="lg" className="h-12">Começar agora</Button>
            </Link>
            <Link to="#features">
              <Button size="lg" variant="outline" className="h-12">Saiba mais</Button>
            </Link>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Múltiplos Números</h3>
                <p className="text-muted-foreground">Conecte e gerencie vários números de WhatsApp em uma única interface.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Globe className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">API Simples</h3>
                <p className="text-muted-foreground">Integre facilmente com seu sistema usando nossa API de baixo código.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Rocket className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Inteligência Artificial</h3>
                <p className="text-muted-foreground">Automatize suas mensagens com recursos avançados de IA.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Escolha seu plano</h2>
            <p className="text-muted-foreground md:text-xl max-w-[700px]">
              Temos opções para todos os tamanhos de negócios
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="flex flex-col">
              <div className="p-6 pb-4 flex flex-col items-center text-center space-y-4">
                <h3 className="text-2xl font-bold">Free</h3>
                <div className="text-4xl font-bold">R$0<span className="text-base font-normal text-muted-foreground">/mês</span></div>
                <p className="text-muted-foreground">Para iniciantes e testes</p>
              </div>
              <CardContent className="flex flex-col items-center text-center space-y-2 p-6">
                <ul className="space-y-2 w-full text-left">
                  <li className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    1 número de WhatsApp
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    100 mensagens/mês
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Suporte básico
                  </li>
                </ul>
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full mt-4">Começar grátis</Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Basic Plan */}
            <Card className="flex flex-col border-primary">
              <div className="p-6 pb-4 flex flex-col items-center text-center space-y-4 bg-primary/5 rounded-t-lg">
                <div className="text-sm font-medium text-primary rounded-full px-3 py-1 bg-primary/10">Popular</div>
                <h3 className="text-2xl font-bold">Basic</h3>
                <div className="text-4xl font-bold">R$49<span className="text-base font-normal text-muted-foreground">/mês</span></div>
                <p className="text-muted-foreground">Para pequenas empresas</p>
              </div>
              <CardContent className="flex flex-col items-center text-center space-y-2 p-6">
                <ul className="space-y-2 w-full text-left">
                  <li className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    5 números de WhatsApp
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    1.000 mensagens/mês
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Recursos de automação
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Suporte prioritário
                  </li>
                </ul>
                <Link to="/login" className="w-full">
                  <Button className="w-full mt-4">Assinar agora</Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Pro Plan */}
            <Card className="flex flex-col">
              <div className="p-6 pb-4 flex flex-col items-center text-center space-y-4">
                <h3 className="text-2xl font-bold">Pro</h3>
                <div className="text-4xl font-bold">R$99<span className="text-base font-normal text-muted-foreground">/mês</span></div>
                <p className="text-muted-foreground">Para empresas em crescimento</p>
              </div>
              <CardContent className="flex flex-col items-center text-center space-y-2 p-6">
                <ul className="space-y-2 w-full text-left">
                  <li className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Números ilimitados
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    5.000 mensagens/mês
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Recursos de IA avançados
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    API personalizada
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Suporte 24/7
                  </li>
                </ul>
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full mt-4">Contate vendas</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-secondary/10 to-primary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Sobre a Techify</h2>
              <p className="text-muted-foreground md:text-lg">
                A Techify é uma empresa especializada em desenvolvimento de soluções com low code e Inteligência Artificial. 
                Nossa missão é simplificar processos complexos através de tecnologia acessível e intuitiva.
              </p>
              <p className="text-muted-foreground md:text-lg">
                Nosso produto principal, o Zap Online, foi desenvolvido para facilitar a comunicação via WhatsApp para empresas de todos os tamanhos, 
                permitindo gerenciar múltiplos números e automatizar mensagens sem complicações.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative h-80 w-80 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarChart3 className="h-24 w-24 text-primary/80" />
                </div>
                <div className="absolute top-0 right-0 p-3 bg-white rounded-full shadow-lg">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute bottom-8 left-0 p-3 bg-white rounded-full shadow-lg">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute top-10 left-10 p-3 bg-white rounded-full shadow-lg">
                  <Rocket className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-8">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">Zap Online</span>
            <span className="text-sm text-muted-foreground">por Techify</span>
          </div>
          <div className="flex gap-4">
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Termos de Uso
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacidade
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contato
            </Link>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
            &copy; 2023 Techify. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
