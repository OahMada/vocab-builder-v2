import 'server-only';

import { PrismaClient } from '../../generated/prisma/client.js';

let globalForPrisma = global as unknown as {
	prisma: PrismaClient;
};

let prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
