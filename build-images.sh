#!/bin/bash

# Build Docker images for all microservices
echo "Building microservices Docker images..."

# Build product service
echo "Building product-service..."
docker build -t shopmate/product-service:latest ./services/product-service

# Build cart service
echo "Building cart-service..."
docker build -t shopmate/cart-service:latest ./services/cart-service

# Build order service
echo "Building order-service..."
docker build -t shopmate/order-service:latest ./services/order-service

# Build frontend service
echo "Building frontend-service..."
docker build -t shopmate/frontend-service:latest ./services/frontend-service

echo "All images built successfully!"

# List built images
echo "Built images:"
docker images | grep shopmate