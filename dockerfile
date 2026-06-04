# --- Stage 1: Construcción ---
FROM node:24-alpine AS builder

RUN npm install -g pnpm

ARG APP_NAME

WORKDIR /app

COPY package*.json pnpm-lock.yaml* ./

# 1. Instalar TODO para poder compilar (devDeps incluidas)
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

# 2. Compilar el microservicio
RUN npx nest build ${APP_NAME}


# --- Stage 2: Dependencias de Producción Limpias ---
# Creamos un stage intermedio rápido solo para descargar lo de producción,
# evitando tener que borrar archivos (prune) en el stage pesado.
FROM node:24-alpine AS prod-deps
RUN npm install -g pnpm
WORKDIR /app
COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts


# --- Stage 3: Producción ---
FROM node:24-alpine

ARG APP_NAME
ENV EMBEDDED_APP_NAME=${APP_NAME}

WORKDIR /app

# Copiamos package.json
COPY --from=builder /app/package*.json ./

# Copiamos el node_modules limpio que viene directo del stage 'prod-deps'
COPY --from=prod-deps /app/node_modules ./node_modules

# Copiamos el compilado final
COPY --from=builder /app/dist/apps/${APP_NAME} ./dist

USER node

CMD ["sh", "-c", "node dist/main.js"]