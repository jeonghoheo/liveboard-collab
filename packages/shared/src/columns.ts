export const COLUMN_KEYS = ["todo", "in_progress", "done"] as const;

export type ColumnKey = (typeof COLUMN_KEYS)[number];

export interface ColumnDefinition {
  key: ColumnKey;
  title: string;
}

export const COLUMNS = [
  { key: "todo", title: "할 일" },
  { key: "in_progress", title: "진행 중" },
  { key: "done", title: "완료" },
] as const satisfies readonly ColumnDefinition[];
