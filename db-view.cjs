require('dotenv').config();
const { PrismaClient } = require('./lib/generated/prisma');
const { withAccelerate } = require('@prisma/extension-accelerate');
const p = new PrismaClient({ accelerateUrl: process.env.DATABASE_URL }).$extends(withAccelerate());
p.user.findMany({ select: { id:true, name:true, email:true, role:true, isVerified:true, createdAt:true }, orderBy: { createdAt:'desc' } })
  .then(u => { console.table(u); process.exit(0) });
