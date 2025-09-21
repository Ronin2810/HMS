import { Router } from 'express';
import * as ctrl from '../controllers/visitController.js';

const r = Router();
r.get('/', ctrl.list);
r.get('/:id', ctrl.getById);
r.post('/', ctrl.create);
r.put('/:id', ctrl.update);
r.delete('/:id', ctrl.remove);
r.get('/:id/case-paper.pdf', ctrl.casePaper);
export default r;
