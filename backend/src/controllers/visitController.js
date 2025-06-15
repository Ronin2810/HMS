// backend/src/controllers/visitController.js
import * as svc from '../services/visitService.js';

export async function list(req, res, next) {
  try {
    const visits = await svc.getAllVisits();
    res.json(visits);
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const visit = await svc.getVisitById(req.params.id);
    if (!visit) return res.status(404).json({ error: 'Not found' });
    res.json(visit);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const created = await svc.createVisit(req.body);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const updated = await svc.updateVisit(req.params.id, req.body);
    res.json(updated);
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    await svc.deleteVisit(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
}
