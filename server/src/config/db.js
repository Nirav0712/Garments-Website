const { PrismaClient } = require('@prisma/client');

let prismaOptions = {
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
};

if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  const { Pool } = require('pg');
  const { PrismaPg } = require('@prisma/adapter-pg');

  const connectionString = process.env.DATABASE_URL.replace(/['"]/g, '');
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  prismaOptions.adapter = adapter;
}

const prisma = new PrismaClient(prismaOptions);

module.exports = prisma;
