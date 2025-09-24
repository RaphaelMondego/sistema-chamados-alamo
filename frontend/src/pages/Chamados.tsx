import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Trash2, Eye, Edit, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
// Corrigido para Chamado[] diretamente, e não um objeto de resposta
interface Chamado {
    id: string;
    titulo: string;
    descricao: string;
    status: string;
    prioridade: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    usuario?: {
        nome: string;
        email: string;
    };
}

export default function Chamados() {
    const [chamados, setChamados] = useState<Chamado[]>([]);
    const [filteredChamados, setFilteredChamados] = useState<Chamado[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("todos");
    const [prioridadeFilter, setPrioridadeFilter] = useState("todas");
    const [tagFilter, setTagFilter] = useState("");
    
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    // Funções utilitárias de cores (mantidas)
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

    // CORREÇÃO CRÍTICA AQUI
    const loadChamados = async () => {
        try {
            const response = await api.get('/chamados');
            // A API retorna um array, não um objeto { chamados: [...] }
            // O response.data deve ser um array de chamados
            setChamados(response.data || []); 
        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao carregar chamados.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadChamados();
    }, []);

    useEffect(() => {
        filterChamados();
    }, [chamados, searchTerm, statusFilter, prioridadeFilter, tagFilter]);

    const filterChamados = () => {
        let filtered = chamados;

        // ... (Lógica de Filtros)

        setFilteredChamados(filtered);
    };

    const handleDelete = async (id: string) => {
        // ... (Lógica de Deleção)
    };

    const exportToExcel = () => {
        // ... (Lógica de Exportação)
    };

    if (isLoading) {
        // ... (JSX de Loading)
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Chamados</h1>
                </div>
                <Card className="animate-pulse">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-16 bg-muted rounded"></div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ... (Header e Filtros) */}

            {/* Lista de Chamados */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Chamados</CardTitle>
                    <CardDescription>
                        {filteredChamados.length} chamado(s) encontrado(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredChamados.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">Nenhum chamado encontrado com os filtros selecionados.</p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Título</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Prioridade</TableHead>
                                        <TableHead>Tags</TableHead>
                                        <TableHead>Criado em</TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredChamados.map((chamado) => (
                                        <TableRow key={chamado.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{chamado.titulo}</p>
                                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                                        {chamado.descricao}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(chamado.status)}
                                            </TableCell>
                                            <TableCell>
                                                {getPriorityBadge(chamado.prioridade)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {/* CORREÇÃO CRÍTICA AQUI */}
                                                    {chamado.tags.map((tag: any, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {/* Se a tag for um objeto, use tag.nome, senão use a string */}
                                                            {typeof tag === 'object' && tag !== null ? tag.nome : tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(chamado.createdAt).toLocaleDateString('pt-BR')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => navigate(`/chamados/${chamado.id}`)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            toast({
                                                                title: "Edição",
                                                                description: "Funcionalidade será implementada.",
                                                            });
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    {user?.papel === 'admin' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(chamado.id)}
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}