#!/bin/bash

echo "Setting up Docker Buildx for multi-arch builds..."

# Create buildx builder if it doesn't exist
if ! docker buildx ls | grep -q "multiarch"; then
    echo "Creating multiarch builder..."
    docker buildx create --name multiarch --use
    docker buildx inspect --bootstrap
else
    echo "Using existing multiarch builder..."
    docker buildx use multiarch
fi

echo "Docker Buildx setup complete!"
docker buildx ls