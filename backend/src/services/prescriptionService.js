// backend/src/services/prescriptionService.js
import prisma from '../prismaClient.js';

export const getByVisit = (visitId) =>
  prisma.prescription.findMany({
    where: { visit_id: visitId }
  });

export const createPrescription = ({ visit_id, patient_id, medicines }) =>
  prisma.prescription.create({ data: { visit_id, patient_id, medicines } });

export const updatePrescription = (id, data) =>
  prisma.prescription.update({ where: { prescription_id: id }, data });

export const deletePrescription = (id) =>
  prisma.prescription.delete({ where: { prescription_id: id } });
