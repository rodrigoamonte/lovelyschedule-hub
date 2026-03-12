import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const roleRedirects: Record<string, string> = {
  admin: '/dashboard',
  gestor: '/dashboard',
  fornecedor: '/agendar',
};

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to={roleRedirects[user.role] ?? '/dashboard'} replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password);
    if (success) {
      const u = { email };
      const role = email.includes('admin') ? 'admin' : email.includes('gestor') ? 'gestor' : 'fornecedor';
      navigate(roleRedirects[role] ?? '/dashboard');
    } else {
      setError('E-mail ou senha inválidos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">AgendaLog</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestão inteligente de entregas</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-card p-6 shadow-card">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" className="w-full">Entrar</Button>
          <div className="rounded-lg bg-secondary p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-secondary-foreground">Contas de demo:</p>
            <p>admin@agendlog.com / admin</p>
            <p>gestor@agendlog.com / gestor</p>
            <p>fornecedor@agendlog.com / fornecedor</p>
          </div>
        </form>
      </div>
    </div>
  );
}
