// backend/src/services/visitService.js
import prisma from '../prismaClient.js';

export const getAllVisits = () =>
  prisma.visit.findMany({
    include: { patient: true, department: true }
  });

export const getVisitById = (id) =>
  prisma.visit.findUnique({
    where: { visit_id: id },
    include: { patient: true, department: true }
  });

export const createVisit = (data) =>
  prisma.visit.create({ data });

export const updateVisit = (id, data) =>
  prisma.visit.update({ where: { visit_id: id }, data });

export const deleteVisit = (id) =>
  prisma.visit.delete({ where: { visit_id: id } });
