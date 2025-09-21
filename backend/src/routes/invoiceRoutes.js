import { Router } from 'express';
import * as ctrl from '../controllers/invoiceController.js';
import * as svc from '../services/invoiceService.js';

const r = Router();
r.post('/visit/:visitId', ctrl.createForVisit);
r.get('/:invoiceId', ctrl.getById);
r.get('/:invoiceId/pdf', async (req, res, next) => {
  try {
    const inv = await svc.getInvoiceById(req.params.invoiceId);
    if (!inv) return res.status(404).json({ error: 'Not found' });
    await svc.streamInvoicePdf(res, inv);
  } catch (e) { next(e); }
});
export default r;
