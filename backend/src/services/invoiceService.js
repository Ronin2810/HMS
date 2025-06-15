// backend/src/services/invoiceService.js
import prisma from '../prismaClient.js';

export const getAllInvoices = () =>
  prisma.invoice.findMany({
    include: { visit: true, payments: true }
  });

export const getInvoiceById = (id) =>
  prisma.invoice.findUnique({
    where: { invoice_id: Number(id) },
    include: { visit: true, payments: true }
  });

export const createInvoice = (data) =>
  prisma.invoice.create({ data });

export const updateInvoice = (id, data) =>
  prisma.invoice.update({
    where: { invoice_id: Number(id) },
    data
  });

export const deleteInvoice = (id) =>
  prisma.invoice.delete({
    where: { invoice_id: Number(id) }
  });
