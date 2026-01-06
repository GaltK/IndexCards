# Infrastructure

AWS CDK infrastructure code for IndexCards platform.

## Structure

- `bin/` - CDK app entry point
- `lib/stacks/` - CDK stack definitions
- `lib/constructs/` - Reusable CDK constructs
- `lib/config/` - Environment configuration
- `test/` - Infrastructure tests

## Commands

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Synthesize CloudFormation templates
npm run synth

# View changes
npm run diff -- --context environment=dev

# Deploy all stacks
npm run deploy -- --all --context environment=dev

# Run tests
npm test
```

## Stacks

1. **NetworkStack** - VPC, subnets, security groups
2. **DatabaseStack** - RDS MySQL instance
3. **AuthStack** - Cognito User Pool
4. **ApiStack** - Lambda functions and API Gateway
5. **FrontendStack** - S3 and CloudFront
6. **MonitoringStack** - CloudWatch and X-Ray
7. **CICDStack** - CodePipeline

## Environment Configuration

Configure environments in `cdk.context.json`:

```json
{
  "environments": {
    "dev": {
      "account": "YOUR-ACCOUNT-ID",
      "region": "us-east-1"
    }
  }
}
```
