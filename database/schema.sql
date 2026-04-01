DROP TABLE IF EXISTS tarefas;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE
);

CREATE TABLE tarefas (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    descricao TEXT NOT NULL,
    setor VARCHAR(120) NOT NULL,
    prioridade VARCHAR(10) NOT NULL,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(10) NOT NULL DEFAULT 'a fazer',
    CONSTRAINT fk_tarefas_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_tarefas_prioridade
        CHECK (prioridade IN ('baixa', 'media', 'alta')),
    CONSTRAINT chk_tarefas_status
        CHECK (status IN ('a fazer', 'fazendo', 'pronto'))
);

INSERT INTO usuarios (nome, email) VALUES
('Ana Souza', 'ana.souza@empresa.com'),
('Bruno Lima', 'bruno.lima@empresa.com'),
('Carla Mendes', 'carla.mendes@empresa.com');

INSERT INTO tarefas (id_usuario, descricao, setor, prioridade, status) VALUES
(1, 'Separar pedidos urgentes para expedicao', 'Logistica', 'alta', 'a fazer'),
(2, 'Atualizar etiquetas do estoque refrigerado', 'Armazem', 'media', 'fazendo'),
(3, 'Conferir registros do controle de qualidade', 'Qualidade', 'alta', 'pronto');
