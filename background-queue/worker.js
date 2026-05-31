import { Worker } from "bullmq";
import { sendWelcomeEmail } from "./mailer.js";
import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest:null
});


const worker = new Worker("email-queue",
    async (job)=>{
        const { email, name } = job.data;
      await sendWelcomeEmail(email, name);
      console.log(`Email sent to ${email}`);
    },
    {connection},
    
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed`, err);
});