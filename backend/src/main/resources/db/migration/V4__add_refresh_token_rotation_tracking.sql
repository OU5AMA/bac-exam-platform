-- Table is currently empty (no auth code exists yet to have inserted rows),
-- so NOT NULL without a default is safe here.
ALTER TABLE refresh_tokens
    ADD COLUMN token_family_id UUID NOT NULL,
    ADD COLUMN absolute_expires_at TIMESTAMPTZ NOT NULL;

CREATE INDEX idx_refresh_tokens_family_id ON refresh_tokens (token_family_id);