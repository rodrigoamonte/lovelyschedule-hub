import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Truck } from 'lucide-react';

const roleRedirects: Record<string, string> = {
  admin: '/dashboard',
  assistente: '/dashboard',
  deposito: '/dashboard',
  fornecedor: '/dashboard',
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
    const result = login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error ?? 'Erro ao fazer login.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary text-primary-foreground mx-auto">
            <Truck className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">AgendaLog</h1>
          <p className="text-sm text-muted-foreground">Sistema de Agendamento de Entregas</p>
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
            <p className="font-medium text-secondary-foreground">Contas de demonstração:</p>
            <p><span className="font-medium">Admin:</span> admin@agendlog.com / admin123</p>
            <p><span className="font-medium">Assistente:</span> assistente@agendlog.com / assist123</p>
            <p><span className="font-medium">Depósito:</span> deposito@agendlog.com / depo123</p>
            <p><span className="font-medium">Fornecedor:</span> fornecedor@agendlog.com / forn123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
