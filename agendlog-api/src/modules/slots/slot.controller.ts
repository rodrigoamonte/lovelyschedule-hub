import type { Request, Response } from "express";
import { SlotService } from "./slot.service.js";

const slotService = new SlotService();

export const getSlots = async (req: Request, res: Response) => {
  try {
    const { bayId, date, storeId } = req.query;

    const slots = await slotService.findAll({
      bayId: bayId as string,
      date: date as string,
      storeId: storeId as string,
    });

    return res.json(slots);
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const createSlot = async (req: Request, res: Response) => {
  try {
    const { bayId, startTime, endTime, maxCapacity } = req.body;

    const slot = await slotService.create({
      bayId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      maxCapacity: maxCapacity || 1,
    });

    return res.status(201).json(slot);
  } catch (error: any) {
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message });
  }
};

export const deleteSlot = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    await slotService.delete(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
