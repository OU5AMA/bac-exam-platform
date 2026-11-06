CREATE TABLE user_daily_challenge_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    challenge_date DATE NOT NULL,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    score INT,
    badge_awarded BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uk_daily_challenge_user_date UNIQUE (user_id, challenge_date)
);
