import * as svc from '../services/invoiceService.js';

export async function createForVisit(req, res, next) {
  try {
    const inv = await svc.createInvoiceForVisit(req.params.visitId, req.body.items || []);
    res.status(201).json(inv);
  } catch (e) { next(e); }
}

export async function getById(req, res, next) {
  try {
    const inv = await svc.getInvoiceById(req.params.invoiceId);
    if (!inv) return res.status(404).json({ error: 'Not found' });
    res.json(inv);
  } catch (e) { next(e); }
}
