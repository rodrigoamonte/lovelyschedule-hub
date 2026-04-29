#!/bin/bash
set -e

echo "Waiting for MySQL..."
until mysqladmin ping -h agendlog-db -u root -p"$MYSQL_ROOT_PASSWORD" --silent; do
    sleep 2
done

echo "Running migrations..."
npx prisma migrate deploy

echo "Running seed..."
npx tsx prisma/seed.ts

echo "Starting the application..."
exec npm run start:prod
