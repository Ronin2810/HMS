import { Router } from 'express';
import * as ctrl from '../controllers/staffController.js';

const router = Router();
router.get(   '/',     ctrl.list);
router.post(  '/',     ctrl.create);
router.delete('/:id',  ctrl.remove);

export default router;
