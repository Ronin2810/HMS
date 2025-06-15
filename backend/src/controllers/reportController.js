// backend/src/controllers/reportController.js
import * as svc from '../services/reportService.js';

export async function list(req, res, next) {
  try { res.json(await svc.getAllReports()); }
  catch(e){ next(e) }
}

export async function getById(req, res, next) {
  try {
    const rpt = await svc.getReportById(req.params.id);
    if (!rpt) return res.status(404).json({ error: 'Not found' });
    res.json(rpt);
  } catch(e){ next(e) }
}

export async function create(req, res, next) {
  try {
    const created = await svc.createReport(req.body);
    res.status(201).json(created);
  } catch(e){ next(e) }
}

export async function update(req, res, next) {
  try { res.json(await svc.updateReport(req.params.id, req.body)); }
  catch(e){ next(e) }
}

export async function remove(req, res, next) {
  try {
    await svc.deleteReport(req.params.id);
    res.status(204).end();
  } catch(e){ next(e) }
}
