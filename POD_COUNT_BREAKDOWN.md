# Exact Pod Count Breakdown

## System Pods (Per 3-node cluster)

### DaemonSets (1 pod per node = 3 pods each)
- **kube-proxy**: 3 pods
- **aws-node (VPC CNI)**: 3 pods
- **ebs-csi-node**: 3 pods

### Cluster-wide Deployments
- **coredns**: 2 pods (default)
- **aws-load-balancer-controller**: 2 pods (if installed)

**Total System Pods: 13 pods**

## Application Pods (From our K8s manifests)

### Current Replica Configuration
- **product-service**: 2 replicas
- **cart-service**: 2 replicas  
- **order-service**: 2 replicas (handles checkout + orders)
- **frontend-service**: 2 replicas

**Total Application Pods: 8 pods**

## Architecture Note
**Checkout is handled by the order-service**, not a separate service:
- `/checkout` → Frontend renders checkout form
- `POST /orders` → Order service processes checkout + creates order

## Total Pod Usage
- System pods: 13
- Application pods: 8
- **Total used: 21 pods**
- **Available capacity: 33 pods**
- **Buffer: 12 pods**

## Verification Commands
```bash
# Check system pods
kubectl get pods -n kube-system

# Check application pods
kubectl get pods -n shopmate

# Check node capacity
kubectl describe nodes | grep -A 5 "Capacity:"
```