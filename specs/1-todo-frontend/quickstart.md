# Quickstart Guide: Frontend Todo Application

## Prerequisites

Before getting started, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn package manager
- Git

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hackathon-todo/frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the frontend directory with the following variables:

```env
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

Note: For development, you can use a simple string as the `BETTER_AUTH_SECRET` value, but use a strong secret for production.

### 4. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Key Technologies Used

### Next.js 16+ with App Router
- Modern React framework with enhanced routing capabilities
- Server Components for improved performance
- Built-in API routes for hybrid applications

### Better Auth
- Simple authentication library for React applications
- Provides hooks for session management
- Handles JWT token management

### SWR (State & Window Revalidator)
- React Hooks library for data fetching
- Provides caching, revalidation, and optimistic updates
- Handles loading and error states automatically

### Tailwind CSS
- Utility-first CSS framework
- Responsive design with mobile-first approach
- Dark mode support built-in

### TypeScript
- Static type checking for improved code quality
- Better IDE support and refactoring
- Type definitions for all components and APIs

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with auth guard
│   ├── page.tsx            # Homepage redirect
│   ├── login/
│   │   └── page.tsx        # Login page
│   ├── signup/
│   │   └── page.tsx        # Signup page
│   └── dashboard/
│       └── page.tsx        # Main dashboard
├── components/
│   ├── ui/
│   │   ├── TaskCard.tsx    # Task display component
│   │   ├── TaskForm.tsx    # Task creation/editing form
│   │   └── DeleteConfirmModal.tsx # Confirmation modal
│   ├── Navbar.tsx          # Navigation bar
│   └── ProtectedRouteWrapper.tsx # Auth wrapper
├── lib/
│   └── api.ts              # Centralized API client
├── hooks/
│   └── useTasks.ts         # SWR hook for task operations
├── types/
│   └── index.ts            # TypeScript interfaces
├── middleware.ts           # Authentication middleware
└── tailwind.config.ts      # Tailwind configuration
```

## Key Features

### Authentication Flow
1. User visits the site
2. If unauthenticated, redirected to `/login`
3. After successful login, redirected to `/dashboard`
4. Protected routes check authentication status

### Task Management
1. View all tasks on the dashboard
2. Add new tasks with title and optional description
3. Edit existing tasks
4. Delete tasks with confirmation
5. Mark tasks as complete/incomplete

### API Integration
- All API calls go through the centralized client in `lib/api.ts`
- Automatic JWT token attachment
- Error handling and user feedback
- Loading states and optimistic updates

## Common Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Lint code
npm run lint

# Run tests
npm run test
```

## Troubleshooting

### Common Issues

#### Issue: Cannot access dashboard after login
- Solution: Ensure the `BETTER_AUTH_SECRET` is the same between frontend and backend
- Check browser console for authentication errors

#### Issue: API calls returning 401 Unauthorized
- Solution: Verify that the JWT token is being properly attached to requests
- Check that the `NEXT_PUBLIC_API_BASE_URL` is correctly set

#### Issue: Styles not loading properly
- Solution: Ensure Tailwind CSS is properly configured
- Verify that the `tailwind.config.ts` file is correctly set up

### Development Tips

1. Use the `useTasks` hook for all task-related operations
2. Import types from `types/index.ts` for type safety
3. Use the centralized API client in `lib/api.ts` for all API calls
4. Check the browser's developer tools for debugging information
5. Use the SWR dev tools for inspecting cache state

## Next Steps

1. Explore the dashboard to understand the UI components
2. Review the `useTasks` hook to understand data fetching patterns
3. Examine the API client in `lib/api.ts` to understand request handling
4. Look at the middleware configuration for authentication flow
5. Customize the UI components in the `components/ui/` directory