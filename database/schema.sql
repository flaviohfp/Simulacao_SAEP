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

INSERT INTO usuarios (nome, email)
SELECT 'Ana Souza', 'ana.souza@empresa.com'
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios WHERE email = 'ana.souza@empresa.com'
);

INSERT INTO usuarios (nome, email)
SELECT 'Bruno Lima', 'bruno.lima@empresa.com'
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios WHERE email = 'bruno.lima@empresa.com'
);

INSERT INTO usuarios (nome, email)
SELECT 'Carla Mendes', 'carla.mendes@empresa.com'
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios WHERE email = 'carla.mendes@empresa.com'
);

INSERT INTO tarefas (id_usuario, descricao, setor, prioridade, status)
SELECT u.id, 'Separar pedidos urgentes para expedicao', 'Logistica', 'alta', 'a fazer'
FROM usuarios u
WHERE u.email = 'ana.souza@empresa.com'
  AND NOT EXISTS (
      SELECT 1
      FROM tarefas
      WHERE descricao = 'Separar pedidos urgentes para expedicao'
  );

INSERT INTO tarefas (id_usuario, descricao, setor, prioridade, status)
SELECT u.id, 'Atualizar etiquetas do estoque refrigerado', 'Armazem', 'media', 'fazendo'
FROM usuarios u
WHERE u.email = 'bruno.lima@empresa.com'
  AND NOT EXISTS (
      SELECT 1
      FROM tarefas
      WHERE descricao = 'Atualizar etiquetas do estoque refrigerado'
  );

INSERT INTO tarefas (id_usuario, descricao, setor, prioridade, status)
SELECT u.id, 'Conferir registros do controle de qualidade', 'Qualidade', 'alta', 'pronto'
FROM usuarios u
WHERE u.email = 'carla.mendes@empresa.com'
  AND NOT EXISTS (
      SELECT 1
      FROM tarefas
      WHERE descricao = 'Conferir registros do controle de qualidade'
  );
