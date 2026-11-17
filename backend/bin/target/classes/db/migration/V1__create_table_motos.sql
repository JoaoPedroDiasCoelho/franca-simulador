-- Migration V1: Criação da tabela de motocicletas
CREATE TABLE IF NOT EXISTS motos (
    id BIGSERIAL PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    cilindrada INTEGER NOT NULL,
    ano_modelo INTEGER NOT NULL,
    preco NUMERIC(12, 2) NOT NULL,
    imagem_url VARCHAR(500),
    descricao TEXT,
    ativa BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_motos_ativa ON motos(ativa);
CREATE INDEX IF NOT EXISTS idx_motos_categoria ON motos(categoria);
CREATE INDEX IF NOT EXISTS idx_motos_preco ON motos(preco);
