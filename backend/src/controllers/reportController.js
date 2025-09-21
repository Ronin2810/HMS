import * as svc from '../services/reportService.js';

export async function listToday(_req, res, next) {
  try { res.json(await svc.getTodayReports()); } catch (e) { next(e); }
}

export async function create(req, res, next) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'File required' });
    const payload = {
      patient_id: req.body.patient_id,
      visit_id: req.body.visit_id || null,
      file_path: `/uploads/${file.filename}`,
      meta: req.body.meta ? JSON.parse(req.body.meta) : null
    };
    const created = await svc.createReport(payload);
    res.status(201).json(created);
  } catch (e) { next(e); }
}
