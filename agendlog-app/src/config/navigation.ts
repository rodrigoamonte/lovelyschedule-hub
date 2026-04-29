import { UserRole } from "@/modules/auth/core/entities/User";
import {
  LayoutDashboard,
  Calendar,
  Store,
  Users,
  PlusCircle,
  Inbox,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export const NAVIGATION_CONFIG: Record<UserRole, NavGroup[]> = {
  ADMIN: [
    {
      label: "PRINCIPAL",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Agendamentos", url: "/admin/schedules", icon: Calendar },
      ],
    },
    {
      label: "ADMINISTRAÇÃO",
      items: [
        { title: "Lojas", url: "/admin/stores", icon: Store },
        { title: "Usuários", url: "/admin/users", icon: Users },
      ],
    },
  ],
  SUPPLIER: [
    {
      label: "PRINCIPAL",
      items: [
        { title: "Início", url: "/dashboard", icon: LayoutDashboard },
        {
          title: "Novo Agendamento",
          url: "/supplier/new-appointment",
          icon: PlusCircle,
        },
        {
          title: "Meus Agendamentos",
          url: "/supplier/my-appointments",
          icon: Calendar,
        },
      ],
    },
  ],
  ANALYST: [
    {
      label: "PRINCIPAL",
      items: [
        { title: "Painel", url: "/dashboard", icon: LayoutDashboard },
        {
          title: "Solicitações",
          url: "/assistant/pending-requests",
          icon: Inbox,
        },
      ],
    },
  ],
  CHECKER: [
    {
      label: "OPERACIONAL",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        {
          title: "Controle de Doca",
          url: "/depot/operational-board",
          icon: Store,
        },
      ],
    },
  ],
};
