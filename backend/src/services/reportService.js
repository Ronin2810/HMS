import prisma from '../prismaClient.js';

function todayBounds() {
  const now = new Date();
  const start = new Date(now); start.setHours(0,0,0,0);
  const end = new Date(now); end.setHours(23,59,59,999);
  return { start, end };
}

export const getTodayReports = () =>
  prisma.report.findMany({
    where: { created_at: { gte: todayBounds().start, lte: todayBounds().end } },
    include: { patient: true, visit: true }
  });

export const createReport = (data) =>
  prisma.report.create({ data, include: { patient: true, visit: true } });
