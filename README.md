# Simulacao SAEP

Projeto de CRUD para o simulado do SAEP, com:

- cadastro de usuarios
- cadastro de tarefas
- edicao e exclusao
- alteracao de status na tela principal
- persistencia em PostgreSQL

## Tecnologias

- Frontend: HTML, CSS e JavaScript
- Backend: Node.js com Express
- Banco de dados: PostgreSQL

## Estrutura do projeto

- `public/`: telas e scripts do frontend
- `backend/`: servidor Node.js e rotas da API
- `database/schema.sql`: criacao das tabelas no PostgreSQL
- `database/db.js`: conexao com o banco

## Requisitos

Antes de iniciar, voce precisa ter:

- Node.js instalado
- PostgreSQL instalado e rodando
- um banco chamado `saep`

## Como criar o banco

Se o banco `saep` ainda nao existir, crie no PostgreSQL.

Exemplo no `psql`:

```sql
CREATE DATABASE saep;
```

## Configuracao do .env

Crie um arquivo `.env` na raiz do projeto com este conteudo:

```env
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=sua_senha_do_postgres
PGDATABASE=saep
```

Observacoes:

- use a senha real do seu PostgreSQL em `PGPASSWORD`
- o arquivo `.env` nao deve ser commitado
- o `.gitignore` da raiz ja ignora esse arquivo

## Instalar dependencias

Abra o terminal dentro da pasta `backend` e rode:

```bash
npm install
```

## Como iniciar o projeto

Ainda dentro da pasta `backend`, rode:

```bash
npm run dev
```

Se preferir rodar sem nodemon:

```bash
node app.js
```

Quando o servidor iniciar corretamente, ele vai:

- conectar no PostgreSQL
- executar o arquivo `database/schema.sql`
- criar as tabelas se elas ainda nao existirem
- iniciar em `http://localhost:3000`

## Rotas principais

- `/`: tela principal de gerenciamento das tarefas
- `/cadastro`: cadastro de usuarios
- `/tarefas`: cadastro de tarefas

## Funcionalidades

### Usuarios

- cadastrar usuario
- listar usuarios
- editar usuario
- excluir usuario

### Tarefas

- cadastrar tarefa
- listar tarefas
- editar tarefa
- excluir tarefa
- alterar status entre `a fazer`, `fazendo` e `pronto`

## Importante

O projeto nao cria mais dados ficticios automaticamente.

Se quiser comecar com o banco vazio, basta usar o schema atual em um banco novo ou apagar os dados antigos do banco que voce ja estava usando.

## Possiveis erros

### Erro de senha no PostgreSQL

Se aparecer algo como:

```text
SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string
```

ou erro de autenticacao, normalmente significa que:

- o arquivo `.env` nao foi criado
- o `.env` nao esta na raiz do projeto
- a senha em `PGPASSWORD` esta errada

### Banco nao existe

Se o banco `saep` nao existir, crie primeiro no PostgreSQL:

```sql
CREATE DATABASE saep;
```

## Arquivos de apoio

Os diagramas do projeto estao em:

- `public/assets/img/Casos de uso.png`
- `public/assets/img/Diagrama Entidade-Relacionamento (DER).png`
