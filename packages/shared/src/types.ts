import type { ColumnKey } from "./columns.js";

export interface Board {
  id: string;
  title: string;
  revision: number;
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  id: string;
  boardId: string;
  title: string;
  body: string;
  columnKey: ColumnKey;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface BoardSnapshot {
  board: Board;
  cards: Card[];
}
