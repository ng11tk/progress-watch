# ProgressPad Docker Setup

This project uses Docker for containerized deployment with separate services for the frontend, backend, and database.

## 🏗️ Architecture

- **Client**: React app served by Nginx (Port 80)
- **Server**: Node.js/Express API (Port 3000)
- **Database**: MongoDB 7.0 (Port 27017)

## 📋 Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Docker Compose v2.0+

## 🚀 Quick Start

### Production Mode

1. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and change the JWT_SECRET:**

   ```bash
   # Edit .env file and set a secure JWT_SECRET
   JWT_SECRET=your-very-secure-secret-key-at-least-32-characters-long
   ```

3. **Build and start all services:**

   ```bash
   docker compose up -d
   ```

4. **Access the application:**

   - Frontend: http://localhost
   - API: http://localhost/server/
   - MongoDB: localhost:27017

5. **View logs:**

   ```bash
   # All services
   docker compose logs -f

   # Specific service
   docker compose logs -f client
   docker compose logs -f server
   docker compose logs -f mongodb
   ```

6. **Stop services:**
   ```bash
   docker compose down
   ```

### Development Mode

For development with hot reload:

```bash
# Start development containers
docker compose -f docker-compose.dev.yml up -d

# Access:
# - Frontend: http://localhost:5173 (Vite dev server with HMR)
# - API: http://localhost:3000
```

## 🛠️ Available Commands

```bash
# Build without starting
docker compose build

# Rebuild and start
docker compose up -d --build

# Stop services
docker compose stop

# Stop and remove containers
docker compose down

# Remove containers and volumes (WARNING: deletes data)
docker compose down -v

# View service status
docker compose ps

# Execute commands in running container
docker compose exec server sh
docker compose exec client sh

# Restart a specific service
docker compose restart server
```

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available configuration options:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens (change in production!)
- `PORT`: Server port (default: 3000)
- `CORS_ORIGIN`: Allowed CORS origins
- `NODE_ENV`: Environment (production/development)

### Database Access

Connect to MongoDB from your host:

```bash
mongosh mongodb://admin:password123@localhost:27017/progresspad?authSource=admin
```

Or use MongoDB Compass:

```
mongodb://admin:password123@localhost:27017
```

## 📦 Docker Images

### Client Image

- Base: nginx:alpine
- Size: ~50MB
- Includes built React app and nginx configuration

### Server Image

- Base: node:20-alpine
- Size: ~200MB
- Includes Node.js and production dependencies

## 🔐 Security Notes

1. **Change default credentials** in production:

   - MongoDB username/password in `docker-compose.yml`
   - JWT_SECRET in `.env`

2. **Use secrets management** for production:

   - Docker secrets
   - Environment-specific `.env` files
   - Never commit `.env` to git

3. **Enable HTTPS** in production:
   - Use reverse proxy (nginx/Traefik)
   - Add SSL certificates
   - Update CORS origins

## 🐛 Troubleshooting

### Port already in use

```bash
# Find process using port
netstat -ano | findstr :80
netstat -ano | findstr :3000

# Stop conflicting services or change ports in docker-compose.yml
```

### Docker Desktop not running

```bash
# Error: cannot connect to Docker daemon
# Solution: Start Docker Desktop from Windows Start menu
```

### Permission errors

```bash
# On Windows, ensure Docker Desktop has access to your drive
# Settings -> Resources -> File Sharing
```

### Database connection errors

```bash
# Check MongoDB is healthy
docker compose ps

# View MongoDB logs
docker compose logs mongodb

# Verify connection string in .env
```

### Build cache issues

```bash
# Clear build cache and rebuild
docker compose build --no-cache
docker compose up -d
```

## 📊 Health Checks

Services include health checks:

- **Server**: `http://localhost:3000/health`
- **MongoDB**: Automatic ping check
- **Client**: HTTP GET on port 80

Check health status:

```bash
docker compose ps
```

## 🔄 Updates and Maintenance

### Update dependencies

```bash
# Rebuild with latest dependencies
docker compose build --no-cache
docker compose up -d
```

### Database backup

```bash
# Backup
docker compose exec mongodb mongodump --authenticationDatabase admin -u admin -p password123 -o /backup

# Restore
docker compose exec mongodb mongorestore --authenticationDatabase admin -u admin -p password123 /backup
```

### View resource usage

```bash
docker stats
```

## 📝 Project Structure

```
progressPad/
├── client/                 # React frontend
├── server/                 # Express backend
├── Dockerfile.client       # Client container config
├── Dockerfile.server       # Server container config
├── docker-compose.yml      # Production orchestration
├── docker-compose.dev.yml  # Development orchestration
├── nginx.conf             # Nginx configuration
├── .dockerignore          # Docker build exclusions
└── .env.example           # Environment template
```

## 🤝 Contributing

When making changes:

1. Test locally with development setup
2. Build production images
3. Test production setup
4. Update this README if needed

## 📄 License

MIT
