FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate
COPY . .
RUN npm run build

FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl default-mysql-client curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
