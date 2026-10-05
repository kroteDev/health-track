#!/usr/bin/env bash
# Script automatizado de deploy do HealthTrack para Servidor Dedicado / Docker
set -e

echo "=== Iniciando Deploy do HealthTrack ==="

# 1. Carrega variáveis de ambiente locais
if [ -f .env.production ]; then
  export $(cat .env.production | xargs)
elif [ -f .env ]; then
  export $(cat .env | xargs)
fi

# 2. Configura schema de produção com PostgreSQL
echo "-> Preparando schema PostgreSQL para produção..."
cp prisma/schema.postgres.prisma prisma/schema.prisma

# 3. Build e subida dos containers com Docker Compose
echo "-> Construindo e iniciando serviços (PostgreSQL + Next.js Standalone)..."
docker compose down
docker compose build --no-cache
docker compose up -d

# 4. Aguarda saúde do PostgreSQL e aplica migrações
echo "-> Aguardando inicialização do banco de dados PostgreSQL..."
docker compose exec -T postgres sh -c "until pg_isready -U healthtrack -d healthtrack; do sleep 1; done"

echo "-> Executando migrações do Prisma no banco de dados..."
docker compose exec -T app npx prisma migrate deploy

# 5. Executa seed opcional do usuário de teste
if [ "$RUN_SEED" = "true" ]; then
  echo "-> Populando usuário demo no banco..."
  docker compose exec -T app npx prisma db seed
fi

echo "=== Deploy concluído com sucesso na porta 3000! ==="
