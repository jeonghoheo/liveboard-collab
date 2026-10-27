import type { BoardSnapshot } from "@liveboard/shared";

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:4000";

export async function fetchBoardSnapshot(
  boardId: string,
): Promise<BoardSnapshot> {
  const response = await fetch(`${SERVER_URL}/api/boards/${boardId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch board: ${response.status}`);
  }

  return (await response.json()) as BoardSnapshot;
}
