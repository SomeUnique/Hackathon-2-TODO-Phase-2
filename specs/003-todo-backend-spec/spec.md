# Specification: todo-backend-fastapi-neon-phase2

**Feature Branch**: `003-todo-backend-spec`
**Created**: 2026-02-07
**Status**: Draft
**Input**: User description: "Create a comprehensive, detailed specification **exclusively for the backend** of the Todo Full-Stack Web Application (Hackathon Phase 2). This specification must enable complete backend implementation and guaranteed successful integration with the already-planned Next.js frontend. Project Context (from constitution and frontend spec): - Backend stack: FastAPI (Python 3.11+), SQLModel (ORM + Pydantic), Neon Serverless PostgreSQL - Authentication: JWT tokens issued by Better Auth (frontend) → verified in backend using shared secret - Shared secret: BETTER_AUTH_SECRET=70tvEiM4SIXNZegpxN5TQRvMiUGePVwU (must be used in env/config) - Database connection: Use exactly this URL from .env: DATABASE_URL = postgresql://neondb_owner:npg_8USzj6FdhfkE@ep-delicate-credit-airvucw7-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require - Frontend integration: Frontend will call these endpoints from http://localhost:3000 using fetch/axios with header: Authorization: Bearer <jwt-token-from-better-auth-session> - Goal: Secure, multi-user backend that enforces ownership and returns data in a format the frontend expects Must-Have Functional Requirements (Backend Only): 1. JWT Authentication Middleware - Extract token from Authorization: Bearer <token> - Verify signature using BETTER_AUTH_SECRET and HS256 algorithm - Extract user_id from payload["sub"] (string) - Attach user to request.state.user - Reject invalid/expired/missing token → 401 Unauthorized with JSON {"detail": "..."} 2. Database Models (SQLModel) - Task model: - id: int primary key auto-increment - user_id: str not null (foreign key reference to users.id – string) - title: str not null, max_length=200 - description: str | None, max_length=1000 - completed: bool default=False - created_at: datetime default=datetime.utcnow - updated_at: datetime default=datetime.utcnow, onupdate=datetime.utcnow - Use SQLModel.metadata.create_all() on startup or provide migration note 3. REST API Endpoints (base: /api) - GET /api/tasks → Return list of tasks where user_id == current_user.id → Optional query params: ?status=pending|completed|all (default all) → Response: array of Task objects (JSON) - POST /api/tasks → Body: { "title": str (required), "description": str (optional) } → Auto-set user_id from JWT → Return created task (201 Created) - GET /api/tasks/{task_id} → Return single task if owned by current_user, else 403/404 - PUT /api/tasks/{task_id} → Body: { "title": str, "description": str } (partial update allowed) → Update only if owned, else 403 - DELETE /api/tasks/{task_id} → Delete only if owned, else 403 - PATCH /api/tasks/{task_id}/complete → Toggle completed field (true ↔ false) → Return updated task 4. Ownership Enforcement - Every CRUD operation (except create) MUST check task.user_id == current_user.id - Violation → 403 Forbidden {"detail": "You do not own this task"} 5. Validation & Pydantic Models - TaskCreate: title required, description optional - TaskUpdate: title and description optional (partial) - TaskRead: full model for responses (include id, user_id?, completed, timestamps) 6. Database Connection & Dependencies - Async engine + session using provided Neon DATABASE_URL - Dependency: async def get_db() → AsyncSession - Dependency: async def get_current_user(...) → dict with id 7. CORS & Startup - Add CORS middleware allowing origin http://localhost:3000 - On startup: create tables if not exist (or note Alembic usage) Non-Functional Requirements: - All endpoints protected by JWT dependency - JSON responses only (use response_model=...) - Error responses standardized: {"detail": str} - Use async/await where possible (SQLModel async support) - Logging: basic print or logging module for startup/errors - Security: Never return other users' tasks, no sensitive data in responses Success Criteria: - Backend must be fully implementable from this spec - All 5 CRUD operations + toggle work with ownership check - Frontend can call endpoints with Bearer token and receive expected JSON - JWT verification works with given BETTER_AUTH_SECRET - Neon DB connection succeeds with provided URL - Clear ownership isolation: user A cannot see/modify user B's tasks - All validation errors return 422 with field details Constraints & Out of Scope (for this backend spec): - Do NOT include Next.js code, UI, or frontend auth pages - Do NOT implement users table – assume Better Auth manages users, only use user_id string - No extra fields/features (no priority, tags, due_date, search, sort yet) - No file uploads, pagination, rate limiting, or advanced auth flows - No deployment config (docker, nginx) – only local dev Output Format: Generate in clean Markdown: - # Specification: todo-backend-fastapi-neon-phase2 - ## Overview & Integration Goals - ## Authentication & JWT Verification - ## Database Schema & Connection - ## API Endpoints (detailed table + descriptions) - ## Data Models (Pydantic + SQLModel) - ## Security & Ownership Rules - ## Error Handling & Validation - ## Startup & CORS Configuration - ## Assumptions & Env Vars Usage - ## Acceptance Checklist ([ ] checkboxes) Do NOT generate any code, plan, tasks, or frontend references beyond API contract. Use the provided .env values (BETTER_AUTH_SECRET, DATABASE_URL) exactly in descriptions. After this spec, the backend should be ready for /sp.plan and full implementation."

## Overview & Integration Goals

The backend for the Todo application is designed to provide a secure, multi-user task management system that integrates seamlessly with the Next.js frontend. The backend implements a REST API using FastAPI and connects to a Neon PostgreSQL database. It enforces strict ownership rules to ensure users can only access their own tasks, and uses JWT tokens issued by Better Auth for authentication.

## Authentication & JWT Verification

The backend implements JWT token verification middleware that extracts tokens from the Authorization header in the format "Bearer <token>". The system verifies the token signature using the shared secret BETTER_AUTH_SECRET with the HS256 algorithm. The user ID is extracted from the payload's "sub" field and attached to the request state for use in endpoint handlers. Invalid, expired, or missing tokens result in a 401 Unauthorized response with a JSON error message.

## Database Schema & Connection

The backend uses SQLModel to define the database schema and connect to a Neon PostgreSQL database. The primary entity is the Task model which includes fields for ID, user ID, title, description, completion status, and timestamps. The database connection utilizes the provided Neon DATABASE_URL with SSL enabled. The system creates database tables on startup if they don't exist.

## API Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| /api/tasks | GET | Retrieve all tasks for the authenticated user | Query params: status (pending\|completed\|all) | Array of Task objects |
| /api/tasks | POST | Create a new task for the authenticated user | { "title": str (required), "description": str (optional) } | Created Task object (201) |
| /api/tasks/{task_id} | GET | Retrieve a specific task | None | Single Task object |
| /api/tasks/{task_id} | PUT | Update a task | { "title": str, "description": str } | Updated Task object |
| /api/tasks/{task_id} | DELETE | Delete a task | None | Empty response (204) |
| /api/tasks/{task_id}/complete | PATCH | Toggle task completion status | None | Updated Task object |

## Data Models (Pydantic + SQLModel)

- **Task Model**: SQLModel entity with id (int, PK, auto-increment), user_id (str, FK to users.id), title (str, max 200), description (str, optional, max 1000), completed (bool, default False), created_at (datetime, default utcnow), updated_at (datetime, default utcnow, onupdate utcnow)
- **TaskCreate Model**: Pydantic model with title (required), description (optional)
- **TaskUpdate Model**: Pydantic model with title (optional), description (optional)
- **TaskRead Model**: Pydantic model with all Task fields for API responses

## Security & Ownership Rules

Every CRUD operation (except creation) enforces ownership by checking that the task's user_id matches the authenticated user's ID. Operations that violate ownership result in a 403 Forbidden response with the message "You do not own this task". The system ensures that users cannot access, modify, or delete tasks belonging to other users. No sensitive data is exposed in API responses.

## Error Handling & Validation

All endpoints return standardized JSON error responses in the format {"detail": str}. Validation errors return 422 status with field-specific details. Authentication failures return 401 Unauthorized. Authorization failures return 403 Forbidden. Missing resources return 404 Not Found. All responses are in JSON format using response_model parameters.

## Startup & CORS Configuration

The backend adds CORS middleware to allow requests from the frontend origin (http://localhost:3000). On startup, the system creates database tables if they don't exist using SQLModel.metadata.create_all(). The application includes basic logging for startup events and errors.

## Assumptions & Env Vars Usage

- BETTER_AUTH_SECRET environment variable contains the shared secret: 70tvEiM4SIXNZegpxN5TQRvMiUGePVwU
- DATABASE_URL environment variable contains the Neon PostgreSQL connection string
- Better Auth manages user accounts and issues JWT tokens
- Frontend will call backend endpoints from http://localhost:3000
- Frontend will include Authorization header with Bearer token for authenticated requests

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create New Task (Priority: P1)

A logged-in user wants to create a new task in their personal task list. They submit a title and optional description through the frontend, which sends a request to the backend API.

**Why this priority**: This is the foundational functionality that enables users to actually use the todo app. Without the ability to create tasks, the app has no value.

**Independent Test**: Can be fully tested by sending a POST request to /api/tasks with a valid JWT token and task data. The system should create the task linked to the authenticated user and return the created task.

**Acceptance Scenarios**:

1. **Given** a user is authenticated with a valid JWT token, **When** they send a POST request to /api/tasks with a title, **Then** a new task is created with the user's ID and returned in the response
2. **Given** a user is authenticated with a valid JWT token, **When** they send a POST request to /api/tasks with title and description, **Then** a new task is created with both fields and returned in the response

---

### User Story 2 - View Own Tasks (Priority: P1)

A logged-in user wants to view their own tasks. The frontend retrieves the user's tasks from the backend API and displays them.

**Why this priority**: Essential for users to see what they've created and track their progress. Without viewing, the create functionality is meaningless.

**Independent Test**: Can be fully tested by sending a GET request to /api/tasks with a valid JWT token. The system should return only tasks belonging to the authenticated user.

**Acceptance Scenarios**:

1. **Given** a user is authenticated with a valid JWT token, **When** they send a GET request to /api/tasks, **Then** they receive a list of only their own tasks
2. **Given** a user is authenticated with a valid JWT token, **When** they send a GET request to /api/tasks with status=pending, **Then** they receive only their pending tasks

---

### User Story 3 - Update Task Information (Priority: P2)

A logged-in user wants to modify the details of one of their tasks, such as updating the title or description.

**Why this priority**: Allows users to refine their tasks over time, improving the utility of the application.

**Independent Test**: Can be fully tested by sending a PUT request to /api/tasks/{task_id} with a valid JWT token and updated task data. The system should update only if the task belongs to the authenticated user.

**Acceptance Scenarios**:

1. **Given** a user is authenticated and owns a specific task, **When** they send a PUT request to /api/tasks/{task_id} with updated data, **Then** the task is updated and returned in the response

---

### User Story 4 - Complete/Uncomplete Tasks (Priority: P2)

A logged-in user wants to mark a task as completed or uncompleted to track their progress.

**Why this priority**: Core functionality for task management - marking tasks as done is essential to the todo app concept.

**Independent Test**: Can be fully tested by sending a PATCH request to /api/tasks/{task_id}/complete with a valid JWT token. The system should toggle the completion status of the user's task.

**Acceptance Scenarios**:

1. **Given** a user is authenticated and owns a specific task, **When** they send a PATCH request to /api/tasks/{task_id}/complete, **Then** the task's completion status is toggled and returned in the response

---

### User Story 5 - Delete Tasks (Priority: P3)

A logged-in user wants to remove tasks they no longer need.

**Why this priority**: Allows users to clean up their task lists, maintaining relevance and reducing clutter.

**Independent Test**: Can be fully tested by sending a DELETE request to /api/tasks/{task_id} with a valid JWT token. The system should delete only if the task belongs to the authenticated user.

**Acceptance Scenarios**:

1. **Given** a user is authenticated and owns a specific task, **When** they send a DELETE request to /api/tasks/{task_id}, **Then** the task is deleted successfully

---

### Edge Cases

- What happens when a user tries to access another user's task? (Should return 403 Forbidden)
- How does the system handle expired JWT tokens? (Should return 401 Unauthorized)
- What occurs when a user sends malformed JSON in a request body? (Should return 422 Unprocessable Entity)
- How does the system handle requests without an Authorization header? (Should return 401 Unauthorized)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST verify JWT tokens using BETTER_AUTH_SECRET with HS256 algorithm
- **FR-002**: System MUST extract user_id from JWT payload["sub"] and attach to request state
- **FR-003**: System MUST reject requests with invalid/expired/missing tokens with 401 Unauthorized
- **FR-004**: System MUST implement Task model with id, user_id, title, description, completed, timestamps
- **FR-005**: System MUST provide GET /api/tasks endpoint returning user's tasks with optional status filter
- **FR-006**: System MUST provide POST /api/tasks endpoint creating tasks with auto-set user_id from JWT
- **FR-007**: System MUST provide GET /api/tasks/{task_id} endpoint returning owned tasks only
- **FR-008**: System MUST provide PUT /api/tasks/{task_id} endpoint updating owned tasks only
- **FR-009**: System MUST provide DELETE /api/tasks/{task_id} endpoint deleting owned tasks only
- **FR-010**: System MUST provide PATCH /api/tasks/{task_id}/complete endpoint toggling completion status
- **FR-011**: System MUST enforce ownership checks on all operations except creation
- **FR-012**: System MUST return 403 Forbidden when users access non-owned resources
- **FR-013**: System MUST connect to Neon PostgreSQL using provided DATABASE_URL
- **FR-014**: System MUST create database tables on startup if they don't exist
- **FR-015**: System MUST implement CORS allowing origin http://localhost:3000

### Key Entities

- **Task**: Represents a user's task with properties: id (unique identifier), user_id (owner reference), title (task name), description (optional details), completed (completion status), created_at (timestamp), updated_at (timestamp)
- **User**: Identity represented by user_id from JWT token; assumed to be managed by Better Auth service

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Backend can be fully implemented from this specification without requiring additional clarification
- **SC-002**: All 5 CRUD operations plus toggle completion work with proper ownership enforcement
- **SC-003**: Frontend can successfully call all endpoints with Bearer tokens and receive expected JSON responses
- **SC-004**: JWT verification works correctly with the provided BETTER_AUTH_SECRET
- **SC-005**: Neon database connection succeeds with the provided URL
- **SC-006**: Clear ownership isolation exists: user A cannot see or modify user B's tasks
- **SC-007**: All validation errors return 422 status with appropriate field details
- **SC-008**: Authentication failures return 401 status consistently
- **SC-009**: Authorization failures return 403 status consistently
- **SC-010**: All API responses are in JSON format as specified