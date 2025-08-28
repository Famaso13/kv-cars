import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./routes/users";
import { closeDb } from "../data/db";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// Example API
app.use("/users", usersRouter);

// Basic error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

const server = app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

// Graceful shutdown
function shutdown() {
  console.log("Shutting down...");
  server.close(() => {
    closeDb();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
