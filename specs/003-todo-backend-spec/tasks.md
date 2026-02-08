# Implementation Tasks: Backend Todo Application

**Feature**: Backend Todo Application with FastAPI, SQLModel, and Neon PostgreSQL
**Branch**: 003-todo-backend-spec
**Created**: 2026-02-07

## Overview

This document outlines the implementation tasks for the backend of the Todo application. The backend will be built using FastAPI, SQLModel, and Neon PostgreSQL, with JWT authentication and strict ownership enforcement.

## Dependencies

- User Story 2 (View Own Tasks) depends on User Story 1 (Create New Task) for data to exist
- All user stories depend on foundational setup (database, authentication, models)

## Parallel Execution Examples

- Database setup (db.py) and authentication setup (auth.py) can be done in parallel
- Creating models (models.py) and schemas (schemas.py) can be done in parallel
- Once foundational work is complete, all user story implementations can be done in parallel

## Implementation Strategy

1. **MVP First**: Implement User Story 1 (Create New Task) as the minimum viable product
2. **Incremental Delivery**: Add User Story 2 (View Own Tasks) to make the MVP useful
3. **Feature Addition**: Implement remaining user stories (Update, Complete, Delete) in priority order
4. **Polish**: Add error handling, logging, and final touches

---

## Phase 1: Setup

### Goal
Initialize the project structure and install dependencies.

### Independent Test Criteria
- Project directory structure matches plan
- Dependencies can be installed successfully
- Basic server can be started

### Tasks

- [X] T001 Create backend/ directory structure per implementation plan
- [X] T002 Create requirements.txt with FastAPI, SQLModel, PyJWT, python-jose[cryptography], uvicorn
- [X] T003 Create .env.example with BETTER_AUTH_SECRET and DATABASE_URL values
- [X] T004 Create README.md with setup instructions

---

## Phase 2: Foundational

### Goal
Implement core infrastructure components that all user stories depend on.

### Independent Test Criteria
- Database connection can be established
- JWT tokens can be verified
- Basic API structure is in place

### Tasks

- [X] T005 [P] Create db.py with async engine and session setup using provided DATABASE_URL
- [X] T006 [P] Create models.py with Task SQLModel class per data model specification
- [X] T007 [P] Create schemas.py with TaskCreate, TaskUpdate, and TaskRead Pydantic models
- [X] T008 [P] Create auth.py with JWT verification function using BETTER_AUTH_SECRET
- [X] T009 [P] Create dependencies.py with get_db() and get_current_user() dependencies
- [X] T010 Create routes/tasks.py with basic APIRouter setup
- [X] T011 Create main.py with FastAPI app, CORS configuration for http://localhost:3000
- [X] T012 Implement database initialization in main.py using metadata.create_all()

---

## Phase 3: User Story 1 - Create New Task (Priority: P1)

### Goal
Enable users to create new tasks in their personal task list.

### Independent Test Criteria
- Can send POST request to /api/tasks with valid JWT and task data
- New task is created with the user's ID and returned in the response
- Task creation fails appropriately with invalid JWT or missing title

### Acceptance Scenarios
1. Given a user is authenticated with a valid JWT token, When they send a POST request to /api/tasks with a title, Then a new task is created with the user's ID and returned in the response
2. Given a user is authenticated with a valid JWT token, When they send a POST request to /api/tasks with title and description, Then a new task is created with both fields and returned in the response

### Tasks

- [X] T013 [US1] Implement POST /api/tasks endpoint in routes/tasks.py
- [X] T014 [US1] Add ownership assignment (user_id from JWT) in task creation
- [X] T015 [US1] Validate required fields (title) in TaskCreate schema
- [X] T016 [US1] Return created task with 201 status code
- [X] T017 [US1] Test task creation with valid JWT and title
- [X] T018 [US1] Test task creation with valid JWT, title, and description
- [X] T019 [US1] Test task creation failure with invalid JWT
- [X] T020 [US1] Test task creation failure with missing title

---

## Phase 4: User Story 2 - View Own Tasks (Priority: P1)

### Goal
Allow users to view their own tasks.

### Independent Test Criteria
- Can send GET request to /api/tasks with valid JWT
- Returns only tasks belonging to the authenticated user
- Supports optional status filter (pending, completed, all)

### Acceptance Scenarios
1. Given a user is authenticated with a valid JWT token, When they send a GET request to /api/tasks, Then they receive a list of only their own tasks
2. Given a user is authenticated with a valid JWT token, When they send a GET request to /api/tasks with status=pending, Then they receive only their pending tasks

### Tasks

- [X] T021 [US2] Implement GET /api/tasks endpoint in routes/tasks.py
- [X] T022 [US2] Add ownership filtering (user_id from JWT) to task retrieval
- [X] T023 [US2] Add optional status query parameter (pending, completed, all)
- [X] T024 [US2] Return list of tasks in JSON format
- [X] T025 [US2] Test retrieving all tasks for authenticated user
- [X] T026 [US2] Test retrieving tasks with status=pending filter
- [X] T027 [US2] Test retrieving tasks with status=completed filter
- [X] T028 [US2] Test retrieving tasks with status=all filter
- [X] T029 [US2] Test that user only sees their own tasks (not others')

---

## Phase 5: User Story 3 - Update Task Information (Priority: P2)

### Goal
Allow users to modify the details of one of their tasks.

### Independent Test Criteria
- Can send PUT request to /api/tasks/{task_id} with valid JWT and updated data
- Task is updated only if it belongs to the authenticated user
- Returns updated task in response

### Acceptance Scenarios
1. Given a user is authenticated and owns a specific task, When they send a PUT request to /api/tasks/{task_id} with updated data, Then the task is updated and returned in the response

### Tasks

- [X] T030 [US3] Implement GET /api/tasks/{task_id} endpoint in routes/tasks.py
- [X] T031 [US3] Add ownership check to retrieve specific task
- [X] T032 [US3] Implement PUT /api/tasks/{task_id} endpoint in routes/tasks.py
- [X] T033 [US3] Add ownership check to update task
- [X] T034 [US3] Update task fields based on request body
- [X] T035 [US3] Return updated task in response
- [X] T036 [US3] Test updating task with valid JWT and owned task
- [X] T037 [US3] Test updating task with partial data (only title or description)
- [X] T038 [US3] Test update failure with valid JWT but non-owned task (403)

---

## Phase 6: User Story 4 - Complete/Uncomplete Tasks (Priority: P2)

### Goal
Allow users to mark a task as completed or uncompleted.

### Independent Test Criteria
- Can send PATCH request to /api/tasks/{task_id}/complete with valid JWT
- Task completion status is toggled only if it belongs to the authenticated user
- Returns updated task with new completion status

### Acceptance Scenarios
1. Given a user is authenticated and owns a specific task, When they send a PATCH request to /api/tasks/{task_id}/complete, Then the task's completion status is toggled and returned in the response

### Tasks

- [X] T039 [US4] Implement PATCH /api/tasks/{task_id}/complete endpoint in routes/tasks.py
- [X] T040 [US4] Add ownership check to toggle task completion
- [X] T041 [US4] Toggle completed field from current value to opposite value
- [X] T042 [US4] Return updated task with new completion status
- [X] T043 [US4] Test toggling completion from false to true
- [X] T044 [US4] Test toggling completion from true to false
- [X] T045 [US4] Test toggle failure with valid JWT but non-owned task (403)

---

## Phase 7: User Story 5 - Delete Tasks (Priority: P3)

### Goal
Allow users to remove tasks they no longer need.

### Independent Test Criteria
- Can send DELETE request to /api/tasks/{task_id} with valid JWT
- Task is deleted only if it belongs to the authenticated user
- Returns 204 No Content on successful deletion

### Acceptance Scenarios
1. Given a user is authenticated and owns a specific task, When they send a DELETE request to /api/tasks/{task_id}, Then the task is deleted successfully

### Tasks

- [X] T046 [US5] Implement DELETE /api/tasks/{task_id} endpoint in routes/tasks.py
- [X] T047 [US5] Add ownership check to delete task
- [X] T048 [US5] Delete task from database
- [X] T049 [US5] Return 204 No Content on successful deletion
- [X] T050 [US5] Test deleting task with valid JWT and owned task
- [X] T051 [US5] Test delete failure with valid JWT but non-owned task (403)
- [X] T052 [US5] Verify deleted task no longer appears in GET /api/tasks response

---

## Phase 8: Error Handling & Validation

### Goal
Implement comprehensive error handling and validation across all endpoints.

### Independent Test Criteria
- All endpoints return standardized JSON error responses
- Authentication failures return 401 Unauthorized
- Authorization failures return 403 Forbidden
- Validation errors return 422 Unprocessable Entity with field details

### Tasks

- [X] T053 Add global exception handler for JWT errors
- [X] T054 Ensure all endpoints return standardized error format {"detail": str}
- [X] T055 Test authentication failure (invalid/missing JWT) returns 401
- [X] T056 Test authorization failure (non-owned resource) returns 403
- [X] T057 Test validation failure (missing required fields) returns 422
- [X] T058 Add detailed validation error messages for field-specific issues

---

## Phase 9: Polish & Cross-Cutting Concerns

### Goal
Final touches and cross-cutting concerns to complete the implementation.

### Independent Test Criteria
- All functionality works as specified
- Application can be started and tested locally
- API documentation is available

### Tasks

- [X] T059 Add basic logging for startup events and errors
- [X] T060 Test complete workflow: create, view, update, toggle, delete tasks
- [X] T061 Verify all API responses match frontend expectations per API contract
- [X] T062 Test ownership enforcement: user A cannot access user B's tasks
- [X] T063 Add startup validation to ensure database connection works
- [X] T064 Verify CORS configuration allows requests from http://localhost:3000
- [X] T065 Test with Swagger UI at http://localhost:8000/docs
- [X] T066 Update README.md with complete usage instructions
- [X] T067 Run all tests to ensure everything works together