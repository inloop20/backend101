import { Queue } from "bullmq";
import dotenv from "dotenv";
import IORedis from 'ioredis'

dotenv.config()

const connections = new IORedis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    maxRetriesPerRequest:null
});

export const emailQueue = new Queue("email-queue",{
    connections
});