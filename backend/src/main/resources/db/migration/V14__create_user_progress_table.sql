CREATE TABLE IF NOT EXISTS user_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    unit_number INT NOT NULL CHECK (unit_number > 0),
    skill VARCHAR(32) NOT NULL,
    score INT NOT NULL CHECK (score >= 0),
    max_score INT NOT NULL CHECK (max_score > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_user_progress_score CHECK (score <= max_score)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
