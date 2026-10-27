CREATE TABLE IF NOT EXISTS boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  revision integer NOT NULL DEFAULT 0 CHECK (revision >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  column_key text NOT NULL CHECK (column_key IN ('todo', 'in_progress', 'done')),
  position integer NOT NULL CHECK (position >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT cards_board_column_position_unique
    UNIQUE (board_id, column_key, position)
    DEFERRABLE INITIALLY DEFERRED
);

INSERT INTO boards (id, title)
VALUES ('00000000-0000-4000-8000-000000000001', 'LiveBoard')
ON CONFLICT (id) DO NOTHING;

INSERT INTO cards (id, board_id, title, body, column_key, position)
VALUES
  (
    '00000000-0000-4000-8000-000000000101',
    '00000000-0000-4000-8000-000000000001',
    '첫 번째 할 일',
    '보드 화면에 카드가 순서대로 보이는지 확인합니다.',
    'todo',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000102',
    '00000000-0000-4000-8000-000000000001',
    '두 번째 할 일',
    '서버 재시작 후에도 데이터가 유지되는지 확인합니다.',
    'todo',
    1
  ),
  (
    '00000000-0000-4000-8000-000000000201',
    '00000000-0000-4000-8000-000000000001',
    'PostgreSQL 연결 확인',
    '도커 컨테이너의 PostgreSQL에 접속합니다.',
    'in_progress',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000301',
    '00000000-0000-4000-8000-000000000001',
    '모노레포 구성',
    'shared, server, web 워크스페이스를 만듭니다.',
    'done',
    0
  )
ON CONFLICT (id) DO NOTHING;
