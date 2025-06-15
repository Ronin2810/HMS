// backend/src/services/reportService.js
import prisma from '../prismaClient.js';

export const getAllReports = () =>
  prisma.report.findMany({
    include: { patient: true, visit: true, department: true }
  });

export const getReportById = (id) =>
  prisma.report.findUnique({
    where: { report_id: id },
    include: { patient: true, visit: true, department: true }
  });

export const createReport = (data) =>
  prisma.report.create({ data });

export const updateReport = (id, data) =>
  prisma.report.update({ where: { report_id: id }, data });

export const deleteReport = (id) =>
  prisma.report.delete({ where: { report_id: id } });
