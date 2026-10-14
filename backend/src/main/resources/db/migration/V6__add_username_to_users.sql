ALTER TABLE users ADD COLUMN username VARCHAR(30);

-- Backfill: derive from email's local part
UPDATE users
    SET username = LOWER(SPLIT_PART(email, '@', 1))
    WHERE username IS NULL;

-- Resolve duplicates from the backfill by appending the id
UPDATE users u
    SET username = u.username || '_' || u.id
    WHERE u.username IN (
        SELECT username FROM users GROUP BY username HAVING COUNT(*) > 1
    );

-- Enforce not-null
ALTER TABLE users ALTER COLUMN username SET NOT NULL;

-- Case-insensitive uniqueness via functional index
CREATE UNIQUE INDEX users_username_lower_unique ON users (LOWER(username));

-- Make password_hash nullable for future Google users
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
