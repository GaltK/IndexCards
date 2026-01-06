/**
 * Shared constants for the IndexCards infrastructure
 */

export const PROJECT_NAME = 'IndexCards';

export const DATABASE_NAME = 'card_collection';

export const AVAILABILITY_ZONES_COUNT = 2;

export const VPC_ENDPOINTS = {
  S3: 's3',
  SECRETS_MANAGER: 'secretsmanager',
  CLOUDWATCH_LOGS: 'logs',
} as const;

export const LAMBDA_RUNTIME = 'python3.11';

export const API_ROUTES = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    FEDERATED: '/auth/federated',
    ME: '/auth/me',
  },
  CARDS: {
    CREATE: '/cards',
    GET: '/cards/{id}',
    UPDATE: '/cards/{id}',
    DELETE: '/cards/{id}',
    LIST: '/cards',
  },
  COLLECTIONS: {
    LIST: '/collections',
    CREATE: '/collections',
    GET: '/collections/{id}',
    UPDATE: '/collections/{id}',
    DELETE: '/collections/{id}',
    CARDS_LIST: '/collections/{id}/cards',
    CARDS_ADD: '/collections/{id}/cards',
    CARDS_REMOVE: '/collections/{id}/cards/{cardId}',
  },
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
  },
} as const;
