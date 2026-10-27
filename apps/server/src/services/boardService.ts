import type { BoardSnapshot } from "@liveboard/shared";
import { findById as findBoardById } from "../repositories/boardRepo.js";
import { listByBoardId } from "../repositories/cardRepo.js";

export async function getBoardSnapshot(
  boardId: string,
): Promise<BoardSnapshot | null> {
  const board = await findBoardById(boardId);

  if (!board) {
    return null;
  }

  const cards = await listByBoardId(boardId);

  return { board, cards };
}
