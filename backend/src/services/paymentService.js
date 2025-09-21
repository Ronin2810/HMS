import prisma from '../prismaClient.js';

export const createPayment = (invoiceId, { method, reference, amount }) =>
  prisma.payment.create({
    data: {
      invoice_id: invoiceId,
      method,
      reference: reference || null,
      amount: Number(amount || 0)
    }
  });
