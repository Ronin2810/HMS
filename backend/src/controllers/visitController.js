import PDFDocument from 'pdfkit';
import * as svc from '../services/visitService.js';
import * as psvc from '../services/patientService.js';
import * as dsvc from '../services/departmentService.js';

function normalizeVisitType(v) {
  const t = String(v || '').toLowerCase().trim();
  if (['fresh', 'new', 'opd'].includes(t)) return 'fresh';
  if (['follow_up', 'followup'].includes(t)) return 'follow_up';
  if (['old', 'ipd', 'emergency'].includes(t)) return 'old';
  return 'fresh';
}

export async function list(_req, res, next) {
  try { res.json(await svc.getAllVisits()); } catch (e) { next(e); }
}

export async function getById(req, res, next) {
  try {
    const v = await svc.getVisitById(req.params.id);
    if (!v) return res.status(404).json({ error: 'Not found' });
    res.json(v);
  } catch (e) { next(e); }
}

export async function create(req, res, next) {
  try {
    const payload = { ...req.body, visit_type: normalizeVisitType(req.body.visit_type) };
    const created = await svc.createVisit(payload);
    res.status(201).json(created);
  } catch (e) { next(e); }
}

export async function update(req, res, next) {
  try {
    const updated = await svc.updateVisit(req.params.id, req.body);
    res.json(updated);
  } catch (e) { next(e); }
}

export async function remove(req, res, next) {
  try { await svc.deleteVisit(req.params.id); res.status(204).end(); }
  catch (e) { next(e); }
}

// 📄 Case Paper PDF
export async function casePaper(req, res, next) {
  try {
    const visit = await svc.getVisitById(req.params.id);
    if (!visit) return res.status(404).json({ error: 'Not found' });

    const patient = visit.patient || await psvc.getPatientById(visit.patient_id);
    const dept = visit.department || (visit.dept_id ? await dsvc.getDepartmentById(visit.dept_id) : null);

    const doc = new PDFDocument({ size: 'A4', margin: 36 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="case-paper-${visit.visit_id}.pdf"`);
    doc.pipe(res);

    doc.fontSize(20).text('Case Paper', { align: 'center' });
    doc.moveDown();
    doc.text(`Visit ID: ${visit.visit_id}`);
    doc.text(`Patient ID: ${patient?.patient_id}`);
    doc.text(`Patient: ${patient?.first_name} ${patient?.last_name}`);
    if (patient?.date_of_birth) doc.text(`DOB: ${new Date(patient.date_of_birth).toLocaleDateString()}`);
    if (patient?.gender) doc.text(`Gender: ${patient.gender}`);
    doc.text(`Department: ${dept?.name || '—'}`);
    doc.text(`Visit Type: ${visit.visit_type}`);
    doc.end();
  } catch (e) { next(e); }
}
