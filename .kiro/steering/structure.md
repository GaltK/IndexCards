---
inclusion: always
---

# Project Structure

## Monorepo Organization

```
/
├── infrastructure/          # AWS CDK infrastructure code
│   ├── bin/                # CDK app entry point
│   ├── lib/
│   │   ├── stacks/         # CDK stack definitions
│   │   │   ├── network-stack.ts
│   │   │   ├── database-stack.ts
│   │   │   ├── auth-stack.ts
│   │   │   ├── api-stack.ts
│   │   │   ├── frontend-stack.ts
│   │   │   ├── monitoring-stack.ts
│   │   │   └── cicd-stack.ts
│   │   ├── constructs/     # Reusable CDK constructs
│   │   └── config/         # Environment configuration
│   ├── test/               # CDK tests
│   └── cdk.json
│
├── backend/                # Python Lambda functions
│   ├── functions/          # Lambda handler code
│   │   ├── auth/           # Authentication endpoints
│   │   ├── cards/          # Card management endpoints
│   │   ├── collections/    # Collection management endpoints
│   │   └── profile/        # User profile endpoints
│   ├── layers/             # Lambda layers
│   │   ├── database/       # DB connection, ORM models
│   │   ├── auth/           # JWT validation, Cognito
│   │   └── utils/          # Logging, validation, errors
│   ├── models/             # Data models and entities
│   ├── test/               # Backend tests
│   └── requirements.txt
│
├── frontend/               # React TypeScript application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client services
│   │   ├── contexts/       # React contexts (auth, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   └── package.json
│
├── shared/                 # Shared code across packages
│   └── types/              # Shared TypeScript types
│
├── .kiro/                  # Kiro configuration
│   ├── specs/              # Feature specifications
│   └── steering/           # AI assistant guidance
│
└── LICENSE                 # Apache 2.0 License
```

## Key Conventions

- Infrastructure stacks are deployed in dependency order: Network → Database/Auth → API → Frontend → Monitoring
- Lambda functions are organized by domain (auth, cards, collections, profile)
- Each Lambda function has a dedicated handler file
- Shared code is packaged into Lambda Layers
- Frontend follows feature-based organization
- All tests are colocated with source code in `test/` directories
- Environment-specific configuration uses CDK context (cdk.context.json)

## Stack Dependencies

- Database Stack depends on Network Stack (VPC, subnets)
- API Stack depends on Network, Database, and Auth Stacks
- Monitoring Stack depends on API Stack
- Frontend Stack is independent
- CI/CD Stack is optional and independent
