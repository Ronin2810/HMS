// backend/src/controllers/prescriptionController.js
import * as svc from '../services/prescriptionService.js';

export async function list(req, res, next) {
  try {
    res.json(await svc.getByVisit(req.params.visitId));
  } catch(e){ next(e) }
}

export async function create(req, res, next) {
  try {
    const payload = {
      visit_id:   req.params.visitId,
      patient_id: req.body.patient_id,
      medicines:  req.body.medicines
    };
    const created = await svc.createPrescription(payload);
    res.status(201).json(created);
  } catch(e){ next(e) }
}

export async function update(req, res, next) {
  try { res.json(await svc.updatePrescription(req.params.id, req.body)); }
  catch(e){ next(e) }
}

export async function remove(req, res, next) {
  try {
    await svc.deletePrescription(req.params.id);
    res.status(204).end();
  } catch(e){ next(e) }
}
