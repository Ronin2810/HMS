import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import visitRoutes from './routes/visitRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// routes
app.use('/patients', patientRoutes);
app.use('/visits', visitRoutes);
app.use('/reports', reportRoutes);
app.use('/prescriptions', prescriptionRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/invoices/:invoiceId/payments', paymentRoutes);

// uploads
import path from 'path';
import fs from 'fs';
const uploadDir = '/app/uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
