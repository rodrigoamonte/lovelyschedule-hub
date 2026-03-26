import { LayoutDashboard, CalendarPlus, ClipboardList, CheckSquare, History, Building2, Clock, Users, Bell, LogOut, Warehouse } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ROLE_LABELS } from '@/lib/mock-data';

type NavItem = { title: string; url: string; icon: React.ElementType; roles: string[] };

const allItems: NavItem[] = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'assistente', 'deposito', 'fornecedor'] },
  // Fornecedor
  { title: 'Novo Agendamento', url: '/novo-agendamento', icon: CalendarPlus, roles: ['fornecedor'] },
  { title: 'Meus Agendamentos', url: '/meus-agendamentos', icon: ClipboardList, roles: ['fornecedor'] },
  // Assistente
  { title: 'Solicitações Pendentes', url: '/solicitacoes', icon: CheckSquare, roles: ['assistente'] },
  { title: 'Histórico de Decisões', url: '/historico', icon: History, roles: ['assistente'] },
  // Depósito
  { title: 'Mural Operacional', url: '/mural', icon: Warehouse, roles: ['deposito'] },
  // Admin
  { title: 'Lojas', url: '/lojas', icon: Building2, roles: ['admin'] },
  { title: 'Horários', url: '/horarios', icon: Clock, roles: ['admin'] },
  { title: 'Usuários', url: '/usuarios', icon: Users, roles: ['admin'] },
  // All
  { title: 'Notificações', url: '/notificacoes', icon: Bell, roles: ['admin', 'assistente', 'deposito', 'fornecedor'] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { user, logout } = useAuth();
  const { notifications } = useData();
  const location = useLocation();

  if (!user) return null;

  const items = allItems.filter(i => i.roles.includes(user.role));
  const unreadCount = notifications.filter(n => n.userId === user.id && !n.read).length;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            {!collapsed && 'AgendaLog'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => {
                const isActive = location.pathname === item.url;
                const showBadge = item.url === '/notificacoes' && unreadCount > 0;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink to={item.url} end className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                        <item.icon className="mr-2 h-4 w-4 shrink-0" />
                        {!collapsed && (
                          <span className="flex-1 flex items-center justify-between">
                            {item.title}
                            {showBadge && (
                              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                {unreadCount}
                              </span>
                            )}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        {!collapsed && (
          <div className="mb-2 px-2">
            <p className="text-xs font-medium text-sidebar-foreground">{user.name}</p>
            <p className="text-[10px] text-sidebar-foreground/50">{ROLE_LABELS[user.role]}</p>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && 'Sair'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
