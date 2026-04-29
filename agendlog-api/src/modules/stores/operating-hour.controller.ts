import type { Request, Response } from "express";
import { OperatingHourService } from "./operating-hour.service.js";

const service = new OperatingHourService();

export const setupHours = async (req: Request, res: Response) => {
  const result = await service.setOperatingHour(req.body);
  res.json(result);
};

export const removeHours = async (
  req: Request<{ storeId: string; dayOfWeek: string }>,
  res: Response,
) => {
  try {
    const { storeId, dayOfWeek } = req.params;

    await service.deleteOperatingHour(storeId, Number(dayOfWeek));

    return res.status(204).send();
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const generate = async (req: Request, res: Response) => {
  try {
    const { storeId, date, durationMinutes, force } = req.body as {
      storeId: string;
      date: string;
      durationMinutes?: number;
      force?: boolean;
    };

    const result = await service.generateSlotsForDate(
      storeId,
      date,
      durationMinutes,
      force,
    );

    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
