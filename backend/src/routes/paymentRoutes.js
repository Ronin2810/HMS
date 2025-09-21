import { Router } from 'express';
import * as ctrl from '../controllers/paymentController.js';

const r = Router({ mergeParams: true });
r.post('/', ctrl.create);
export default r;
