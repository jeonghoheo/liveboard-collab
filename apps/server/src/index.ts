import { createServer } from "node:http";
import cors from "cors";
import express from "express";
import { Server as SocketServer } from "socket.io";
import { env } from "./config/env.js";
import { pool } from "./db/pool.js";
import { boardsRouter } from "./http/routes/boards.js";
import { registerBoardHandlers } from "./sockets/boardHandlers.js";

const app = express();

app.use(cors({ origin: env.WEB_ORIGIN }));
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

const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: { origin: env.WEB_ORIGIN },
});

registerBoardHandlers(io);

httpServer.listen(env.SERVER_PORT, () => {
  console.log(`Server listening on http://localhost:${env.SERVER_PORT}`);
});

function shutdown(signal: string) {
  console.log(`${signal} received, shutting down`);

  io.close(() => {
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
