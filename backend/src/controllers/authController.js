// backend/src/controllers/authController.js
import { authenticate } from '../services/authService.js';

export async function login(req, res, next) {
  const { username, password, role: requestedRole } = req.body;
  try {
    const user = await authenticate(username, password);
    // Reject if the picked role doesn't match their actual role
    if (user.role.name !== requestedRole) {
      return res.status(403).json({ error: 'Role does not match credentials' });
    }
    // OK, send back their staff info
    res.json({
      staff_id:  user.staff_id,
      username:  user.username,
      role:      user.role.name,
      dept_id:   user.dept_id
    });
  } catch (e) {
    res.status(401).json({ error: 'Invalid username or password' });
  }
}
