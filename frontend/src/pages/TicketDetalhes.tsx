import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Tag, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Garanta que estes caminhos estejam corretos no seu projeto
import { useApi } from '@/hooks/useApi'; 
import { useAuth } from '@/contexts/AuthContext';
import { Chamado } from '@/types'; 
import { toast } from '@/hooks/use-toast'; 

export default function TicketDetalhes() {
    const { id } = useParams<{ id: string }>();
    const [ticket, setTicket] = useState<Chamado | null>(null); 
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();
    const api = useApi();

    useEffect(() => {
        if (!id) return;
        
        const fetchTicket = async () => {
            try {
                // Rota GET /chamados/:id
                const response = await api.get<Chamado>(`/chamados/${id}`);
                setTicket(response.data);
            } catch (error) {
                toast({
                    title: "Erro ao carregar",
                    description: "Chamado não encontrado ou erro de permissão.",
                    variant: "destructive"
                });
                navigate('/chamados');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTicket();
    }, [id, navigate, api]);

    const getPriorityColor = (priority: string) => { 
        switch (priority.toLowerCase()) {
            case 'urgente': return 'bg-red-600/10 text-red-600 border-red-600/50';
            case 'alta': return 'bg-orange-600/10 text-orange-600 border-orange-600/50';
            case 'media': return 'bg-yellow-600/10 text-yellow-600 border-yellow-600/50';
            default: return 'bg-gray-400/10 text-gray-600 border-gray-400/50';
        }
    };
    const getStatusColor = (status: string) => { return 'bg-blue-600/10 text-blue-600 border-blue-600/50'; };

    if (isLoading) {
        return <div className="flex justify-center items-center h-40">Carregando detalhes...</div>;
    }

    if (!ticket) {
        return <div className="flex justify-center items-center h-40 text-muted-foreground">Chamado não encontrado.</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/chamados')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold text-foreground">Detalhes do Chamado #{ticket.id}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl">{ticket.titulo}</CardTitle>
                            <div className="flex items-center space-x-3 mt-2">
                                <Badge variant="outline" className={getPriorityColor(ticket.prioridade)}>
                                    <AlertCircle className="mr-1 h-3 w-3" />
                                    {ticket.prioridade.toUpperCase()}
                                </Badge>
                                <Badge variant="outline" className={getStatusColor(ticket.status)}>
                                    {ticket.status.toUpperCase()}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Descrição:</h3>
                            <div className="prose prose-sm max-w-none">
                                <p className="text-foreground whitespace-pre-wrap">{ticket.descricao}</p>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {ticket.tags && ticket.tags.length > 0 && (
                        <Card className="shadow-sm">
                            <CardHeader><CardTitle className="flex items-center text-lg"><Tag className="mr-2 h-4 w-4 text-primary" />Plataformas</CardTitle></CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {ticket.tags.map((tag: any, index) => (
                                        <Badge key={index} variant="secondary" className="text-sm">
                                            {typeof tag === 'object' ? tag.nome : tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card className="shadow-sm">
                        <CardHeader><CardTitle className="text-lg">Informações</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Criado por</p>
                                    <p className="text-sm text-muted-foreground">
                                        {ticket.usuario?.nome || 'Usuário Indisponível'}
                                    </p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center space-x-3">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Data de criação</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(ticket.dataCriacao).toLocaleString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader><CardTitle className="text-lg">Ações</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full justify-start" onClick={() => navigate(`/chamados/editar/${ticket.id}`)}>Editar Chamado</Button>
                            {user?.papel === 'admin' && (
                                <Button variant="destructive" className="w-full justify-start" onClick={() => { /* Lógica de exclusão */ }}>Excluir Chamado</Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
