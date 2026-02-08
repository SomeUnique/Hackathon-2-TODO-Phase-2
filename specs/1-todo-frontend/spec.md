# Specification: todo-frontend-nextjs-phase2

## Overview & Goals (Frontend Focus)

This specification outlines the frontend requirements for a multi-user Todo web application built with Next.js 16+ using the App Router, TypeScript, and Tailwind CSS. The primary goal is to create a responsive, user-friendly interface that enables users to manage their tasks effectively while maintaining security and proper user isolation.

The frontend will focus on providing a seamless user experience for authentication, task management, and data visualization. It will integrate with a backend API for data persistence while ensuring all operations are performed securely with proper authentication and authorization.

## Pages & Routing Structure

The application will have the following pages and routes:

- `/login` - Login page with email/password form using Better Auth UI components
- `/signup` - Registration page with email/password form using Better Auth UI components
- `/` (Dashboard) - Main page showing the user's task list with options to add, edit, delete, and mark tasks as complete
- `/tasks/[id]/edit` - Optional separate page for editing a specific task (alternative to modal approach)

Protected routes will redirect unauthenticated users to the login page. The dashboard will serve as the main hub for all task-related activities.

## User Stories & Functional Requirements

### User Authentication
- As a new user, I can sign up using my email and password through the Better Auth UI components
- As an existing user, I can sign in using my email and password through the Better Auth UI components
- As a logged-in user, I am automatically redirected to the dashboard after successful authentication
- As a logged-out user, I am redirected to the login page when trying to access protected routes

### Task Management
- As a logged-in user, I can view all my tasks on the dashboard with their title, description, and completion status
- As a logged-in user, I can add a new task with a required title and optional description
- As a logged-in user, I can edit an existing task's title and description
- As a logged-in user, I can delete a task after confirming the action
- As a logged-in user, I can mark a task as complete or pending using a checkbox or toggle button
- As a logged-in user, I receive appropriate feedback when operations succeed or fail

### UI/UX Requirements
- As a user, I see loading states when data is being fetched or operations are in progress
- As a user, I receive clear error messages when operations fail
- As a user, I receive success notifications when operations complete successfully
- As a user, the interface is responsive and works well on both mobile and desktop devices

## Components Breakdown

### Authentication Components
- `LoginForm` - Email/password login form using Better Auth UI components
- `SignupForm` - Email/password registration form using Better Auth UI components

### Task Management Components
- `TaskList` - Container component that displays all user tasks in a list/grid format
- `TaskCard` - Individual task display component showing title, description, and completion status
- `TaskForm` - Form component for adding or editing tasks with title and description fields
- `DeleteConfirmModal` - Modal dialog to confirm task deletion before executing the action

### Layout Components
- `AuthLayout` - Layout wrapper for authentication pages (login/signup)
- `DashboardLayout` - Layout wrapper for the main dashboard with navigation
- `ProtectedRoute` - Higher-order component or wrapper to protect routes that require authentication

## API Client & Data Fetching

### API Client Implementation
- Create a centralized API client in `lib/api.ts` that handles all HTTP requests to the backend
- The client will automatically attach the JWT token from the Better Auth session to all requests in the Authorization header
- Implement proper error handling for different HTTP status codes (401, 403, 404, 500, etc.)

### Data Fetching Strategy
- Use SWR or TanStack Query for data fetching, caching, and synchronization
- Implement optimistic updates for better user experience during mutations
- Handle loading states at both global and component levels
- Implement proper error boundaries and user-friendly error messages

### API Endpoints Integration
- GET `/api/tasks` - Retrieve the current user's tasks
- POST `/api/tasks` - Create a new task for the current user
- GET `/api/tasks/{taskId}` - Retrieve a specific task (if using separate edit page)
- PUT `/api/tasks/{taskId}` - Update a specific task
- DELETE `/api/tasks/{taskId}` - Delete a specific task
- PATCH `/api/tasks/{taskId}/complete` - Toggle task completion status

## Styling & Responsiveness

### Styling Approach
- Use Tailwind CSS for all styling with a consistent design system
- Implement a mobile-first responsive design approach
- Use appropriate spacing, typography, and color scheme for good UX
- Implement dark mode support using Tailwind's dark mode utilities

### Responsive Design Requirements
- The interface must be fully usable on mobile devices (320px minimum width)
- Tablet and desktop layouts should take advantage of additional screen space
- Forms and interactive elements must have appropriate touch targets (minimum 44px)
- Navigation should adapt to different screen sizes appropriately

### Component Styling
- Use consistent Tailwind classes for layout (grid, flex, spacing)
- Implement card-based design for task items with appropriate shadows and borders
- Use appropriate button styles for different actions (primary, secondary, destructive)
- Ensure proper contrast ratios for accessibility compliance

## State & Error Handling

### State Management
- Use React hooks for local component state management
- Use SWR or TanStack Query for server state management
- Implement proper loading states for all asynchronous operations
- Handle form state appropriately with validation

### Error Handling
- Display user-friendly error messages for failed operations
- Implement global error handling for uncaught exceptions
- Show appropriate feedback when API calls fail
- Handle authentication errors by redirecting to login page
- Implement proper form validation with clear error indicators

### Loading States
- Show loading spinners during data fetching
- Display skeleton screens while content loads
- Indicate when operations are in progress (saving, deleting, etc.)
- Provide immediate feedback for user interactions

## Assumptions & Constraints

### Technical Assumptions
- Better Auth provides a reliable session/token management system
- The backend API endpoints will be available at `http://localhost:8000/api/tasks`
- JWT tokens will be properly formatted and verifiable by the frontend
- The backend implements proper user isolation and authentication checks

### Design Constraints
- Focus exclusively on frontend implementation without backend considerations
- Use only Tailwind CSS and optional shadcn/ui components for styling
- Implement only the 6 core features specified (no additional functionality)
- Maintain a clean, minimalist design approach without unnecessary complexity

### Scope Limitations
- No backend FastAPI code, SQLModel, or Neon DB connection implementation
- No full JWT verification logic (assume session.token is available)
- No additional features beyond the specified 6 core features
- No external UI libraries beyond Tailwind/shadcn (if used minimally)

## Acceptance Checklist

- [ ] User can successfully sign up using email and password
- [ ] User can successfully sign in using email and password
- [ ] Unauthenticated users are redirected to login page when accessing protected routes
- [ ] Authenticated users are redirected to dashboard after login
- [ ] User can view their task list on the dashboard
- [ ] User can add a new task with required title and optional description
- [ ] User can edit an existing task's details
- [ ] User can delete a task after confirmation
- [ ] User can mark a task as complete or pending
- [ ] All operations provide appropriate loading states
- [ ] All operations provide clear success/error feedback
- [ ] Interface is responsive and works on mobile and desktop
- [ ] API calls include proper authentication tokens
- [ ] All UI elements follow accessibility best practices
- [ ] Form validation prevents invalid submissions
- [ ] Error handling provides user-friendly messages