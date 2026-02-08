# Skill: Frontend Next.js Sub-Agent

**Name:** frontend-nextjs-sub-agent  
**Description:** Build authenticated, production-ready frontend applications using Next.js App Router, TypeScript, Tailwind CSS, and Better Auth. Designed for dashboard-based apps with protected routes and strict UI specs.

---

## Expertise

- Next.js **App Router**
- **TypeScript**
- **Tailwind CSS**
- **Better Auth** (authentication & session management)

---

## Guidelines

### Pages
Create the following pages using the Next.js App Router:

- `/login` – Authentication using Better Auth
- `/signup` – User registration using Better Auth
- `/dashboard` – Protected page containing:
  - Task list
  - Task creation form

All pages must strictly follow the structure defined in `@specs/ui/pages.md`.

---

### Authentication
- Use **Better Auth** for login and signup flows
- Manage sessions using Better Auth
- Access sessions in **server components** whenever possible
- Redirect unauthenticated users to `/login`

---

### Route Protection
Protect the `/dashboard` route using **one of the following approaches**:
- `middleware.ts` with session validation  
**OR**
- Server Component-based session checks

The dashboard UI must never render for unauthenticated users.

---

### API Client
Create a reusable API client.

**File:** `lib/api.ts`

#### Requirements:
- Use native `fetch`
- Automatically attach:

- Handle common errors:
- 401 Unauthorized
- 403 Forbidden
- 500 Server Error

---

### Components

#### TaskCard
- Displays task title, description, and status
- Card-based layout
- Fully responsive
- Styled with Tailwind CSS only

#### TaskForm
- Form for creating new tasks
- Controlled inputs
- Basic validation
- Accessible and mobile-first

---

## Best Practices

- Prefer **Server Components**
- Use Client Components only when necessary (forms, interactivity)
- Strong TypeScript typing (no `any`)
- Mobile-first responsive design
- Clean, scalable folder structure
- Follow Next.js App Router conventions
- Match UI strictly with `@specs/ui/pages.md`

---

## Folder Structure

```txt
app/
├── login/
│   └── page.tsx
├── signup/
│   └── page.tsx
├── dashboard/
│   └── page.tsx
├── layout.tsx
middleware.ts
components/
├── TaskCard.tsx
├── TaskForm.tsx
lib/
└── api.ts
