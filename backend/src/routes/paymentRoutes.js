// backend/src/routes/paymentRoutes.js
import { Router } from 'express';
import * as ctrl from '../controllers/paymentController.js';

const router = Router({ mergeParams: true });
router.get(   '/',      ctrl.list);
router.post(  '/',      ctrl.create);
router.put(   '/:id',   ctrl.update);
router.delete('/:id',   ctrl.remove);

export default router;
