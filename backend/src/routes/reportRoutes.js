// backend/src/routes/reportRoutes.js
import { Router } from 'express';
import * as ctrl from '../controllers/reportController.js';

const router = Router();
router.get(   '/',      ctrl.list);
router.get(   '/:id',   ctrl.getById);
router.post(  '/',      ctrl.create);
router.put(   '/:id',   ctrl.update);
router.delete('/:id',   ctrl.remove);

export default router;
