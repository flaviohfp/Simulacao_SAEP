CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tarefas (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    descricao TEXT NOT NULL,
    setor VARCHAR(120) NOT NULL,
    prioridade VARCHAR(10) NOT NULL CHECK (prioridade IN ('baixa', 'media', 'alta')),
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(10) NOT NULL DEFAULT 'a fazer' CHECK (status IN ('a fazer', 'fazendo', 'pronto')),
    CONSTRAINT fk_tarefas_usuarios
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
