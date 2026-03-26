export type UserRole = 'fornecedor' | 'assistente' | 'deposito' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: 'ativo' | 'bloqueado';
  loginAttempts: number;
  blockedUntil: string | null;
  createdAt: string;
}

export interface Supplier {
  id: string;
  userId: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  telefone: string;
  emailContato: string;
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  city: string;
  address: string;
  active: boolean;
  createdAt: string;
}

export interface TimeSlot {
  id: string;
  storeId: string;
  date: string;
  time: string;
  maxCapacity: number;
  usedCapacity: number;
  active: boolean;
}

export type AppointmentStatus = 'pendente' | 'aprovado' | 'rejeitado' | 'cancelado';

export interface Appointment {
  id: string;
  supplierId: string;
  storeId: string;
  date: string;
  time: string;
  merchandise: string;
  notes: string;
  status: AppointmentStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentHistory {
  id: string;
  appointmentId: string;
  userId: string;
  action: string;
  description: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  appointmentId?: string;
  type: 'status_change' | 'reminder' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  fornecedor: 'Fornecedor',
  assistente: 'Assistente de Validação',
  deposito: 'Responsável Depósito',
  admin: 'Administrador',
};

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
  cancelado: 'Cancelado',
};

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const dayAfter = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Administrador Geral', email: 'admin@agendlog.com', password: 'admin123', role: 'admin', status: 'ativo', loginAttempts: 0, blockedUntil: null, createdAt: '2025-01-01T00:00:00' },
  { id: 'u2', name: 'Maria Silva', email: 'assistente@agendlog.com', password: 'assist123', role: 'assistente', status: 'ativo', loginAttempts: 0, blockedUntil: null, createdAt: '2025-01-01T00:00:00' },
  { id: 'u3', name: 'João Santos', email: 'deposito@agendlog.com', password: 'depo123', role: 'deposito', status: 'ativo', loginAttempts: 0, blockedUntil: null, createdAt: '2025-01-01T00:00:00' },
  { id: 'u4', name: 'Carlos Oliveira', email: 'fornecedor@agendlog.com', password: 'forn123', role: 'fornecedor', status: 'ativo', loginAttempts: 0, blockedUntil: null, createdAt: '2025-01-01T00:00:00' },
  { id: 'u5', name: 'Ana Costa', email: 'fornecedor2@agendlog.com', password: 'forn123', role: 'fornecedor', status: 'ativo', loginAttempts: 0, blockedUntil: null, createdAt: '2025-01-15T00:00:00' },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 's1', userId: 'u4', razaoSocial: 'Distribuidora ABC Ltda', nomeFantasia: 'Distribuidora ABC', cnpj: '12.345.678/0001-90', telefone: '(11) 91234-5678', emailContato: 'contato@abc.com', createdAt: '2025-01-01T00:00:00' },
  { id: 's2', userId: 'u5', razaoSocial: 'Alimentos Frescos S.A.', nomeFantasia: 'Frescos SA', cnpj: '98.765.432/0001-10', telefone: '(19) 93456-7890', emailContato: 'vendas@frescos.com', createdAt: '2025-01-15T00:00:00' },
];

export const INITIAL_STORES: Store[] = [
  { id: 'st1', name: 'Supermercado Central', city: 'São Paulo', address: 'Av. Paulista, 1000 — São Paulo/SP', active: true, createdAt: '2025-01-01T00:00:00' },
  { id: 'st2', name: 'Supermercado Vila Nova', city: 'Campinas', address: 'Rua Norte-Sul, 500 — Campinas/SP', active: true, createdAt: '2025-01-01T00:00:00' },
  { id: 'st3', name: 'CD Logístico Guarulhos', city: 'Guarulhos', address: 'Rod. Presidente Dutra, km 220 — Guarulhos/SP', active: true, createdAt: '2025-01-01T00:00:00' },
];

function generateSlots(storeId: string, date: string): TimeSlot[] {
  const hours = ['07:00', '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
  return hours.map((time, i) => ({
    id: `ts_${storeId}_${date}_${i}`,
    storeId,
    date,
    time,
    maxCapacity: time === '07:00' || time === '13:00' ? 3 : 2,
    usedCapacity: 0,
    active: true,
  }));
}

const allSlots: TimeSlot[] = [
  ...generateSlots('st1', today),
  ...generateSlots('st1', tomorrow),
  ...generateSlots('st1', dayAfter),
  ...generateSlots('st2', today),
  ...generateSlots('st2', tomorrow),
  ...generateSlots('st3', today),
  ...generateSlots('st3', tomorrow),
];

// Pre-occupy some slots
allSlots.find(s => s.id === `ts_st1_${today}_0`)!.usedCapacity = 1;
allSlots.find(s => s.id === `ts_st1_${today}_1`)!.usedCapacity = 2;
allSlots.find(s => s.id === `ts_st1_${today}_2`)!.usedCapacity = 1;

export const INITIAL_TIMESLOTS: TimeSlot[] = allSlots;

export const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: 'a1', supplierId: 's1', storeId: 'st1', date: today, time: '07:00', merchandise: 'Laticínios e frios', notes: 'Carga refrigerada', status: 'aprovado', createdAt: `${today}T06:00:00`, updatedAt: `${today}T06:30:00` },
  { id: 'a2', supplierId: 's1', storeId: 'st1', date: today, time: '08:00', merchandise: 'Bebidas em geral', notes: '', status: 'pendente', createdAt: `${today}T07:00:00`, updatedAt: `${today}T07:00:00` },
  { id: 'a3', supplierId: 's2', storeId: 'st1', date: today, time: '08:00', merchandise: 'Hortifruti', notes: 'Necessário conferência rápida', status: 'pendente', createdAt: `${today}T07:30:00`, updatedAt: `${today}T07:30:00` },
  { id: 'a4', supplierId: 's2', storeId: 'st1', date: today, time: '09:00', merchandise: 'Frutas e verduras', notes: '', status: 'aprovado', createdAt: `${today}T06:15:00`, updatedAt: `${today}T06:45:00` },
  { id: 'a5', supplierId: 's1', storeId: 'st2', date: tomorrow, time: '10:00', merchandise: 'Produtos de limpeza', notes: 'Carga paletizada', status: 'pendente', createdAt: `${today}T08:00:00`, updatedAt: `${today}T08:00:00` },
];

export const INITIAL_HISTORY: AppointmentHistory[] = [
  { id: 'h1', appointmentId: 'a1', userId: 'u4', action: 'Criação', description: 'Agendamento criado pelo fornecedor.', createdAt: `${today}T06:00:00` },
  { id: 'h2', appointmentId: 'a1', userId: 'u2', action: 'Aprovação', description: 'Agendamento aprovado pela assistente.', createdAt: `${today}T06:30:00` },
  { id: 'h3', appointmentId: 'a2', userId: 'u4', action: 'Criação', description: 'Agendamento criado pelo fornecedor.', createdAt: `${today}T07:00:00` },
  { id: 'h4', appointmentId: 'a3', userId: 'u5', action: 'Criação', description: 'Agendamento criado pelo fornecedor.', createdAt: `${today}T07:30:00` },
  { id: 'h5', appointmentId: 'a4', userId: 'u5', action: 'Criação', description: 'Agendamento criado pelo fornecedor.', createdAt: `${today}T06:15:00` },
  { id: 'h6', appointmentId: 'a4', userId: 'u2', action: 'Aprovação', description: 'Agendamento aprovado pela assistente.', createdAt: `${today}T06:45:00` },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'u2', appointmentId: 'a2', type: 'status_change', title: 'Nova solicitação', message: 'Distribuidora ABC solicitou agendamento para Supermercado Central em ' + today + ' às 08:00.', read: false, createdAt: `${today}T07:00:00` },
  { id: 'n2', userId: 'u2', appointmentId: 'a3', type: 'status_change', title: 'Nova solicitação', message: 'Frescos SA solicitou agendamento para Supermercado Central em ' + today + ' às 08:00.', read: false, createdAt: `${today}T07:30:00` },
  { id: 'n3', userId: 'u4', appointmentId: 'a1', type: 'status_change', title: 'Agendamento aprovado', message: 'Seu agendamento para Supermercado Central em ' + today + ' às 07:00 foi aprovado.', read: true, createdAt: `${today}T06:30:00` },
  { id: 'n4', userId: 'u4', appointmentId: 'a1', type: 'reminder', title: 'Lembrete de entrega', message: 'Lembrete: sua entrega em Supermercado Central está agendada para hoje às 07:00.', read: false, createdAt: `${today}T05:00:00` },
];

export const MAX_LOGIN_ATTEMPTS = 3;
export const LOCKOUT_MINUTES = 5;
