# Kubernetes Deployment Options

## Option 1: Local Development (Kind/Minikube)

### Prerequisites
- Docker Desktop
- kubectl

### Setup
```bash
# Setup local cluster
./setup-local-k8s.sh

# Deploy application
./deploy-k8s.sh local

# Access application
echo "127.0.0.1 shopmate.local" >> /etc/hosts
open http://shopmate.local
```

## Option 2: AWS EKS Cluster

### Prerequisites
- AWS CLI configured
- Terraform installed
- kubectl

### Setup EKS Cluster
```bash
# Create EKS cluster
./create-eks-cluster.sh ap-southeast-1 shopmate-eks

# Deploy application
./deploy-k8s.sh eks ap-southeast-1

# Get LoadBalancer URL
kubectl get service frontend-service -n shopmate
```

### Manual EKS Setup (Alternative)
```bash
# Create cluster with eksctl
eksctl create cluster --name shopmate-eks --region ap-southeast-1 --nodes 2

# Update kubeconfig
aws eks update-kubeconfig --region ap-southeast-1 --name shopmate-eks
```

## Option 3: Other Cloud Providers

### Google GKE
```bash
# Create cluster
gcloud container clusters create shopmate-gke --num-nodes=2

# Get credentials
gcloud container clusters get-credentials shopmate-gke

# Deploy
./deploy-k8s.sh local  # Use local mode for non-AWS
```

### Azure AKS
```bash
# Create cluster
az aks create --resource-group myResourceGroup --name shopmate-aks --node-count 2

# Get credentials
az aks get-credentials --resource-group myResourceGroup --name shopmate-aks

# Deploy
./deploy-k8s.sh local  # Use local mode for non-AWS
```

## Cleanup

### Local (Kind)
```bash
kind delete cluster --name shopmate
```

### EKS
```bash
cd terraform/eks
terraform destroy -auto-approve
```

## Cost Considerations

### Local Development: FREE
- Uses local Docker resources

### EKS Cluster: ~$118/month
- Control plane: $73/month
- Worker nodes (3x t3.small): ~$45/month
- Total: ~$118/month

### Alternatives for Lower Cost:
- Use t3.micro instances (free tier eligible)
- Use Fargate for serverless containers
- Use EKS Anywhere for on-premises