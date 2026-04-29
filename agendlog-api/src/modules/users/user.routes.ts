import { Router } from "express";
import * as controller from "./user.controller.js";
import { authMiddleware } from "../../core/middlewares/auth.middleware.js";
import { authorize } from "../../core/middlewares/role.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(authorize(["ADMIN"]));

router.get("/", controller.getUsers);
router.post("/", controller.createUser);
router.get('/roles', controller.getRoles);
router.patch("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);

export default router;
