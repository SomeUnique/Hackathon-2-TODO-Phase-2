---
id: 3
title: Frontend Todo Plan
stage: plan
date: 2026-01-20
surface: agent
model: Qwen
feature: todo-frontend
branch: 1-todo-frontend
user: user
command: /sp.plan
labels: [plan, frontend, todo, nextjs]
links:
  spec: specs/1-todo-frontend/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/1-todo-frontend/plan.md
 - specs/1-todo-frontend/research.md
 - specs/1-todo-frontend/data-model.md
 - specs/1-todo-frontend/quickstart.md
tests:
 - none
---

## Prompt

Create a detailed technical implementation plan exclusively for the frontend part of the Todo Full-Stack Web Application (Phase 2), strictly based on the existing constitution and the frontend specification that was just created. Do NOT include any backend (FastAPI), database (Neon/SQLModel), or full auth backend logic – focus 100% on Next.js frontend as the current priority.

Project Context (from constitution & spec):
- Technology: Next.js 16+ App Router, TypeScript, Tailwind CSS
- Authentication: Better Auth (use useSession, signIn, signOut hooks) – assume token is available in session for API calls
- API Integration: Placeholder calls to http://localhost:8000/api/tasks (use fetch with Authorization header)
- Core UI Flows: Login/Signup → Protected Dashboard → Task CRUD (list, add, edit, delete, toggle complete)
- No extras: No priorities/tags/due dates/search/sort/recurring yet

Key Technical Decisions & Tradeoffs (document each with options & chosen reason):

1. Data Fetching & State Management
   - Option A: useEffect + useState
   - Option B: SWR / TanStack Query (caching, revalidation, optimistic updates)
   - Chosen: B – ideal for API-driven app, automatic loading/error handling

2. Authentication & Protected Routes
   - Use Better Auth session hook
   - Middleware for redirect (middleware.ts) or layout-level check
   - Token attachment: session?.token → Authorization: Bearer <token>

3. Routing Structure
   - /app/login/page.tsx
   - /app/signup/page.tsx
   - /app/dashboard/page.tsx (protected)
   - Root layout with auth guard

4. Component Architecture
   - Reusable UI: TaskCard (display), TaskForm (add/edit), ConfirmDeleteModal
   - Layout: Navbar (logo + logout), Main content area

5. Styling & UI Library
   - Tailwind CSS primary
   - Optional minimal shadcn/ui (buttons, inputs, dialogs) if time allows
   - Responsive: Mobile-first, grid/flex layouts

6. API Client Design
   - lib/api.ts: Typed fetch wrapper with base URL + auth header
   - Handle 401 → logout or redirect to login

7. UX Patterns
   - Loading: Skeleton UI or spinner
   - Errors: Toast notifications (sonner/react-hot-toast)
   - Success: Toast + optimistic update for toggle/delete

Architecture Sketch (Frontend Only):
- app/
  - layout.tsx (root + auth check)
  - page.tsx (redirect logic)
  - login/page.tsx
  - signup/page.tsx
  - dashboard/page.tsx
- components/
  - Navbar.tsx
  - TaskCard.tsx
  - TaskForm.tsx
  - DeleteConfirm.tsx
- lib/
  - api.ts (client)
- hooks/
  - useTasks.ts (SWR hook)
- types/
  - task.ts (Task interface)

Proposed Frontend Structure:
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   └── dashboard/
│       └── page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── ui/
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx
│   │   └── DeleteConfirm.tsx
├── lib/
│   └── api.ts
├── hooks/
│   └── useTasks.ts
├── types/
│   └── index.ts
├── middleware.ts (optional auth guard)
└── tailwind.config.ts

Quality Validation & Acceptance Approach:
- Manual tests:
  - Signup → auto redirect to dashboard
  - Task list loads (mock data if backend down)
  - Add task → instant UI update
  - Toggle complete → visual change (strike-through + color)
  - Delete → modal confirm → removal
  - Logout → redirect to login
- Edge cases:
  - Empty task list (show "No tasks yet")
  - Network error (toast + retry button)
  - Invalid token (redirect to login)

Implementation Roadmap (sequential frontend phases):
1. Install/setup Better Auth + basic login/signup pages
2. Create root layout + protected dashboard redirect
3. Build API client (lib/api.ts) with token handling
4. Implement task list view + fetch hook
5. Add new task form + POST mutation
6. Edit task (modal/inline) + PUT mutation
7. Delete task with confirmation modal + DELETE call
8. Toggle complete + PATCH optimistic update
9. Add Navbar, logout, loading skeletons, error toasts
10. Responsive polish: Mobile layout, Tailwind utilities
11. Final: Empty states, success feedback, accessibility tweaks

Constraints Reminder:
- Frontend only – no FastAPI/SQLModel/Neon code
- Assume backend API at localhost:8000 (use placeholders)
- TypeScript strict mode
- Minimal dependencies (Better Auth, Tailwind, optional shadcn/ui or sonner)
- Code readability: Components small, hooks clean

Output Format:
Generate in clean Markdown:
- # Technical Plan: frontend-nextjs-todo-phase2
- ## Architecture Overview
- ## Key Decisions & Tradeoffs
- ## Component & File Structure
- ## Data Flow & API Client Design
- ## Quality Validation & Test Checklist
- ## Implementation Roadmap (phased steps)
- ## Risks & Mitigations (e.g., auth session issues, API downtime)

Do NOT generate any code yet – only the plan document.
Reference constitution and frontend specification implicitly.
After plan review, next step will be /sp.tasks for frontend implementation tasks.

## Response snapshot

I have successfully created a detailed technical implementation plan for the frontend part of the Todo Full-Stack Web Application (Phase 2). The plan includes:

1. Architecture Overview - Outlining the component-based approach with clear separation of concerns
2. Key Decisions & Tradeoffs - Documenting the rationale behind each technical choice
3. Component & File Structure - Defining the project organization
4. Data Flow & API Client Design - Detailing how data moves through the application
5. Quality Validation & Test Checklist - Providing a comprehensive testing approach
6. Implementation Roadmap - Breaking down the work into phased steps
7. Risks & Mitigations - Identifying potential challenges and solutions

Additionally, I created supporting documents:
- Research summary documenting technical decisions
- Data model defining the structure of task data
- Quickstart guide to help developers get up and running

The plan focuses exclusively on frontend implementation and adheres to the project constitution and specification.

## Outcome

- ✅ Impact: Created comprehensive technical plan for frontend implementation
- 🧪 Tests: none
- 📁 Files: Created plan.md, research.md, data-model.md, and quickstart.md in specs/1-todo-frontend/
- 🔁 Next prompts: /sp.tasks to break the plan into implementation tasks
- 🧠 Reflection: The plan provides a clear roadmap for frontend development while staying within scope.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Break the plan into specific implementation tasks with /sp.tasks