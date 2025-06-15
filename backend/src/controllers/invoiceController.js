// backend/src/controllers/invoiceController.js
import * as svc from '../services/invoiceService.js';

export async function list(req, res, next) {
  try {
    res.json(await svc.getAllInvoices());
  } catch (e) { next(e) }
}

export async function getById(req, res, next) {
  try {
    const inv = await svc.getInvoiceById(req.params.id);
    if (!inv) return res.status(404).json({ error: 'Not found' });
    res.json(inv);
  } catch (e) { next(e) }
}

export async function create(req, res, next) {
  try {
    const created = await svc.createInvoice(req.body);
    res.status(201).json(created);
  } catch (e) { next(e) }
}

export async function update(req, res, next) {
  try {
    res.json(await svc.updateInvoice(req.params.id, req.body));
  } catch (e) { next(e) }
}

export async function remove(req, res, next) {
  try {
    await svc.deleteInvoice(req.params.id);
    res.status(204).end();
  } catch (e) { next(e) }
}
