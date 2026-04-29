# Agendlog

Agendlog é uma plataforma para a gestão de agendamentos e logística de depósitos. O sistema implementa um controle de acesso baseado em funções (RBAC), oferecendo interfaces específicas para Administradores, Assistentes, Depósitos e Fornecedores.

A solução é composta por uma API (Node.js/Express/Prisma), um cliente web (React/Vite) e um banco de dados relacional (MySQL), totalmente conteinerizada com Docker.

## Pré-requisitos

Para a correta execução do projeto, é necessário possuir as seguintes ferramentas instaladas:

* [Docker Desktop / Engine](https://www.docker.com/get-started/) (>= 20.10.x)
* [Docker Compose](https://docs.docker.com/compose/install/) (>= 2.x.x)
* [Git](https://git-scm.com/downloads)

## Configuração Inicial

Siga os passos abaixo para preparar o ambiente de execução:

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/rodrigoamonte/lovelyschedule-hub.git
   cd agendlog
   ```

2. **Configurar variáveis de ambiente:**
   Copie o arquivo de exemplo e edite as definições conforme necessário.
   ```bash
   cp .env.example .env
   ```

3. **Gerar chaves de segurança:**
   Utilize o seguinte comando para gerar valores seguros para as variáveis `DB_ROOT_PASSWORD`, `JWT_SECRET` e `ADMIN_PASSWORD` no arquivo `.env`:
   ```bash
   openssl rand -base64 32
   ```

## Inicialização da Infraestrutura

Para compilar as imagens e iniciar os serviços em segundo plano:

```bash
docker compose up --build -d
```

O sistema estará acessível através do gateway em `http://localhost:{APP_PORT_HOST}`.

## Gestão de Banco de Dados (Prisma)

As operações de esquema e persistência devem ser realizadas através do Prisma ORM integrado no container da API.

### Migração Inicial (First Migration)
Para criar a estrutura inicial das tabelas:
```bash
docker compose exec api npx prisma migrate dev --name init
```

### Sincronização de Esquema (Sync DB)
Para forçar a sincronização do banco de dados com o `schema.prisma` sem gerar arquivos de migração (indicado para desenvolvimento ágil estrutural):
```bash
docker exec -it agendlog-api npx prisma db push
```

### Geração do Cliente Prisma
Caso realize alterações manuais no esquema, atualize os tipos do `@prisma/client`:
```bash
DATABASE_URL="mysql://root:<sua_senha>@localhost:3306/agendlog" npx prisma generate
```

## Fluxo de Desenvolvimento

A arquitetura do projeto utiliza imagens estáticas construídas a partir de `Dockerfiles` para garantir a máxima consistência entre os ambientes de desenvolvimento e produção.

Para aplicar alterações realizadas no código-fonte, é necessário reconstruir as imagens dos serviços:

* **Aplicar alterações em todos os serviços:**
  ```bash
  docker compose up --build -d
  ```

* **Aplicar alterações em um serviço específico (ex: api):**
  ```bash
  docker compose up --build -d api
  ```

### Comandos Úteis de Operação

* **Monitoramento de Logs:** Para acompanhar a saída padrão da API em tempo real:
  ```bash
  docker compose logs -f api
  ```
* **Acesso Interativo:** Para executar comandos diretamente dentro do container da API:
  ```bash
  docker compose exec api sh
  ```
* **Encerramento da Infraestrutura:** Para parar os containers:
  ```bash
  docker compose down
  ```

## Implantação em Produção

Para instanciar o sistema em um ambiente produtivo, siga estas diretrizes essenciais:

1. Altere a variável `ENVIRONMENT` para `production`.
2. Assegure-se de que a `VITE_API_URL` aponte para o domínio público com protocolo seguro (HTTPS).
3. Utilize exclusivamente o comando de deploy para o Prisma, garantindo a aplicação segura do histórico de migrações:
   ```bash
   docker compose exec api npx prisma migrate deploy
   ```

## Estrutura do Repositório

O projeto adota uma arquitetura modular de monorepo lógico:

* `agendlog-api/`: Backend construído em Node.js, Express, TypeScript e Prisma.
* `agendlog-app/`: Frontend construído com React, Vite e Tailwind CSS.
* `nginx/`: Definições do proxy reverso, atuando como API Gateway estático.
* `prisma/`: Definição de esquema relacional (`schema.prisma`) e artefatos de migração.
