import prisma from '../prismaClient.js';

export const getDepartmentById = (id) =>
  prisma.department.findUnique({ where: { dept_id: id } });
