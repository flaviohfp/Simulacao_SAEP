DROP TABLE IF EXISTS tarefas;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    descricao TEXT NOT NULL,
    setor TEXT NOT NULL,
    prioridade TEXT NOT NULL CHECK (prioridade IN ('baixa', 'media', 'alta')),
    data_cadastro TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'a fazer' CHECK (status IN ('a fazer', 'fazendo', 'pronto')),
    FOREIGN KEY (id_usuario)
        REFERENCES usuarios (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

INSERT INTO usuarios (nome, email) VALUES
('Ana Souza', 'ana.souza@empresa.com'),
('Bruno Lima', 'bruno.lima@empresa.com'),
('Carla Mendes', 'carla.mendes@empresa.com');

INSERT INTO tarefas (id_usuario, descricao, setor, prioridade, status) VALUES
(1, 'Separar pedidos urgentes para expedicao', 'Logistica', 'alta', 'a fazer'),
(2, 'Atualizar etiquetas do estoque refrigerado', 'Armazem', 'media', 'fazendo'),
(3, 'Conferir registros do controle de qualidade', 'Qualidade', 'alta', 'pronto');
