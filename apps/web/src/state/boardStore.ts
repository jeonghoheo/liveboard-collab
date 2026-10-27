import { create } from "zustand";
import type { BoardSnapshot } from "@liveboard/shared";

export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

interface BoardState {
  snapshot: BoardSnapshot | null;
  status: ConnectionStatus;
  error: string | null;
  setSnapshot: (snapshot: BoardSnapshot) => void;
  setStatus: (status: ConnectionStatus) => void;
  setError: (error: string | null) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  snapshot: null,
  status: "idle",
  error: null,
  setSnapshot: (snapshot) => {
    set({ snapshot, error: null });
  },
  setStatus: (status) => {
    set({ status });
  },
  setError: (error) => {
    set({ error });
  },
}));
