import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TicketEdicao() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(`/chamados/${id}`)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold text-foreground">Editar Chamado #{id}</h1>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Formulário de Edição</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-muted-foreground py-8">
                        Funcionalidade de edição para o Chamado ID **{id}** será implementada aqui.
                    </div>
                    <Button onClick={() => navigate('/chamados')}>Salvar Edição</Button>
                </CardContent>
            </Card>
        </div>
    );
}
