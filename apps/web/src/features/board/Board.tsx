import { useMemo } from "react";
import {
  COLUMNS,
  COLUMN_KEYS,
  type BoardSnapshot,
  type Card,
  type ColumnKey,
} from "@liveboard/shared";
import { Column } from "./Column";

interface BoardProps {
  snapshot: BoardSnapshot;
}

export function Board({ snapshot }: BoardProps) {
  const cardsByColumn = useMemo(() => {
    const grouped = Object.fromEntries(
      COLUMN_KEYS.map((key) => [key, [] as Card[]]),
    ) as Record<ColumnKey, Card[]>;

    for (const card of snapshot.cards) {
      grouped[card.columnKey].push(card);
    }

    for (const key of COLUMN_KEYS) {
      grouped[key].sort((a, b) => a.position - b.position);
    }

    return grouped;
  }, [snapshot]);

  return (
    <main className="board">
      {COLUMNS.map((column) => (
        <Column
          key={column.key}
          title={column.title}
          cards={cardsByColumn[column.key]}
        />
      ))}
    </main>
  );
}
