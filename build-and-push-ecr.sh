#!/bin/bash

REGION=${1:-ap-southeast-1}
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "Building and pushing images to ECR..."
echo "Account ID: $ACCOUNT_ID"
echo "Region: $REGION"

# Setup buildx for multi-arch builds
./setup-buildx.sh

# Login to ECR
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# ECR repositories are created by Terraform
echo "Using ECR repositories created by Terraform..."

# Build and push images
services=("product-service" "cart-service" "order-service" "frontend-service")

for service in "${services[@]}"; do
    echo "Building and pushing $service..."
    
    # Build multi-arch image for x86_64 (compatible with t3.small)
    docker buildx build --platform linux/amd64 -t shopmate/$service:latest ./services/$service --load
    
    # Tag for ECR
    docker tag shopmate/$service:latest $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/shopmate/$service:latest
    
    # Push to ECR
    docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/shopmate/$service:latest
done

echo "All images pushed to ECR successfully!"

# Update Kubernetes manifests with ECR image URLs
echo "Updating Kubernetes manifests..."
for service in "${services[@]}"; do
    sed -i.bak "s|shopmate/$service:latest|$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/shopmate/$service:latest|g" k8s/deployments/$service.yaml
done

echo "Kubernetes manifests updated with ECR image URLs"