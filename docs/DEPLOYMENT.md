# SkillChain Deployment Guide

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for development)
- Python 3.11+ (for AI services)
- Git

### Environment Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-org/skillchain.git
cd skillchain
```

2. **Create environment files**
```bash
# Copy example environment files
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp ai-api/.env.example ai-api/.env
```

3. **Configure environment variables**
```bash
# .env (root)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key

# frontend/.env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AI_API_URL=http://localhost:8001
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# backend/.env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://skillchain:skillchain_password@localhost:5432/skillchain
MONGODB_URI=mongodb://skillchain:skillchain_password@localhost:27017/skillchain
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# ai-api/.env
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://skillchain:skillchain_password@localhost:5432/skillchain
MONGODB_URI=mongodb://skillchain:skillchain_password@localhost:27017/skillchain
```

## Development Deployment

### Using Docker Compose (Recommended)

1. **Start all services**
```bash
docker-compose -f deployment/docker-compose.yml up -d
```

2. **Install dependencies**
```bash
# Install all dependencies
npm run install:all
```

3. **Start development servers**
```bash
# Start all services in development mode
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI API: http://localhost:8001
- API Documentation: http://localhost:5000/api-docs

### Manual Development Setup

1. **Start databases**
```bash
# PostgreSQL
docker run -d --name postgres \
  -e POSTGRES_DB=skillchain \
  -e POSTGRES_USER=skillchain \
  -e POSTGRES_PASSWORD=skillchain_password \
  -p 5432:5432 postgres:15-alpine

# MongoDB
docker run -d --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=skillchain \
  -e MONGO_INITDB_ROOT_PASSWORD=skillchain_password \
  -p 27017:27017 mongo:7

# Redis
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

2. **Install and start services**
```bash
# Backend
cd backend
npm install
npm run dev

# AI API
cd ai-api
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8001

# Frontend
cd frontend
npm install
npm start
```

## Production Deployment

### Using Docker Compose

1. **Build production images**
```bash
docker-compose -f deployment/docker-compose.yml build
```

2. **Start production services**
```bash
docker-compose -f deployment/docker-compose.yml up -d
```

3. **Set up SSL certificates**
```bash
# Generate SSL certificates (Let's Encrypt)
certbot certonly --standalone -d your-domain.com
```

4. **Update nginx configuration**
```bash
# Update nginx.conf with SSL settings
# Uncomment HTTPS server block
```

### Cloud Deployment

#### Frontend (Vercel)

1. **Connect repository to Vercel**
2. **Set environment variables**
3. **Deploy automatically on push**

#### Backend (Render)

1. **Create new web service**
2. **Connect GitHub repository**
3. **Set build command**: `npm run build`
4. **Set start command**: `npm start`
5. **Configure environment variables**

#### AI API (Railway)

1. **Create new project**
2. **Connect GitHub repository**
3. **Set start command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Configure environment variables**

#### Database (Supabase)

1. **Create new Supabase project**
2. **Run database migrations**
3. **Configure authentication**
4. **Set up storage buckets**

## Environment Configuration

### Required Environment Variables

#### Frontend
```bash
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_AI_API_URL=https://your-ai-api-url.com
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Backend
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@host:port/database
MONGODB_URI=mongodb://user:password@host:port/database
REDIS_URL=redis://host:port
JWT_SECRET=your_jwt_secret_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
AI_API_URL=https://your-ai-api-url.com
```

#### AI API
```bash
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://user:password@host:port/database
MONGODB_URI=mongodb://user:password@host:port/database
```

## Database Setup

### PostgreSQL Setup

1. **Create database**
```sql
CREATE DATABASE skillchain;
CREATE USER skillchain WITH PASSWORD 'skillchain_password';
GRANT ALL PRIVILEGES ON DATABASE skillchain TO skillchain;
```

2. **Run migrations**
```bash
# Run SQL schema
psql -h localhost -U skillchain -d skillchain -f database/schemas/postgresql.sql
```

### MongoDB Setup

1. **Create database and user**
```javascript
use skillchain
db.createUser({
  user: "skillchain",
  pwd: "skillchain_password",
  roles: [{ role: "readWrite", db: "skillchain" }]
})
```

2. **Import collections**
```bash
# Import MongoDB schemas
mongoimport --host localhost --db skillchain --collection reels --file database/schemas/mongodb.js
```

## SSL Configuration

### Let's Encrypt Setup

1. **Install Certbot**
```bash
sudo apt-get update
sudo apt-get install certbot
```

2. **Generate certificates**
```bash
sudo certbot certonly --standalone -d your-domain.com
```

3. **Update nginx configuration**
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
}
```

## Monitoring and Logging

### Health Checks

1. **Application health endpoints**
- Frontend: `GET /health`
- Backend: `GET /api/health`
- AI API: `GET /health`

2. **Database health checks**
```bash
# PostgreSQL
pg_isready -h localhost -p 5432

# MongoDB
mongosh --eval "db.adminCommand('ping')"

# Redis
redis-cli ping
```

### Logging Configuration

1. **Application logs**
```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f ai-api
docker-compose logs -f frontend
```

2. **Log rotation**
```bash
# Configure logrotate
sudo nano /etc/logrotate.d/skillchain
```

## Backup and Recovery

### Database Backups

1. **PostgreSQL backup**
```bash
pg_dump -h localhost -U skillchain skillchain > backup.sql
```

2. **MongoDB backup**
```bash
mongodump --host localhost --db skillchain --out backup/
```

3. **Automated backups**
```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U skillchain skillchain > "backup_${DATE}.sql"
mongodump --host localhost --db skillchain --out "backup_${DATE}/"
```

### File System Backups

1. **Application files**
```bash
tar -czf skillchain_backup_$(date +%Y%m%d).tar.gz /path/to/skillchain
```

2. **Configuration files**
```bash
cp -r /etc/nginx/ssl /backup/ssl
cp /etc/nginx/nginx.conf /backup/nginx.conf
```

## Troubleshooting

### Common Issues

1. **Port conflicts**
```bash
# Check port usage
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000
netstat -tulpn | grep :8001
```

2. **Database connection issues**
```bash
# Test database connections
psql -h localhost -U skillchain -d skillchain -c "SELECT 1;"
mongosh --eval "db.adminCommand('ping')"
redis-cli ping
```

3. **Service startup issues**
```bash
# Check service status
docker-compose ps
docker-compose logs service-name
```

### Performance Optimization

1. **Database optimization**
```sql
-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
```

2. **Caching configuration**
```bash
# Redis configuration
redis-cli CONFIG SET maxmemory 256mb
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

3. **Nginx optimization**
```nginx
# Enable gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;
```

## Security Considerations

### Firewall Configuration

1. **UFW setup**
```bash
sudo ufw enable
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw deny 5432   # PostgreSQL
sudo ufw deny 27017  # MongoDB
sudo ufw deny 6379   # Redis
```

2. **Fail2ban setup**
```bash
sudo apt-get install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### SSL/TLS Security

1. **Strong SSL configuration**
```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
```

2. **Security headers**
```nginx
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
```

## Scaling Considerations

### Horizontal Scaling

1. **Load balancer configuration**
```nginx
upstream backend {
    server backend1:5000;
    server backend2:5000;
    server backend3:5000;
}
```

2. **Database clustering**
```bash
# PostgreSQL replication
# MongoDB replica set
# Redis cluster
```

### Vertical Scaling

1. **Resource monitoring**
```bash
# CPU usage
top -p $(pgrep -f "node\|python\|nginx")

# Memory usage
free -h
ps aux --sort=-%mem | head

# Disk usage
df -h
du -sh /var/lib/docker
```

2. **Performance tuning**
```bash
# Node.js optimization
NODE_OPTIONS="--max-old-space-size=4096"

# Python optimization
PYTHONOPTIMIZE=1
```

This deployment guide provides comprehensive instructions for setting up SkillChain in various environments, from development to production. Follow the steps carefully and adapt them to your specific infrastructure requirements.

