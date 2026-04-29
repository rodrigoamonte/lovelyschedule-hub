import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import storeRoutes from "./modules/stores/store.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import bayRoutes from "./modules/bays/bay.routes.js";
import slotRoutes from "./modules/slots/slot.routes.js";
import appointmentsRoutes from "./modules/appointments/appointment.routes.js";
import { authMiddleware } from "./core/middlewares/auth.middleware.js";
import { prisma } from "./core/database/prisma.js";

const router = Router();

router.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "UP",
      database: "CONNECTED",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "DOWN",
      database: "DISCONNECTED",
      timestamp: new Date().toISOString(),
    });
  }
});

// Pubic
router.use("/auth", authRoutes);

// Private
router.use(authMiddleware);
router.use("/stores", storeRoutes);
router.use("/users", userRoutes);
router.use("/bays", bayRoutes);
router.use("/slots", slotRoutes);
router.use("/appointments", appointmentsRoutes);

export default router;
