#!/bin/bash

REGION=${1:-ap-southeast-1}
CLUSTER_NAME=${2:-shopmate-eks}

echo "Creating EKS cluster: $CLUSTER_NAME in region: $REGION"

# Create EKS cluster with Terraform
cd terraform/eks
terraform init
terraform plan -var="aws_region=$REGION" -var="cluster_name=$CLUSTER_NAME"
terraform apply -var="aws_region=$REGION" -var="cluster_name=$CLUSTER_NAME" -auto-approve

# Update kubeconfig
echo "Updating kubeconfig..."
aws eks update-kubeconfig --region $REGION --name $CLUSTER_NAME

# Verify cluster
echo "Verifying cluster..."
kubectl get nodes

echo "EKS cluster created successfully!"
echo "Cluster name: $CLUSTER_NAME"
echo "Region: $REGION"