# Terraform Configuration

This directory contains only the **EKS cluster** configuration for Kubernetes deployment.

## Structure
```
terraform/
└── eks/
    ├── main.tf      # EKS cluster and VPC
    ├── variables.tf # Input variables
    └── outputs.tf   # Cluster outputs
```

## Usage
```bash
cd terraform/eks
terraform init
terraform apply
```

## Note
The old ECS Fargate configuration has been removed since we're now using Kubernetes/EKS for microservices deployment.