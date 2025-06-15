// backend/src/controllers/patientController.js
import * as svc from '../services/patientService.js';

export async function list(req, res, next) {
  try {
    const patients = await svc.getAllPatients();
    res.json(patients);
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const patient = await svc.getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Not found' });
    res.json(patient);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const created = await svc.createPatient(req.body);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const updated = await svc.updatePatient(req.params.id, req.body);
    res.json(updated);
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    await svc.deletePatient(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
}
