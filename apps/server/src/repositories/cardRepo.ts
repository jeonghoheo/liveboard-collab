import type { Card, ColumnKey } from "@liveboard/shared";
import { pool } from "../db/pool.js";

interface CardRow {
  id: string;
  board_id: string;
  title: string;
  body: string;
  column_key: ColumnKey;
  position: number;
  created_at: Date;
  updated_at: Date;
}

export async function listByBoardId(boardId: string): Promise<Card[]> {
  const result = await pool.query<CardRow>(
    `
      SELECT id, board_id, title, body, column_key, position, created_at, updated_at
      FROM cards
      WHERE board_id = $1
      ORDER BY
        CASE column_key
          WHEN 'todo' THEN 0
          WHEN 'in_progress' THEN 1
          ELSE 2
        END,
        position,
        created_at
    `,
    [boardId],
  );

  return result.rows.map((row) => ({
    id: row.id,
    boardId: row.board_id,
    title: row.title,
    body: row.body,
    columnKey: row.column_key,
    position: row.position,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }));
}
