# Atlas Birdie — Setup em nova máquina

Siga estes passos em ordem após clonar o repositório. Pular qualquer etapa causará erros na inicialização.

## Pré-requisitos

- Node.js >= 20
- pnpm >= 9
- PostgreSQL rodando localmente
- Redis rodando localmente (via Docker ou nativo)
- Docker (recomendado para Redis)

## 1. Instalar dependências

Sempre na **raiz** do monorepo:

```powershell
pnpm install
```

> Nunca rode `pnpm install` dentro de `apps/api` ou `apps/web` diretamente.

## 2. Configurar variáveis de ambiente

### `apps/api/.env`

Crie o arquivo com base no exemplo abaixo (substitua os valores reais):

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/atlas_birdie?schema=public"
REDIS_URL=redis://localhost:6379
PORT=3001
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

### `apps/web/.env.local`

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:3001
```

As chaves do Clerk estão disponíveis em [dashboard.clerk.com](https://dashboard.clerk.com) → seu app → **API Keys**.

## 3. Gerar o Prisma Client

Obrigatório em toda máquina nova (o client não é commitado no repositório):

```powershell
cd apps/api
pnpm db:generate
cd ../..
```

## 4. Subir o Redis

Via Docker (recomendado):

```powershell
docker run -d --name redis-atlas -p 6379:6379 redis:alpine
```

Confirme que está rodando:

```powershell
docker exec redis-atlas redis-cli ping
# Deve retornar: PONG
```

## 5. Criar o banco de dados e rodar as migrations

```powershell
# Cria o banco se não existir
psql -U postgres -c "CREATE DATABASE atlas_birdie;"

# Roda as migrations
cd apps/api
pnpm db:migrate
cd ../..
```

## 6. Iniciar o projeto

```powershell
# Na raiz do monorepo
pnpm dev
```

Confirme que ambos subiram:
- Frontend: `http://localhost:3000`
- API: `http://localhost:3001`

## Problemas comuns

| Erro | Causa | Solução |
|---|---|---|
| `Cannot find package '@fastify/cors'` | `pnpm install` não foi rodado na raiz | `pnpm install` na raiz |
| `Cannot find module '...generated/prisma'` | Prisma Client não gerado | `pnpm db:generate` em `apps/api` |
| `ERR_CONNECTION_REFUSED` na porta 3001 | API não subiu ou Redis offline | Verifique Redis e logs da API |
| `JWT is expired` / clock skew | Relógio do sistema desajustado | `w32tm /resync /force` (Windows) |
| `Infinite redirect loop` (Clerk) | Keys do `.env.local` incorretas | Copie as keys do dashboard.clerk.com |
