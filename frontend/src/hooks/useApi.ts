import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api'; // Importa a função de API de dentro de hooks/lib/api.ts

// Usamos este tipo para garantir a consistência
interface ApiResult<T> {
  data: T;
  // Outras propriedades se a sua API retornar (status, message, etc.)
}

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth(); // Assume que useAuth fornece logout

  const request = async <T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    endpoint: string,
    data?: any,
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    try {
      // O 'api' é a sua função base que já lida com o token JWT
      const response = await api.request<ApiResult<T>>({
        method,
        url: endpoint,
        data: data,
      });

      // O servidor deve retornar a estrutura { data: T }
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro de comunicação com o servidor.';
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        toast({
          title: "Não Autorizado",
          description: "Sua sessão expirou ou você não tem permissão.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro de Requisição",
          description: errorMessage,
          variant: "destructive",
        });
      }
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const get = <T>(endpoint: string) => request<T>('get', endpoint);
  const post = <T>(endpoint: string, data: any) => request<T>('post', endpoint, data);
  const put = <T>(endpoint: string, data: any) => request<T>('put', endpoint, data);
  const patch = <T>(endpoint: string, data: any) => request<T>('patch', endpoint, data);
  const remove = <T>(endpoint: string) => request<T>('delete', endpoint);

  return { get, post, put, patch, remove, isLoading, error };
};
