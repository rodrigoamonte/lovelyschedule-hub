export const THEME_CONFIG = {
  layout: {
    shell: "space-y-6",
    card: "rounded-xl bg-card shadow-card overflow-hidden",
    section: "p-6 space-y-5",
    grid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
  },

  table: {
    wrapper: "rounded-xl bg-card shadow-card overflow-hidden",
    cellTruncate: "max-w-[150px] truncate",
    headerAction: "text-right",
  },

  status: {
    ACTIVE: {
      bg: "bg-accent/10",
      text: "text-accent",
      label: "Ativo",
    },
    INACTIVE: {
      bg: "bg-destructive/10",
      text: "text-destructive",
      label: "Inativo",
    },
    PENDING: {
      bg: "bg-warning/10",
      text: "text-warning",
      label: "Pendente",
      icon: "Clock",
    },
    UNDER_REVIEW: {
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      label: "Em Revisão",
      icon: "Search",
    },
    APPROVED: {
      bg: "bg-accent/10",
      text: "text-accent",
      label: "Aprovado",
      icon: "CheckCircle",
    },
    REJECTED: {
      bg: "bg-destructive/10",
      text: "text-destructive",
      label: "Rejeitado",
      icon: "XCircle",
    },
    SCHEDULED: {
      bg: "bg-purple-500/10",
      text: "text-purple-500",
      label: "Agendado",
      icon: "Calendar",
    },
    INSPECTION: {
      bg: "bg-orange-500/10",
      text: "text-orange-500",
      label: "Em Conferência",
      icon: "ClipboardCheck",
    },
    COMPLETED: {
      bg: "bg-green-600/10",
      text: "text-green-600",
      label: "Finalizado",
      icon: "Flag",
    },
    CANCELLED: {
      bg: "bg-muted/10",
      text: "text-muted-foreground",
      label: "Cancelado",
      icon: "Ban",
    },
    MAINTENANCE: {
      bg: "bg-gray-500/10",
      text: "text-gray-500",
      label: "Manutenção",
      icon: "Settings",
    },
  },

  icons: {
    size: {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
      xl: "h-6 w-6",
    },
    container: "flex h-10 w-10 items-center justify-center rounded-lg",
  },

  typography: {
    h1: "text-2xl font-bold text-foreground",
    h2: "text-xl font-semibold text-foreground",
    subtitle: "text-sm text-muted-foreground",
    detail: "text-xs text-muted-foreground",
  },
} as const;

export type AppStatus = keyof typeof THEME_CONFIG.status;
