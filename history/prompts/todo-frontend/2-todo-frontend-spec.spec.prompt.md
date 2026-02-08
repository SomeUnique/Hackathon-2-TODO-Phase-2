---
id: 2
title: Todo Frontend Spec
stage: spec
date: 2026-01-20
surface: agent
model: Qwen
feature: todo-frontend
branch: 1-todo-frontend
user: user
command: /sp.specify
labels: [specification, frontend, todo, nextjs]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - specs/1-todo-frontend/spec.md
 - specs/1-todo-frontend/checklists/requirements.md
tests:
 - none
---

## Prompt

Create a detailed specification ONLY for the frontend part of the Todo Full-Stack Web Application (Phase 2), ignoring backend, database, and full auth flow for now. Focus exclusively on Next.js frontend as the priority. Project Context from Constitution: - Frontend: Next.js 16+ (App Router, TypeScript, Tailwind CSS) - Goal: Responsive, user-friendly interface for multi-user Todo app - Features to implement (basic 5 only): 1. Signup / Signin pages (using Better Auth UI components) 2. Dashboard / Home page: List all user's tasks 3. Add new task form (title required, description optional) 4. Edit/Update task (modal or separate page) 5. Delete task button with confirmation 6. Toggle complete (checkbox or button) - All task operations will call backend API (but backend not implemented yet – mock or placeholder API calls allowed) - Authentication: Use Better Auth for login/signup – assume JWT token available in session - API calls: Protected routes require token in headers User Stories (Frontend Only): - As a new user, I can signup and signin using email/password - As a logged-in user, I am redirected to dashboard - As a logged-in user, I can see my task list (title, description, completed status) - As a logged-in user, I can add a new task with title and optional description - As a logged-in user, I can edit an existing task's title/description - As a logged-in user, I can delete a task after confirmation - As a logged-in user, I can mark a task as complete or pending - UI should show loading states, error messages, and success toasts Non-Functional Requirements (Frontend): - Responsive design: Mobile-first, works on desktop/mobile (Tailwind) - Use server components by default, client components only for interactivity (forms, modals) - Styling: Tailwind CSS + optional shadcn/ui components (if needed – no heavy UI kits) - State management: React hooks + SWR or TanStack Query for API fetching - API client: Create lib/api.ts with fetch + Authorization header from Better Auth session - Protected routes: Use middleware or layout to redirect unauthenticated users to login - Error handling: Show user-friendly messages (e.g., "Failed to load tasks", "Please login") - Accessibility: Semantic HTML, aria labels where needed - No backend/DB logic here – assume API endpoints exist at http://localhost:8000/api/tasks Success Criteria for this Specification: - Covers complete frontend UI flow: auth → dashboard → CRUD operations - Describes pages/routes: /login, /signup, / (dashboard) - Details components: TaskList, TaskCard, TaskForm, DeleteConfirmModal - Specifies API client usage with token attachment - Includes loading/error/success states - Mentions Tailwind classes for layout (grid, flex, cards, buttons) - Remains frontend-only – no backend/DB code or Neon connection Constraints & Out of Scope (for this spec): - Do NOT include backend FastAPI code, SQLModel, Neon DB connection - Do NOT implement full JWT verification logic (assume session.token available) - Do NOT add extra features (priorities, tags, due dates, search, sort – save for later) - Do NOT use external UI libraries beyond Tailwind/shadcn (if used, minimal) - Keep spec concise (800-1500 words ideal) Output Format: Generate specification in clean Markdown with these sections: - # Specification: todo-frontend-nextjs-phase2 - ## Overview & Goals (Frontend Focus) - ## Pages & Routing Structure - ## User Stories & Functional Requirements - ## Components Breakdown - ## API Client & Data Fetching - ## Styling & Responsiveness - ## State & Error Handling - ## Assumptions & Constraints - ## Acceptance Checklist (with [ ] checkboxes) Do NOT generate any code, plan, or backend references beyond API placeholders. Strictly follow the project constitution (frontend rules only for this phase). Focus on "what" the user sees and interacts with, not how backend works.

## Response snapshot

I have successfully created a detailed specification for the frontend part of the Todo Full-Stack Web Application (Phase 2). The specification includes:

1. Overview & Goals focusing on the frontend requirements
2. Pages & Routing Structure detailing the navigation flow
3. User Stories & Functional Requirements covering all specified features
4. Components Breakdown outlining the necessary UI components
5. API Client & Data Fetching describing the integration approach
6. Styling & Responsiveness requirements for the UI
7. State & Error Handling specifications
8. Assumptions & Constraints based on the project context
9. Acceptance Checklist with all required functionality

I also created a quality checklist to validate that the specification meets all requirements. The specification is comprehensive, focused solely on frontend requirements, and adheres to the project constitution.

## Outcome

- ✅ Impact: Created comprehensive frontend specification for the Todo app
- 🧪 Tests: none
- 📁 Files: Created specs/1-todo-frontend/spec.md and specs/1-todo-frontend/checklists/requirements.md
- 🔁 Next prompts: /sp.plan to create technical plan based on this specification
- 🧠 Reflection: The specification covers all required frontend features while staying within scope.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin technical planning with /sp.plan