#!/bin/bash

# Countdown Timer - One Command Startup Script
# Author: Jie Lin, Ph.D.
# Copyright © 2025 TLIN INVESTMENTS LLC
# All Rights Reserved.
#
# This script starts the countdown timer application in Docker
# with automatic port detection and browser opening.

set -e

APP_DIR="app"
COMPOSE_FILE="$APP_DIR/docker-compose.yml"
DOCKER_DIR="$APP_DIR/docker"
PACKAGE_JSON="$APP_DIR/package.json"
DOCKERFILE="$DOCKER_DIR/Dockerfile"
VERSION_FILE="$DOCKER_DIR/.docker-image-version"
COMPOSE_PROJECT_NAME="countdown_timer_app"
export COMPOSE_PROJECT_NAME
COMPOSE_BUILD_IMAGE="${COMPOSE_PROJECT_NAME}-dev:latest"

docker_compose() {
    docker-compose -f "$COMPOSE_FILE" "$@"
}

# Cleanup function to ensure proper shutdown
cleanup() {
    echo ""
    echo "🛑 Shutting down application..."
    docker_compose down
    echo "✅ Application stopped successfully"
    exit 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM signals
trap cleanup SIGINT SIGTERM

echo "⏱️  Countdown Timer Application"
echo "================================"
echo "© 2025 Jie Lin, Ph.D. | TLIN INVESTMENTS LLC"
echo ""

# Check if Docker is running
echo "🔍 Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker first."
    exit 1
fi
echo "✅ Docker is running"
echo ""

# Stop any existing containers
echo "🧹 Cleaning up existing containers..."
docker_compose down 2>/dev/null || true
echo ""

# Function to check if a port is available
is_port_available() {
    local port=$1
    # Try to connect to the port - if it fails, the port is available
    ! nc -z localhost "$port" 2>/dev/null
}

# Find an available port starting from 5173
echo "🔍 Checking port availability..."
VITE_PORT=5173
MAX_PORT=5183
PORT_FOUND=false

for port in $(seq $VITE_PORT $MAX_PORT); do
    if is_port_available "$port"; then
        VITE_PORT=$port
        PORT_FOUND=true
        if [ "$port" -eq 5173 ]; then
            echo "✅ Using default port: $VITE_PORT"
        else
            echo "✅ Using port: $VITE_PORT (port 5173 was busy)"
        fi
        break
    fi
done

if [ "$PORT_FOUND" = false ]; then
    echo "❌ Error: No available ports found in range 5173-$MAX_PORT"
    echo "   Please free up a port and try again."
    exit 1
fi

# Export the port for docker-compose to use
export VITE_PORT
echo ""

# Calculate version hash for Docker image caching
echo "🔍 Checking for Docker image changes..."
VERSION_HASH=$(cat "$DOCKERFILE" "$PACKAGE_JSON" 2>/dev/null | md5 -q 2>/dev/null || cat "$DOCKERFILE" "$PACKAGE_JSON" 2>/dev/null | md5sum | cut -d' ' -f1)
IMAGE_NAME="countdown-timer"
IMAGE_TAG="${IMAGE_NAME}:${VERSION_HASH}"

# Check if we need to rebuild
NEED_BUILD=false
if [ -f "$VERSION_FILE" ]; then
    STORED_VERSION=$(cat "$VERSION_FILE")
    if [ "$STORED_VERSION" != "$VERSION_HASH" ]; then
        echo "📦 Dockerfile or dependencies changed, rebuild required"
        NEED_BUILD=true
    else
        # Check if image exists
        if ! docker images -q "$IMAGE_TAG" > /dev/null 2>&1 || [ -z "$(docker images -q $IMAGE_TAG 2> /dev/null)" ]; then
            echo "📦 Docker image not found, rebuild required"
            NEED_BUILD=true
        else
            echo "✅ Using cached Docker image (version: ${VERSION_HASH:0:12})"
        fi
    fi
else
    echo "📦 First run, building Docker image..."
    NEED_BUILD=true
fi

# Build or use cached image
if [ "$NEED_BUILD" = true ]; then
    echo "🔨 Building Docker image..."
    echo "   This may take a minute..."
    echo ""

    # Build with version tag
    docker_compose build dev

    # Tag the image with version hash
    BUILT_IMAGE=$(docker images -q "$COMPOSE_BUILD_IMAGE" 2>/dev/null)
    if [ -n "$BUILT_IMAGE" ]; then
        docker tag "$BUILT_IMAGE" "$IMAGE_TAG"
        echo "$VERSION_HASH" > "$VERSION_FILE"
        echo "✅ Docker image built and cached (version: ${VERSION_HASH:0:12})"
    fi
    echo ""
fi

# Start the development server in detached mode
echo "🚀 Starting the application on port $VITE_PORT..."
docker_compose up -d dev

# Wait for the server to be ready
echo "⏳ Waiting for server to start..."
sleep 8

# Check if server is responding on the selected port
MAX_RETRIES=30
RETRY_COUNT=0
SERVER_URL="http://localhost:$VITE_PORT"

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s "$SERVER_URL" > /dev/null 2>&1; then
        echo "✅ Server is ready!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    sleep 1
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Server failed to start. Check Docker logs with: docker logs countdown-timer-dev"
    docker_compose down
    exit 1
fi

echo ""
echo "🎉 Application is running!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Open your browser and visit:"
echo ""
echo "   👉  $SERVER_URL"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✨ Countdown Timer is ready to use!"
echo ""
echo "📝 Press Ctrl+C to stop the server"
echo ""

# Attach to docker-compose logs (this will run in foreground)
# The trap will handle cleanup when Ctrl+C is pressed
docker_compose logs -f dev
