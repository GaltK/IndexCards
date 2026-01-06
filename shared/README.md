# Shared

Shared TypeScript types and utilities used across infrastructure and frontend packages.

## Structure

- `types/` - Shared TypeScript type definitions

## Usage

Import shared types in other packages:

```typescript
import { Card, User, Collection, PaginatedResponse } from '@indexcards/shared';
```

## Building

```bash
# Build shared types
npm run build

# Watch for changes
npm run watch
```

## Types

- **Card** - Card entity with all properties
- **User** - User entity with profile information
- **Collection** - Collection entity
- **PaginatedResponse** - Generic paginated response wrapper
- **ErrorResponse** - Standard API error response format
- **AuthResponse** - Authentication response
- **CardQueryParams** - Query parameters for card listing
