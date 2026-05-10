import 'dotenv/config';
import app from './app';
import prisma from './config/prisma';

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to Postgres database!');
    console.log('🚀 Server running on http://localhost:5000');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
  }
});
