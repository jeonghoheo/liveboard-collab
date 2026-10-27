import express from "express";
import { env } from "./config/env.js";
import { pool } from "./db/pool.js";
import { boardsRouter } from "./http/routes/boards.js";

const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/boards", boardsRouter);

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  },
);

const server = app.listen(env.SERVER_PORT, () => {
  console.log(`Server listening on http://localhost:${env.SERVER_PORT}`);
});

function shutdown(signal: string) {
  console.log(`${signal} received, shutting down`);

  server.close(() => {
    pool
      .end()
      .then(() => {
        process.exit(0);
      })
      .catch((error) => {
        console.error("Failed to close PostgreSQL pool", error);
        process.exit(1);
      });
  });
}

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});
