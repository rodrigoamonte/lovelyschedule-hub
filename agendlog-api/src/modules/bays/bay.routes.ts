import { Router } from "express";
import * as controller from "./bay.controller.js";
import { authMiddleware } from "../../core/middlewares/auth.middleware.js";
import { authorize } from "../../core/middlewares/role.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", controller.getBays);
router.get("/:id", controller.getBayById);

router.post("/", authorize(["ADMIN", "ANALYST"]), controller.createBay);
router.patch("/:id", authorize(["ADMIN", "ANALYST"]), controller.updateBay);
router.delete("/:id", authorize(["ADMIN"]), controller.deleteBay);

export default router;
