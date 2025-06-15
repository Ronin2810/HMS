import * as svc from '../services/staffService.js';

export async function list(req, res, next) {
  try {
    const all = await svc.listStaff();
    res.json(all);
  } catch (e) { next(e) }
}

export async function create(req, res, next) {
  try {
    const { username, password, role_id, dept_id } = req.body;
    const created = await svc.createStaff({ username, password, role_id, dept_id });
    res.status(201).json(created);
  } catch (e) { next(e) }
}

export async function remove(req, res, next) {
  try {
    await svc.deleteStaff(req.params.id);
    res.status(204).end();
  } catch (e) { next(e) }
}
