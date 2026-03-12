import { cn } from '@/lib/utils';
import { type AppointmentStatus, STATUS_LABELS } from '@/lib/mock-data';

const statusStyles: Record<AppointmentStatus, string> = {
  pendente: 'bg-warning/15 text-warning',
  aprovado: 'bg-accent/15 text-accent',
  rejeitado: 'bg-destructive/15 text-destructive',
  aguardando: 'bg-primary/15 text-primary',
  chegou: 'bg-accent/15 text-accent',
  atrasado: 'bg-destructive/15 text-destructive',
  concluido: 'bg-muted text-muted-foreground',
};

export function StatusBadge({ status, className }: { status: AppointmentStatus; className?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      statusStyles[status],
      className,
    )}>
      {STATUS_LABELS[status]}
    </span>
  );
}
