# EKS Capacity Planning

## Pod Capacity Analysis

### t3.small Instance (2 vCPU, 2GB RAM)
- **Max pods per node**: 11 pods
- **System pods per node**: ~4-5 pods
  - kube-proxy: 1 pod
  - aws-node (VPC CNI): 1 pod  
  - coredns: 2 pods (cluster-wide)
  - ebs-csi-node: 1 pod
- **Available for application**: ~6-7 pods per node

### Current Configuration (3 nodes)
- **Total pod capacity**: 33 pods
- **System pods**: ~13 pods
- **Available for apps**: ~20 pods
- **Our microservices**: 9 pods (2+2+2+3 replicas)
- **Buffer**: 11 pods for scaling

## Resource Allocation

### Per Service Resource Limits
```yaml
# Backend services (product, cart, order)
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
  limits:
    memory: "256Mi" 
    cpu: "200m"

# Frontend service
resources:
  requests:
    memory: "256Mi"
    cpu: "200m"
  limits:
    memory: "512Mi"
    cpu: "400m"
```

### Node Resource Usage
- **Per t3.small**: 2GB RAM, 2 vCPU
- **Backend pod**: 256Mi RAM, 200m CPU
- **Frontend pod**: 512Mi RAM, 400m CPU
- **System overhead**: ~500Mi RAM, 300m CPU

## Cost Comparison

### Option 1: 3x t3.small (~$45/month)
- 3 nodes × $15/month = $45/month
- EKS control plane: $73/month
- **Total: ~$118/month**

### Option 2: 2x t3.medium (~$60/month)  
- 2 nodes × $30/month = $60/month
- EKS control plane: $73/month
- **Total: ~$133/month**

**Recommendation**: Use 3x t3.small for better cost efficiency and pod distribution.