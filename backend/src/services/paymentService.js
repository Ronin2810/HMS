// backend/src/services/paymentService.js
import prisma from '../prismaClient.js';

export const getPaymentsByInvoice = (invoiceId) =>
  prisma.payment.findMany({
    where: { invoice_id: Number(invoiceId) }
  });

export const createPayment = (data) =>
  prisma.payment.create({ data });

export const updatePayment = (id, data) =>
  prisma.payment.update({
    where: { payment_id: Number(id) },
    data
  });

export const deletePayment = (id) =>
  prisma.payment.delete({
    where: { payment_id: Number(id) }
  });
