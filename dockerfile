# --- Stage 1: Construcción ---
FROM node:24-alpine AS builder

# Habilitar Corepack para usar la versión exacta de pnpm del proyecto o instalarlo globalmente
RUN npm install -g pnpm

ARG APP_NAME

WORKDIR /app

# Copiar los manifiestos de pnpm y el lockfile yaml
COPY package*.json pnpm-lock.yaml* ./

# Instalar todas las dependencias (incluyendo devDependencies para compilar)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copiar el resto del código fuente
COPY . .

# Compilar el microservicio específico usando el CLI de Nest
RUN npx nest build ${APP_NAME}

# Prunear las dependencias de desarrollo para dejar solo producción en node_modules
# Al usar monorrepos con pnpm, esto optimiza el aislamiento de la app
RUN pnpm prune --prod


# --- Stage 2: Producción ---
FROM node:24-alpine

ARG APP_NAME
ENV EMBEDDED_APP_NAME=${APP_NAME}

WORKDIR /app

# Copiamos los archivos necesarios y el node_modules optimizado
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/${APP_NAME} ./dist

USER node

CMD ["sh", "-c", "node dist/main.js"]