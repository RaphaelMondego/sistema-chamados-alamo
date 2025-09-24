import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Ticket, Clock, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api"; // Assumindo que este é o seu hook de API
import { useToast } from "@/hooks/use-toast";

// Interface para as tags (assumindo que o backend retorna {id, nome})
interface Tag {
  id: string;
  nome: string;
}

interface DashboardStats {
  totalChamados: number;
  chamadosAbertos: number;
  chamadosEmAndamento: number;
  chamadosResolvidos: number;
}

interface ChamadoRecente {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  createdAt: string;
  tags?: Tag[]; // Corrigido para ser um array de objetos Tag
}

// ... (Resto das funções getStatusBadge e getPriorityBadge)
const getStatusBadge = (status: string) => {
  const statusMap = {
    aberto: { variant: "status-open" as const, label: "Aberto" },
    em_andamento: { variant: "status-progress" as const, label: "Em Andamento" },
    resolvido: { variant: "status-resolved" as const, label: "Resolvido" },
    fechado: { variant: "status-closed" as const, label: "Fechado" },
  };
  const config = statusMap[status as keyof typeof statusMap] || { variant: "default" as const, label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getPriorityBadge = (prioridade: string) => {
  const prioridadeMap = {
    baixa: { variant: "priority-low" as const, label: "Baixa" },
    media: { variant: "priority-medium" as const, label: "Média" },
    alta: { variant: "priority-high" as const, label: "Alta" },
    urgente: { variant: "priority-urgent" as const, label: "Urgente" },
  };
  const config = prioridadeMap[prioridade as keyof typeof prioridadeMap] || { variant: "default" as const, label: prioridade };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
// ...

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalChamados: 0,
    chamadosAbertos: 0,
    chamadosEmAndamento: 0,
    chamadosResolvidos: 0,
  });
  const [chamadosRecentes, setChamadosRecentes] = useState<ChamadoRecente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Nota: Sua API deve retornar um array direto de chamados.
      const response = await api.get('/chamados');
      const chamados = response.data;

      // Calcular estatísticas
      const stats = {
        totalChamados: chamados.length,
        chamadosAbertos: chamados.filter((c: any) => c.status === 'aberto').length,
        chamadosEmAndamento: chamados.filter((c: any) => c.status === 'em_andamento').length,
        chamadosResolvidos: chamados.filter((c: any) => c.status === 'resolvido').length,
      };

      setStats(stats);
      
      // Últimos 5 chamados
      const recentes = chamados
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      setChamadosRecentes(recentes);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do dashboard.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    // ... (Loading state JSX)
    return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-3">
                  <div className="h-4 bg-muted rounded w-24"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-16"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/chamados/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Chamado
          </Link>
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Chamados</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChamados}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abertos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.chamadosAbertos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.chamadosEmAndamento}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolvidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.chamadosResolvidos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Chamados Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Chamados Recentes</CardTitle>
          <CardDescription>
            Últimos chamados criados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chamadosRecentes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Ticket className="mx-auto h-12 w-12 mb-4" />
              <p>Nenhum chamado encontrado</p>
              <Button asChild className="mt-4">
                <Link to="/chamados/novo">Criar primeiro chamado</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {chamadosRecentes.map((chamado) => (
                <div
                  key={chamado.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{chamado.titulo}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(chamado.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                    {chamado.tags && chamado.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {chamado.tags.map((tag, index) => (
                          // CORREÇÃO CRÍTICA AQUI: Use tag.nome se for um objeto, ou tag se for uma string
                          <Badge key={index} variant="outline" className="text-xs">
                            {typeof tag === 'object' && tag !== null ? String(tag.nome) : String(tag)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(chamado.prioridade)}
                    {getStatusBadge(chamado.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}