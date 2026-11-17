ALTER TABLE users
    ADD COLUMN nome VARCHAR(150),
    ADD COLUMN email VARCHAR(254),
    ADD COLUMN role VARCHAR(50);

UPDATE users u
SET role = CASE WHEN EXISTS (
    SELECT 1 FROM authorities a
    WHERE a.username = u.username AND a.authority = 'ROLE_ADMIN'
) THEN 'ROLE_ADMIN' ELSE 'ROLE_CLIENTE' END;

UPDATE users u
SET nome = p.nome
FROM cliente_perfis p
WHERE p.username = u.username;

UPDATE users
SET email = username
WHERE role = 'ROLE_CLIENTE';

ALTER TABLE users
    ALTER COLUMN role SET NOT NULL,
    ADD CONSTRAINT ck_users_role CHECK (role IN ('ROLE_ADMIN', 'ROLE_CLIENTE'));

CREATE UNIQUE INDEX uq_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_role ON users(role);

DROP TABLE authorities;
DROP TABLE cliente_perfis;
