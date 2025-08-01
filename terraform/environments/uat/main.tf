module "eks" {
  source = "../../eks"
  
  aws_region   = "ap-southeast-1"
  cluster_name = "shopmate-uat"
  environment  = "uat"
}