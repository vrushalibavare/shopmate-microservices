# Microservices Architecture Plan

## Services Overview

### 1. Product Service (Port 3001)
- Manages product catalog
- CRUD operations for products
- Stock management
- Database: DynamoDB products table

### 2. Cart Service (Port 3002)  
- Shopping cart operations
- Session-based cart management
- Database: DynamoDB carts table

### 3. Order Service (Port 3003)
- Order processing and checkout
- Order history
- Database: DynamoDB orders table

### 4. Frontend Service (Port 3000)
- Web UI (EJS templates)
- API Gateway functionality
- Static assets serving
- Communicates with other services via HTTP

### 5. AI Service (Port 3004)
- AI-powered features
- Chat functionality
- Product recommendations

## Directory Structure
```
shopmate-microservices/
├── services/
│   ├── product-service/
│   ├── cart-service/
│   ├── order-service/
│   ├── frontend-service/
│   └── ai-service/
├── k8s/
│   ├── namespaces/
│   ├── services/
│   ├── deployments/
│   ├── configmaps/
│   └── ingress/
├── shared/
│   ├── utils/
│   └── middleware/
└── docker-compose.yml
```