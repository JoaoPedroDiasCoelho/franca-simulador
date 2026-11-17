ALTER TABLE authorities DROP CONSTRAINT IF EXISTS authorities_username_fkey;

ALTER TABLE users ALTER COLUMN username TYPE VARCHAR(254);
ALTER TABLE authorities ALTER COLUMN username TYPE VARCHAR(254);

ALTER TABLE authorities
    ADD CONSTRAINT fk_authorities_users_username
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE;

CREATE TABLE cliente_perfis (
    username VARCHAR(254) PRIMARY KEY REFERENCES users(username) ON DELETE CASCADE,
    nome VARCHAR(150) NOT NULL
);

CREATE TABLE cliente_convites (
    email VARCHAR(254) PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);
