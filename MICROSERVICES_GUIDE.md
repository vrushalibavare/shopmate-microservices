# ShopMate Microservices Deployment Guide

## Architecture Overview

The monolithic ShopMate application has been decomposed into the following microservices:

1. **Product Service** (Port 3001) - Product catalog management
2. **Cart Service** (Port 3002) - Shopping cart operations
3. **Order Service** (Port 3003) - Order processing
4. **Frontend Service** (Port 3000) - Web UI and API Gateway

## Quick Start

### Local Development with Docker Compose

1. **Build and run all services:**
   ```bash
   docker-compose -f docker-compose.microservices.yml up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Product API: http://localhost:3001/api/products
   - Cart API: http://localhost:3002/api/cart
   - Order API: http://localhost:3003/api/orders

### Kubernetes Deployment

1. **Build Docker images:**
   ```bash
   ./build-images.sh
   ```

2. **Deploy to Kubernetes:**
   ```bash
   ./deploy-k8s.sh
   ```

3. **Access the application:**
   - Add `127.0.0.1 shopmate.local` to `/etc/hosts`
   - Visit: http://shopmate.local

## Service Communication

Services communicate via HTTP REST APIs:
- Frontend → Product/Cart/Order services
- Cart → Product service (for stock updates)
- Order → Cart service (for checkout)

## Environment Variables

Key environment variables for each service:

### All Services
- `NODE_ENV`: Environment (development/production)
- `AWS_REGION`: AWS region for DynamoDB

### Service-Specific
- `PRODUCTS_TABLE`: DynamoDB products table name
- `CARTS_TABLE`: DynamoDB carts table name  
- `ORDERS_TABLE`: DynamoDB orders table name
- `PRODUCT_SERVICE_URL`: Product service endpoint
- `CART_SERVICE_URL`: Cart service endpoint
- `ORDER_SERVICE_URL`: Order service endpoint

## Monitoring and Health Checks

Each service exposes a `/health` endpoint for monitoring:
- Product Service: http://localhost:3001/health
- Cart Service: http://localhost:3002/health
- Order Service: http://localhost:3003/health
- Frontend Service: http://localhost:3000/health

## Scaling

### Kubernetes Horizontal Pod Autoscaler

```bash
# Scale product service
kubectl scale deployment product-service --replicas=5 -n shopmate

# Auto-scaling based on CPU
kubectl autoscale deployment product-service --cpu-percent=70 --min=2 --max=10 -n shopmate
```

## Database Setup

Ensure DynamoDB tables exist:
- `shopmate-products-prod`
- `shopmate-carts-prod`
- `shopmate-orders-prod`

## Troubleshooting

### Common Issues

1. **Service Discovery**: Ensure service names match in environment variables
2. **Database Access**: Verify AWS credentials and DynamoDB table permissions
3. **Port Conflicts**: Check no other services are using ports 3000-3003

### Debugging Commands

```bash
# Check pod status
kubectl get pods -n shopmate

# View logs
kubectl logs -f deployment/product-service -n shopmate

# Port forward for debugging
kubectl port-forward service/product-service 3001:3001 -n shopmate
```

## Next Steps

1. **Add AI Service**: Implement the AI service for chat functionality
2. **API Gateway**: Consider using Kong or Ambassador for advanced routing
3. **Service Mesh**: Implement Istio for advanced traffic management
4. **Monitoring**: Add Prometheus and Grafana for metrics
5. **CI/CD**: Set up automated deployment pipelines
6. **Security**: Implement JWT authentication and RBAC