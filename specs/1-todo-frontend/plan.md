# Technical Plan: frontend-nextjs-todo-phase2

## Architecture Overview

This technical plan outlines the implementation of the frontend for a multi-user Todo web application using Next.js 16+ with the App Router, TypeScript, and Tailwind CSS. The architecture follows a component-based approach with clear separation of concerns between UI components, data fetching logic, and authentication management.

The frontend will integrate with Better Auth for authentication and connect to a backend API for data persistence. The architecture emphasizes responsive design, proper state management, and user-friendly interactions with appropriate loading and error handling.

## Key Decisions & Tradeoffs

### 1. Data Fetching & State Management
- **Option A**: useEffect + useState
- **Option B**: SWR / TanStack Query (caching, revalidation, optimistic updates)
- **Chosen**: B – SWR is ideal for API-driven app, provides automatic loading/error handling, caching, and revalidation capabilities that enhance user experience

### 2. Authentication & Protected Routes
- **Option A**: Layout-level auth check using Better Auth's useSession hook
- **Option B**: Middleware for redirect (middleware.ts)
- **Chosen**: A + B – Use middleware for initial redirect to handle auth before page load, complement with layout-level checks for additional protection and token attachment

### 3. Routing Structure
- **Option A**: App Router with nested layouts
- **Option B**: Pages Router
- **Chosen**: A – Next.js 16+ App Router provides better code organization, nested layouts, and improved performance

### 4. Component Architecture
- **Option A**: Monolithic components
- **Option B**: Reusable, atomic components
- **Chosen**: B – Atomic design promotes reusability, maintainability, and easier testing

### 5. Styling & UI Library
- **Option A**: Tailwind CSS only
- **Option B**: Tailwind CSS + minimal shadcn/ui components
- **Chosen**: B – Tailwind for primary styling with shadcn/ui for complex components like modals and forms

### 6. API Client Design
- **Option A**: Direct fetch calls scattered throughout components
- **Option B**: Centralized API client with interceptors
- **Chosen**: B – Centralized client provides consistent error handling, authentication token management, and request/response transformation

## Component & File Structure

```
frontend/
├── app/
│   ├── layout.tsx (root layout with auth guard)
│   ├── page.tsx (redirect to dashboard if logged in, else to login)
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   └── dashboard/
│       └── page.tsx
├── components/
│   ├── ui/
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx
│   │   └── DeleteConfirmModal.tsx
│   ├── Navbar.tsx
│   └── ProtectedRouteWrapper.tsx
├── lib/
│   └── api.ts (centralized API client)
├── hooks/
│   ├── useTasks.ts (SWR hook for task operations)
│   └── useAuthRedirect.ts (redirect logic for auth)
├── types/
│   └── index.ts (Task interface and related types)
├── middleware.ts (auth middleware)
└── tailwind.config.ts
```

## Data Flow & API Client Design

### API Client Implementation
- Create a centralized API client in `lib/api.ts` that handles all HTTP requests to the backend
- The client will automatically attach the JWT token from the Better Auth session to all requests in the Authorization header
- Implement proper error handling for different HTTP status codes (401, 403, 404, 500, etc.)
- Include request/response interceptors for common transformations

### Data Flow
1. User performs an action (e.g., add task)
2. Component calls hook function (e.g., `addTask` in `useTasks`)
3. Hook calls API client function (e.g., `api.post('/tasks', taskData)`)
4. API client attaches auth token and makes request
5. Response is processed and returned to hook
6. Hook updates SWR cache for optimistic updates
7. UI reflects changes automatically

### API Endpoints Integration
- GET `/api/tasks` - Retrieve the current user's tasks
- POST `/api/tasks` - Create a new task for the current user
- PUT `/api/tasks/{taskId}` - Update a specific task
- DELETE `/api/tasks/{taskId}` - Delete a specific task
- PATCH `/api/tasks/{taskId}/complete` - Toggle task completion status

## Quality Validation & Test Checklist

### Manual Tests
- [ ] Signup → auto redirect to dashboard
- [ ] Signin → auto redirect to dashboard
- [ ] Task list loads (shows loading state initially)
- [ ] Add task → instant UI update with optimistic update
- [ ] Toggle complete → visual change (strike-through + color) with optimistic update
- [ ] Delete task → modal confirm → removal with optimistic update
- [ ] Logout → redirect to login
- [ ] Protected route access → redirect to login when unauthenticated

### Edge Cases
- [ ] Empty task list (show "No tasks yet" message)
- [ ] Network error (toast notification + option to retry)
- [ ] Invalid token (redirect to login with error message)
- [ ] Form validation errors (proper error display)
- [ ] Concurrent edits (ensure consistency)

### Performance Tests
- [ ] Page load times under 3 seconds
- [ ] Task operations respond within 1 second
- [ ] Smooth animations and transitions
- [ ] Efficient re-rendering

## Implementation Roadmap (phased steps)

### Phase 1: Authentication Setup
1. Install Better Auth and configure in Next.js
2. Create login and signup pages with basic UI
3. Implement root layout with auth check
4. Set up middleware for protected routes
5. Test authentication flow

### Phase 2: API Client & Data Layer
1. Create centralized API client in `lib/api.ts`
2. Implement token attachment mechanism
3. Create task types in `types/index.ts`
4. Build `useTasks` hook with SWR for data fetching
5. Test API integration with mock endpoints

### Phase 3: Core UI Components
1. Build TaskCard component to display individual tasks
2. Create TaskForm component for adding/editing tasks
3. Implement DeleteConfirmModal component
4. Create Navbar component with logout functionality
5. Integrate components with data layer

### Phase 4: Dashboard Implementation
1. Build dashboard page with task list
2. Implement add task functionality
3. Add optimistic updates for better UX
4. Implement loading and error states
5. Test complete CRUD flow

### Phase 5: Polish & Enhancements
1. Add toast notifications for user feedback
2. Implement skeleton loaders for better perceived performance
3. Add responsive design for mobile devices
4. Implement dark mode support
5. Conduct accessibility review

### Phase 6: Testing & Validation
1. Perform manual testing of all user flows
2. Test edge cases and error conditions
3. Validate responsive design on different devices
4. Verify security measures (protected routes, token handling)
5. Prepare for deployment

## Risks & Mitigations

### Risk 1: Authentication Session Issues
- **Risk**: Session expiration or invalidation causing inconsistent user experience
- **Mitigation**: Implement proper session refresh mechanisms and clear error handling with user-friendly messages

### Risk 2: API Downtime or Slow Response
- **Risk**: Backend API unavailable affecting user experience
- **Mitigation**: Implement graceful error handling, offline support where possible, and clear messaging to users

### Risk 3: State Management Complexity
- **Risk**: Complex state interactions leading to bugs
- **Mitigation**: Use SWR for server state management and keep local component state minimal

### Risk 4: Security Vulnerabilities
- **Risk**: Improper authentication checks allowing unauthorized access
- **Mitigation**: Implement both middleware and client-side checks, secure token storage, and proper validation

### Risk 5: Performance Degradation
- **Risk**: Slow UI response times affecting user experience
- **Mitigation**: Optimize component rendering, implement proper caching, and use efficient data fetching strategies