# IndexCards

```
  ╔═══════════════╗        ╔═══════════════╗
  ║   ⚾ TOPPS    ║        ║   ⚡ POKEMON  ║
  ║               ║        ║               ║
  ║   [Player]    ║        ║   PIKACHU     ║
  ║   Portrait    ║        ║    ⚡⚡⚡      ║
  ║               ║        ║   HP: 60      ║
  ║               ║        ║               ║
  ║ Mookie Betts  ║        ║ ⚡ Thunder    ║
  ║ Dodgers • SS  ║        ║   Shock  30   ║
  ║ Series 1 #50  ║        ║ ⚡⚡ Electro   ║
  ║ Rarity: ★★★★★ ║        ║   Ball   50   ║
  ╚═══════════════╝        ╚═══════════════╝
```

A cloud-native card collection platform for managing and showcasing your trading card collections.

## Quick Start

```bash
# 1. Clone and install
git clone <repository-url> && cd indexcards
npm install

# 2. Configure AWS credentials
aws configure

# 3. Setup infrastructure
cd infrastructure
npm install
cp cdk.context.json.template cdk.context.json
cdk bootstrap

# 4. Deploy to dev
cdk deploy --all --context environment=dev

# 5. Access your application
# API and Frontend URLs will be in the CDK outputs
```

See [Getting Started](#getting-started) for detailed instructions.

## Overview

IndexCards enables collectors to digitally catalog their trading cards with detailed attributes, organize them into custom collections, and showcase their top 20 favorite cards. Built on AWS serverless architecture with a modern React frontend.

## Features

- **Card Library Management** - Full CRUD operations for your card collection
- **Advanced Search** - Filter and sort by player name, brand, series, type, and rarity
- **Custom Collections** - Organize cards into user-defined collections
- **Top Cards Showcase** - Display up to 20 favorite cards on your home page
- **User Profiles** - Manage personal information and bio
- **Secure Authentication** - Amazon Cognito with OpenID Connect support

## Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        User[User Browser]
    end

    subgraph "AWS Cloud"
        subgraph "Edge & CDN"
            CF[CloudFront CDN]
            S3Web[S3 Static Hosting]
        end

        APIGW[API Gateway]
        Cognito[Amazon Cognito<br/>User Pool]
        Secrets[Secrets Manager]

        subgraph "VPC - Private Subnets"
            Lambda[Lambda Functions<br/>Python 3.11]
            RDS[(RDS MySQL<br/>Multi-AZ)]
        end

        subgraph "Observability"
            CW[CloudWatch<br/>Logs & Metrics]
            XRay[X-Ray Tracing]
        end
    end

    User -->|HTTPS| CF
    CF --> S3Web
    User -->|API Calls| APIGW
    APIGW -->|Authorize| Cognito
    APIGW --> Lambda
    Lambda --> RDS
    Lambda -.->|VPC Endpoint| Secrets
    Lambda -.->|VPC Endpoint| CW
    Lambda --> XRay
    APIGW --> XRay

    style User fill:#e1f5ff
    style CF fill:#ff9900
    style S3Web fill:#ff9900
    style APIGW fill:#ff9900
    style Lambda fill:#ff9900
    style Cognito fill:#ff9900
    style RDS fill:#ff9900
    style Secrets fill:#ff9900
    style CW fill:#ff9900
    style XRay fill:#ff9900

    linkStyle 6 stroke:#00a86b,stroke-width:2px
    linkStyle 7 stroke:#00a86b,stroke-width:2px
    style CW fill:#ff9900
    style XRay fill:#ff9900
```

### Technology Stack

- **Frontend**: React + TypeScript, hosted on S3 + CloudFront
- **Backend**: Python Lambda functions with API Gateway
- **Database**: Amazon RDS MySQL
- **Authentication**: Amazon Cognito
- **Infrastructure**: AWS CDK (TypeScript)
- **Monitoring**: CloudWatch + X-Ray

## Project Structure

```
/
├── infrastructure/     # AWS CDK infrastructure code
├── backend/           # Python Lambda functions
├── frontend/          # React TypeScript application
├── shared/            # Shared code and types
└── .kiro/             # Specs and steering documents
```

See [structure.md](.kiro/steering/structure.md) for detailed organization.

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- AWS CLI configured with appropriate credentials
- AWS CDK CLI (`npm install -g aws-cdk`)

## Getting Started

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd indexcards

# Install root dependencies
npm install
```

### 2. Bootstrap AWS Environment

```bash
# Bootstrap CDK in your AWS account (one-time setup)
cd infrastructure
npm install

# Bootstrap using your AWS CLI credentials
cdk bootstrap

# Or with a specific profile
cdk bootstrap --profile your-profile-name
```

### 3. Configure Environment

Copy the context template and configure for your environment:

```bash
cd infrastructure
cp cdk.context.json.template cdk.context.json
```

**Note:** The `cdk.context.json` file is gitignored for security. AWS account ID will be automatically detected from your AWS CLI credentials. You only need to adjust environment-specific settings like VPC CIDR, instance types, etc.

The infrastructure uses your AWS CLI credentials:

```bash
# Ensure AWS CLI is configured
aws configure

# Or use a specific profile
export AWS_PROFILE=your-profile-name
```

### 4. Deploy Infrastructure

```bash
# Deploy all infrastructure stacks to dev
cd infrastructure
cdk deploy --all --context environment=dev

# Or with a specific AWS profile
cdk deploy --all --context environment=dev --profile your-profile-name

# Note: This will create VPC, RDS, Cognito, Lambda functions, API Gateway, etc.
# Deployment takes approximately 15-20 minutes
```

### 5. Initialize Database Schema

```bash
# After infrastructure is deployed, run database migrations
cd backend
pip install -r requirements.txt

# Run schema creation script (to be implemented)
python scripts/init_db.py --environment dev
```

### 6. Deploy Backend

```bash
# Backend Lambda functions are deployed with infrastructure
# To update Lambda code only:
cd infrastructure
cdk deploy ApiStack --context environment=dev
```

### 7. Build and Deploy Frontend

```bash
cd frontend
npm install
npm run build

# Get S3 bucket name from CDK outputs
aws s3 sync dist/ s3://YOUR-FRONTEND-BUCKET-NAME

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR-DISTRIBUTION-ID \
  --paths "/*"
```

### 8. Test the Application

```bash
# Get API Gateway URL from CDK outputs
export API_URL="https://your-api-id.execute-api.us-east-1.amazonaws.com/dev"

# Test health endpoint
curl $API_URL/api/auth/me

# Access frontend
# CloudFront URL will be in CDK outputs
```

## Development Workflow

### Local Backend Development

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run tests
pytest

# Run specific test
pytest test/test_cards.py -v

# Run with coverage
pytest --cov=functions --cov=layers
```

### Local Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Infrastructure Changes

```bash
cd infrastructure

# View changes before deploying
cdk diff --context environment=dev

# Deploy specific stack
cdk deploy NetworkStack --context environment=dev

# Destroy all stacks (careful!)
cdk destroy --all --context environment=dev
```

## Testing

- **Unit Tests**: All components and functions
- **Property-Based Tests**: Hypothesis (Python) and fast-check (TypeScript)
- **Integration Tests**: End-to-end API workflows
- **Infrastructure Tests**: CDK snapshot and assertion tests

Each correctness property has a dedicated property-based test running minimum 100 iterations.

## Environments

The project supports multiple environments configured via CDK context:

- **dev**: Development environment with minimal resources
- **staging**: Pre-production environment
- **prod**: Production environment with Multi-AZ RDS, enhanced monitoring

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/federated` - Federated login via OpenID Connect
- `GET /api/auth/me` - Get current user info

### Card Endpoints

- `POST /api/cards` - Create new card
- `GET /api/cards` - List cards (with pagination, filtering, sorting)
- `GET /api/cards/{id}` - Get card by ID
- `PUT /api/cards/{id}` - Update card
- `DELETE /api/cards/{id}` - Delete card

### Collection Endpoints

- `GET /api/collections` - List all collections (includes Top Cards)
- `POST /api/collections` - Create new collection
- `GET /api/collections/{id}` - Get collection details
- `PUT /api/collections/{id}` - Update collection name
- `DELETE /api/collections/{id}` - Delete collection
- `GET /api/collections/{id}/cards` - List cards in collection
- `POST /api/collections/{id}/cards` - Add card to collection
- `DELETE /api/collections/{id}/cards/{cardId}` - Remove card from collection

### Profile Endpoints

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

All protected endpoints require JWT token in `Authorization: Bearer {token}` header.

## Monitoring

- **CloudWatch Logs**: All Lambda function logs
- **CloudWatch Metrics**: Request count, latency, errors
- **CloudWatch Alarms**: Error rates, throttling, resource utilization
- **X-Ray Tracing**: Distributed tracing across services
- **CloudWatch Dashboards**: Key metrics visualization

## Security

- **No Secrets in Code**: AWS account IDs and credentials never committed to repository
- **AWS CLI Credentials**: Infrastructure deployment uses your configured AWS profile
- **Data Encryption**: All data encrypted at rest (RDS, S3) and in transit (TLS/HTTPS)
- **VPC Isolation**: Lambda and RDS run in private subnets with no public internet access
- **Least-Privilege IAM**: All roles follow principle of least privilege
- **Input Validation**: All API inputs validated and sanitized
- **Secrets Management**: Database credentials stored in AWS Secrets Manager
- **VPC Flow Logs**: Network traffic monitoring enabled for security analysis

### Sensitive Files (Gitignored)

The following files contain environment-specific or sensitive data and are never committed:

- `infrastructure/cdk.context.json` - Contains cached AWS account values
- `infrastructure/cdk.out/` - Generated CloudFormation templates
- `infrastructure/.env` - Local environment variables (if used)
- `backend/.env` - Backend environment variables
- `frontend/.env` - Frontend environment variables

### Network Architecture

**All Lambda functions run in VPC private subnets** to access RDS MySQL database. This design ensures:

- ✅ Secure database access (no public internet exposure)
- ✅ Consistent security posture across all functions
- ✅ All functions can access database for user records and collections

**NAT Gateway Strategy:**

- **Dev/Staging**: Optional (disabled by default for cost savings)
- **Production**: Enabled (required for Lambda to access Cognito and external services)

**VPC Endpoints** configured for:

- S3 (for backups and static assets)
- Secrets Manager (for database credentials)
- CloudWatch (for logs and metrics)

This eliminates NAT Gateway costs for AWS service communication while maintaining security.

**Why all Lambdas are in VPC:**

- `auth-register` creates user records and Top Cards collection in database
- `auth-me` retrieves user profile from database
- All card/collection functions require database access
- Consistent deployment pattern simplifies operations

## Contributing

1. Review the specs in `.kiro/specs/` for requirements and design
2. Follow the project structure conventions
3. Write tests for all new functionality
4. Ensure all tests pass before submitting
5. Update documentation as needed

## License

Apache License 2.0 - See [LICENSE](LICENSE) for details.

## Documentation

- [Product Overview](.kiro/steering/product.md)
- [Technology Stack](.kiro/steering/tech.md)
- [Project Structure](.kiro/steering/structure.md)
- [Requirements](.kiro/specs/card-collection-platform/requirements.md)
- [Design Document](.kiro/specs/card-collection-platform/design.md)
- [Infrastructure Requirements](.kiro/specs/card-platform-infrastructure/requirements.md)
- [Infrastructure Design](.kiro/specs/card-platform-infrastructure/design.md)
