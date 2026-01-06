# Implementation Plan: IndexCards Infrastructure

## Overview

This implementation plan focuses exclusively on deploying the AWS infrastructure for the IndexCards platform using AWS CDK. The tasks build incrementally from project setup through complete infrastructure deployment, with testing at each stage.

## Tasks

- [x] 1. Initialize CDK project and repository structure

  - Create `/infrastructure` directory in monorepo
  - Initialize CDK TypeScript project with `cdk init app --language typescript`
  - Configure package.json with CDK dependencies
  - Set up TypeScript configuration (tsconfig.json)
  - Create directory structure: `/lib/stacks`, `/lib/constructs`, `/lib/config`, `/test`
  - Initialize Git and create .gitignore for CDK artifacts
  - _Requirements: 1.1, 1.2, 1.5_

- [ ] 2. Configure environment contexts and constants

  - Create `lib/config/environment.ts` for environment configuration interface
  - Create `lib/config/constants.ts` for shared constants
  - Configure `cdk.context.json` with dev, staging, and prod environments
  - Define environment-specific parameters (VPC CIDR, instance types, etc.)
  - Create helper functions to load environment configuration
  - _Requirements: 10.1, 10.2, 10.3_

- [ ] 3. Create CDK app entry point

  - Implement `bin/app.ts` as CDK application entry point
  - Load environment from CDK context
  - Instantiate all stacks with proper dependencies
  - Configure stack naming with environment prefix
  - Add tags for cost tracking and organization
  - _Requirements: 1.1, 10.4, 2.5_

- [ ] 4. Implement Network Stack
- [ ] 4.1 Create VPC and subnets

  - Create `lib/stacks/network-stack.ts`
  - Define VPC with configurable CIDR block
  - Create private subnets across 2+ availability zones
  - Configure subnet routing tables
  - _Requirements: 2.1, 2.5_

- [ ] 4.2 Configure VPC endpoints

  - Add VPC endpoints for S3, Secrets Manager, CloudWatch
  - Configure endpoint security groups
  - Optimize for cost by avoiding NAT Gateway where possible
  - _Requirements: 2.2_

- [ ] 4.3 Create security groups

  - Create Lambda security group with egress rules
  - Create RDS security group allowing access from Lambda SG
  - Implement least-privilege access rules
  - _Requirements: 2.3, 9.1_

- [ ] 4.4 Optional NAT Gateway configuration

  - Add conditional NAT Gateway based on environment config
  - Configure routing for Lambda internet access
  - _Requirements: 2.4_

- [ ] 4.5 Export network resources

  - Export VPC ID for cross-stack reference
  - Export private subnet IDs
  - Export security group IDs
  - _Requirements: 11.1, 11.2_

- [ ]\* 4.6 Write tests for Network Stack

  - Create snapshot test for CloudFormation template
  - Test VPC has correct CIDR block
  - Test private subnets exist in multiple AZs
  - Test security groups have correct ingress/egress rules
  - _Requirements: 12.1, 12.3_

- [ ] 5. Implement Database Stack
- [ ] 5.1 Create RDS MySQL instance

  - Create `lib/stacks/database-stack.ts`
  - Import VPC and subnets from Network Stack
  - Define RDS MySQL instance with environment-specific sizing
  - Configure Multi-AZ based on environment
  - Create DB subnet group using private subnets
  - _Requirements: 3.1, 10.2, 10.4_

- [ ] 5.2 Configure database security

  - Enable encryption at rest using KMS
  - Create KMS key for database encryption
  - Configure security group to allow access only from Lambda SG
  - _Requirements: 3.4, 3.5, 9.1_

- [ ] 5.3 Set up Secrets Manager for credentials

  - Generate database credentials using Secrets Manager
  - Store master username and password in secret
  - Configure automatic secret rotation (optional)
  - _Requirements: 3.2, 9.2_

- [ ] 5.4 Configure automated backups and retention

  - Enable automated daily backups
  - Set backup retention period based on environment (1 day for dev, 7 days for prod)
  - Configure backup window for off-peak hours
  - Enable deletion protection for production environment
  - Disable deletion protection for dev/staging environments
  - _Requirements: 3.3_

- [ ] 5.5 Export database resources

  - Export database endpoint
  - Export database secret ARN
  - Export database name
  - _Requirements: 11.1, 11.4_

- [ ]\* 5.6 Write tests for Database Stack

  - Create snapshot test
  - Test RDS has encryption enabled
  - Test RDS is in private subnets
  - Test backup retention is configured
  - Test security group allows Lambda access only
  - _Requirements: 12.1, 12.3, 12.4_

- [ ] 6. Implement Authentication Stack
- [ ] 6.1 Create Cognito User Pool

  - Create `lib/stacks/auth-stack.ts`
  - Define Cognito User Pool with password policy
  - Configure required attributes (username, email)
  - Set password requirements based on environment
  - Configure account recovery options
  - _Requirements: 4.1, 4.4_

- [ ] 6.2 Create User Pool Client

  - Create User Pool Client for web application
  - Configure OAuth flows
  - Set token expiration times
  - _Requirements: 4.2_

- [ ] 6.3 Optional: Configure identity providers

  - Add OpenID Connect identity providers
  - Configure attribute mapping
  - _Requirements: 4.3_

- [ ] 6.4 Optional: Enable MFA

  - Configure MFA settings based on environment
  - Set up SMS or TOTP MFA
  - _Requirements: 4.5_

- [ ] 6.5 Export authentication resources

  - Export User Pool ID
  - Export User Pool ARN
  - Export User Pool Client ID
  - _Requirements: 11.1, 11.3_

- [ ]\* 6.6 Write tests for Authentication Stack

  - Create snapshot test
  - Test User Pool has password policy configured
  - Test User Pool Client exists
  - Test required attributes are configured
  - _Requirements: 12.1, 12.3_

- [ ] 7. Implement API Stack - Lambda Layers
- [ ] 7.1 Create Lambda Layer constructs

  - Create `lib/constructs/lambda-layer.ts` reusable construct
  - Define layer packaging logic
  - Configure layer compatibility with Python runtime
  - _Requirements: 5.1_

- [ ] 7.2 Create Database Layer

  - Create layer with pymysql, SQLAlchemy dependencies
  - Package database connection utilities
  - Include ORM models (placeholder for now)
  - _Requirements: 5.1, 5.7_

- [ ] 7.3 Create Auth Layer

  - Create layer with PyJWT, boto3 dependencies
  - Package JWT validation utilities
  - Include Cognito integration helpers
  - _Requirements: 5.1, 5.7_

- [ ] 7.4 Create Utils Layer

  - Create layer with logging utilities
  - Package validation helpers
  - Include error handling utilities
  - _Requirements: 5.1, 5.7_

- [ ] 8. Implement API Stack - Lambda Functions
- [ ] 8.1 Create Lambda Function construct

  - Create `lib/constructs/lambda-function.ts` reusable construct
  - Configure VPC access using Network Stack exports
  - Attach Lambda layers
  - Set environment variables for database connection
  - Configure IAM role with necessary permissions
  - Enable X-Ray tracing
  - _Requirements: 5.2, 5.7, 9.1, 9.2_

- [ ] 8.2 Create authentication Lambda functions

  - Create auth-register Lambda (placeholder handler)
  - Create auth-login Lambda (placeholder handler)
  - Create auth-federated Lambda (placeholder handler)
  - Create auth-me Lambda (placeholder handler)
  - Configure memory and timeout based on environment
  - _Requirements: 5.2, 5.7, 10.2_

- [ ] 8.3 Create card management Lambda functions

  - Create cards-create Lambda (placeholder handler)
  - Create cards-get Lambda (placeholder handler)
  - Create cards-update Lambda (placeholder handler)
  - Create cards-delete Lambda (placeholder handler)
  - Create cards-list Lambda (placeholder handler)
  - _Requirements: 5.2, 5.7_

- [ ] 8.4 Create collection Lambda functions

  - Create collections-list Lambda (placeholder handler)
  - Create collections-create Lambda (placeholder handler)
  - Create collections-get Lambda (placeholder handler)
  - Create collections-update Lambda (placeholder handler)
  - Create collections-delete Lambda (placeholder handler)
  - Create collection-cards-list Lambda (placeholder handler)
  - Create collection-cards-add Lambda (placeholder handler)
  - Create collection-cards-remove Lambda (placeholder handler)
  - _Requirements: 5.2, 5.7_

- [ ] 8.5 Create profile Lambda functions

  - Create profile-get Lambda (placeholder handler)
  - Create profile-update Lambda (placeholder handler)
  - _Requirements: 5.2, 5.7_

- [ ] 9. Implement API Stack - API Gateway
- [ ] 9.1 Create API Gateway REST API

  - Create API Gateway REST API in `lib/stacks/api-stack.ts`
  - Configure CloudWatch logging
  - Enable X-Ray tracing
  - Set up default CORS configuration
  - _Requirements: 5.1, 5.6, 10.3_

- [ ] 9.2 Create Cognito Authorizer

  - Create Cognito User Pool Authorizer
  - Import User Pool from Authentication Stack
  - Configure authorization scopes
  - _Requirements: 5.5, 11.3_

- [ ] 9.3 Create API routes for authentication

  - Create POST /auth/register route with Lambda integration
  - Create POST /auth/login route with Lambda integration
  - Create POST /auth/federated route with Lambda integration
  - Create GET /auth/me route with Lambda integration and authorizer
  - _Requirements: 5.4_

- [ ] 9.4 Create API routes for cards

  - Create POST /cards route with authorizer
  - Create GET /cards/{id} route with authorizer
  - Create PUT /cards/{id} route with authorizer
  - Create DELETE /cards/{id} route with authorizer
  - Create GET /cards route with authorizer (list with query params)
  - _Requirements: 5.4, 5.5_

- [ ] 9.5 Create API routes for collections

  - Create GET /collections route with authorizer
  - Create POST /collections route with authorizer
  - Create GET /collections/{id} route with authorizer
  - Create PUT /collections/{id} route with authorizer
  - Create DELETE /collections/{id} route with authorizer
  - Create GET /collections/{id}/cards route with authorizer
  - Create POST /collections/{id}/cards route with authorizer
  - Create DELETE /collections/{id}/cards/{cardId} route with authorizer
  - _Requirements: 5.4, 5.5_

- [ ] 9.6 Create API routes for profile

  - Create GET /profile route with authorizer
  - Create PUT /profile route with authorizer
  - _Requirements: 5.4, 5.5_

- [ ] 9.7 Configure API Gateway deployment

  - Create deployment for API Gateway
  - Configure stage (dev, staging, prod) with stage variables
  - Set up throttling limits
  - Configure usage plans (optional)
  - _Requirements: 10.3_

- [ ] 9.8 Export API resources

  - Export API Gateway URL
  - Export API Gateway ID
  - _Requirements: 11.1_

- [ ]\* 9.9 Write tests for API Stack

  - Create snapshot test
  - Test API Gateway has Cognito authorizer
  - Test Lambda functions have VPC configuration
  - Test all expected routes exist
  - Test Lambda functions have correct IAM permissions
  - _Requirements: 12.1, 12.3, 12.4_

- [ ] 10. Implement Frontend Stack
- [ ] 10.1 Create S3 bucket for static hosting

  - Create `lib/stacks/frontend-stack.ts`
  - Define S3 bucket with static website configuration
  - Configure bucket policy for CloudFront access
  - Enable encryption at rest
  - Block public access (CloudFront only)
  - _Requirements: 6.1_

- [ ] 10.2 Create CloudFront distribution

  - Create CloudFront distribution with S3 origin
  - Configure Origin Access Identity
  - Set up cache behaviors for static assets
  - Configure default root object (index.html)
  - _Requirements: 6.2, 6.4_

- [ ] 10.3 Configure SSL certificate

  - Optionally import or create ACM certificate
  - Configure custom domain (if provided)
  - Set up HTTPS-only access
  - _Requirements: 6.3_

- [ ] 10.4 Configure error responses

  - Redirect 404 errors to /index.html for SPA routing
  - Redirect 403 errors to /index.html
  - _Requirements: 6.5_

- [ ] 10.5 Export frontend resources

  - Export CloudFront distribution URL
  - Export CloudFront distribution ID
  - Export S3 bucket name
  - _Requirements: 11.1_

- [ ]\* 10.6 Write tests for Frontend Stack

  - Create snapshot test
  - Test S3 bucket has encryption enabled
  - Test CloudFront distribution exists
  - Test error responses are configured
  - _Requirements: 12.1, 12.3_

- [ ] 11. Implement Monitoring Stack
- [ ] 11.1 Create CloudWatch Log Groups

  - Create `lib/stacks/monitoring-stack.ts`
  - Create log groups for all Lambda functions
  - Configure log retention based on environment
  - _Requirements: 7.1_

- [ ] 11.2 Create CloudWatch Alarms for Lambda

  - Create alarm for Lambda error rate > 5%
  - Create alarm for Lambda throttling
  - Create alarm for Lambda duration > 10 seconds
  - _Requirements: 7.2_

- [ ] 11.3 Create CloudWatch Alarms for RDS

  - Create alarm for RDS CPU > 80%
  - Create alarm for RDS storage < 10% free
  - Create alarm for RDS connection count
  - _Requirements: 7.2_

- [ ] 11.4 Create CloudWatch Alarms for API Gateway

  - Create alarm for API Gateway 5xx errors > 1%
  - Create alarm for API Gateway 4xx errors > 10%
  - _Requirements: 7.2_

- [ ] 11.5 Create SNS Topic for notifications

  - Create SNS topic for alarm notifications
  - Add email subscription based on configuration
  - _Requirements: 7.4_

- [ ] 11.6 Configure X-Ray tracing

  - Enable X-Ray for Lambda functions
  - Enable X-Ray for API Gateway
  - _Requirements: 7.3_

- [ ] 11.7 Create CloudWatch Dashboard

  - Create dashboard with Lambda metrics
  - Add RDS metrics to dashboard
  - Add API Gateway metrics to dashboard
  - _Requirements: 7.5_

- [ ]\* 11.8 Write tests for Monitoring Stack

  - Create snapshot test
  - Test alarms are created for critical metrics
  - Test SNS topic exists
  - _Requirements: 12.1, 12.3_

- [ ] 12. Implement CI/CD Stack (Optional)
- [ ] 12.1 Create CodePipeline

  - Create `lib/stacks/cicd-stack.ts`
  - Define pipeline with source, build, and deploy stages
  - Configure source from GitHub or CodeCommit
  - _Requirements: 8.1, 8.2_

- [ ] 12.2 Create CodeBuild project

  - Create CodeBuild project for CDK synthesis
  - Configure buildspec.yml for CDK commands
  - Set up environment variables
  - _Requirements: 8.3_

- [ ] 12.3 Configure deployment stage

  - Create CloudFormation deployment actions for each stack
  - Configure deployment order based on dependencies
  - _Requirements: 8.4, 11.2, 11.3, 11.4_

- [ ] 12.4 Add approval gate for production

  - Add manual approval action before production deployment
  - Configure approval based on environment
  - _Requirements: 8.5_

- [ ] 12.5 Create S3 bucket for artifacts

  - Create S3 bucket for pipeline artifacts
  - Configure lifecycle policies
  - _Requirements: 8.1_

- [ ] 12.6 Configure IAM roles for pipeline

  - Create service role for CodePipeline
  - Create service role for CodeBuild
  - Grant permissions for CloudFormation deployment
  - _Requirements: 9.4_

- [ ]\* 12.7 Write tests for CI/CD Stack

  - Create snapshot test
  - Test pipeline has correct stages
  - Test approval gate exists for production
  - _Requirements: 12.1, 12.3_

- [ ] 13. Create deployment scripts
- [ ] 13.1 Create deployment helper scripts

  - Create `scripts/deploy.sh` for deploying all stacks
  - Create `scripts/deploy-stack.sh` for deploying individual stacks
  - Create `scripts/destroy.sh` for tearing down infrastructure
  - Add environment validation
  - _Requirements: 10.5_

- [ ] 13.2 Create bootstrap script

  - Create `scripts/bootstrap.sh` for CDK bootstrap
  - Document AWS account setup requirements
  - _Requirements: 10.5_

- [ ] 13.3 Document deployment process

  - Create README.md with deployment instructions
  - Document environment configuration
  - Add troubleshooting guide
  - Document stack dependencies
  - _Requirements: 10.5_

- [ ] 14. Integration testing
- [ ] 14.1 Deploy to dev environment

  - Run `cdk deploy --all --context environment=dev`
  - Verify all stacks deploy successfully
  - Check CloudFormation console for stack status
  - _Requirements: 12.2_

- [ ] 14.2 Validate cross-stack references

  - Verify Lambda functions can access RDS
  - Verify API Gateway can invoke Lambda functions
  - Check CloudWatch logs for any errors
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 14.3 Test API Gateway endpoints

  - Use curl or Postman to test API endpoints
  - Verify authentication endpoints return expected responses
  - Test that protected endpoints require authorization
  - _Requirements: 5.4, 5.5_

- [ ] 14.4 Validate monitoring and alarms

  - Check CloudWatch dashboards are populated
  - Verify alarms are in OK state
  - Test alarm notifications (optional)
  - _Requirements: 7.1, 7.2, 7.5_

- [ ] 14.5 Clean up dev environment

  - Run `cdk destroy --all --context environment=dev`
  - Verify all resources are deleted
  - Check for any orphaned resources
  - _Requirements: 1.4_

- [ ] 15. Final documentation and handoff
- [ ] 15.1 Create architecture diagrams

  - Document deployed architecture
  - Create network diagram
  - Document data flow
  - _Requirements: Documentation_

- [ ] 15.2 Document operational procedures

  - Document how to deploy updates
  - Document how to roll back deployments
  - Document monitoring and alerting
  - Document backup and recovery procedures
  - _Requirements: Documentation_

- [ ] 15.3 Create runbook for common tasks

  - Document how to scale resources
  - Document how to rotate secrets
  - Document how to troubleshoot common issues
  - _Requirements: Documentation_
