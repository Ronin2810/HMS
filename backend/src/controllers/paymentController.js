// backend/src/controllers/paymentController.js
import * as svc from '../services/paymentService.js';

export async function list(req, res, next) {
  try {
    res.json(await svc.getPaymentsByInvoice(req.params.invoiceId));
  } catch (e) { next(e) }
}

export async function create(req, res, next) {
  try {
    const payload = {
      invoice_id: Number(req.params.invoiceId),
      amount_paid:   req.body.amount_paid,
      method:        req.body.method
    };
    const created = await svc.createPayment(payload);
    res.status(201).json(created);
  } catch (e) { next(e) }
}

export async function update(req, res, next) {
  try {
    res.json(await svc.updatePayment(req.params.id, req.body));
  } catch (e) { next(e) }
}

export async function remove(req, res, next) {
  try {
    await svc.deletePayment(req.params.id);
    res.status(204).end();
  } catch (e) { next(e) }
}
