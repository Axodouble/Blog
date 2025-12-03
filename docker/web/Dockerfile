FROM nginx:alpine AS webserver
FROM oven/bun:alpine AS bun

WORKDIR /app
COPY . .
RUN bun install
RUN bun run write

FROM webserver
COPY --from=bun /app/docs /usr/share/nginx/html
COPY docker/web/nginx.conf /etc/nginx/conf.d/default.conf