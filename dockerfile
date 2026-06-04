FROM node:24-alpine AS builder

ARG APP_NAME

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx nest build ${APP_NAME}

FROM node:24-alpine

ARG APP_NAME

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

USER node

CMD sh -c "node dist/apps/${APP_NAME}/main.js"