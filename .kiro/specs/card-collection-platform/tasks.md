# Implementation Plan: Card Collection Platform

## Overview

This implementation plan breaks down the Card Collection Platform into incremental, actionable tasks. Each task builds on previous work, starting with infrastructure, then backend services, and finally the frontend application. The plan follows a test-driven approach with property-based testing for correctness properties.

## Tasks

- [x] 1. Initialize monorepo structure and tooling

  - Create root directory structure: `/infrastructure`, `/backend`, `/frontend`, `/shared`
  - Set up package manager workspace configuration (npm/yarn workspaces or similar)
  - Configure TypeScript for shared types and infrastructure
  - Create root-level configuration files (.gitignore, .editorconfig, README.md)
  - Set up linting and formatting tools (ESLint, Prettier)
  - _Requirements: 13.1, 13.2, 13.4_

- [ ] 2. Set up AWS CDK infrastructure foundation

  - Initialize CDK app in `/infrastructure` directory
  - Create CDK context configuration for multiple environments (dev, staging, prod)
  - Define base stack structure with environment-specific parameters
  - Configure CDK deployment settings and bootstrap requirements
  - _Requirements: 8.1, 8.3_

- [ ] 3. Implement Network Stack

  - Create VPC with private subnets across 2 availability zones
  - Configure NAT Gateways (optional, for Lambda internet access)
  - Define Security Groups for Lambda functions and RDS with least-privilege rules
  - Set up Network ACLs for additional security layer
  - Configure VPC endpoints for AWS services (S3, Secrets Manager, CloudWatch)
  - _Requirements: 11.4_

- [ ] 4. Implement Database Stack

  - Create RDS MySQL instance in private subnets with Multi-AZ configuration
  - Configure database parameter groups for optimal performance
  - Enable encryption at rest for RDS instance
  - Set up automated backups with retention policy
  - Store database credentials in AWS Secrets Manager
  - Configure security group to allow access only from Lambda functions
  - _Requirements: 10.1, 10.2, 11.2_

- [ ] 5. Implement Authentication Stack

  - Create Cognito User Pool with password policies
  - Configure Cognito User Pool Client for web application
  - Set up OpenID Connect identity providers in Cognito
  - Create Cognito Identity Pool for federated identities
  - Configure user attributes (username, email)
  - _Requirements: 6.1, 6.3_

- [ ] 6. Implement Monitoring Stack

  - Create CloudWatch Log Groups for application services
  - Set up X-Ray tracing configuration
  - Define CloudWatch Alarms for critical metrics (error rates, latency, resource utilization)
  - Create SNS topics for alert notifications
  - Configure CloudWatch Dashboards for application and infrastructure metrics
  - _Requirements: 12.1, 12.2, 12.3, 12.5_

- [ ] 7. Set up backend project structure

  - Initialize Python project in `/backend` directory
  - Set up project structure: `/functions` (Lambda handlers), `/layers` (shared code), `/models` (data models)
  - Configure Poetry or pip for dependency management
  - Create requirements.txt for Lambda layers (database, auth, utils)
  - Set up database migration tool (Alembic for Python)
  - Configure logging utilities for Lambda (structured JSON logging to CloudWatch)
  - Create shared utilities for Lambda responses, error handling, and CORS
  - _Requirements: 13.1_

- [ ] 8. Create database schema (initial deployment)

  - Create initial schema for `users` table with all fields and indexes
  - Create schema for `cards` table with foreign key to users and indexes
  - Create schema for `collections` table with user foreign key and system collection flag
  - Create schema for `collection_cards` junction table with foreign keys, constraints, and unique position per collection
  - Add database indexes for query optimization (user_id, brand, rarity, username, collection_id, system collections)
  - Add constraint to enforce Top Cards collection (is_system_collection=TRUE) has max 20 cards
  - Configure deletion protection based on environment (none for dev, enabled for production)
  - Test schema creation can be applied cleanly
  - _Requirements: 10.1, 10.2, 5A.1, 5B.1, 5.1_

- [ ] 9. Implement data models and entities
- [ ] 9.1 Create Card entity/model with all required fields

  - Define Card class with id, userId, playerFirstName, playerLastName, brand, series, cardType, rarity, timestamps
  - Add validation annotations for required fields and data types
  - Configure ORM mappings to database table
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ]\* 9.2 Write property test for Card entity

  - **Property 1: Card creation adds to library**
  - **Validates: Requirements 1.1, 1.2, 2.1-2.6**

- [ ] 9.3 Create User entity/model with profile fields

  - Define User class with id, username, firstName, lastName, birthdate, bio, timestamps
  - Add unique constraint on username
  - Configure ORM mappings to database table
  - _Requirements: 7.1_

- [ ] 9.4 Create Collection entity/model

  - Define Collection class with id, userId, name, isSystemCollection, timestamps
  - Configure ORM mappings to database table
  - _Requirements: 5A.1_

- [ ] 9.5 Create CollectionCard entity/model for junction table

  - Define CollectionCard class with collectionId, cardId, position
  - Configure ORM mappings with foreign key relationships
  - _Requirements: 5B.1_

- [ ] 10. Implement authentication service
- [ ] 10.1 Create JWT token validation middleware

  - Implement JWT token parsing and validation against Cognito public keys
  - Extract user ID from token claims
  - Add authentication middleware to protect routes
  - _Requirements: 6.2, 6.5_

- [ ]\* 10.2 Write property test for token validation

  - **Property 24: Valid credential authentication**
  - **Validates: Requirements 6.1, 6.2**

- [ ]\* 10.3 Write property test for invalid token rejection

  - **Property 25: Invalid credential rejection**
  - **Validates: Requirements 6.4**

- [ ] 10.4 Implement user registration endpoint

  - Create POST /api/auth/register endpoint
  - Integrate with Cognito to create user account
  - Create corresponding user record in database
  - Auto-create Top Cards collection for new user (marked as system collection with name "Top Cards")
  - Return JWT token on successful registration
  - _Requirements: 6.1, 7.1, 5.1_

- [ ] 10.5 Implement login endpoint

  - Create POST /api/auth/login endpoint
  - Authenticate with Cognito using username/password
  - Return JWT token on successful authentication
  - _Requirements: 6.2_

- [ ] 10.6 Implement federated login endpoint

  - Create POST /api/auth/federated endpoint
  - Validate OpenID Connect token with Cognito
  - Create or retrieve user record
  - Return JWT token
  - _Requirements: 6.3_

- [ ] 10.7 Implement current user endpoint

  - Create GET /api/auth/me endpoint
  - Return authenticated user information from token
  - _Requirements: 6.2_

- [ ] 11. Implement Card repository and service
- [ ] 11.1 Create Card repository with CRUD operations

  - Implement createCard method with database insert
  - Implement getCardById method with user ownership check
  - Implement updateCard method with validation
  - Implement deleteCard method with cascade to collections (including Top Cards)
  - Add connection pooling configuration
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ]\* 11.2 Write property test for card update persistence

  - **Property 2: Card update persistence**
  - **Validates: Requirements 1.3**

- [ ]\* 11.3 Write property test for card deletion

  - **Property 3: Card deletion removes from library**
  - **Validates: Requirements 1.4**

- [ ] 11.4 Implement card validation service

  - Create validation functions for all card fields
  - Validate required fields are present and non-empty
  - Validate rarity is a valid integer
  - Return structured validation errors
  - _Requirements: 1.5_

- [ ]\* 11.5 Write property test for invalid card rejection

  - **Property 4: Invalid card rejection**
  - **Validates: Requirements 1.5**

- [ ] 11.6 Implement input sanitization for card fields

  - Sanitize string inputs to prevent XSS attacks
  - Validate and sanitize all user inputs
  - _Requirements: 11.5_

- [ ]\* 11.7 Write property test for input sanitization

  - **Property 20: Input sanitization**
  - **Validates: Requirements 11.5**

- [ ] 12. Implement Card API endpoints
- [ ] 12.1 Create POST /api/cards endpoint

  - Accept card data in request body
  - Validate input using validation service
  - Create card in database for authenticated user
  - Return created card with 201 status
  - Handle validation errors with 400 status
  - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 12.2 Create GET /api/cards/{id} endpoint

  - Retrieve card by ID for authenticated user
  - Verify user owns the card
  - Return card data with 200 status
  - Return 404 if card not found or not owned by user
  - _Requirements: 1.2_

- [ ] 12.3 Create PUT /api/cards/{id} endpoint

  - Accept partial card updates in request body
  - Validate updated fields
  - Update card in database
  - Return updated card with 200 status
  - _Requirements: 1.3_

- [ ] 12.4 Create DELETE /api/cards/{id} endpoint

  - Delete card for authenticated user
  - Verify user owns the card
  - Return 204 status on success
  - _Requirements: 1.4_

- [ ] 13. Implement pagination for card listing
- [ ] 13.1 Create pagination utility functions

  - Implement calculateOffset function from page and pageSize
  - Implement calculateTotalPages function from totalItems and pageSize
  - Create PaginationMetadata builder
  - _Requirements: 3.1, 3.5_

- [ ] 13.2 Implement paginated card query in repository

  - Add getCardsPaginated method with LIMIT and OFFSET
  - Return both card data and total count
  - Handle edge cases (page beyond available pages)
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ]\* 13.3 Write property test for pagination completeness

  - **Property 5: Pagination completeness**
  - **Validates: Requirements 3.1, 3.2, 3.3**

- [ ]\* 13.4 Write property test for pagination metadata

  - **Property 6: Pagination metadata accuracy**
  - **Validates: Requirements 3.5**

- [ ] 14. Implement filtering and sorting for card listing
- [ ] 14.1 Create query builder for dynamic filters

  - Implement filter builder that constructs WHERE clauses
  - Support partial match for name fields (LIKE queries)
  - Support exact match for brand, series, cardType, rarity
  - Handle multiple simultaneous filters with AND logic
  - Use parameterized queries to prevent SQL injection
  - _Requirements: 4.1, 4.2_

- [ ]\* 14.2 Write property test for filter correctness

  - **Property 7: Filter correctness**
  - **Validates: Requirements 4.1, 4.2**

- [ ] 14.3 Implement sorting logic in query builder

  - Add ORDER BY clause construction for any card property
  - Support both ascending and descending sort orders
  - Handle null values in sorting consistently
  - _Requirements: 4.3, 4.4_

- [ ]\* 14.4 Write property test for sort order correctness

  - **Property 8: Sort order correctness**
  - **Validates: Requirements 4.3, 4.4**

- [ ] 14.5 Combine filtering, sorting, and pagination

  - Integrate filter, sort, and pagination in single query
  - Apply filters first, then sort, then paginate
  - Ensure total count reflects filtered results
  - _Requirements: 4.5_

- [ ]\* 14.6 Write property test for filter and sort composition

  - **Property 9: Filter and sort composition**
  - **Validates: Requirements 4.5**

- [ ] 15. Create GET /api/cards endpoint with full query support

  - Parse query parameters for pagination (page, pageSize)
  - Parse query parameters for sorting (sortBy, sortOrder)
  - Parse query parameters for filtering (filterPlayerFirstName, filterPlayerLastName, etc.)
  - Validate query parameters (page >= 1, pageSize <= 100, valid sortBy values)
  - Call repository with parsed parameters
  - Return paginated response with data and metadata
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 16. Implement Collection Management (includes Top Cards as system collection)
- [ ] 16.1 Create Collection service operations

  - Implement createCollection method with name validation
  - Implement getCollectionById method with ownership check
  - Implement getUserCollections method to list all user collections (includes Top Cards)
  - Implement getTopCardsCollection helper to retrieve user's Top Cards system collection
  - Implement updateCollection method for name updates (prevent updates to system collections)
  - Implement deleteCollection method (preserves cards, prevent deletion of system collections)
  - _Requirements: 5A.1, 5A.2, 5A.3, 5A.4, 5.1_

- [ ]\* 16.2 Write property test for top cards auto-creation

  - **Property 10: Top cards auto-creation**
  - **Validates: Requirements 5.1**

- [ ]\* 16.3 Write property test for collection creation

  - **Property 15: Collection creation persistence**
  - **Validates: Requirements 5A.1**

- [ ]\* 16.4 Write property test for collection update

  - **Property 16: Collection update persistence**
  - **Validates: Requirements 5A.3**

- [ ]\* 16.5 Write property test for collection deletion

  - **Property 17: Collection deletion preserves cards**
  - **Validates: Requirements 5A.4**

- [ ]\* 16.6 Write property test for invalid collection rejection

  - **Property 18: Invalid collection rejection**
  - **Validates: Requirements 5A.5**

- [ ] 16.7 Create GET /api/collections endpoint

  - Retrieve all collections for authenticated user (includes Top Cards system collection)
  - Include card count for each collection
  - Return collections sorted by creation date
  - Mark system collections with isSystemCollection flag
  - _Requirements: 5A.2, 5.1_

- [ ] 16.8 Create POST /api/collections endpoint

  - Accept collection name in request body
  - Validate name is not empty
  - Create collection for authenticated user (isSystemCollection=false)
  - Return created collection
  - _Requirements: 5A.1, 5A.5_

- [ ] 16.9 Create GET /api/collections/{id} endpoint

  - Retrieve collection by ID
  - Verify user owns the collection
  - Return collection details
  - Works for Top Cards system collection
  - _Requirements: 5A.2, 5.4_

- [ ] 16.10 Create PUT /api/collections/{id} endpoint

  - Accept updated collection name
  - Verify user owns the collection
  - Prevent updates to system collections (Top Cards)
  - Update collection name
  - Return updated collection
  - _Requirements: 5A.3_

- [ ] 16.11 Create DELETE /api/collections/{id} endpoint

  - Verify user owns the collection
  - Prevent deletion of system collections (Top Cards)
  - Delete collection without deleting cards
  - Return 204 status
  - _Requirements: 5A.4_

- [ ] 16B. Implement Collection Card Management (includes Top Cards 20-card limit)
- [ ] 16B.1 Create CollectionCard service operations

  - Implement addCardToCollection method with ownership validation
  - Add special validation for Top Cards: enforce 20-card maximum
  - Add special validation for Top Cards: require position (1-20)
  - Implement removeCardFromCollection method (works for Top Cards)
  - Implement getCollectionCards method with pagination, filtering, sorting
  - Handle cascade deletion when card is deleted from library
  - _Requirements: 5B.1, 5B.2, 5B.3, 5B.4, 5B.5, 5.2, 5.3_

- [ ]\* 16B.2 Write property test for top cards capacity constraint

  - **Property 11: Top cards capacity constraint**
  - **Validates: Requirements 5.2, 5.3**

- [ ]\* 16B.3 Write property test for card addition to collection

  - **Property 19: Card addition to collection**
  - **Validates: Requirements 5B.1**

- [ ]\* 16B.4 Write property test for card removal from collection

  - **Property 20: Card removal from collection**
  - **Validates: Requirements 5B.2**

- [ ]\* 16B.5 Write property test for collection card retrieval

  - **Property 21: Collection card retrieval consistency**
  - **Validates: Requirements 5B.3**

- [ ]\* 16B.6 Write property test for top cards retrieval consistency

  - **Property 12: Top cards retrieval consistency**
  - **Validates: Requirements 5.4**

- [ ]\* 16B.7 Write property test for top cards removal

  - **Property 13: Top cards removal consistency**
  - **Validates: Requirements 5.5**

- [ ]\* 16B.8 Write property test for card deletion cascade

  - **Property 22: Card deletion cascade to collections**
  - **Validates: Requirements 5B.4**

- [ ]\* 16B.9 Write property test for top cards cascade deletion

  - **Property 14: Top cards cascade deletion**
  - **Validates: Requirements 5.6**

- [ ]\* 16B.10 Write property test for authorization

  - **Property 23: Authorization for collection card addition**
  - **Validates: Requirements 5B.5**

- [ ] 16B.11 Create GET /api/collections/{id}/cards endpoint

  - Retrieve all cards in a collection
  - Support pagination, filtering, and sorting (same as /api/cards)
  - Verify user owns the collection
  - Include position information if available
  - For Top Cards: enforce position ordering (1-20)
  - _Requirements: 5B.3, 5.4_

- [ ] 16B.12 Create POST /api/collections/{id}/cards endpoint

  - Accept cardId and optional position in request body
  - Verify user owns both the collection and the card
  - For Top Cards: require position, enforce 20-card maximum
  - Add card to collection
  - Return success response
  - _Requirements: 5B.1, 5B.5, 5.2, 5.3_

- [ ] 16B.13 Create DELETE /api/collections/{id}/cards/{cardId} endpoint

  - Verify user owns the collection
  - Remove card from collection without deleting the card
  - Works for Top Cards system collection
  - Return 204 status
  - _Requirements: 5B.2, 5.5_

- [ ] 17. Implement User Profile functionality
- [ ] 17.1 Create User repository operations

  - Implement getUserById method
  - Implement getUserByUsername method for uniqueness checks
  - Implement updateUserProfile method for firstName, lastName, birthdate, bio
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]\* 17.2 Write property test for username uniqueness

  - **Property 27: Username uniqueness**
  - **Validates: Requirements 7.1, 7.6**

- [ ]\* 17.3 Write property test for profile update persistence

  - **Property 28: Profile update persistence**
  - **Validates: Requirements 7.2, 7.3, 7.4, 7.5**

- [ ] 17.4 Create GET /api/profile endpoint

  - Retrieve profile for authenticated user
  - Return all profile fields
  - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [ ] 17.5 Create PUT /api/profile endpoint

  - Accept partial profile updates
  - Validate field formats (birthdate as valid date)
  - Update user profile in database
  - Return updated profile
  - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [ ] 18. Implement authorization middleware
- [ ] 18.1 Create resource ownership verification

  - Implement middleware to verify user owns requested card
  - Implement middleware to verify user owns requested collection
  - Implement middleware to verify user owns requested profile
  - Return 403 Forbidden for unauthorized access attempts
  - _Requirements: 11.3_

- [ ]\* 18.2 Write property test for authorization enforcement

  - **Property 29: Authorization enforcement**
  - **Validates: Requirements 11.3**

- [ ]\* 18.3 Write property test for session expiration

  - **Property 26: Session expiration enforcement**
  - **Validates: Requirements 6.5**

- [ ] 19. Implement error handling and logging
- [ ] 19.1 Create global error handler

  - Implement error handler middleware for all exceptions
  - Map exceptions to appropriate HTTP status codes
  - Return consistent error response format with code, message, timestamp, requestId
  - _Requirements: Error Handling section_

- [ ] 19.2 Implement structured logging

  - Configure JSON logging with timestamp, level, service, requestId, userId, message
  - Log all errors with full context and stack traces
  - Log important business events (user registration, card creation)
  - Integrate with CloudWatch Logs
  - _Requirements: 12.1_

- [ ]\* 19.3 Write property test for error logging

  - **Property 31: Error logging completeness**
  - **Validates: Requirements 12.1**

- [ ] 19.4 Implement metrics emission

  - Emit custom metrics for request latency, success/failure, endpoint
  - Integrate with CloudWatch Metrics
  - Add request ID propagation for tracing
  - _Requirements: 12.3_

- [ ]\* 19.5 Write property test for metrics emission

  - **Property 32: Metrics emission**
  - **Validates: Requirements 12.3**

- [ ] 19.6 Configure X-Ray tracing

  - Add X-Ray SDK to application
  - Instrument HTTP requests and database queries
  - Propagate trace context across service boundaries
  - _Requirements: 12.4_

- [ ] 20. Checkpoint - Ensure all backend tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 21. Implement API Stack with Lambda functions
- [ ] 21.1 Create Lambda Layers for shared code

  - Create database layer with MySQL connector, connection pooling, ORM models
  - Create auth layer with JWT validation and Cognito integration
  - Create utils layer with logging, error handling, validation utilities
  - Package layers with dependencies
  - _Requirements: 8.1_

- [ ] 21.2 Create Lambda functions for authentication

  - Implement auth-register Lambda handler
  - Implement auth-login Lambda handler
  - Implement auth-federated Lambda handler
  - Implement auth-me Lambda handler
  - Configure VPC access for database connectivity
  - Set environment variables for database and Cognito configuration
  - Configure IAM roles with permissions for Secrets Manager, CloudWatch, X-Ray, RDS
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 21.3 Create Lambda functions for card management

  - Implement cards-create Lambda handler
  - Implement cards-get Lambda handler
  - Implement cards-update Lambda handler
  - Implement cards-delete Lambda handler
  - Implement cards-list Lambda handler with pagination, filtering, sorting
  - Configure VPC access and IAM roles
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 4.1, 4.3_

- [ ] 21.4 Create Lambda functions for collections

  - Implement collections-list Lambda handler
  - Implement collections-create Lambda handler
  - Implement collections-get Lambda handler
  - Implement collections-update Lambda handler
  - Implement collections-delete Lambda handler
  - Implement collection-cards-list Lambda handler
  - Implement collection-cards-add Lambda handler
  - Implement collection-cards-remove Lambda handler
  - Configure VPC access and IAM roles
  - _Requirements: 5A.1, 5A.2, 5A.3, 5A.4, 5B.1, 5B.2, 5B.3_

- [ ] 21.5 Create Lambda functions for profile

  - Implement profile-get Lambda handler
  - Implement profile-update Lambda handler
  - Configure VPC access and IAM roles
  - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [ ] 21.6 Create API Gateway REST API

  - Define API Gateway REST API in CDK
  - Create Cognito User Pool Authorizer
  - Configure CORS settings for frontend access
  - Set up request validation schemas
  - Configure API Gateway CloudWatch logging
  - _Requirements: 8.1, 11.1_

- [ ] 21.7 Configure API Gateway routes and integrations

  - Create /auth/\* routes with Lambda integrations
  - Create /cards/\* routes with Lambda integrations and Cognito authorization
  - Create /collections/\* routes with Lambda integrations and Cognito authorization
  - Create /profile routes with Lambda integrations and Cognito authorization
  - Configure method responses and integration responses
  - _Requirements: 8.1_

- [ ] 21.8 Set up API Gateway deployment and stage

  - Create deployment for API Gateway
  - Configure stage (dev, staging, prod) with stage variables
  - Enable X-Ray tracing for API Gateway
  - Configure throttling and usage plans
  - _Requirements: 8.1_

- [ ] 21.9 Set up SSL/TLS certificate for API Gateway

  - Request or import SSL certificate in ACM
  - Configure custom domain for API Gateway
  - Create DNS records for custom domain
  - _Requirements: 11.1_

- [ ] 22. Implement Frontend Stack for static hosting
- [ ] 22. Implement Frontend Stack for static hosting
- [ ] 22.1 Create S3 bucket for static website hosting

  - Define S3 bucket with static website configuration
  - Configure bucket policy for CloudFront access
  - Enable encryption at rest
  - _Requirements: 11.2_

- [ ] 22.2 Create CloudFront distribution

  - Define CloudFront distribution with S3 origin
  - Configure SSL certificate for custom domain
  - Set up caching policies for static assets
  - Configure error pages (404, 403 redirect to index.html for SPA routing)
  - _Requirements: 11.1_

- [ ] 22.3 Configure CloudFront security headers

  - Add security headers (HSTS, X-Content-Type-Options, X-Frame-Options)
  - Configure CORS for API requests
  - _Requirements: 11.1_

- [ ] 23. Set up CI/CD Pipeline Stack
- [ ] 23.1 Create CodePipeline for infrastructure

  - Define pipeline with source stage (GitHub/CodeCommit)
  - Add build stage with CodeBuild for CDK synth
  - Add deploy stage for CDK deploy
  - Configure approval gates for production
  - _Requirements: 9.1, 9.2, 9.4_

- [ ] 23.2 Create CodePipeline for backend Lambda functions

  - Define pipeline with source stage
  - Add build stage for packaging Lambda functions and layers
  - Add test stage to run all tests before deployment
  - Add deploy stage to update Lambda functions via CDK
  - Configure test stage to run all tests before deployment
  - _Requirements: 9.1, 9.2, 9.3_

- [ ] 23.3 Create CodePipeline for frontend

  - Define pipeline with source stage
  - Add build stage for React build
  - Add deploy stage to sync to S3 and invalidate CloudFront
  - _Requirements: 9.1, 9.2_

- [ ] 23.4 Configure build specifications

  - Create buildspec.yml for infrastructure CDK builds
  - Create buildspec.yml for Lambda builds with test execution
  - Create buildspec.yml for frontend builds
  - _Requirements: 9.1_

- [ ]\* 23.5 Write CDK tests for infrastructure stacks

  - Create snapshot tests for all CDK stacks
  - Write fine-grained assertions for Lambda functions, API Gateway, RDS
  - Test stack synthesis succeeds
  - _Requirements: 8.2_
  - Configure CORS for API requests
  - _Requirements: 11.1_

- [ ] 24. Initialize React frontend project

  - Create React TypeScript project in `/frontend` directory
  - Configure TypeScript with strict mode
  - Set up React Router for client-side routing
  - Install and configure UI component library (Material-UI or similar)
  - Set up environment configuration for API endpoints
  - Configure build tools (Vite or Create React App)
  - _Requirements: 13.1_

- [ ] 25. Implement authentication context and hooks
- [ ] 26.1 Create authentication context

  - Implement React context for authentication state
  - Store JWT token in context and localStorage
  - Provide login, logout, and token refresh functions
  - _Requirements: 6.1, 6.2_

- [ ] 26.2 Create Cognito integration service

  - Implement functions to call Cognito authentication APIs
  - Handle token storage and retrieval
  - Implement token expiration checking
  - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [ ] 26.3 Create protected route component

  - Implement ProtectedRoute wrapper component
  - Redirect to login if not authenticated
  - Check token expiration before rendering
  - _Requirements: 6.5, 11.3_

- [ ] 26.4 Create login page

  - Build login form with username and password fields
  - Implement form validation
  - Call authentication service on submit
  - Handle authentication errors
  - Add link to registration page
  - _Requirements: 6.2_

- [ ] 26.5 Create registration page

  - Build registration form with username, password, email fields
  - Implement form validation (password strength, email format)
  - Call registration API on submit
  - Handle registration errors (username already exists)
  - Redirect to login or auto-login after successful registration
  - _Requirements: 6.1, 7.1_

- [ ] 26.6 Create federated login button

  - Add "Sign in with OpenID Connect" button
  - Implement OAuth flow with Cognito
  - Handle callback and token exchange
  - _Requirements: 6.3_

- [ ] 27. Create API client service
- [ ] 27.1 Implement base API client

  - Create axios or fetch wrapper with base URL configuration
  - Add request interceptor to attach JWT token to all requests
  - Add response interceptor for error handling
  - Implement retry logic for transient failures
  - _Requirements: 11.3_

- [ ] 27.2 Implement Card API client methods

  - Create createCard function
  - Create getCard function
  - Create updateCard function
  - Create deleteCard function
  - Create getCards function with pagination, filtering, sorting parameters
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 4.1, 4.3_

- [ ] 27.3 Implement User Profile API client methods

  - Create getProfile function
  - Create updateProfile function
  - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [ ] 28. Implement Card Management UI
- [ ] 28.1 Create Card list component

  - Build table or grid view to display cards
  - Show all card properties (player name, brand, series, type, rarity)
  - Add edit and delete buttons for each card
  - Handle loading and error states
  - _Requirements: 1.2_

- [ ] 28.2 Create Card form component

  - Build form with fields for all card properties
  - Implement form validation (required fields, rarity as number)
  - Reuse for both create and edit operations
  - Display validation errors
  - _Requirements: 1.1, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 28.3 Create Add Card page

  - Use Card form component
  - Call createCard API on submit
  - Show success message and redirect to library
  - Handle API errors
  - _Requirements: 1.1_

- [ ] 28.4 Create Edit Card page

  - Load existing card data
  - Use Card form component with initial values
  - Call updateCard API on submit
  - Show success message
  - _Requirements: 1.3_

- [ ] 28.5 Implement card deletion

  - Add delete confirmation dialog
  - Call deleteCard API on confirmation
  - Remove card from UI on success
  - Handle errors
  - _Requirements: 1.4_

- [ ] 29. Implement Library Browser with pagination
- [ ] 29.1 Create pagination controls component

  - Build previous/next page buttons
  - Display current page and total pages
  - Add page size selector
  - Disable buttons appropriately (first/last page)
  - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [ ] 29.2 Create Library page with pagination

  - Fetch cards with pagination parameters
  - Display Card list component
  - Display pagination controls
  - Update URL query parameters on page change
  - Handle loading states during page transitions
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 30. Implement filtering and sorting UI
- [ ] 30.1 Create filter controls component

  - Build input fields for each filterable property
  - Add clear filters button
  - Apply filters on form submit or input change
  - _Requirements: 4.1, 4.2_

- [ ] 30.2 Create sort controls component

  - Build dropdown for sort field selection
  - Add toggle for ascending/descending order
  - Apply sort on selection change
  - _Requirements: 4.3, 4.4_

- [ ] 30.3 Integrate filters and sorting into Library page

  - Add filter and sort controls above card list
  - Combine filter, sort, and pagination parameters in API call
  - Reset to page 1 when filters or sort changes
  - Update URL query parameters
  - _Requirements: 4.5_

- [ ] 31. Implement Collections UI (includes Top Cards as system collection)
- [ ] 31.1 Create Collections API client methods

  - Create getCollections function (returns all collections including Top Cards)
  - Create createCollection function
  - Create updateCollection function (prevent updates to system collections)
  - Create deleteCollection function (prevent deletion of system collections)
  - Create getCollectionCards function
  - Create addCardToCollection function (enforce Top Cards 20-card limit)
  - Create removeCardFromCollection function
  - _Requirements: 5A.1, 5A.2, 5A.3, 5A.4, 5B.1, 5B.2, 5B.3, 5.1, 5.2_

- [ ] 31.2 Create Collections list component

  - Display all user collections with card counts (includes Top Cards)
  - Show system collections (Top Cards) with special indicator/badge
  - Add create new collection button
  - Add edit and delete buttons for user-created collections only
  - Prevent deletion and name editing of system collections
  - _Requirements: 5A.2, 5.1_

- [ ] 31.3 Create Collection form component

  - Build form with collection name field
  - Implement form validation (name required)
  - Reuse for both create and edit operations
  - Disable for system collections
  - _Requirements: 5A.1, 5A.3, 5A.5_

- [ ] 31.4 Create Collections page

  - Display Collections list component
  - Show create collection dialog/modal
  - Handle collection creation
  - Handle collection editing (prevent for system collections)
  - Handle collection deletion with confirmation (prevent for system collections)
  - _Requirements: 5A.1, 5A.2, 5A.3, 5A.4_

- [ ] 31.5 Create Collection detail page

  - Display collection name and metadata
  - Show "Top Cards" badge if system collection
  - Show all cards in the collection with pagination
  - Support filtering and sorting of cards
  - Add "Add Cards" button
  - Add remove button for each card
  - For Top Cards: show position ordering (1-20), enforce 20-card limit
  - Show empty state when collection has no cards
  - _Requirements: 5B.3, 5.4_

- [ ] 31.6 Create Add Cards to Collection interface

  - Display user's library with selection checkboxes
  - Filter out cards already in the collection
  - Allow multi-select of cards to add
  - For Top Cards: limit selection to reach 20 total, require position input
  - Call addCardToCollection API for each selected card
  - Show success/error messages
  - _Requirements: 5B.1, 5.2, 5.3_

- [ ] 31.7 Create Home page with Top Cards display

  - Fetch user's collections via getCollections API
  - Get Top Cards collection (first collection with isSystemCollection=true or at index 0)
  - Fetch cards from Top Cards collection via getCollectionCards API
  - Display cards in a visually appealing grid or carousel
  - Sort by position (1-20)
  - Handle case when Top Cards collection is empty
  - Add link to manage Top Cards (goes to Top Cards collection detail page)
  - _Requirements: 5.4_

- [ ] 31.8 Update Card list component to support collection actions

  - Add "Add to Collection" dropdown/menu for each card
  - Show list of user's collections (including Top Cards)
  - Handle adding card to selected collection
  - For Top Cards: check if already at 20-card limit before allowing add
  - Show feedback when card is added
  - _Requirements: 5B.1, 5.2_

- [ ] 32. Implement User Profile UI
- [ ] 32.1 Create Profile display component

  - Display username (read-only)
  - Display firstName, lastName, birthdate, bio
  - Show created date
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 32.2 Create Profile edit form

  - Build form for firstName, lastName, birthdate, bio
  - Implement form validation (birthdate format)
  - Username should not be editable
  - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [ ] 32.3 Create Profile page

  - Load user profile on mount
  - Display Profile display component
  - Add edit mode toggle
  - Show Profile edit form in edit mode
  - Call updateProfile API on save
  - Handle errors
  - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [ ] 33. Implement navigation and layout
- [ ] 33.1 Create main navigation component

  - Add navigation links (Home, Library, Collections, Add Card, Profile)
  - Show user info and logout button when authenticated
  - Hide navigation when not authenticated
  - Note: Top Cards accessed via Collections page (system collection)
  - _Requirements: General UI_

- [ ] 33.2 Create main layout component

  - Include navigation component
  - Define consistent page layout
  - Add footer with app information
  - _Requirements: General UI_

- [ ] 33.3 Set up routing

  - Configure React Router with all routes
  - Protect routes that require authentication
  - Set up 404 page for unknown routes
  - _Requirements: General UI_

- [ ] 34. Implement error handling and user feedback
- [ ] 34.1 Create error boundary component

  - Catch React errors and display fallback UI
  - Log errors to console or monitoring service
  - _Requirements: Error Handling_

- [ ] 34.2 Create toast/notification system

  - Implement toast notifications for success/error messages
  - Show notifications for API operations (card created, profile updated, etc.)
  - Auto-dismiss after timeout
  - _Requirements: Error Handling_

- [ ] 34.3 Create loading indicators

  - Add loading spinners for async operations
  - Show skeleton screens for page loads
  - Disable buttons during API calls
  - _Requirements: Error Handling_

- [ ] 35. Add responsive design and styling

  - Ensure all components are mobile-responsive
  - Apply consistent theme and styling
  - Test on different screen sizes
  - Add accessibility attributes (ARIA labels, semantic HTML)
  - _Requirements: General UI_

- [ ]\* 36. Write frontend component tests

  - Write tests for authentication components (login, registration)
  - Write tests for Card form validation
  - Write tests for pagination controls
  - Write tests for filter and sort controls
  - Write tests for API client error handling
  - _Requirements: Testing Strategy_

- [ ] 37. Create deployment scripts and documentation
- [ ] 37.1 Create deployment scripts

  - Write script to deploy all CDK stacks in correct order (Network → Database → Auth → API → Frontend → Monitoring → CI/CD)
  - Write script to package and deploy Lambda functions and layers
  - Write script to build and deploy frontend
  - Add environment-specific deployment commands
  - _Requirements: 8.1, 8.3_

- [ ] 37.2 Create environment configuration

  - Document required environment variables for Lambda functions
  - Create .env.example files for each component
  - Document AWS account setup requirements
  - Document RDS connection configuration
  - _Requirements: 8.3_

- [ ] 37.3 Write README documentation

  - Document project structure and organization (monorepo with Lambda functions)
  - Add setup instructions for local development and Lambda testing
  - Document deployment process for serverless architecture
  - Add API documentation or link to API Gateway documentation
  - Document testing approach (unit, property-based, integration)
  - _Requirements: 13.1_

- [ ] 38. Final Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 39. Deploy to staging environment

  - Deploy infrastructure stacks to staging (Network, Database, Auth, API, Frontend, Monitoring)
  - Run database migrations in staging
  - Deploy Lambda functions and layers to staging
  - Deploy frontend to staging
  - Verify all Lambda functions are working via API Gateway
  - Test end-to-end flows
  - _Requirements: 8.1, 8.3, 9.2_

- [ ]\* 40. Run integration tests in staging
  - Execute end-to-end integration tests
  - Verify authentication flows
  - Test card CRUD operations
  - Test pagination, filtering, sorting
  - Test top cards functionality
  - Verify monitoring and logging
  - _Requirements: Testing Strategy_
