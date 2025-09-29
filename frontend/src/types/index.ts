export interface User {
  id: string;
  nome: string;
  email: string;
  papel: 'admin' | 'user';
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface Chamado {
  id: string;
  titulo: string;
  descricao: string;
  status: 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  tags: string[];
  usuarioId: string;
  usuario?: User;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface ChamadoForm {
  titulo: string;
  descricao: string;
  prioridade: string;
  tags: string[];
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginForm {
  email: string;
  senha: string;
}

export interface RegisterForm {
  nome: string;
  email: string;
  senha: string;
}