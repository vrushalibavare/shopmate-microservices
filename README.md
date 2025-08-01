# ShopMate Microservices on Kubernetes

A microservices e-commerce application built with Node.js, deployed on AWS EKS.

## Architecture

- **Product Service** (Port 3001) - Product catalog management
- **Cart Service** (Port 3002) - Shopping cart operations  
- **Order Service** (Port 3003) - Order processing and checkout
- **Frontend Service** (Port 3000) - Web UI and API Gateway

## Quick Start

### Local Development
```bash
./setup-local-k8s.sh          # Create local cluster
./deploy-k8s.sh local          # Deploy microservices
```

### AWS EKS Production
```bash
./deploy-environment.sh prod   # Create EKS + deploy
```

## Project Structure

```
├── services/                  # Microservices
│   ├── product-service/
│   ├── cart-service/
│   ├── order-service/
│   └── frontend-service/
├── k8s/                      # Kubernetes manifests
├── terraform/                # Infrastructure as Code
├── shared/                   # Shared utilities
└── .github/workflows/        # CI/CD pipelines
```

## Documentation

- [Deployment Options](DEPLOYMENT_OPTIONS.md)
- [Microservices Guide](MICROSERVICES_GUIDE.md)
- [EKS Capacity Planning](EKS_CAPACITY_PLANNING.md)
- [Pod Count Breakdown](POD_COUNT_BREAKDOWN.md)

## Cost

- **Local**: FREE (Kind cluster)
- **EKS**: ~$118/month (3x t3.small + control plane)