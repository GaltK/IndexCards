# Backend

Python Lambda functions for IndexCards platform.

## Structure

- `functions/` - Lambda handler code organized by domain
  - `auth/` - Authentication endpoints
  - `cards/` - Card management endpoints
  - `collections/` - Collection management endpoints
  - `profile/` - User profile endpoints
- `layers/` - Lambda layers for shared code
  - `database/` - DB connection, ORM models
  - `auth/` - JWT validation, Cognito integration
  - `utils/` - Logging, validation, error handling
- `models/` - Data models and entities
- `test/` - Backend tests

## Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Install in development mode
pip install -e ".[dev]"
```

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov

# Run specific test file
pytest test/test_cards.py -v

# Run property-based tests only
pytest -m property

# Run unit tests only
pytest -m unit
```

## Code Quality

```bash
# Format code
black .

# Lint code
flake8 .

# Type checking
mypy .
```

## Lambda Layers

Shared code is packaged into Lambda layers:

- **database layer**: MySQL connection pooling, ORM models
- **auth layer**: JWT validation, Cognito SDK integration
- **utils layer**: Logging, error handling, validation utilities
