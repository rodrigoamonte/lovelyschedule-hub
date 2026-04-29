import { Router } from 'express';
import * as controller from './slot.controller.js';
import { authMiddleware } from '../../core/middlewares/auth.middleware.js';
import { authorize } from '../../core/middlewares/role.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', controller.getSlots);
router.post('/', authorize(['ADMIN', 'ANALYST']), controller.createSlot);
router.delete('/:id', authorize(['ADMIN', 'ANALYST']), controller.deleteSlot);

export default router;
