import express from "express";
import dotenv from "dotenv";
import { emailQueue } from "./queue.js";

dotenv.config();

const app = express();
app.use(express.json());


app.post("/signup", async (req, res) => {
  const { email, name } = req.body;

  const user = { id: Date.now(), email, name };

  await emailQueue.add("send-welcome-email", {
    email: user.email,
    name: user.name,
  },
  {
    attempts: 3,
    backoff:{
        type:'exponential',
        delay:1000
    }
  }
);

  res.json({
    message: "User created, email queued",
    user,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});