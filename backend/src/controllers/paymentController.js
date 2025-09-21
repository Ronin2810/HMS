import * as svc from '../services/paymentService.js';

export async function create(req, res, next) {
  try {
    const pmt = await svc.createPayment(req.params.invoiceId, req.body);
    res.status(201).json(pmt);
  } catch (e) { next(e); }
}
