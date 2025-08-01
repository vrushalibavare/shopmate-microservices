variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1"
}

variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
  default     = "shopmate-eks"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}