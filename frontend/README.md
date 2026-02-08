# Todo App Frontend

This is the frontend for the Todo application built with Next.js, TypeScript, Tailwind CSS, and Better Auth.

## Features

- User authentication (sign up, sign in, sign out)
- Task management (create, read, update, delete)
- Toggle task completion status
- Responsive design with dark mode support
- Optimistic updates for better UX
- Loading states and error handling

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS for styling
- Better Auth for authentication
- SWR for data fetching and caching
- React for UI components

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd todo-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Copy `.env.local.example` to `.env.local` and update the values as needed:
   ```bash
   cp .env.local.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Environment Variables

- `NEXT_PUBLIC_BETTER_AUTH_URL`: The URL of your Better Auth instance
- `BETTER_AUTH_SECRET`: Secret key for Better Auth
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for the backend API

## Scripts

- `npm run dev`: Starts the development server
- `npm run build`: Builds the application for production
- `npm start`: Starts the production server
- `npm run lint`: Runs the linter

## Deployment

The application can be deployed to platforms like Vercel, Netlify, or any other hosting service that supports Next.js applications.

For Vercel deployment:
1. Connect your GitHub repository to Vercel
2. Add the required environment variables in the Vercel dashboard
3. Deploy!

## Project Structure

```
frontend/
├── app/                 # Next.js App Router pages
│   ├── login/           # Login page
│   ├── signup/          # Signup page
│   └── dashboard/       # Dashboard page
├── components/          # Reusable UI components
│   └── ui/              # Specific UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and API client
├── types/               # TypeScript type definitions
├── public/              # Static assets
└── styles/              # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request