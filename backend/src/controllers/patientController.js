import * as svc from '../services/patientService.js';

export async function list(_req, res, next) {
  try { res.json(await svc.getAllPatients()); } catch (e) { next(e); }
}

export async function getById(req, res, next) {
  try {
    const patient = await svc.getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Not found' });
    res.json(patient);
  } catch (e) { next(e); }
}

export async function create(req, res, next) {
  try {
    const { first_name, last_name, date_of_birth, gender, phone, email, contact_info, family_info } = req.body;
    const data = {
      first_name,
      last_name,
      gender: gender ?? null,
      date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
      contact_info: {
        ...(typeof contact_info === 'object' && contact_info ? contact_info : {}),
        ...(phone ? { phone } : {}),
        ...(email ? { email } : {})
      },
      ...(family_info ? { family_info } : {})
    };
    const created = await svc.createPatient(data);
    res.status(201).json(created);
  } catch (e) { next(e); }
}

export async function update(req, res, next) {
  try {
    const updated = await svc.updatePatient(req.params.id, req.body);
    res.json(updated);
  } catch (e) { next(e); }
}

export async function remove(req, res, next) {
  try { await svc.deletePatient(req.params.id); res.status(204).end(); }
  catch (e) { next(e); }
}
