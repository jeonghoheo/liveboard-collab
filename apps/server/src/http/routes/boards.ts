import { Router } from "express";
import { boardParamsSchema } from "@liveboard/shared";
import { getBoardSnapshot } from "../../services/boardService.js";

export const boardsRouter = Router();

boardsRouter.get("/:id", async (req, res, next) => {
  const parsed = boardParamsSchema.safeParse(req.params);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid board id" });
    return;
  }

  try {
    const snapshot = await getBoardSnapshot(parsed.data.id);

    if (!snapshot) {
      res.status(404).json({ error: "Board not found" });
      return;
    }

    res.json(snapshot);
  } catch (error) {
    next(error);
  }
});
