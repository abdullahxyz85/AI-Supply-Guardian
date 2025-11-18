#!/bin/bash

# AI Supply Guardian - Quick Deployment Script
# This script automates the deployment process on cPanel server

set -e  # Exit on error

echo "🚀 AI Supply Guardian - Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_info "Docker and Docker Compose found ✓"

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    print_warn ".env file not found in backend directory"
    print_info "Creating .env template..."
    
    cat > backend/.env << 'EOF'
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-domain.com/api/auth/google/callback
FRONTEND_URL=https://your-domain.com

# Security
ENCRYPTION_KEY=your_32_character_encryption_key_here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# N8N Webhook (Optional)
N8N_WEBHOOK_KEY=your_n8n_webhook_key
EOF

    print_warn "Please edit backend/.env with your actual credentials before continuing"
    print_info "Opening .env file..."
    ${EDITOR:-nano} backend/.env
fi

# Ask user if they want to continue
read -p "Ready to deploy? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Deployment cancelled"
    exit 0
fi

# Stop existing containers
print_info "Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Build and start containers
print_info "Building Docker images..."
docker-compose build --no-cache

print_info "Starting containers..."
docker-compose up -d

# Wait for containers to be healthy
print_info "Waiting for containers to be healthy..."
sleep 10

# Check container status
print_info "Checking container status..."
docker-compose ps

# Check backend health
print_info "Testing backend health..."
if curl -f http://localhost:8055/health &>/dev/null; then
    print_info "Backend is healthy ✓"
else
    print_error "Backend health check failed"
    print_info "Checking logs..."
    docker-compose logs backend | tail -n 20
fi

# Check frontend health
print_info "Testing frontend..."
if curl -f http://localhost:3035/ &>/dev/null; then
    print_info "Frontend is running ✓"
else
    print_warn "Frontend might still be starting up..."
fi

# Show logs
print_info "Recent logs:"
docker-compose logs --tail=20

echo ""
echo "=========================================="
print_info "Deployment complete! 🎉"
echo ""
echo "Frontend: http://localhost:3035"
echo "Backend:  http://localhost:8055"
echo ""
print_info "To view logs: docker-compose logs -f"
print_info "To stop: docker-compose down"
echo "=========================================="
