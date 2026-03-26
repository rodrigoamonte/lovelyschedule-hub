import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  INITIAL_SUPPLIERS, INITIAL_STORES, INITIAL_TIMESLOTS, INITIAL_APPOINTMENTS, INITIAL_HISTORY, INITIAL_NOTIFICATIONS,
  type Supplier, type Store, type TimeSlot, type Appointment, type AppointmentHistory, type Notification, type AppointmentStatus,
} from '@/lib/mock-data';

interface DataContextType {
  suppliers: Supplier[];
  stores: Store[];
  timeSlots: TimeSlot[];
  appointments: Appointment[];
  history: AppointmentHistory[];
  notifications: Notification[];
  addSupplier: (s: Omit<Supplier, 'id' | 'createdAt'>) => void;
  addStore: (s: Omit<Store, 'id' | 'createdAt'>) => void;
  updateStore: (id: string, data: Partial<Store>) => void;
  addTimeSlot: (t: Omit<TimeSlot, 'id'>) => void;
  updateTimeSlot: (id: string, data: Partial<TimeSlot>) => void;
  getAvailableSlots: (storeId: string, date: string) => TimeSlot[];
  createAppointment: (a: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status'>, userId: string) => string;
  updateAppointment: (id: string, data: Partial<Appointment>, userId: string, action: string, description: string) => void;
  cancelAppointment: (id: string, userId: string) => void;
  approveAppointment: (id: string, userId: string) => void;
  rejectAppointment: (id: string, userId: string, reason: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  addNotification: (n: Omit<Notification, 'id' | 'createdAt'>) => void;
  getSupplierByUserId: (userId: string) => Supplier | undefined;
}

const DataContext = createContext<DataContextType | null>(null);

let idCounter = 100;
const genId = (prefix: string) => `${prefix}_${idCounter++}`;

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(INITIAL_TIMESLOTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [history, setHistory] = useState<AppointmentHistory[]>(INITIAL_HISTORY);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const addHistoryEntry = useCallback((appointmentId: string, userId: string, action: string, description: string) => {
    setHistory(prev => [...prev, { id: genId('h'), appointmentId, userId, action, description, createdAt: new Date().toISOString() }]);
  }, []);

  const addNotificationInternal = useCallback((n: Omit<Notification, 'id' | 'createdAt'>) => {
    setNotifications(prev => [{ ...n, id: genId('n'), createdAt: new Date().toISOString() }, ...prev]);
  }, []);

  const addSupplier = useCallback((s: Omit<Supplier, 'id' | 'createdAt'>) => {
    setSuppliers(prev => [...prev, { ...s, id: genId('s'), createdAt: new Date().toISOString() }]);
  }, []);

  const addStore = useCallback((s: Omit<Store, 'id' | 'createdAt'>) => {
    setStores(prev => [...prev, { ...s, id: genId('st'), createdAt: new Date().toISOString() }]);
  }, []);

  const updateStore = useCallback((id: string, data: Partial<Store>) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  }, []);

  const addTimeSlot = useCallback((t: Omit<TimeSlot, 'id'>) => {
    setTimeSlots(prev => [...prev, { ...t, id: genId('ts') }]);
  }, []);

  const updateTimeSlot = useCallback((id: string, data: Partial<TimeSlot>) => {
    setTimeSlots(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  }, []);

  const getAvailableSlots = useCallback((storeId: string, date: string) => {
    return timeSlots.filter(t => t.storeId === storeId && t.date === date && t.active && t.usedCapacity < t.maxCapacity);
  }, [timeSlots]);

  const getSupplierByUserId = useCallback((userId: string) => {
    return suppliers.find(s => s.userId === userId);
  }, [suppliers]);

  const createAppointment = useCallback((a: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status'>, userId: string) => {
    const now = new Date().toISOString();
    const id = genId('a');
    const appt: Appointment = { ...a, id, status: 'pendente', createdAt: now, updatedAt: now };
    setAppointments(prev => [...prev, appt]);

    // Occupy slot
    setTimeSlots(prev => prev.map(t =>
      t.storeId === a.storeId && t.date === a.date && t.time === a.time
        ? { ...t, usedCapacity: t.usedCapacity + 1 }
        : t
    ));

    addHistoryEntry(id, userId, 'Criação', 'Agendamento criado pelo fornecedor.');

    // Notify assistants
    const supplier = suppliers.find(s => s.userId === userId);
    const store = stores.find(s => s.id === a.storeId);
    addNotificationInternal({
      userId: 'u2', // assistente
      appointmentId: id,
      type: 'status_change',
      title: 'Nova solicitação',
      message: `${supplier?.nomeFantasia ?? 'Fornecedor'} solicitou agendamento para ${store?.name ?? 'loja'} em ${a.date} às ${a.time}.`,
      read: false,
    });

    return id;
  }, [suppliers, stores, addHistoryEntry, addNotificationInternal]);

  const updateAppointment = useCallback((id: string, data: Partial<Appointment>, userId: string, action: string, description: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a));
    addHistoryEntry(id, userId, action, description);
  }, [addHistoryEntry]);

  const cancelAppointment = useCallback((id: string, userId: string) => {
    const appt = appointments.find(a => a.id === id);
    if (!appt || appt.status !== 'pendente') return;

    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelado' as AppointmentStatus, updatedAt: new Date().toISOString() } : a));

    // Free slot
    setTimeSlots(prev => prev.map(t =>
      t.storeId === appt.storeId && t.date === appt.date && t.time === appt.time
        ? { ...t, usedCapacity: Math.max(0, t.usedCapacity - 1) }
        : t
    ));

    addHistoryEntry(id, userId, 'Cancelamento', 'Agendamento cancelado pelo fornecedor.');
  }, [appointments, addHistoryEntry]);

  const approveAppointment = useCallback((id: string, userId: string) => {
    const appt = appointments.find(a => a.id === id);
    if (!appt) return;

    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'aprovado' as AppointmentStatus, updatedAt: new Date().toISOString() } : a));
    addHistoryEntry(id, userId, 'Aprovação', 'Agendamento aprovado pela assistente de validação.');

    // Notify supplier
    const supplier = suppliers.find(s => s.id === appt.supplierId);
    const store = stores.find(s => s.id === appt.storeId);
    if (supplier) {
      addNotificationInternal({
        userId: supplier.userId,
        appointmentId: id,
        type: 'status_change',
        title: 'Agendamento aprovado',
        message: `Seu agendamento para ${store?.name ?? 'loja'} em ${appt.date} às ${appt.time} foi aprovado.`,
        read: false,
      });
    }
  }, [appointments, suppliers, stores, addHistoryEntry, addNotificationInternal]);

  const rejectAppointment = useCallback((id: string, userId: string, reason: string) => {
    const appt = appointments.find(a => a.id === id);
    if (!appt) return;

    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'rejeitado' as AppointmentStatus, rejectionReason: reason, updatedAt: new Date().toISOString() } : a));

    // Free slot
    setTimeSlots(prev => prev.map(t =>
      t.storeId === appt.storeId && t.date === appt.date && t.time === appt.time
        ? { ...t, usedCapacity: Math.max(0, t.usedCapacity - 1) }
        : t
    ));

    addHistoryEntry(id, userId, 'Rejeição', `Agendamento rejeitado. Motivo: ${reason}`);

    // Notify supplier
    const supplier = suppliers.find(s => s.id === appt.supplierId);
    const store = stores.find(s => s.id === appt.storeId);
    if (supplier) {
      addNotificationInternal({
        userId: supplier.userId,
        appointmentId: id,
        type: 'status_change',
        title: 'Agendamento rejeitado',
        message: `Seu agendamento para ${store?.name ?? 'loja'} em ${appt.date} às ${appt.time} foi rejeitado. Motivo: ${reason}`,
        read: false,
      });
    }
  }, [appointments, suppliers, stores, addHistoryEntry, addNotificationInternal]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback((userId: string) => {
    setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, read: true } : n));
  }, []);

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'createdAt'>) => {
    addNotificationInternal(n);
  }, [addNotificationInternal]);

  return (
    <DataContext.Provider value={{
      suppliers, stores, timeSlots, appointments, history, notifications,
      addSupplier, addStore, updateStore, addTimeSlot, updateTimeSlot,
      getAvailableSlots, getSupplierByUserId,
      createAppointment, updateAppointment, cancelAppointment, approveAppointment, rejectAppointment,
      markNotificationRead, markAllNotificationsRead, addNotification,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be within DataProvider');
  return ctx;
}
