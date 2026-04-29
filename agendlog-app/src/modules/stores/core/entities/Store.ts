export interface Store {
  id: string;
  name: string;
  code: string;
  address: string;
  active: boolean;
}

export interface Bay {
  id: string;
  name: string;
  code: string;
  storeId: string;
  location?: string;
}

export interface Slot {
  id: string;
  bayId: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
}

export interface OperatingHour {
  id: string;
  storeId: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  slotDuration: number;
}
