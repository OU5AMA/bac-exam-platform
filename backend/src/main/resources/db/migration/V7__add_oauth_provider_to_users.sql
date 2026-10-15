ALTER TABLE users
    ADD COLUMN oauth_provider VARCHAR(32),
    ADD COLUMN oauth_subject VARCHAR(255),
    ADD COLUMN display_name VARCHAR(255);

CREATE UNIQUE INDEX users_oauth_identity_unique
    ON users (oauth_provider, oauth_subject)
    WHERE oauth_provider IS NOT NULL;
