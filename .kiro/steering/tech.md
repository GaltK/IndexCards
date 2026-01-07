---
inclusion: always
---

# Technology Stack

## Architecture

Serverless three-tier architecture on AWS with monorepo organization.

## Infrastructure

- AWS CDK (TypeScript) for Infrastructure as Code
- Monorepo structure: `/infrastructure`, `/backend`, `/frontend`, `/shared`
- **Required Resource Tags**: All AWS resources must be tagged with:
  - `Product: index-cards`
  - `cost-center: web-and-apps`
- See [infrastructure-standards.md](infrastructure-standards.md) for complete tagging requirements

## Backend

- Python 3.11+ Lambda functions
- API Gateway REST API
- Amazon RDS MySQL for data persistence
- Amazon Cognito for authentication
- Lambda Layers for shared code (database, auth, utils)

## Frontend

- React with TypeScript
- S3 + CloudFront for static hosting
- Material-UI or similar component library
- React Router for client-side routing

## Observability

- CloudWatch Logs and Metrics
- X-Ray for distributed tracing
- CloudWatch Alarms with SNS notifications

## CI/CD

- AWS CodePipeline for automated deployments
- AWS CodeBuild for builds and tests
- Separate pipelines for infrastructure, backend, and frontend

## Common Commands

### Infrastructure Deployment

```bash
# Deploy all stacks to dev
cdk deploy --all --context environment=dev

# Deploy specific stack
cdk deploy NetworkStack --context environment=dev

# Destroy all stacks
cdk destroy --all --context environment=dev
```

### Backend Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run tests (including property-based tests)
pytest

# Run specific test
pytest test/test_cards.py
```

### Frontend Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Testing Strategy

- Unit tests for all components
- Property-based testing (Hypothesis for Python, fast-check for TypeScript) with minimum 100 iterations per property
- Integration tests for API endpoints
- CDK snapshot and fine-grained tests for infrastructure
- Each correctness property must have exactly one property-based test tagged with property number
