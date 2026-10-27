import { Board } from "./features/board/Board";
import { useBoardSocket } from "./socket/useBoardSocket";
import { useBoardStore } from "./state/boardStore";

const STATUS_LABEL = {
  idle: "대기",
  connecting: "연결 중",
  connected: "연결됨",
  disconnected: "끊김",
  error: "오류",
} as const;

export function App() {
  useBoardSocket();

  const snapshot = useBoardStore((state) => state.snapshot);
  const status = useBoardStore((state) => state.status);
  const error = useBoardStore((state) => state.error);

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>{snapshot ? snapshot.board.title : "LiveBoard"}</h1>
          <p className="board-meta">
            {snapshot ? `revision ${snapshot.board.revision}` : "실시간 보드"}
          </p>
        </div>
        <span className={`status status-${status}`}>{STATUS_LABEL[status]}</span>
      </header>

      {error ? (
        <p className="banner banner-error" role="alert">
          {error}
        </p>
      ) : null}

      {snapshot ? (
        <Board snapshot={snapshot} />
      ) : status === "error" ? null : (
        <p className="loading">보드를 불러오는 중입니다.</p>
      )}
    </div>
  );
}
