import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, markNotificationRead } = useData();

  const userNotifs = notifications
    .filter(n => n.userId === user?.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const unread = userNotifs.filter(n => !n.read);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-foreground">Notificações</h1>
        <p className="text-sm text-muted-foreground">{unread.length} não lida{unread.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="space-y-2">
        {userNotifs.length === 0 ? (
          <div className="rounded-xl bg-card shadow-card p-8 text-center text-sm text-muted-foreground">
            <Bell className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
            Nenhuma notificação.
          </div>
        ) : (
          userNotifs.map(n => (
            <div key={n.id} className={`rounded-xl p-4 shadow-card flex items-start gap-3 transition-colors ${n.read ? 'bg-card' : 'bg-primary/5 border border-primary/10'}`}>
              <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${n.read ? 'bg-transparent' : 'bg-primary'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString('pt-BR')}</p>
              </div>
              {!n.read && (
                <Button size="sm" variant="ghost" onClick={() => markNotificationRead(n.id)} className="shrink-0">
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
