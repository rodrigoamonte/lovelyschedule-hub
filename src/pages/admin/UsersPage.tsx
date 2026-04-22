import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ROLE_LABELS, type UserRole } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Loader2 } from 'lucide-react';

interface UserRow {
  user_id: string;
  full_name: string;
  email: string;
  active: boolean;
  created_at: string;
  roles: UserRole[];
}

export default function UsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ data: profiles }, { data: roles }] = await Promise.all([
        supabase.from('profiles').select('user_id, full_name, email, active, created_at').order('created_at', { ascending: false }),
        supabase.from('user_roles').select('user_id, role'),
      ]);
      if (cancelled) return;
      const rolesByUser = new Map<string, UserRole[]>();
      (roles ?? []).forEach(r => {
        const list = rolesByUser.get(r.user_id) ?? [];
        list.push(r.role as UserRole);
        rolesByUser.set(r.user_id, list);
      });
      setRows((profiles ?? []).map(p => ({
        user_id: p.user_id,
        full_name: p.full_name,
        email: p.email,
        active: p.active,
        created_at: p.created_at,
        roles: rolesByUser.get(p.user_id) ?? [],
      })));
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl text-foreground">Gestão de Usuários</h1>
          <p className="text-sm text-muted-foreground">Usuários cadastrados no sistema</p>
        </div>
      </div>

      <div className="rounded-xl bg-card shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 flex items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando...
          </div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Nenhum usuário encontrado.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Perfis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(u => (
                <TableRow key={u.user_id}>
                  <TableCell className="font-medium">{u.full_name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="text-xs">
                    {u.roles.length > 0 ? u.roles.map(r => ROLE_LABELS[r]).join(', ') : '—'}
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium ${u.active ? 'text-accent' : 'text-destructive'}`}>
                      {u.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(u.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Novos usuários se cadastram pela tela de login. A alteração de perfis (admin, assistente, depósito) é feita diretamente no banco por enquanto.
      </p>
    </div>
  );
}
