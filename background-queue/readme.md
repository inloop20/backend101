# Email Queue System (BullMQ + Nodemailer + Redis)

A scalable background email system using **BullMQ**, **Redis (Docker)**, and **Nodemailer**.  
It offloads email sending from your API using a queue-based architecture.

---

## Features

- Background email processing with BullMQ
- Nodemailer (Gmail SMTP)
- Redis via Docker
- Non-blocking signup flow
- Retry support for failed jobs
- Clean producer / worker separation

---

## Architecture

Client -> Express API -> BullMQ Queue -> Redis -> Worker -> Nodemailer -> Email Sent

---

## Tech Stack

- Node.js
- Express.js
- BullMQ
- Redis (Docker)
- Nodemailer
- dotenv

---

## Redis Setup (Docker)

### docker-compose.yml

```yaml
version: "3.8"

services:
  redis:
    image: redis:7
    container_name: redis-bullmq
    ports:
      - "6379:6379"
```

### Start Redis

```bash
docker compose up -d
```

---

## Project Structure

```
project/
├── server.js
├── worker.js
├── queue.js
├── mailer.js
├── .env
├── docker-compose.yml
```

---

## Installation

```bash
git clone https://github.com/Abubakar2105/backend101/background-queue.git
npm install
```

---

## Environment Variables

Create a `.env` file:

```env
PORT=3000

REDIS_HOST=localhost
REDIS_PORT=6379

EMAIL_USER=yourgmail@gmail.com
EMAIL_APP_PASSWORD=your_app_password
```

> Use Gmail **App Password**, not your normal password.

---

## Run the Project

### 1. Start Redis

```bash
docker compose up -d
```

### 2. Start Worker

```bash
node worker.js
```

### 3. Start API Server

```bash
node server.js
```

---

## API Endpoint

### POST /signup

Creates a user and queues a welcome email.

### Request

```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

### Response

```json
{
  "message": "User created, email queued",
  "user": {
    "id": 123456,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

## How It Works

### 1. Signup request hits API

User is created (mock or DB)

### 2. Job added to queue

```js
await emailQueue.add("send-welcome-email", {
  email,
  name
});
```

### 3. Worker processes job

BullMQ pulls job from Redis

### 4. Email sent

Nodemailer sends email via Gmail SMTP

---

## Queue Setup

### queue.js

```js
import { Queue } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

export const emailQueue = new Queue("email-queue", {
  connection,
});
```

---

## Worker

### worker.js

```js
import { Worker } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";
import { sendWelcomeEmail } from "./mailer.js";

dotenv.config();

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const worker = new Worker(
  "email-queue",
  async (job) => {
    if (job.name === "send-welcome-email") {
      const { email, name } = job.data;
      await sendWelcomeEmail(email, name);
      console.log("Email sent:", email);
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed`, err);
});
```

---

## Mailer (Nodemailer)

### mailer.js

```js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function sendWelcomeEmail(email, name) {
  await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome",
    text: `Hello ${name}, welcome to our platform!`,
  });
}
```

---

## Common Issues

### Gmail Auth Error (EAUTH 535)

- Enable 2FA
- Generate App Password
- Use App Password in `.env`

---

### Redis not running

```bash
docker ps
```

---

## Future Improvements

- HTML email templates (MJML / Handlebars)
- Retry + exponential backoff
- Bull Board dashboard
- Multiple queues (auth, notifications)
- Production email provider (SendGrid / SES)

---

## What You Learn

- Background job processing
- Queue architecture
- Redis usage
- Scalable backend systems
- Email delivery pipelines

---

## License

MIT
