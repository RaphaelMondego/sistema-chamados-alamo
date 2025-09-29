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
import { Chamado } from "@/types";

// Corrigido para Chamado[] diretamente, e não um objeto de resposta
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
    const getStatusBadge = (status: string) => { /* ... */ return <Badge variant="default">{status}</Badge>; };
    const getPriorityBadge = (prioridade: string) => { /* ... */ return <Badge variant="default">{prioridade}</Badge>; };

    const loadChamados = async () => {
        try {
            const response = await api.get('/chamados');
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

        // Lógica de Filtros (simplificada para o exemplo)
        if (searchTerm) {
            filtered = filtered.filter(chamado =>
                chamado.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                chamado.descricao.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredChamados(filtered);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Tem certeza que deseja excluir este chamado?")) {
            return;
        }
        
        try {
            await api.delete(`/chamados/${id}`);
            setChamados(prev => prev.filter(chamado => chamado.id !== id));
            toast({
                title: "Sucesso",
                description: "Chamado excluído com sucesso.",
            });
        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao excluir chamado.",
                variant: "destructive",
            });
        }
    };

    const exportToExcel = () => { /* ... */ };

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
            {/* ... (Filtros e Cabeçalho) */}

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
                                    {/* ... (TableHead) */}
                                </TableHeader>
                                <TableBody>
                                    {filteredChamados.map((chamado) => (
                                        <TableRow key={chamado.id}>
                                            <TableCell>
                                                {/* Título e Descrição */}
                                                <div>
                                                    <p className="font-medium">{chamado.titulo}</p>
                                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                                        {chamado.descricao}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(chamado.status)}</TableCell>
                                            <TableCell>{getPriorityBadge(chamado.prioridade)}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {chamado.tags.map((tag: any, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {typeof tag === 'object' && tag !== null ? tag.nome : tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(chamado.dataCriacao).toLocaleDateString('pt-BR')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {/* BOTÃO VISUALIZAR (EYE) */}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => navigate(`/chamados/${chamado.id}`)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    
                                                    {/* BOTÃO EDITAR (EDIT) */}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => navigate(`/chamados/editar/${chamado.id}`)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>

                                                    {/* BOTÃO EXCLUIR (ADMIN) */}
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