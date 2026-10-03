ALTER TABLE refresh_tokens
    ADD COLUMN token_family_id     UUID        NOT NULL DEFAULT gen_random_uuid(),
    ADD COLUMN absolute_expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '12 hours');

CREATE INDEX idx_refresh_tokens_token_family_id ON refresh_tokens (token_family_id);

ALTER TABLE refresh_tokens
    ALTER COLUMN token_family_id     DROP DEFAULT,
    ALTER COLUMN absolute_expires_at DROP DEFAULT;
