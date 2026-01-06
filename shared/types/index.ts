/**
 * Shared TypeScript types for IndexCards platform
 * These types are used across infrastructure and frontend packages
 */

// Card entity
export interface Card {
  id: string;
  userId: string;
  playerFirstName: string;
  playerLastName: string;
  brand: string;
  series: string;
  cardType: string;
  rarity: number;
  createdAt: string;
  updatedAt: string;
}

// User entity
export interface User {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  birthdate: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

// Collection entity
export interface Collection {
  id: string;
  userId: string;
  name: string;
  isSystemCollection: boolean;
  createdAt: string;
  updatedAt: string;
}

// Pagination metadata
export interface PaginationMetadata {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

// API error response
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
    timestamp: string;
    requestId: string;
  };
}

// Authentication response
export interface AuthResponse {
  userId: string;
  token: string;
}

// Query parameters for card listing
export interface CardQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: 'playerFirstName' | 'playerLastName' | 'brand' | 'series' | 'cardType' | 'rarity' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  filterPlayerFirstName?: string;
  filterPlayerLastName?: string;
  filterBrand?: string;
  filterSeries?: string;
  filterCardType?: string;
  filterRarity?: number;
}
