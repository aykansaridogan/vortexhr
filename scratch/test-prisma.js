const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
console.log('Prisma Client class found:', !!PrismaClient);
console.log('Prisma instance created:', !!prisma);
process.exit(0);
