import api from "@/shared/lib/api";
import {
  Store,
  Bay,
  Slot,
  OperatingHour,
} from "@/modules/stores/core/entities/Store";

export class StoreRepository {
  static async getAll(): Promise<Store[]> {
    const { data } = await api.get<Store[]>("/stores");
    return data;
  }

  static async create(payload: Omit<Store, "id">): Promise<Store> {
    const { data } = await api.post<Store>("/stores", payload);
    return data;
  }

  static async update(id: string, payload: Partial<Store>): Promise<void> {
    await api.patch(`/stores/${id}`, payload);
  }

  static async setOperatingHours(
    payload: Omit<OperatingHour, "id">,
  ): Promise<void> {
    await api.post("/stores/operating-hours", payload);
  }

  static async getOperatingHours(storeId?: string): Promise<OperatingHour[]> {
    const { data } = await api.get<OperatingHour[]>("/stores/operating-hours", {
      params: { storeId },
    });
    return data;
  }

  static async deleteOperatingHour(id: string): Promise<void> {
    await api.delete(`/stores/operating-hours/${id}`);
  }

  static async generateSlots(payload: {
    storeId: string;
    date: string;
    durationMinutes: number;
    force: boolean;
  }): Promise<void> {
    await api.post("/stores/generate-slots", payload);
  }

  static async getBays(storeId?: string): Promise<Bay[]> {
    const { data } = await api.get<Bay[]>("/bays", { params: { storeId } });
    return data;
  }

  static async createBay(payload: Omit<Bay, "id">): Promise<Bay> {
    const { data } = await api.post<Bay>("/bays", payload);
    return data;
  }

  static async updateBay(id: string, payload: Partial<Bay>): Promise<void> {
    await api.patch(`/bays/${id}`, payload);
  }

  static async deleteBay(id: string): Promise<void> {
    await api.delete(`/bays/${id}`);
  }

  static async getSlots(params: {
    bayId?: string;
    date?: string;
    storeId?: string;
  }): Promise<Slot[]> {
    const { data } = await api.get<Slot[]>("/slots", { params });
    return data;
  }

  static async createSlot(payload: Omit<Slot, "id">): Promise<Slot> {
    const { data } = await api.post<Slot>("/slots", payload);
    return data;
  }
}
