import { Router } from 'express';
import * as ctrl from '../controllers/prescriptionController.js';

const r = Router();
r.get('/today', ctrl.listToday);
r.get('/by-visit/:visitId', ctrl.listByVisit);
r.post('/', ctrl.create);
export default r;
