import type { Server, Socket } from "socket.io";
import { boardJoinSchema } from "@liveboard/shared";
import { getBoardSnapshot } from "../services/boardService.js";

interface ActionRejectedPayload {
  event: string;
  reason: string;
}

function reject(socket: Socket, reason: string) {
  const payload: ActionRejectedPayload = { event: "board:join", reason };
  socket.emit("action:rejected", payload);
}

export function registerBoardHandlers(io: Server) {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("board:join", async (payload: unknown) => {
      const parsed = boardJoinSchema.safeParse(payload);

      if (!parsed.success) {
        reject(socket, "Invalid board id");
        return;
      }

      const { boardId } = parsed.data;

      try {
        const snapshot = await getBoardSnapshot(boardId);

        if (!snapshot) {
          reject(socket, "Board not found");
          return;
        }

        await socket.join(`board:${boardId}`);
        socket.emit("board:snapshot", snapshot);
      } catch (error) {
        console.error("Failed to handle board:join", error);
        reject(socket, "Internal server error");
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`);
    });
  });
}
