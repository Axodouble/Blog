FROM nginx:alpine AS webserver
FROM oven/bun:alpine AS blog

WORKDIR /app
COPY . .
RUN bun install
RUN bun run write

FROM webserver
COPY --from=blog /app/docs /usr/share/nginx/html