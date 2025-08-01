#!/bin/bash

CLUSTER_TYPE=${1:-local}  # local, eks
REGION=${2:-ap-southeast-1}

echo "Deploying ShopMate microservices to Kubernetes..."
echo "Cluster type: $CLUSTER_TYPE"

if [ "$CLUSTER_TYPE" = "eks" ]; then
    echo "Building and pushing images to ECR..."
    ./build-and-push-ecr.sh $REGION
else
    echo "Building local images..."
    ./build-images.sh
    
    # Load images into kind cluster
    if command -v kind &> /dev/null; then
        echo "Loading images into kind cluster..."
        kind load docker-image shopmate/product-service:latest --name shopmate
        kind load docker-image shopmate/cart-service:latest --name shopmate
        kind load docker-image shopmate/order-service:latest --name shopmate
        kind load docker-image shopmate/frontend-service:latest --name shopmate
    fi
fi

# Create namespace
echo "Creating namespace..."
kubectl apply -f k8s/namespaces/shopmate-namespace.yaml

# Apply ConfigMaps
echo "Applying ConfigMaps..."
kubectl apply -f k8s/configmaps/

# Apply Services
echo "Applying Services..."
kubectl apply -f k8s/services/

# Apply Deployments
echo "Applying Deployments..."
kubectl apply -f k8s/deployments/

# Apply Ingress
echo "Applying Ingress..."
kubectl apply -f k8s/ingress/

echo "Deployment complete!"

# Show status
echo "Checking deployment status..."
kubectl get pods -n shopmate
kubectl get services -n shopmate

if [ "$CLUSTER_TYPE" = "eks" ]; then
    echo "Getting LoadBalancer URL..."
    kubectl get service frontend-service -n shopmate
else
    echo "Access the application at: http://shopmate.local (add to /etc/hosts if using local cluster)"
fi