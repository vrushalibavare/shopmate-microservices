module "shopmate" {
  source = "../../"
  
  environment        = "dev"
  aws_region         = "ap-southeast-1"
  app_count          = 1
  domain_name        = "shopmate.dev.sctp-sandbox.com"
  route53_zone_name  = "sctp-sandbox.com"
  create_route53_zone = false  # Using existing zone
}