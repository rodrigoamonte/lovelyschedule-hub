import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  INITIAL_SUPPLIERS, INITIAL_UNITS, INITIAL_WINDOWS, INITIAL_APPOINTMENTS, INITIAL_NOTIFICATIONS,
  type Supplier, type Unit, type ReceivingWindow, type Appointment, type Notification, type AppointmentStatus,
} from '@/lib/mock-data';

interface DataContextType {
  suppliers: Supplier[];
  units: Unit[];
  windows: ReceivingWindow[];
  appointments: Appointment[];
  notifications: Notification[];
  addSupplier: (s: Omit<Supplier, 'id'>) => void;
  addUnit: (u: Omit<Unit, 'id'>) => void;
  addWindow: (w: Omit<ReceivingWindow, 'id'>) => void;
  addAppointment: (a: Omit<Appointment, 'id' | 'createdAt'>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  markNotificationRead: (id: string) => void;
  addNotification: (n: Omit<Notification, 'id' | 'createdAt'>) => void;
  getBookingsCount: (windowId: string, date: string) => number;
}

const DataContext = createContext<DataContextType | null>(null);

let idCounter = 100;
const genId = () => `gen_${idCounter++}`;

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);
  const [windows, setWindows] = useState<ReceivingWindow[]>(INITIAL_WINDOWS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const addSupplier = useCallback((s: Omit<Supplier, 'id'>) => {
    setSuppliers(prev => [...prev, { ...s, id: genId() }]);
  }, []);

  const addUnit = useCallback((u: Omit<Unit, 'id'>) => {
    setUnits(prev => [...prev, { ...u, id: genId() }]);
  }, []);

  const addWindow = useCallback((w: Omit<ReceivingWindow, 'id'>) => {
    setWindows(prev => [...prev, { ...w, id: genId() }]);
  }, []);

  const addAppointment = useCallback((a: Omit<Appointment, 'id' | 'createdAt'>) => {
    setAppointments(prev => [...prev, { ...a, id: genId(), createdAt: new Date().toISOString() }]);
  }, []);

  const updateAppointmentStatus = useCallback((id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'createdAt'>) => {
    setNotifications(prev => [{ ...n, id: genId(), createdAt: new Date().toISOString() }, ...prev]);
  }, []);

  const getBookingsCount = useCallback((windowId: string, date: string) => {
    return appointments.filter(a => a.windowId === windowId && a.date === date && a.status !== 'rejeitado').length;
  }, [appointments]);

  return (
    <DataContext.Provider value={{
      suppliers, units, windows, appointments, notifications,
      addSupplier, addUnit, addWindow, addAppointment,
      updateAppointmentStatus, markNotificationRead, addNotification, getBookingsCount,
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
