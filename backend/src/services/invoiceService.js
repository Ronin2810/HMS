import PDFDocument from 'pdfkit';
import prisma from '../prismaClient.js';

export const createInvoiceForVisit = async (visitId, items) => {
  const total = items.reduce((acc, it) => acc + Number(it.amount || 0), 0);
  return prisma.invoice.create({
    data: { visit_id: visitId, items, total_amount: total },
    include: { visit: { include: { patient: true } } }
  });
};

export const getInvoiceById = (id) =>
  prisma.invoice.findUnique({
    where: { invoice_id: id },
    include: { visit: { include: { patient: true } }, payments: true }
  });

export const streamInvoicePdf = async (res, invoice) => {
  const doc = new PDFDocument({ size: 'A4', margin: 36 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="invoice-${invoice.invoice_id}.pdf"`);
  doc.pipe(res);

  doc.fontSize(20).text('Invoice', { align: 'center' });
  doc.moveDown();
  doc.text(`Invoice ID: ${invoice.invoice_id}`);
  doc.text(`Visit ID: ${invoice.visit_id}`);
  doc.text(`Patient ID: ${invoice.visit?.patient?.patient_id}`);
  doc.text(`Patient: ${invoice.visit?.patient?.first_name} ${invoice.visit?.patient?.last_name}`);
  doc.moveDown();
  doc.text('Items:');
  (invoice.items || []).forEach((it, i) => {
    doc.text(`${i + 1}. ${it.label} - ${Number(it.amount).toFixed(2)}`);
  });
  doc.moveDown();
  doc.text(`Total: ${Number(invoice.total_amount).toFixed(2)}`);
  doc.end();
};
