import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { ROLE_LABELS } from '@/lib/mock-data';
import { Package, Clock, CheckCircle, XCircle, CalendarCheck, AlertTriangle, Building2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user } = useAuth();
  const { appointments, suppliers, stores, notifications, getSupplierByUserId } = useData();
  const navigate = useNavigate();

  if (!user) return null;

  const today = new Date().toISOString().split('T')[0];
  const todayStr = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  if (user.role === 'fornecedor') {
    const supplier = getSupplierByUserId(user.id);
    const myAppts = appointments.filter(a => a.supplierId === supplier?.id);
    const pending = myAppts.filter(a => a.status === 'pendente').length;
    const approved = myAppts.filter(a => a.status === 'aprovado').length;
    const todayAppts = myAppts.filter(a => a.date === today && a.status === 'aprovado');
    const unread = notifications.filter(n => n.userId === user.id && !n.read).length;

    return (
      <DashboardShell title={`Olá, ${user.name}`} subtitle={todayStr} role={user.role}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Clock className="h-5 w-5 text-warning" />} label="Pendentes" value={pending} />
          <StatCard icon={<CheckCircle className="h-5 w-5 text-accent" />} label="Aprovados" value={approved} />
          <StatCard icon={<CalendarCheck className="h-5 w-5 text-primary" />} label="Entregas hoje" value={todayAppts.length} />
          <StatCard icon={<AlertTriangle className="h-5 w-5 text-destructive" />} label="Notificações" value={unread} />
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={() => navigate('/novo-agendamento')}>Novo Agendamento</Button>
          <Button variant="outline" onClick={() => navigate('/meus-agendamentos')}>Meus Agendamentos</Button>
        </div>
      </DashboardShell>
    );
  }

  if (user.role === 'assistente') {
    const pending = appointments.filter(a => a.status === 'pendente').length;
    const approvedToday = appointments.filter(a => a.status === 'aprovado' && a.date === today).length;
    const rejectedTotal = appointments.filter(a => a.status === 'rejeitado').length;
    const unread = notifications.filter(n => n.userId === user.id && !n.read).length;

    return (
      <DashboardShell title="Painel da Validação" subtitle={todayStr} role={user.role}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Clock className="h-5 w-5 text-warning" />} label="Pendentes" value={pending} />
          <StatCard icon={<CheckCircle className="h-5 w-5 text-accent" />} label="Aprovados hoje" value={approvedToday} />
          <StatCard icon={<XCircle className="h-5 w-5 text-destructive" />} label="Rejeitados" value={rejectedTotal} />
          <StatCard icon={<AlertTriangle className="h-5 w-5 text-primary" />} label="Notificações" value={unread} />
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={() => navigate('/solicitacoes')}>Ver Solicitações Pendentes</Button>
          <Button variant="outline" onClick={() => navigate('/historico')}>Histórico de Decisões</Button>
        </div>
      </DashboardShell>
    );
  }

  if (user.role === 'deposito') {
    const todayApproved = appointments.filter(a => a.date === today && a.status === 'aprovado');
    const storeCount = stores.filter(s => s.active).length;

    return (
      <DashboardShell title="Painel do Depósito" subtitle={todayStr} role={user.role}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard icon={<Package className="h-5 w-5 text-primary" />} label="Entregas aprovadas hoje" value={todayApproved.length} />
          <StatCard icon={<Building2 className="h-5 w-5 text-accent" />} label="Lojas ativas" value={storeCount} />
          <StatCard icon={<CalendarCheck className="h-5 w-5 text-warning" />} label="Fornecedores" value={suppliers.length} />
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={() => navigate('/mural')}>Acessar Mural Operacional</Button>
        </div>
      </DashboardShell>
    );
  }

  // Admin
  const totalAppts = appointments.length;
  const pendingAppts = appointments.filter(a => a.status === 'pendente').length;

  return (
    <DashboardShell title="Painel Administrativo" subtitle={todayStr} role={user.role}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Package className="h-5 w-5 text-primary" />} label="Total de agendamentos" value={totalAppts} />
        <StatCard icon={<Clock className="h-5 w-5 text-warning" />} label="Pendentes" value={pendingAppts} />
        <StatCard icon={<Building2 className="h-5 w-5 text-accent" />} label="Lojas" value={stores.length} />
        <StatCard icon={<Users className="h-5 w-5 text-destructive" />} label="Fornecedores" value={suppliers.length} />
      </div>
      <div className="flex gap-3 mt-6">
        <Button onClick={() => navigate('/lojas')}>Gerenciar Lojas</Button>
        <Button variant="outline" onClick={() => navigate('/horarios')}>Configurar Horários</Button>
        <Button variant="outline" onClick={() => navigate('/usuarios')}>Gestão de Usuários</Button>
      </div>
    </DashboardShell>
  );
}

function DashboardShell({ title, subtitle, role, children }: { title: string; subtitle: string; role: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle} • {ROLE_LABELS[role as keyof typeof ROLE_LABELS]}</p>
      </div>
      {children}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl bg-card p-4 shadow-card flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
