import 'dotenv/config';import app from './app.js';import {PrismaClient} from '@prisma/client';
if(!process.env.JWT_SECRET||process.env.JWT_SECRET.length<32){console.error('JWT_SECRET must be configured with at least 32 characters in server/.env');process.exit(1)}
const prisma=new PrismaClient();const port=Number(process.env.PORT)||5000;
try{await prisma.$connect();app.listen(port,()=>console.log(`NovaCart API running at http://localhost:${port}`))}catch(e){console.error('Could not connect to PostgreSQL. Check DATABASE_URL and ensure PostgreSQL is running.',e.message);process.exit(1)}
process.on('SIGINT',async()=>{await prisma.$disconnect();process.exit(0)});process.on('SIGTERM',async()=>{await prisma.$disconnect();process.exit(0)});
