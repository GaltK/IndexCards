# IndexCards Monorepo Setup

This document describes the monorepo structure and initial setup completed for the IndexCards platform.

## Directory Structure Created

```
/
├── infrastructure/          # AWS CDK infrastructure code
│   ├── bin/                # CDK app entry point
│   ├── lib/
│   │   ├── stacks/         # CDK stack definitions
│   │   ├── constructs/     # Reusable CDK constructs
│   │   └── config/         # Environment configuration
│   ├── test/               # CDK tests
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   ├── cdk.json
│   └── README.md
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
│   ├── requirements.txt
│   ├── setup.py
│   ├── pytest.ini
│   └── README.md
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
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .eslintrc.json
│   ├── .env.example
│   └── README.md
│
├── shared/                 # Shared code across packages
│   ├── types/              # Shared TypeScript types
│   │   └── index.ts        # Common type definitions
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── .kiro/                  # Kiro configuration
│   ├── specs/              # Feature specifications
│   └── steering/           # AI assistant guidance
│
├── package.json            # Root workspace configuration
├── tsconfig.json           # Root TypeScript configuration
├── .gitignore              # Git ignore patterns
├── .editorconfig           # Editor configuration
├── .eslintrc.json          # ESLint configuration
├── .prettierrc.json        # Prettier configuration
├── .prettierignore         # Prettier ignore patterns
├── LICENSE                 # Apache 2.0 License
└── README.md               # Project documentation
```

## Configuration Files Created

### Root Level

1. **package.json** - Workspace configuration with npm workspaces
   - Workspaces: infrastructure, frontend, shared
   - Scripts: lint, format, test, build
   - Dev dependencies: TypeScript, ESLint, Prettier

2. **tsconfig.json** - Root TypeScript configuration
   - Target: ES2020
   - Strict mode enabled
   - Composite project support

3. **.gitignore** - Comprehensive ignore patterns
   - Node modules, build outputs, IDE files
   - Python cache, virtual environments
   - CDK outputs, logs, environment files

4. **.editorconfig** - Editor consistency
   - UTF-8 encoding, LF line endings
   - 2 spaces for TS/JS/JSON, 4 for Python

5. **.eslintrc.json** - ESLint configuration
   - TypeScript parser and plugin
   - Prettier integration
   - Recommended rules

6. **.prettierrc.json** - Code formatting
   - Single quotes, semicolons
   - 100 character line width
   - 2 space indentation

### Infrastructure Package

1. **package.json** - CDK dependencies and scripts
2. **tsconfig.json** - TypeScript config extending root
3. **cdk.json** - CDK app configuration
4. **jest.config.js** - Jest test configuration
5. **README.md** - Infrastructure documentation

### Backend Package

1. **requirements.txt** - Python dependencies
   - Core: boto3, pymysql, pydantic
   - Testing: pytest, hypothesis, moto
   - Dev: black, flake8, mypy

2. **setup.py** - Python package configuration
3. **pytest.ini** - Pytest configuration
   - Test discovery patterns
   - Coverage settings
   - Hypothesis profile (100 iterations)
4. **README.md** - Backend documentation

### Frontend Package

1. **package.json** - React and Vite dependencies
   - React 18, Material-UI
   - Vite for build tooling
   - Vitest for testing
   - fast-check for property-based testing

2. **tsconfig.json** - TypeScript config for React
3. **vite.config.ts** - Vite build configuration
4. **.eslintrc.json** - React-specific ESLint rules
5. **.env.example** - Environment variable template
6. **README.md** - Frontend documentation

### Shared Package

1. **package.json** - Shared types package
2. **tsconfig.json** - TypeScript config for shared types
3. **types/index.ts** - Common type definitions
   - Card, User, Collection entities
   - PaginatedResponse, ErrorResponse
   - API request/response types
4. **README.md** - Shared package documentation

## Next Steps

### 1. Install Dependencies

```bash
# Install root and workspace dependencies
npm install

# This will install dependencies for:
# - Root workspace
# - infrastructure/
# - frontend/
# - shared/
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
pip install -e ".[dev]"
```

### 3. Build Shared Types

```bash
cd shared
npm run build
```

### 4. Verify Setup

```bash
# Lint all TypeScript code
npm run lint

# Format all code
npm run format

# Build all workspaces
npm run build
```

## Workspace Features

- **npm workspaces** for dependency management
- **TypeScript project references** for type sharing
- **Shared types** between infrastructure and frontend
- **Consistent tooling** (ESLint, Prettier) across packages
- **Independent builds** for each package
- **Monorepo scripts** at root level

## Technology Stack

- **Infrastructure**: AWS CDK (TypeScript)
- **Backend**: Python 3.11+ Lambda functions
- **Frontend**: React 18 + TypeScript + Vite
- **Testing**: Jest (CDK), pytest + Hypothesis (Python), Vitest + fast-check (React)
- **Code Quality**: ESLint, Prettier, Black, Flake8, Mypy

## Requirements Satisfied

This setup satisfies the following requirements from the specification:

- ✅ **Requirement 13.1**: Monorepo organization with separate directories
- ✅ **Requirement 13.2**: Workspace tooling for shared dependencies
- ✅ **Requirement 13.4**: Shared libraries within monorepo

All directory structures, configuration files, and tooling are now in place for development to begin.
