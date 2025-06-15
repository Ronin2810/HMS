import prisma from '../prismaClient.js';

export const listStaff = () =>
  prisma.staff.findMany({ include: { role: true, department: true } });

export const createStaff = ({ username, password, role_id, dept_id }) =>
  prisma.staff.create({
    data: {
      username,
      password_hash: password,
      role_id: Number(role_id),
      dept_id: dept_id ? Number(dept_id) : null
    }
  });

export const deleteStaff = (id) =>
  prisma.staff.delete({ where: { staff_id: Number(id) } });
