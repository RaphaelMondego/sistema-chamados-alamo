import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Chamados from "./pages/Chamados";
import NovoChamado from "./pages/NovoChamado";
import Usuarios from "./pages/Usuarios";
import NotFound from "./pages/NotFound";
// NOVAS IMPORTS
import TicketDetalhes from "./pages/TicketDetalhes"; 
import TicketEdicao from "./pages/TicketEdicao"; 

const queryClient = new QueryClient();

// --- Componente de Roteamento ---
function AppRoutes() {
    const { user, isLoading } = useAuth();
    
    if (isLoading) {
        // Exibir tela de carregamento enquanto verifica o token
        return (
            <div className="flex justify-center items-center h-screen text-xl text-primary">
                Carregando Sistema...
            </div>
        );
    }

    if (user) {
        // Rotas Protegidas (Acessíveis se 'user' existir)
        return (
            <Layout>
                <Routes>
                    {/* Rotas principais, incluindo a raiz que redireciona */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/chamados" element={<Chamados />} />
                    <Route path="/chamados/novo" element={<NovoChamado />} />
                    
                    {/* ROTAS DE DETALHES E EDIÇÃO CORRIGIDAS */}
                    {/* Visualizar um chamado específico: /chamados/123 */}
                    <Route path="/chamados/:id" element={<TicketDetalhes />} /> 
                    {/* Editar um chamado específico: /chamados/editar/123 */}
                    <Route path="/chamados/editar/:id" element={<TicketEdicao />} /> 

                    <Route path="/usuarios" element={<Usuarios />} />
                    
                    {/* Bloquear acesso às páginas de autenticação se já estiver logado */}
                    <Route path="/login" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/registro" element={<Navigate to="/dashboard" replace />} />
                    
                    {/* Rota de fallback para 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        );
    }

    // Rotas Públicas (Acessíveis se 'user' for nulo)
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            
            {/* Qualquer outra rota (incluindo /, /dashboard, /chamados) redireciona para login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

const App = () => (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </TooltipProvider>
        </AuthProvider>
    </QueryClientProvider>
);

export default App;
