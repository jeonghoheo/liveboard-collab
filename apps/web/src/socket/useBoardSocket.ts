import { useEffect } from "react";
import type { BoardSnapshot } from "@liveboard/shared";
import { socket } from "./socket";
import { useBoardStore } from "../state/boardStore";

const BOARD_ID =
  import.meta.env.VITE_BOARD_ID ?? "00000000-0000-4000-8000-000000000001";

interface ActionRejectedPayload {
  event: string;
  reason: string;
}

export function useBoardSocket() {
  const setSnapshot = useBoardStore((state) => state.setSnapshot);
  const setStatus = useBoardStore((state) => state.setStatus);
  const setError = useBoardStore((state) => state.setError);

  useEffect(() => {
    setStatus("connecting");
    setError(null);

    function handleConnect() {
      setStatus("connected");
      setError(null);
      socket.emit("board:join", { boardId: BOARD_ID });
    }

    function handleDisconnect() {
      setStatus("disconnected");
    }

    function handleSnapshot(snapshot: BoardSnapshot) {
      setSnapshot(snapshot);
      setStatus("connected");
    }

    function handleRejected(payload: ActionRejectedPayload) {
      setError(payload.reason);
      setStatus("error");
    }

    function handleConnectError() {
      setError("서버에 연결할 수 없습니다.");
      setStatus("error");
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("board:snapshot", handleSnapshot);
    socket.on("action:rejected", handleRejected);
    socket.on("connect_error", handleConnectError);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("board:snapshot", handleSnapshot);
      socket.off("action:rejected", handleRejected);
      socket.off("connect_error", handleConnectError);
      socket.disconnect();
    };
  }, [setError, setSnapshot, setStatus]);
}
