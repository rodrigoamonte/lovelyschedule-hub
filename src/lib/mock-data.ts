export type UserRole = 'admin' | 'gestor' | 'fornecedor';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  unitId?: string;
  supplierId?: string;
}

export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  contact: string;
  email: string;
  unitIds: string[];
}

export interface Unit {
  id: string;
  name: string;
  address: string;
  type: 'loja' | 'cd';
}

export interface ReceivingWindow {
  id: string;
  unitId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  cargoType: string;
  maxCapacity: number;
}

export type AppointmentStatus = 'pendente' | 'aprovado' | 'rejeitado' | 'aguardando' | 'chegou' | 'atrasado' | 'concluido';

export interface Appointment {
  id: string;
  supplierId: string;
  unitId: string;
  windowId: string;
  date: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const today = new Date().toISOString().split('T')[0];
const todayDow = new Date().getDay();

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Administrador', email: 'admin@agendlog.com', password: 'admin', role: 'admin' },
  { id: 'u2', name: 'Carlos Mendes', email: 'gestor@agendlog.com', password: 'gestor', role: 'gestor', unitId: 'un1' },
  { id: 'u3', name: 'Ana Souza', email: 'fornecedor@agendlog.com', password: 'fornecedor', role: 'fornecedor', supplierId: 's1' },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'Distribuidora ABC', cnpj: '12.345.678/0001-90', contact: '(11) 91234-5678', email: 'contato@abc.com', unitIds: ['un1', 'un2'] },
  { id: 's2', name: 'Transportes Silva', cnpj: '98.765.432/0001-10', contact: '(11) 99876-5432', email: 'logistica@silva.com', unitIds: ['un1'] },
  { id: 's3', name: 'Alimentos Frescos Ltda', cnpj: '11.222.333/0001-44', contact: '(19) 93456-7890', email: 'vendas@frescos.com', unitIds: ['un1', 'un2'] },
];

export const INITIAL_UNITS: Unit[] = [
  { id: 'un1', name: 'CD São Paulo', address: 'Rod. Anhanguera, km 32 — SP', type: 'cd' },
  { id: 'un2', name: 'Loja Campinas', address: 'Av. Norte-Sul, 1200 — Campinas', type: 'loja' },
];

export const INITIAL_WINDOWS: ReceivingWindow[] = [
  { id: 'w1', unitId: 'un1', dayOfWeek: todayDow, startTime: '08:00', endTime: '10:00', cargoType: 'Perecíveis', maxCapacity: 2 },
  { id: 'w2', unitId: 'un1', dayOfWeek: todayDow, startTime: '10:00', endTime: '12:00', cargoType: 'Secos', maxCapacity: 3 },
  { id: 'w3', unitId: 'un1', dayOfWeek: todayDow, startTime: '14:00', endTime: '16:00', cargoType: 'Geral', maxCapacity: 2 },
  { id: 'w4', unitId: 'un1', dayOfWeek: (todayDow + 1) % 7, startTime: '08:00', endTime: '10:00', cargoType: 'Perecíveis', maxCapacity: 2 },
  { id: 'w5', unitId: 'un2', dayOfWeek: todayDow, startTime: '09:00', endTime: '11:00', cargoType: 'Geral', maxCapacity: 2 },
  { id: 'w6', unitId: 'un2', dayOfWeek: (todayDow + 2) % 7, startTime: '13:00', endTime: '15:00', cargoType: 'Secos', maxCapacity: 3 },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: 'a1', supplierId: 's1', unitId: 'un1', windowId: 'w1', date: today, status: 'aprovado', createdAt: today + 'T07:00:00' },
  { id: 'a2', supplierId: 's2', unitId: 'un1', windowId: 'w2', date: today, status: 'pendente', notes: 'Carga frágil', createdAt: today + 'T09:30:00' },
  { id: 'a3', supplierId: 's3', unitId: 'un1', windowId: 'w3', date: today, status: 'aprovado', createdAt: today + 'T06:00:00' },
  { id: 'a4', supplierId: 's1', unitId: 'un2', windowId: 'w5', date: today, status: 'pendente', createdAt: today + 'T08:15:00' },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'u2', message: 'Novo agendamento pendente de Distribuidora ABC para CD São Paulo.', read: false, createdAt: today + 'T07:05:00' },
  { id: 'n2', userId: 'u2', message: 'Novo agendamento pendente de Transportes Silva para CD São Paulo.', read: false, createdAt: today + 'T09:35:00' },
  { id: 'n3', userId: 'u3', message: 'Seu agendamento para CD São Paulo (08:00–10:00) foi aprovado.', read: true, createdAt: today + 'T07:30:00' },
];

export const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
  aguardando: 'Aguardando',
  chegou: 'Chegou',
  atrasado: 'Atrasado',
  concluido: 'Concluído',
};
