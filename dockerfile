# --- Stage 1: Construcción ---
FROM node:24-alpine AS builder

# Declaramos el argumento que inyectará Dockploy
ARG APP_NAME

WORKDIR /app

# Copiar manifiestos e instalar todas las dependencias (devDeps incluidas para compilar)
COPY package*.json ./
RUN npm ci

# Copiar el código fuente
COPY . .

# Compilar el microservicio específico
RUN npx nest build ${APP_NAME}

# Eliminamos las devDependencies para dejar node_modules limpio para producción
RUN npm prune --production


# --- Stage 2: Producción ---
FROM node:24-alpine

# Volvemos a declarar el ARG en este stage para poder usarlo
ARG APP_NAME
# CRÍTICO: Lo persistimos en un ENV para que esté disponible en el CMD de producción
ENV EMBEDDED_APP_NAME=${APP_NAME}

WORKDIR /app

# Copiamos las dependencias de producción ya optimizadas desde el builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copiamos ÚNICAMENTE el build del microservicio en cuestión
COPY --from=builder /app/dist/apps/${APP_NAME} ./dist

# Usamos el usuario seguro por defecto de la imagen de Node
USER node

# Ejecutamos directamente el main de la app copiada
CMD ["sh", "-c", "node dist/main.js"]