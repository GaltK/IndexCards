# Frontend

React TypeScript frontend for IndexCards platform.

## Structure

- `src/components/` - Reusable React components
- `src/pages/` - Page components
- `src/services/` - API client services
- `src/contexts/` - React contexts (auth, etc.)
- `src/hooks/` - Custom React hooks
- `src/types/` - TypeScript type definitions
- `public/` - Static assets

## Setup

```bash
# Install dependencies
npm install
```

## Development

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Environment Variables

Create `.env.local` file:

```env
VITE_API_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev
VITE_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Features

- Card library management with CRUD operations
- Advanced filtering, sorting, and pagination
- Custom collections
- Top Cards showcase (max 20 cards)
- User profile management
- Secure authentication with Cognito
