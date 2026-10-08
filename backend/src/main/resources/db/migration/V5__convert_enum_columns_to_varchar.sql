ALTER TABLE users
ALTER COLUMN role TYPE VARCHAR(32) USING role::text;

ALTER TABLE users
    ALTER COLUMN role DROP DEFAULT;

ALTER TABLE users
    ADD CONSTRAINT users_role_check
        CHECK (role IN ('STUDENT', 'TEACHER', 'ADMIN'));

ALTER TABLE users
ALTER COLUMN account_status TYPE VARCHAR(32) USING account_status::text;

ALTER TABLE users
    ALTER COLUMN account_status DROP DEFAULT;

ALTER TABLE users
    ADD CONSTRAINT users_account_status_check
        CHECK (account_status IN ('ACTIVE', 'PENDING_APPROVAL', 'REJECTED'));

DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS account_status;