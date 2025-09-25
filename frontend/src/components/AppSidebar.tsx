import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  Plus,
  Users,
  BarChart3,
  User,
  LogOut,
  Menu
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navigationItems = [
  // Rotas que devem ser exatas (END=TRUE)
  { titulo: "Dashboard", url: "/dashboard", icon: LayoutDashboard, exact: true },
  { titulo: "Chamados", url: "/chamados", icon: Ticket, exact: true },
  // Rotas que são filhas e não devem ser exatas (END=FALSE)
  { titulo: "Novo Chamado", url: "/chamados/novo", icon: Plus, exact: false },
  { titulo: "Usuários", url: "/usuarios", icon: Users, exact: false },
  { titulo: "Relatórios", url: "/relatorios", icon: BarChart3, exact: false },
  { titulo: "Meu Perfil", url: "/perfil", icon: User, exact: true },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAuth();
  const collapsed = state === "collapsed";

  // CORREÇÃO CRÍTICA: Apenas passa a classe de estilo com base no isActive nativo do NavLink
  const getNavClass = ({ isActive, isPending, end }: { isActive: boolean, isPending: boolean, end: boolean }) => {
    return isActive
      ? "bg-primary text-primary-foreground font-medium"
      : "hover:bg-accent hover:text-accent-foreground";
  };
  
  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"}>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <img 
              src="/public/logo-alamo.png" 
              alt="Logo Álamo Tickets" 
              className="w-25 h-25 object-contain p-0.8 rounded-lg" 
            />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-sidebar-foreground">Álamo Tickets</h2>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && "Navegação"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.titulo}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive, isPending }) => getNavClass({ isActive, isPending, end: item.exact })}
                      end={item.exact} // Usa a propriedade 'end'
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span className="ml-2">{item.titulo}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!collapsed && user && (
          <div className="mb-2">
            <p className="text-sm font-medium text-sidebar-foreground">{user.nome}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            {user.papel && (
              <p className="text-xs text-primary font-medium capitalize">{user.papel}</p>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          onClick={logout}
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sair</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}