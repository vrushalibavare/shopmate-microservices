#!/bin/bash

ENV=${1:-dev}
REGION=${2:-ap-southeast-1}

echo "Deploying to environment: $ENV"

# Create EKS cluster for environment
echo "Creating EKS cluster..."
cd terraform/environments/$ENV
terraform init
terraform apply -auto-approve

# Update kubeconfig
CLUSTER_NAME="shopmate-$ENV"
aws eks update-kubeconfig --region $REGION --name $CLUSTER_NAME

# Create namespace
kubectl create namespace shopmate-$ENV --dry-run=client -o yaml | kubectl apply -f -

# Deploy application
echo "Deploying microservices..."
cd ../../../

# Build and push images
./build-and-push-ecr.sh $REGION $ENV

# Products will be auto-seeded by product-service on startup

# Apply environment-specific config
kubectl apply -f k8s/environments/$ENV/

# Apply base manifests with environment namespace
for file in k8s/deployments/*.yaml k8s/services/*.yaml; do
    sed "s/namespace: shopmate/namespace: shopmate-$ENV/g" $file | kubectl apply -f -
done

echo "Deployment complete for $ENV environment!"
kubectl get pods -n shopmate-$ENV