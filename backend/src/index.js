// backend/src/index.js
import express from 'express';
import patientRoutes from './routes/patientRoutes.js';
import visitRoutes   from './routes/visitRoutes.js';
import referralRoutes from './routes/visitReferralRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import authRoutes from './routes/authRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import deptRoutes from './routes/departmentRoutes.js';


import errorHandler  from './middleware/errorHandler.js';

const app = express();
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.send('OK'));

// API routes
app.use('/patients', patientRoutes);
app.use('/visits', visitRoutes);
app.use('/visits/:visitId/referrals', referralRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/invoices/:invoiceId/payments', paymentRoutes);
app.use('/reports', reportRoutes);
app.use('/visits/:visitId/prescriptions', prescriptionRoutes);
app.use('/auth', authRoutes);
app.use('/staff', staffRoutes);
app.use('/roles',       roleRoutes);
app.use('/departments', deptRoutes);

// Error handler (must be last)
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Backend listening on port ${port}`);
});
