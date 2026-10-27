import { z } from "zod";
import { COLUMN_KEYS } from "./columns.js";

export const boardIdSchema = z.uuid();

export const boardParamsSchema = z.object({
  id: boardIdSchema,
});

export const boardJoinSchema = z.object({
  boardId: boardIdSchema,
});

export const cardMoveSchema = z.object({
  cardId: z.uuid(),
  toColumn: z.enum(COLUMN_KEYS),
  toIndex: z.number().int().min(0),
});

export type BoardJoinInput = z.infer<typeof boardJoinSchema>;
export type CardMoveInput = z.infer<typeof cardMoveSchema>;
