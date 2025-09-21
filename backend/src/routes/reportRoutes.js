import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as ctrl from '../controllers/reportController.js';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ts = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${ts}-${Math.random().toString(36).slice(2)}${ext}`);
  }
});
const upload = multer({ storage });

const r = Router();
r.get('/today', ctrl.listToday);
r.post('/upload', upload.single('file'), ctrl.create);
export default r;
