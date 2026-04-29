import { Router } from "express";
import * as controller from "./store.controller.js";
import * as hoursController from "./operating-hour.controller.js";
import { authMiddleware } from "../../core/middlewares/auth.middleware.js";
import { authorize } from "../../core/middlewares/role.middleware.js";

const router = Router();

router.use(authMiddleware);
router.get("/", controller.getAllStores);
router.get("/:id", controller.getStoreById);
router.post("/", authorize(["ADMIN", "ANALYST"]), controller.createStore);
router.patch("/:id", authorize(["ADMIN", "ANALYST"]), controller.updateStore);
router.delete("/:id", authorize(["ADMIN"]), controller.deleteStore);
router.post(
  "/operating-hours",
  authorize(["ADMIN"]),
  hoursController.setupHours,
);
router.delete(
  "/operating-hours/:storeId/:dayOfWeek",
  authorize(["ADMIN"]),
  hoursController.removeHours,
);
router.post(
  "/generate-slots",
  authorize(["ADMIN", "ANALYST"]),
  hoursController.generate,
);

export default router;
