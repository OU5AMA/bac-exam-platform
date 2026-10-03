CREATE TYPE user_role AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');
CREATE TYPE account_status AS ENUM ('ACTIVE', 'PENDING_APPROVAL', 'REJECTED');

ALTER TABLE users
    ADD COLUMN role user_role NOT NULL DEFAULT 'STUDENT',
    ADD COLUMN account_status account_status NOT NULL DEFAULT 'ACTIVE';

CREATE INDEX idx_users_account_status ON users (account_status);