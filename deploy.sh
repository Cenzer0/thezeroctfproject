#!/bin/bash
set -e

echo "🚀 Starting CTF platform setup..."

# Make sure we have the latest code
echo "📦 Pulling latest code changes..."
git pull

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "📝 Creating .env file..."
  cat > .env << EOL
# App
NODE_ENV=production

# Database
POSTGRES_PASSWORD=secure_password_here

# Auth
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Domains
WEB_HOST=ctf.example.com
API_HOST=api.ctf.example.com

# MINIO
MINIO_ACCESS_KEY=minio
MINIO_SECRET_KEY=secure_minio_password_here
MINIO_BUCKET=ctf

# Let's Encrypt
LETSENCRYPT_EMAIL=your-email@example.com
EOL
  echo "⚠️  Created .env file with default values. Please update it with your own values."
  echo "✏️  Edit the file with: nano .env"
  exit 1
fi

# Clean up any old containers
echo "🧹 Cleaning up old containers and volumes..."
docker-compose down --remove-orphans

# Pull/build new images
echo "🏗️  Building Docker images..."
docker-compose -f docker-compose.prod.yml build

# Start the services
echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

echo "✅ CTF platform is now running!"
echo "🌐 Web UI: https://$(grep WEB_HOST .env | cut -d '=' -f2)"
echo "🔌 API: https://$(grep API_HOST .env | cut -d '=' -f2)"

# Monitor logs
echo "📊 Showing logs (Ctrl+C to exit)..."
docker-compose -f docker-compose.prod.yml logs -f
