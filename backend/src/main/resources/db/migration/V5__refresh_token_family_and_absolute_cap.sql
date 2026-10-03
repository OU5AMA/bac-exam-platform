-- Compatibility migration: V4__add_refresh_token_rotation_tracking.sql adds these columns.
-- IF NOT EXISTS also supports databases that only applied the former V4 migration.
ALTER TABLE refresh_tokens
    ADD COLUMN IF NOT EXISTS token_family_id UUID NOT NULL DEFAULT gen_random_uuid(),
    ADD COLUMN IF NOT EXISTS absolute_expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '12 hours');

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_family_id ON refresh_tokens (token_family_id);

ALTER TABLE refresh_tokens
    ALTER COLUMN token_family_id DROP DEFAULT,
    ALTER COLUMN absolute_expires_at DROP DEFAULT;
