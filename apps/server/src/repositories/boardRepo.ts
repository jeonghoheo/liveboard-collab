import type { Board } from "@liveboard/shared";
import { pool } from "../db/pool.js";

interface BoardRow {
  id: string;
  title: string;
  revision: number;
  created_at: Date;
  updated_at: Date;
}

export async function findById(id: string): Promise<Board | null> {
  const result = await pool.query<BoardRow>(
    `
      SELECT id, title, revision, created_at, updated_at
      FROM boards
      WHERE id = $1
    `,
    [id],
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    revision: row.revision,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}
