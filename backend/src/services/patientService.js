// backend/src/services/patientService.js
import prisma from '../prismaClient.js';

export const getAllPatients = () =>
  prisma.patient.findMany();

export const getPatientById = (id) =>
  prisma.patient.findUnique({ where: { patient_id: id } });

export const createPatient = (data) =>
  prisma.patient.create({ data });

export const updatePatient = (id, data) =>
  prisma.patient.update({ where: { patient_id: id }, data });

export const deletePatient = (id) =>
  prisma.patient.delete({ where: { patient_id: id } });
