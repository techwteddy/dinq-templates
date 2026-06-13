# Docker Deployment Guide

This guide explains how to deploy Lifebeet using Docker and GitHub Packages.

## Overview

Lifebeet is deployed using:
- **Docker** for containerization
- **GitHub Packages (GHCR)** for image registry
- **GitHub Actions** for automated builds and pushes
- **Portainer** (or any Docker orchestration) for production deployment

## Architecture

```
GitHub Repository
    ↓ (on push to main)
GitHub Actions
    ↓ (build & push)
GitHub Container Registry (ghcr.io)
    ↓ (pull)
Production Server (Portainer/Docker)
    ↓ (run)
Lifebeet Application
```

## Automated Build Process

Every push to the `main` branch automatically:
1. Builds a Docker image
2. Pushes to GitHub Container Registry
3. Tags with `latest` and commit SHA

### Image Naming

Images are published to:
```
ghcr.io/devpbeat/lifebeet:latest
ghcr.io/devpbeat/lifebeet:main-<sha>
```

## Prerequisites

### On Your Server

1. **Docker** installed
2. **Docker Compose** (optional, recommended)
3. **GitHub Personal Access Token** with `read:packages` permission
4. **Supabase** project with PostgreSQL database

## Deployment Steps

### 1. Authenticate with GitHub Container Registry

On your server, log in to GHCR:

```bash
# Create a GitHub Personal Access Token with read:packages scope
# Then log in:
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
```

### 2. Pull the Latest Image

```bash
docker pull ghcr.io/devpbeat/lifebeet:latest
```

### 3. Create Environment File

Create a `.env` file with your configuration:

```bash
# Database URL (use your Supabase connection string)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]

# Node Environment
NODE_ENV=production
```

### 4. Run with Docker

#### Option A: Docker Run (Simple)

```bash
docker run -d \
  --name lifebeet \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  ghcr.io/devpbeat/lifebeet:latest
```

#### Option B: Docker Compose (Recommended)

Use the provided `docker-compose.prod.yml`:

```bash
# Edit docker-compose.prod.yml with your environment variables
# Or create a .env file

docker-compose -f docker-compose.prod.yml up -d
```

This will:
- Pull the latest image from GHCR
- Start the application on port 3000
- Optionally start a PostgreSQL container (if not using Supabase)
- Set up proper networking

### 5. Setup Database

After the container is running, set up the database:

```bash
# Enter the container
docker exec -it lifebeet sh

# Generate Prisma client (if needed)
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed with sample data
npx prisma db seed

# Exit container
exit
```

Or run these commands directly:

```bash
docker exec lifebeet npx prisma generate
docker exec lifebeet npx prisma db push
docker exec lifebeet npx prisma db seed
```

### 6. Verify Deployment

Check if the application is running:

```bash
# Check container status
docker ps

# Check logs
docker logs lifebeet

# Test the application
curl http://localhost:3000
```

## Portainer Deployment

### Using Portainer Stacks

1. **Log in to Portainer**
2. **Go to Stacks**
3. **Add Stack**
4. **Paste the docker-compose.prod.yml content**
5. **Add environment variables** in the Environment section
6. **Deploy the stack**

### Using Portainer Services

1. **Go to Services**
2. **Add Service**
3. **Configure:**
   - Image: `ghcr.io/devpbeat/lifebeet:latest`
   - Port: `3000:3000`
   - Environment variables from `.env`
   - Restart policy: `unless-stopped`
4. **Deploy**

## Updating the Application

### Manual Update

```bash
# Pull the latest image
docker pull ghcr.io/devpbeat/lifebeet:latest

# Stop and remove old container
docker stop lifebeet
docker rm lifebeet

# Start new container
docker run -d \
  --name lifebeet \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  ghcr.io/devpbeat/lifebeet:latest
```

### With Docker Compose

```bash
# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Recreate containers
docker-compose -f docker-compose.prod.yml up -d
```

### With Portainer

1. Go to your stack/service
2. Click "Update"
3. Enable "Re-pull image"
4. Update

## Monitoring

### View Logs

```bash
# Follow logs
docker logs -f lifebeet

# Last 100 lines
docker logs --tail 100 lifebeet
```

### Container Stats

```bash
docker stats lifebeet
```

### Health Check

Add to your docker-compose.prod.yml:

```yaml
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## Reverse Proxy Setup

### Nginx

```nginx
server {
    listen 80;
    server_name lifebeet.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Traefik

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.lifebeet.rule=Host(`lifebeet.yourdomain.com`)"
  - "traefik.http.routers.lifebeet.entrypoints=websecure"
  - "traefik.http.routers.lifebeet.tls.certresolver=letsencrypt"
  - "traefik.http.services.lifebeet.loadbalancer.server.port=3000"
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs lifebeet

# Check environment variables
docker inspect lifebeet | grep -A 20 "Env"

# Verify image exists
docker images | grep lifebeet
```

### Database Connection Issues

```bash
# Test database connection from container
docker exec lifebeet npx prisma db pull

# Check DATABASE_URL format
# Should be: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

### Permission Issues

```bash
# The container runs as non-root user (nextjs:nodejs)
# Ensure volumes have correct permissions if mounting any
```

### Image Pull Issues

```bash
# Re-authenticate with GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Verify token has read:packages permission
```

## Advanced Configuration

### Using External PostgreSQL

If using Supabase or external PostgreSQL, set `DATABASE_URL` to your connection string and remove the postgres service from docker-compose.

### Scaling

To run multiple instances behind a load balancer:

```bash
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

### Custom Port

Change the port mapping in docker-compose or docker run:

```bash
# Run on port 8080 instead of 3000
docker run -p 8080:3000 ...
```

## Security Best Practices

1. **Use secrets management** for sensitive environment variables
2. **Enable SSL/TLS** with reverse proxy
3. **Keep images updated** - pull latest regularly
4. **Limit container resources** with `--memory` and `--cpus`
5. **Use read-only filesystem** where possible
6. **Scan images** for vulnerabilities

## CI/CD Integration

The GitHub Actions workflow automatically:
- Builds on every push to main
- Pushes to GHCR
- Tags with commit SHA and latest
- Caches layers for faster builds

To manually trigger a build:
1. Go to GitHub Actions
2. Select "Build and Push Docker Image"
3. Click "Run workflow"

## Backup Strategy

### Database Backups

```bash
# Backup with Prisma
docker exec lifebeet npx prisma db pull --file backup.prisma

# Or use PostgreSQL tools
docker exec postgres pg_dump -U postgres lifebeet > backup.sql
```

### Application State

The application is stateless - all data is in PostgreSQL. Backup your database regularly.

## Support

For issues:
1. Check container logs
2. Verify environment variables
3. Test database connectivity
4. Review GitHub Actions workflow runs
5. Check GHCR for available images

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [GitHub Packages Documentation](https://docs.github.com/en/packages)
- [Portainer Documentation](https://docs.portainer.io/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
