import * as svc from '../services/prescriptionService.js';

export async function listToday(_req, res, next) {
  try { res.json(await svc.getTodayPrescriptions()); } catch (e) { next(e); }
}

export async function listByVisit(req, res, next) {
  try { res.json(await svc.getByVisit(req.params.visitId)); } catch (e) { next(e); }
}

export async function create(req, res, next) {
  try { res.status(201).json(await svc.createPrescription(req.body)); }
  catch (e) { next(e); }
}
