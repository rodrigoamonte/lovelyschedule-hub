// src/shared/presentation/components/AppSidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";
import { NAVIGATION_CONFIG } from "@/config/navigation";
import { LogOut, ChevronUp, Calendar as LogoIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils"; 
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/shared/presentation/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/presentation/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
} from "@/shared/presentation/components/ui/avatar";

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();

  if (!user) return null;

  const groups = NAVIGATION_CONFIG[user.role] || [];
  const isExpanded = state === "expanded";

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4 border-b">
        <div
          className={cn(
            "flex items-center w-full transition-all duration-300",
            isExpanded
              ? "justify-start gap-3 px-2"
              : "justify-center gap-0 px-0",
          )}
        >
          <div className="bg-primary p-1.5 rounded-lg text-white shrink-0">
            <LogoIcon className="w-5 h-5" />
          </div>
          {isExpanded && (
            <span className="font-bold text-xl truncate">AgendLog</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group, idx) => (
          <SidebarGroup key={group.label || idx}>
            {group.label && isExpanded && (
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      tooltip={!isExpanded ? item.title : undefined}
                    >
                      <Link to={item.url}>
                        <item.icon className="w-5 h-5" />
                        {isExpanded && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="h-12 w-full">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback>
                  {user.name?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isExpanded && (
                <>
                  <div className="flex flex-col items-start text-sm overflow-hidden ml-2">
                    <span className="font-medium truncate w-full">
                      {user.name}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto w-4 h-4" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="w-56">
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
