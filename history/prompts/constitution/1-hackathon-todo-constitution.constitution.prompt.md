---
id: 1
title: Hackathon Todo Constitution
stage: constitution
date: 2026-01-20
surface: agent
model: Qwen
feature: none
branch: main
user: user
command: /sp.constitution
labels: [constitution, hackathon, todo, fullstack]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

Create a comprehensive, unbreakable constitution file for Hackathon Phase 2: Full-Stack Todo Web Application.

This constitution is the supreme rulebook that every specification, plan, task, sub-agent, skill, and code implementation MUST follow. No overrides allowed.

Project Name: hackathon-todo-fullstack-phase2
Project Type: Hackathon Phase 2 - Multi-user Full-Stack Todo Web App
Development Paradigm: Strict Agentic Spec-Driven Development using Spec-Kit Plus + Qwen (or Claude Code) sub-agents and skills
Language & Stack:
  Frontend: Next.js 16+ (App Router, TypeScript, Tailwind CSS)
  Backend: FastAPI (Python 3.11+)
  ORM/Database: SQLModel + Neon Serverless PostgreSQL
  Authentication: Better Auth (frontend) with JWT tokens (shared secret via env BETTER_AUTH_SECRET)
  Monorepo: Single repo with /frontend, /backend, /specs, /agents (subagents + skills)

Core Functional Requirements (only these 5 basic features – no extras):
1. User Signup / Signin (via Better Auth on frontend)
2. Add new task (title required, description optional)
3. View/List all tasks (only authenticated user's tasks)
4. Update task details
5. Delete task
6. Mark task as complete / incomplete (toggle)

Non-Functional & Security Rules:
- Multi-user isolation: Every task MUST have user_id (string from JWT "sub" claim)
- All API endpoints require valid JWT in Authorization: Bearer <token>
- Backend MUST verify JWT and filter all queries by current_user.id
- No access to other users' tasks – 403 Forbidden if mismatch
- JWT secret shared via env var BETTER_AUTH_SECRET (same in frontend & backend)
- Stateless auth – no sessions in backend DB
- Data persistence: Neon PostgreSQL only (no in-memory or files)
- Database schema: users (managed by Better Auth), tasks (id: int PK, user_id: str FK, title: str not null, description: text nullable, completed: bool default false, created_at: timestamp, updated_at: timestamp)

API Rules:
- Base path: /api
- Endpoints (user_id NOT in path – use JWT for identification):
  - GET /api/tasks → list user's tasks (optional query params: status, sort)
  - POST /api/tasks → create task for current user
  - GET /api/tasks/{task_id} → get one task (ownership check)
  - PUT /api/tasks/{task_id} → update task (ownership check)
  - DELETE /api/tasks/{task_id} → delete task (ownership check)
  - PATCH /api/tasks/{task_id}/complete → toggle completed (ownership check)
- All responses: JSON with Pydantic models
- Errors: Standard HTTP (401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Validation)

Project Structure (monorepo – mandatory):
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

Agentic Workflow Rules:
- No manual coding allowed – all code generated via Qwen + Spec-Kit Plus
- Workflow: /sp.specify → /sp.plan → /sp.tasks → /sp.implement
- Use sub-agents for specialization (delegate tasks)
- Use skills for reusable patterns (include when relevant)
- Always reference specs with @specs/path.md
- Update specs only if constitution allows

Constraints & Boundaries:
- No additional features (no priorities, tags, due dates, recurring, search – save for future phases)
- No external auth services beyond Better Auth + JWT
- No colors/icons unless Tailwind/shadcn
- Local dev: docker-compose up (frontend:3000, backend:8000)
- Env vars: DATABASE_URL (Neon), BETTER_AUTH_SECRET (shared), others as needed
- Code quality: Type hints, docstrings, PEP-8 (backend), ESLint/Prettier (frontend)

Judging Criteria Focus:
- Full compliance with Spec-Kit Plus workflow + sub-agents/skills usage
- Secure multi-user implementation (JWT + ownership enforcement)
- Clean monorepo structure with organized specs/agents
- Working full-stack app: signup → create/view/update/delete own tasks only

This constitution is eternal and supreme.
Any contradiction in spec/plan/task/code must be rejected.
All generations MUST start with: "Constitution followed: [brief summary]"

Output Format:
Generate as clean Markdown constitution.md with sections:
- # Project Constitution - Phase 2 Full-Stack Todo Web App
- ## Project Overview & Goals
- ## Core Requirements & Features
- ## Technology & Security Rules
- ## API & Endpoint Rules
- ## Monorepo Structure
- ## Agentic Workflow & Sub-Agents/Skills
- ## Constraints & Non-Scope
- ## Judging & Success Criteria

Do NOT generate code, specs, or plans yet – only the constitution file.

## Response snapshot

I've created a comprehensive constitution file for the Hackathon Phase 2 Full-Stack Todo Web Application based on your requirements. The constitution document is now in place at `.specify/memory/constitution.md` and includes all the sections you specified:

- Project Constitution with core principles
- Technology & Security Rules
- API & Endpoint Rules
- Monorepo Structure
- Agentic Workflow & Sub-Agents/Skills
- Constraints & Non-Scope
- Judging & Success Criteria
- Governance section

The constitution serves as the supreme rulebook that all future specifications, plans, tasks, sub-agents, skills, and code implementations must follow. It enforces the agentic spec-driven development workflow and ensures security, proper architecture, and adherence to the required technology stack.

## Outcome

- ✅ Impact: Created foundational constitution document that will govern all future development
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md
- 🔁 Next prompts: /sp.specify to create feature specifications based on this constitution
- 🧠 Reflection: The constitution establishes clear boundaries and requirements for the hackathon project, ensuring all development stays within scope.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin feature specification using /sp.specify