import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, Mail, MailOpen } from 'lucide-react';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();

  if (!user) return null;

  const myNotifs = notifications.filter(n => n.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const unreadCount = myNotifs.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl text-foreground">Notificações</h1>
            <p className="text-sm text-muted-foreground">{unreadCount} não lida(s)</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAllNotificationsRead(user.id)}>
            <CheckCheck className="mr-2 h-4 w-4" /> Marcar todas como lidas
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {myNotifs.length === 0 ? (
          <div className="rounded-xl bg-card shadow-card p-8 text-center text-muted-foreground text-sm">Nenhuma notificação.</div>
        ) : (
          myNotifs.map(n => (
            <div
              key={n.id}
              className={`rounded-xl bg-card shadow-card p-4 flex items-start gap-3 cursor-pointer transition-colors ${!n.read ? 'border-l-4 border-l-primary' : ''}`}
              onClick={() => !n.read && markNotificationRead(n.id)}
            >
              <div className="mt-0.5">
                {n.read ? <MailOpen className="h-4 w-4 text-muted-foreground" /> : <Mail className="h-4 w-4 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!n.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString('pt-BR')}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
