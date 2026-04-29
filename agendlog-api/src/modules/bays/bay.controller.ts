import type { Request, Response } from "express";
import { BayService } from "./bay.service.js";

const bayService = new BayService();

export const getBays = async (req: Request, res: Response) => {
  const { storeId } = req.query;
  const bays = await bayService.findAll(storeId as string);
  res.json(bays);
};

export const getBayById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const bay = await bayService.findById(req.params.id);
  if (!bay) return res.status(404).json({ message: "Bay not found" });
  res.json(bay);
};

export const createBay = async (req: Request, res: Response) => {
  try {
    const { name, code, storeId, location } = req.body;

    if (!storeId)
      return res.status(400).json({ message: "O ID da loja é obrigatório" });

    const bay = await bayService.create({ name, code, storeId, location });
    res.status(201).json(bay);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const updateBay = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const bay = await bayService.update(req.params.id, req.body);
    res.json(bay);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteBay = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    await bayService.delete(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
