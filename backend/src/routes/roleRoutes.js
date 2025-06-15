import { Router } from 'express';
import prisma from '../prismaClient.js';
const r = Router();
r.get('/', async (_q,res)=>res.json(await prisma.role.findMany()));
export default r;