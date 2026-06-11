---
name: docker
description: Docker development skill. Covers Dockerfile best practices, multi-stage builds, Docker Compose for local development, container optimization, networking, volumes, and production deployment patterns.
user-invocable: true
---

# Docker Development Skill

## What this Skill is for

Use this Skill when the user asks for:

- Writing or optimizing Dockerfiles
- Docker Compose configuration
- Multi-stage build patterns
- Container networking and volumes
- Local development environments
- Production deployment configurations
- Container debugging and troubleshooting

## Default stack decisions (opinionated)

1. **Multi-stage builds**

- Always use multi-stage builds for production images
- Separate build dependencies from runtime
- Keep final images minimal

2. **Base images**

- Prefer Alpine or distroless for production
- Use specific version tags, not `latest`
- Consider `node:*-slim` for Node.js apps

3. **Layer optimization**

- Order instructions from least to most frequently changing
- Combine related RUN commands
- Use `.dockerignore` to exclude unnecessary files

4. **Security**

- Run as non-root user
- Don't store secrets in images
- Scan images for vulnerabilities

## Operating procedure

### 1. Dockerfile patterns

**Node.js/Next.js multi-stage build:**

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

**Python/FastAPI:**

```dockerfile
FROM python:3.12-slim AS builder
WORKDIR /app

RUN pip install poetry
COPY pyproject.toml poetry.lock ./
RUN poetry export -f requirements.txt > requirements.txt

FROM python:3.12-slim
WORKDIR /app

COPY --from=builder /app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd -m appuser
USER appuser

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Go:**

```dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server

FROM gcr.io/distroless/static-debian12
COPY --from=builder /app/server /server
EXPOSE 8080
ENTRYPOINT ["/server"]
```

### 2. Docker Compose for development

```yaml
# docker-compose.yml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - '3000:3000'
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://postgres:postgres@db:5432/app
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

Development Dockerfile (`Dockerfile.dev`):

```dockerfile
FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
```

### 3. .dockerignore

```
# Dependencies
node_modules
.pnpm-store

# Build outputs
.next
dist
build
out

# Development
.git
.gitignore
*.md
.env*
.vscode
.idea

# Test
coverage
.nyc_output
*.test.*
__tests__

# Docker
Dockerfile*
docker-compose*
.docker

# OS
.DS_Store
Thumbs.db
```

### 4. Common commands

```bash
# Build
docker build -t myapp:latest .
docker build -t myapp:latest -f Dockerfile.prod .

# Run
docker run -p 3000:3000 myapp:latest
docker run -d --name myapp -p 3000:3000 myapp:latest
docker run --rm -it myapp:latest sh

# Compose
docker compose up -d
docker compose down
docker compose logs -f app
docker compose exec app sh
docker compose build --no-cache

# Debug
docker logs myapp
docker exec -it myapp sh
docker inspect myapp

# Cleanup
docker system prune -a
docker volume prune
docker image prune -a
```

### 5. Networking patterns

**Internal service communication:**

```yaml
services:
  frontend:
    networks:
      - frontend
      - backend

  api:
    networks:
      - backend

  db:
    networks:
      - backend

networks:
  frontend:
  backend:
    internal: true # No external access
```

**Custom network with fixed IPs:**

```yaml
networks:
  app_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16
```

### 6. Volume patterns

**Named volumes for persistence:**

```yaml
volumes:
  postgres_data:
    driver: local

services:
  db:
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

**Bind mounts for development:**

```yaml
services:
  app:
    volumes:
      - .:/app # Source code
      - /app/node_modules # Preserve container's node_modules
      - ./config:/app/config:ro # Read-only config
```

### 7. Health checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

```yaml
services:
  app:
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3000/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### 8. Production patterns

**Environment variables:**

```yaml
services:
  app:
    env_file:
      - .env.production
    environment:
      - NODE_ENV=production
```

**Resource limits:**

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

**Restart policies:**

```yaml
services:
  app:
    restart: unless-stopped
    # or: always, on-failure, no
```

## Troubleshooting

- **Build cache issues:** `docker build --no-cache`
- **Permission denied:** Check USER directive and volume permissions
- **Container exits immediately:** Check CMD/ENTRYPOINT, use `docker logs`
- **Network issues:** Verify service names match in connection strings
- **Slow builds:** Review .dockerignore, optimize layer order
- **Large images:** Use multi-stage builds, Alpine base, prune in RUN commands
