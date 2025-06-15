// backend/src/controllers/visitReferralController.js
import * as svc from '../services/visitReferralService.js';

export async function list(req, res, next) {
  try {
    const visitId = req.params.visitId;
    const items   = await svc.getReferralsByVisit(visitId);
    res.json(items);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const payload = {
      visit_id:           req.params.visitId,
      referred_dept_id:   req.body.referred_dept_id,
      referred_doctor_id: req.body.referred_doctor_id
    };
    const created = await svc.createReferral(payload);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const updated = await svc.updateReferral(req.params.id, req.body);
    res.json(updated);
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    await svc.deleteReferral(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
}
