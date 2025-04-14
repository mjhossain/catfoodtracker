#!/bin/bash
# Simple deployment script for CatFeedTracker

# Build the Docker image
echo "Building Docker image..."
docker-compose build

# Stop any existing containers
echo "Stopping any existing containers..."
docker-compose down

# Start the application
echo "Starting the application..."
docker-compose up -d

# Show logs
# echo "Application started! Showing logs..."
# docker-compose logs -f 