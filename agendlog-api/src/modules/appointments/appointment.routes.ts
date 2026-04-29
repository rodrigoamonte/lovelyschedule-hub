import { Router } from "express";
import * as controller from "./appointment.controller.js";
import { authorize } from "../../core/middlewares/role.middleware.js";

const router = Router();

router.get("/", authorize(["ADMIN", "ANALYST", "SUPPLIER"]), controller.getAll);
router.get("/my", controller.getMyAppointments);
router.get("/:id", controller.getOne);

router.post("/", controller.createAppointment);
router.patch("/:id", controller.updateAppointment);
router.delete("/:id", controller.deleteAppointment);
router.patch(
  "/:id/approve",
  authorize(["ADMIN", "ANALYST"]),
  controller.approveAppointment,
);

export default router;
