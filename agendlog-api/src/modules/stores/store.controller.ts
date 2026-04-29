import type { Request, Response } from "express";
import { StoreService } from "./store.service.js";

const storeService = new StoreService();

export const getAllStores = async (req: Request, res: Response) => {
  const stores = await storeService.findAll();
  return res.json(stores);
};

export const getStoreById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const store = await storeService.findById(id);

  if (!store) return res.status(404).json({ message: "Store not found" });
  return res.json(store);
};

export const createStore = async (req: Request, res: Response) => {
  const { code } = req.body;

  const existing = await storeService.findByCode(code);
  if (existing) {
    return res
      .status(400)
      .json({ message: "This code is already being used by an active store." });
  }

  try {
    const store = await storeService.create(req.body);
    return res.status(201).json(store);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({
        message:
          "Code conflicts with an archived record. Please contact support.",
      });
    }
    return res.status(500).json({ message: "Internal error" });
  }
};

export const updateStore = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  try {
    const existingStore = await storeService.findById(id);
    if (!existingStore) {
      return res.status(404).json({ message: "Store not found for update" });
    }

    const updatedStore = await storeService.update(id, req.body);
    return res.json(updatedStore);
  } catch (error) {
    return res.status(500).json({ message: "Internal error while updating" });
  }
};

export const deleteStore = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  try {
    const existingStore = await storeService.findById(id);
    if (!existingStore)
      return res.status(404).json({ message: "Store not found" });

    await storeService.delete(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Error deleting store" });
  }
};
