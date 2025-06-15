import prisma from '../prismaClient.js';

export async function authenticate(username, password) {
  // look up staff with their role
  const user = await prisma.staff.findUnique({
    where: { username },
    include: { role: true }
  });
  if (!user || user.password_hash !== password) {
    throw new Error('Invalid credentials');
  }
  return user;
}
