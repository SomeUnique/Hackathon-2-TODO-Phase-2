<!--
Sync Impact Report:
Version change: 1.0.0 → 1.0.0 (initial constitution)
Modified principles: None (new document)
Added sections: All sections (new document)
Removed sections: None
Templates requiring updates: N/A (initial document)
Follow-up TODOs: None
-->
# Hackathon Phase 2 Full-Stack Todo Web Application Constitution

## Core Principles

### I. Strict Agentic Spec-Driven Development
All development follows the Spec-Kit Plus workflow: /sp.specify → /sp.plan → /sp.tasks → /sp.implement. No manual coding is allowed - all code must be generated via Qwen + Spec-Kit Plus. Every specification, plan, task, sub-agent, skill, and code implementation must follow this constitution as the supreme rulebook.

### II. Multi-User Security & Isolation
Every task must have a user_id linked to the authenticated user. All API endpoints require valid JWT in Authorization: Bearer <token>. Backend must verify JWT and filter all queries by current_user.id. No access to other users' tasks is allowed - return 403 Forbidden if there's a mismatch. Authentication is handled via Better Auth on frontend with JWT tokens.

### III. Full-Stack Integration
The application must be a fully integrated full-stack solution with Next.js 16+ frontend, FastAPI backend, and Neon Serverless PostgreSQL database. All components must work together seamlessly with proper API communication and data flow between layers.

### IV. Minimalist Feature Set
Only implement the 6 core features specified: 1) User Signup/Signin, 2) Add new task, 3) View/List all tasks, 4) Update task details, 5) Delete task, 6) Mark task as complete/incomplete. No additional features are allowed (no priorities, tags, due dates, recurring, search - save for future phases).

### V. Monorepo Organization
The project must follow a strict monorepo structure with dedicated directories for specs/, agents/, frontend/, and backend/. All components must be properly organized within this structure with clear separation of concerns.

### VI. Type Safety & Code Quality
All code must maintain high quality standards: Type hints, docstrings, PEP-8 compliance for backend, and ESLint/Prettier for frontend. All API responses must use Pydantic models for validation and consistency.

## Technology & Security Rules

The application stack consists of:
- Frontend: Next.js 16+ (App Router, TypeScript, Tailwind CSS)
- Backend: FastAPI (Python 3.11+)
- ORM/Database: SQLModel + Neon Serverless PostgreSQL
- Authentication: Better Auth (frontend) with JWT tokens (shared secret via env BETTER_AUTH_SECRET)

Security requirements:
- Stateless auth – no sessions stored in backend DB
- JWT secret shared via env var BETTER_AUTH_SECRET (same in frontend & backend)
- Data persistence: Neon PostgreSQL only (no in-memory or files)
- Database schema: users table (managed by Better Auth), tasks table with id (int PK), user_id (str FK), title (str not null), description (text nullable), completed (bool default false), created_at (timestamp), updated_at (timestamp)

## API & Endpoint Rules

Base path: /api
Endpoints (user_id NOT in path – use JWT for identification):
- GET /api/tasks → list user's tasks (optional query params: status, sort)
- POST /api/tasks → create task for current user
- GET /api/tasks/{task_id} → get one task (ownership check)
- PUT /api/tasks/{task_id} → update task (ownership check)
- DELETE /api/tasks/{task_id} → delete task (ownership check)
- PATCH /api/tasks/{task_id}/complete → toggle completed (ownership check)

All responses must be JSON with Pydantic models. Error responses must follow standard HTTP status codes (401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Validation).

## Monorepo Structure

The project must follow this mandatory structure:
```
hackathon-todo/
├── .spec-kit/config.yaml
├── specs/
│   ├── overview.md
│   ├── features/task-crud.md
│   ├── api/rest-endpoints.md
│   ├── database/schema.md
│   └── ui/pages.md
├── agents/
│   ├── main-orchestrator.md
│   ├── subagents/ (backend-fastapi.md, frontend-nextjs.md, etc.)
│   └── skills/ (jwt-verification.md, task-crud-backend.md, etc.)
├── frontend/ (Next.js app)
├── backend/ (FastAPI app)
├── docker-compose.yml
└── README.md
```

## Agentic Workflow & Sub-Agents/Skills

Workflow: /sp.specify → /sp.plan → /sp.tasks → /sp.implement
- Use sub-agents for specialization (delegate tasks)
- Use skills for reusable patterns (include when relevant)
- Always reference specs with @specs/path.md
- Update specs only if constitution allows
- Available sub-agents: auth-jwt-sub-agent, db-neon-sub-agent, fastapi-backend-sub-agent, main-orchestrator, nextjs-frontend-builder, ui-ux-sub-agent

## Constraints & Non-Scope

Strictly prohibited additions:
- No additional features (no priorities, tags, due dates, recurring, search – save for future phases)
- No external auth services beyond Better Auth + JWT
- No colors/icons unless using Tailwind/shadcn
- No organizational-only libraries or unnecessary abstractions

Environment requirements:
- Local dev: docker-compose up (frontend:3000, backend:8000)
- Env vars: DATABASE_URL (Neon), BETTER_AUTH_SECRET (shared), others as needed

## Judging & Success Criteria

Success is measured by:
- Full compliance with Spec-Kit Plus workflow + sub-agents/skills usage
- Secure multi-user implementation (JWT + ownership enforcement)
- Clean monorepo structure with organized specs/agents
- Working full-stack app: signup → create/view/update/delete own tasks only
- Proper implementation of all 6 core features
- Code quality and adherence to technology stack requirements

## Governance

This constitution is the supreme rulebook that supersedes all other practices. All development activities must verify compliance with these principles. Any contradictions in spec/plan/task/code must be rejected. Amendments require formal documentation, approval, and migration planning.

**Version**: 1.0.0 | **Ratified**: 2026-01-20 | **Last Amended**: 2026-01-20
