#!/bin/bash

# Generate secure session secrets for each environment
# Usage: ./generate-secrets.sh

echo "Generating secure session secrets..."

# Generate 64-character random strings
DEV_SECRET=$(openssl rand -hex 32)
UAT_SECRET=$(openssl rand -hex 32)
PROD_SECRET=$(openssl rand -hex 32)

echo "Generated secrets:"
echo "DEV:  $DEV_SECRET"
echo "UAT:  $UAT_SECRET"
echo "PROD: $PROD_SECRET"

# Update environment files
sed -i.bak "s/session_secret.*=.*/session_secret     = \"$DEV_SECRET\"/" terraform/environments/dev/main.tf
sed -i.bak "s/session_secret.*=.*/session_secret     = \"$UAT_SECRET\"/" terraform/environments/uat/main.tf
sed -i.bak "s/session_secret.*=.*/session_secret     = \"$PROD_SECRET\"/" terraform/environments/prod/main.tf

echo "Updated environment files with new secrets"
echo "Backup files created with .bak extension"