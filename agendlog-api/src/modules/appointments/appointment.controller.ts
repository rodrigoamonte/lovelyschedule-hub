import type { Request, Response } from "express";
import { AppointmentService } from "./appointment.service.js";
import { Role } from "@prisma/client";

const service = new AppointmentService();

export const createAppointment = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const {
      deliverySlotIds,
      supplierId,
      merchandise,
      notes,
      orderNumber,
      totalValue,
    } = req.body;

    if (!Array.isArray(deliverySlotIds) || deliverySlotIds.length === 0) {
      return res.status(400).json({ message: "Select at least one slot" });
    }

    const appointment = await service.create({
      deliverySlotIds,
      supplierId: supplierId || req.user.id,
      createdById: req.user.id,
      merchandise,
      orderNumber,
      totalValue,
      notes,
    });

    return res.status(201).json(appointment);
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getMyAppointments = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const data = await service.findMyAppointments(req.user.id);
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { storeId, status, includeDeleted } = req.query;
    const data = await service.findAll(req.user, {
      storeId: storeId as string,
      status: status as any,
      includeDeleted: includeDeleted === "true",
    });
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOne = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const data = await service.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateAppointment = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const data = await service.update(req.params.id, req.user.id, req.body);
    return res.json(data);
  } catch (error: any) {
    return res.status(error.statusCode || 400).json({ message: error.message });
  }
};

export const deleteAppointment = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { reason } = req.body;
    await service.delete(req.params.id, req.user.id, reason);
    return res.status(204).send();
  } catch (error: any) {
    return res.status(error.statusCode || 400).json({ message: error.message });
  }
};

export const approveAppointment = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== Role.ADMIN && req.user.role !== Role.ANALYST) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const data = await service.approve(req.params.id, req.user.id);
    return res.json(data);
  } catch (error: any) {
    return res.status(error.statusCode || 400).json({ message: error.message });
  }
};
