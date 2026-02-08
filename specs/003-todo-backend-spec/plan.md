# Technical Plan: backend-fastapi-neon-phase2 (Refined)

**Branch**: `003-todo-backend-spec` | **Date**: 2026-02-07 | **Spec**: [link to spec.md](../003-todo-backend-spec/spec.md)
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a secure, multi-user backend for the Todo application using FastAPI, SQLModel, and Neon PostgreSQL. The backend will provide JWT-authenticated REST API endpoints for task management with strict ownership enforcement, ensuring users can only access their own tasks.

## Technical Context

**Language/Version**: Python 3.11
**Primary Dependencies**: FastAPI, SQLModel, PyJWT, python-jose[cryptography], Neon PostgreSQL driver
**Storage**: Neon Serverless PostgreSQL database
**Testing**: pytest for backend functionality
**Target Platform**: Linux server (development: localhost:8000)
**Project Type**: Web backend API
**Performance Goals**: Handle 1000 concurrent users, API response time <200ms p95
**Constraints**: JWT authentication required for all endpoints, ownership enforcement for all operations, SSL required for database connection
**Scale/Scope**: Multi-user support with isolated data access, 10k+ users anticipated

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Multi-User Security & Isolation: All endpoints will require JWT authentication and enforce ownership checks
- ✅ Full-Stack Integration: Backend will integrate with Next.js frontend via REST API
- ✅ Type Safety & Code Quality: Using Pydantic models for request/response validation
- ✅ API & Endpoint Rules: Following specified endpoints with proper authentication and ownership checks
- ✅ Monorepo Structure: Backend code will be contained in backend/ directory
- ✅ Technology & Security Rules: Using FastAPI, SQLModel, Neon PostgreSQL, and JWT authentication with shared secret

## Backend Isolation & Folder Structure

All backend code, dependencies, and configurations will be contained within the `backend/` directory to maintain clean separation from frontend code:

```
backend/
├── main.py                  # App entry, CORS, startup event, router include
├── models.py                # SQLModel Task class
├── schemas.py               # Pydantic: TaskCreate, TaskUpdate, TaskRead
├── dependencies.py          # get_db(), get_current_user()
├── auth.py                  # JWT decode + verification logic
├── routes/
│   └── tasks.py             # All endpoints + ownership checks
├── db.py                    # engine, session factory, init_db()
├── .env                     # Optional – or use os.getenv in code
└── requirements.txt         # fastapi, uvicorn, sqlmodel, python-jose[cryptography]
```

## Refined Technical Decisions & Tradeoffs

### 1. Project Isolation
- All backend code, deps, env handling inside backend/
- Run command: cd backend && uvicorn main:app --reload --port 8000
- Chosen: Strict folder isolation for clean monorepo

### 2. JWT Verification Method
- Manual PyJWT decode in dependency (no third-party auth lib)
- Reason: Minimal deps, full control, hackathon-friendly

### 3. Database Setup
- Async engine + AsyncSession
- Table creation: metadata.create_all() on startup (no Alembic for speed)
- Reason: Simple, works with Neon serverless

### 4. API Router & Organization
- APIRouter(prefix="/api/tasks") in routes/tasks.py
- Dependencies injected via Depends()

### 5. Response Models
- TaskRead excludes user_id (security)
- Timestamps serialized as ISO strings

### 6. CORS
- Allow origin: http://localhost:3000 (frontend)
- Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS

### 7. Error Standardization
- All errors return JSON {"detail": str, "code": optional}
- 401 for auth, 403 for ownership, 404 not found, 422 validation

## Detailed File-by-File Architecture

### main.py
- FastAPI() instance
- Add CORS middleware allowing http://localhost:3000
- @app.on_event("startup") async def startup(): await init_db()
- Include tasks router with prefix

### models.py
- class Task(SQLModel, table=True):
  - id: int | None = Field(default=None, primary_key=True)
  - user_id: str
  - title: str
  - description: str | None = None
  - completed: bool = False
  - created_at: datetime = Field(default_factory=datetime.utcnow)
  - updated_at: datetime = Field(default_factory=datetime.utcnow)

### schemas.py
- class TaskCreate(BaseModel): title (required), description (optional)
- class TaskUpdate(BaseModel): title (optional), description (optional)
- class TaskRead(BaseModel): all fields except user_id (security)

### dependencies.py
- async def get_db(): yield AsyncSession(engine)
- async def get_current_user(token: str = Depends(oauth2_scheme)): verify JWT and return user info

### auth.py
- def verify_jwt(token: str) -> dict: jwt.decode(...) with BETTER_AUTH_SECRET

### routes/tasks.py
- router = APIRouter(prefix="/api/tasks")
- All 6 endpoints with ownership checks using current_user.id

### db.py
- async_engine with provided DATABASE_URL
- async_sessionmaker for session creation
- init_db() function to create tables

## JWT Verification & Dependencies

The backend will implement JWT verification using PyJWT and python-jose[cryptography] to decode and verify tokens issued by Better Auth. The verification process will:
1. Extract the token from the Authorization header
2. Verify the signature using BETTER_AUTH_SECRET with HS256 algorithm
3. Extract user_id from payload["sub"]
4. Return user information for use in endpoints

Dependencies required:
- pyjwt
- python-jose[cryptography]

## Database Setup & Neon Integration

The database connection will use:
- AsyncEngine with provided Neon DATABASE_URL
- SSL mode set to 'require' as specified
- Channel binding set to 'require' as specified
- SQLModel metadata.create_all() on startup to ensure tables exist

Connection string: postgresql://neondb_owner:npg_8USzj6FdhfkE@ep-delicate-credit-airvucw7-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

## API Endpoints Step-by-Step Plan

1. **GET /api/tasks**: Query tasks filtered by current_user.id with optional status filter
2. **POST /api/tasks**: Create task with user_id from JWT, return created task
3. **GET /api/tasks/{task_id}**: Return task if owned by current_user, else 403/404
4. **PUT /api/tasks/{task_id}**: Update task if owned by current_user, else 403
5. **DELETE /api/tasks/{task_id}**: Delete task if owned by current_user, else 403
6. **PATCH /api/tasks/{task_id}/complete**: Toggle completion if owned by current_user, else 403

Each endpoint will use dependencies for authentication and database access.

## Security, Errors & CORS

### Security
- All endpoints require JWT authentication
- Ownership checks on all operations except creation
- user_id not exposed in API responses for security
- No sensitive data in error messages

### Error Handling
- Standardized JSON responses: {"detail": str}
- HTTP status codes: 401 (auth), 403 (ownership), 404 (not found), 422 (validation)
- Global exception handlers for JWT errors

### CORS
- Allow origin: http://localhost:3000
- Allow credentials: true
- Allow methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
- Allow headers: Content-Type, Authorization

## Frontend API Contract (response shapes)

The backend will return consistent JSON responses that match frontend expectations:

### Task Object
```json
{
  "id": 1,
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "created_at": "2023-01-01T00:00:00",
  "updated_at": "2023-01-01T00:00:00"
}
```

### Successful Responses
- GET /api/tasks: [{"id": 1, ...}, {"id": 2, ...}]
- POST /api/tasks: {"id": 1, ...} (201 Created)
- GET /api/tasks/{id}: {"id": 1, ...}
- PUT /api/tasks/{id}: {"id": 1, ...}
- PATCH /api/tasks/{id}/complete: {"id": 1, ...}

### Error Responses
- All errors: {"detail": "error message"}

## Quality, Testing & Validation Checklist

### Independent backend testing:
- uvicorn → http://localhost:8000/docs (Swagger UI)
- curl -H "Authorization: Bearer <valid-jwt>" http://localhost:8000/api/tasks
- Test ownership: Create task with token A, try delete with token B → 403
- Neon connection: Startup log should show no connection error

### Edge cases checklist:
- [ ] Empty list → []
- [ ] Invalid token → 401
- [ ] Missing title on POST → 422
- [ ] Non-existent ID → 404
- [ ] Ownership violation → 403

### API Contract Compliance:
- [ ] All endpoints return proper JSON
- [ ] Authentication required for all endpoints
- [ ] Ownership enforced on all operations
- [ ] Consistent error format

## Implementation Roadmap (12 phases)

1. Create backend/ folder + requirements.txt + .env.example
2. Setup db.py: async engine, get_session dependency
3. Create models.py: Task SQLModel class
4. Create schemas.py: Pydantic models for create/update/read
5. Create auth.py: JWT verification function
6. Create dependencies.py: get_current_user + get_db
7. Create routes/tasks.py: APIRouter + all 6 endpoints with ownership checks
8. Create main.py: FastAPI app, CORS, startup event (init_db), include_router
9. Add global exception handler for JWT errors
10. Add basic logging (print or logging module) for startup & errors
11. Test locally: cd backend && uvicorn main:app --reload
12. Integration verification: Ensure JSON responses match frontend types (id int, completed bool, dates ISO)

## Risks, Mitigations & Env Vars Usage

### Risks & Mitigations:
- Neon connection fail → Check URL, SSL params, firewall
- JWT secret mismatch → Use exact value from constitution: BETTER_AUTH_SECRET=70tvEiM4SIXNZegpxN5TQRvMiUGePVwU
- Async session leak → Use async with AsyncSession(db) as session:
- CORS error → Explicitly allow frontend origin

### Environment Variables:
- BETTER_AUTH_SECRET: 70tvEiM4SIXNZegpxN5TQRvMiUGePVwU (for JWT verification)
- DATABASE_URL: postgresql://neondb_owner:npg_8USzj6FdhfkE@ep-delicate-credit-airvucw7-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

## Project Structure

### Documentation (this feature)

```text
specs/003-todo-backend-spec/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── main.py                  # App entry, CORS, startup event, router include
├── models.py                # SQLModel Task class
├── schemas.py               # Pydantic: TaskCreate, TaskUpdate, TaskRead
├── dependencies.py          # get_db(), get_current_user()
├── auth.py                  # JWT decode + verification logic
├── routes/
│   └── tasks.py             # All endpoints + ownership checks
├── db.py                    # engine, session factory, init_db()
├── .env                     # Optional – or use os.getenv in code
└── requirements.txt         # fastapi, uvicorn, sqlmodel, python-jose[cryptography]
```

**Structure Decision**: Selected web application backend structure with all code contained in the backend/ directory to maintain clear separation from frontend code while following the monorepo organization principle.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|

## Phase 1 Deliverables

### Files Created
- `research.md` - Technical research and decisions
- `data-model.md` - Entity definitions and relationships  
- `contracts/todo-api.yaml` - OpenAPI specification
- `quickstart.md` - Setup and usage instructions

### Backend Structure Implemented
The backend follows a modular architecture with clear separation of concerns:
- `main.py` - Application entry point with CORS and startup configuration
- `models.py` - SQLModel definitions
- `schemas.py` - Pydantic request/response models
- `dependencies.py` - Database and authentication dependencies
- `auth.py` - JWT verification logic
- `routes/tasks.py` - API endpoints with ownership checks
- `db.py` - Database connection and session management
- `requirements.txt` - Project dependencies

## Refined Technical Decisions

### JWT Verification Method
- Manual PyJWT decode in dependency (no third-party auth lib)
- Reason: Minimal deps, full control, hackathon-friendly

### Database Setup
- Async engine + AsyncSession
- Table creation: metadata.create_all() on startup (no Alembic for speed)
- Reason: Simple, works with Neon serverless

### API Router & Organization
- APIRouter(prefix="/api/tasks") in routes/tasks.py
- Dependencies injected via Depends()

### Response Models
- TaskRead excludes user_id (security)
- Timestamps serialized as ISO strings

### CORS
- Allow origin: http://localhost:3000 (frontend)
- Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS

### Error Standardization
- All errors return JSON {"detail": str, "code": optional}
- 401 for auth, 403 for ownership, 404 not found, 422 validation

## Quality & Validation Strategy

### Independent backend testing:
- uvicorn → http://localhost:8000/docs (Swagger UI)
- curl -H "Authorization: Bearer <valid-jwt>" http://localhost:8000/api/tasks
- Test ownership: Create task with token A, try delete with token B → 403
- Neon connection: Startup log should show no connection error

### Edge cases checklist:
- Empty list → []
- Invalid token → 401
- Missing title on POST → 422
- Non-existent ID → 404
- Ownership violation → 403

## Implementation Roadmap

1. Create backend/ folder + requirements.txt + .env.example
2. Setup db.py: async engine, get_session dependency
3. Create models.py: Task SQLModel class
4. Create schemas.py: Pydantic models for create/update/read
5. Create auth.py: JWT verification function
6. Create dependencies.py: get_current_user + get_db
7. Create routes/tasks.py: APIRouter + all 6 endpoints with ownership checks
8. Create main.py: FastAPI app, CORS, startup event (init_db), include_router
9. Add global exception handler for JWT errors
10. Add basic logging (print or logging module) for startup & errors
11. Test locally: cd backend && uvicorn main:app --reload
12. Integration verification: Ensure JSON responses match frontend types (id int, completed bool, dates ISO)