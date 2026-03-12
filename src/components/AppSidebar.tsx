import { LayoutDashboard, Truck, Building2, Clock, CalendarCheck, CheckSquare, Bell, LogOut } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const allItems = [
  { title: 'Painel Diário', url: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'gestor'] },
  { title: 'Fornecedores', url: '/fornecedores', icon: Truck, roles: ['admin'] },
  { title: 'Unidades', url: '/unidades', icon: Building2, roles: ['admin'] },
  { title: 'Janelas', url: '/janelas', icon: Clock, roles: ['admin', 'gestor'] },
  { title: 'Agendar Entrega', url: '/agendar', icon: CalendarCheck, roles: ['fornecedor'] },
  { title: 'Aprovações', url: '/aprovacoes', icon: CheckSquare, roles: ['admin', 'gestor'] },
  { title: 'Notificações', url: '/notificacoes', icon: Bell, roles: ['admin', 'gestor', 'fornecedor'] },
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
            <p className="text-[10px] text-sidebar-foreground/50">{user.email}</p>
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
