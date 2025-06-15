// backend/src/services/visitReferralService.js
import prisma from '../prismaClient.js';

export const getReferralsByVisit = (visitId) =>
  prisma.visitReferral.findMany({
    where: { visit_id: visitId },
    include: {
      department: true,
      doctor:     true
    }
  });

export const createReferral = ({ visit_id, referred_dept_id, referred_doctor_id }) =>
  prisma.visitReferral.create({
    data: { visit_id, referred_dept_id, referred_doctor_id }
  });

export const updateReferral = (id, data) =>
  prisma.visitReferral.update({
    where: { referral_id: Number(id) },
    data
  });

export const deleteReferral = (id) =>
  prisma.visitReferral.delete({
    where: { referral_id: Number(id) }
  });
