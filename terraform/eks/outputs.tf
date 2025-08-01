output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "cluster_name" {
  description = "Kubernetes Cluster Name"
  value       = module.eks.cluster_name
}

output "cluster_arn" {
  description = "The Amazon Resource Name (ARN) of the cluster"
  value       = module.eks.cluster_arn
}

output "dynamodb_tables" {
  description = "DynamoDB table names"
  value = {
    products = aws_dynamodb_table.products.name
    carts    = aws_dynamodb_table.carts.name
    orders   = aws_dynamodb_table.orders.name
  }
}

output "ecr_repositories" {
  description = "ECR repository URLs"
  value = {
    product_service  = aws_ecr_repository.product_service.repository_url
    cart_service     = aws_ecr_repository.cart_service.repository_url
    order_service    = aws_ecr_repository.order_service.repository_url
    frontend_service = aws_ecr_repository.frontend_service.repository_url
  }
}