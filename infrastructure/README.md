# IndexCards Infrastructure

AWS CDK infrastructure for the IndexCards platform.

## Prerequisites

- Node.js 18+ and npm
- AWS CLI configured with credentials
- AWS CDK CLI: `npm install -g aws-cdk`

## Setup

```bash
# Install dependencies
npm install

# Copy the context template (first time only)
cp cdk.context.json.template cdk.context.json

# Build the project
npm run build
```

**Note:** `cdk.context.json` is gitignored because CDK will cache account-specific values in it. The template file (`cdk.context.json.template`) is the source of truth for environment configuration.

## Deployment

The infrastructure uses your AWS CLI credentials. Make sure you have configured your AWS profile:

```bash
aws configure
```

### Deploy to Development

```bash
cdk deploy --all --context environment=dev
```

### Deploy to Staging

```bash
cdk deploy --all --context environment=staging
```

### Deploy to Production

```bash
cdk deploy --all --context environment=prod
```

### Using a Specific AWS Profile

```bash
cdk deploy --all --context environment=dev --profile your-profile-name
```

## Configuration

Environment-specific configuration is stored in `cdk.context.json`. This file does NOT contain AWS account IDs - those come from your AWS CLI credentials.

## Useful Commands

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for changes and compile
- `npm run test` - Run unit tests
- `npx cdk deploy` - Deploy this stack to your default AWS account/region
- `npx cdk diff` - Compare deployed stack with current state
- `npx cdk synth` - Emits the synthesized CloudFormation template

## Security

- AWS account IDs are never committed to the repository
- All sensitive configuration should be in `.env` files (which are gitignored)
- Use AWS Secrets Manager for application secrets
