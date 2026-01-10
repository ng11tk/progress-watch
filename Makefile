# Makefile for ProgressPad Docker Operations

.PHONY: help build up down restart logs clean dev prod

# Default target
help:
	@echo "ProgressPad Docker Commands:"
	@echo "  make build      - Build all Docker images"
	@echo "  make up         - Start production containers"
	@echo "  make down       - Stop all containers"
	@echo "  make restart    - Restart all containers"
	@echo "  make logs       - View logs from all services"
	@echo "  make clean      - Remove containers and volumes"
	@echo "  make dev        - Start development environment"
	@echo "  make prod       - Start production environment"
	@echo "  make ps         - Show container status"
	@echo "  make shell-server  - Shell into server container"
	@echo "  make shell-client  - Shell into client container"

# Production commands
build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

ps:
	docker compose ps

# Development commands
dev:
	docker compose -f docker-compose.dev.yml up -d
	@echo "Development environment started!"
	@echo "Client: http://localhost:5173"
	@echo "Server: http://localhost:3000"

dev-down:
	docker compose -f docker-compose.dev.yml down

dev-logs:
	docker compose -f docker-compose.dev.yml logs -f

# Production
prod: build up
	@echo "Production environment started!"
	@echo "Application: http://localhost"

# Cleaning
clean:
	docker compose down -v
	docker system prune -f

clean-all:
	docker compose down -v --rmi all
	docker system prune -af --volumes

# Shell access
shell-server:
	docker compose exec server sh

shell-client:
	docker compose exec client sh

shell-db:
	docker compose exec mongodb mongosh -u admin -p password123 --authenticationDatabase admin

# Database operations
db-backup:
	docker compose exec mongodb mongodump --authenticationDatabase admin -u admin -p password123 -o /data/backup
	@echo "Backup completed in MongoDB container at /data/backup"

# Rebuild specific service
rebuild-server:
	docker compose build server
	docker compose up -d server

rebuild-client:
	docker compose build client
	docker compose up -d client
