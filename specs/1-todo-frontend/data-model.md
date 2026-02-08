# Data Model: Frontend Todo Application

## Task Entity

### Fields
- **id**: number (Primary Key, unique identifier)
- **title**: string (Required, non-empty)
- **description**: string | null (Optional, can be null)
- **completed**: boolean (Default: false)
- **created_at**: string (ISO date string, read-only)
- **updated_at**: string (ISO date string, read-only)
- **user_id**: string (Foreign Key, identifies owner)

### Validation Rules
- `title` must be at least 1 character long
- `description` can be null or up to 1000 characters
- `completed` is a boolean value (true/false)
- `created_at` and `updated_at` are automatically managed by the backend
- `user_id` is automatically assigned based on authenticated user's session

### State Transitions
- `completed` can transition from `false` to `true` or vice versa
- `title` and `description` can be updated while preserving `id` and `user_id`
- `created_at` remains constant after initial creation
- `updated_at` automatically updates on any modification

## Session Entity (from Better Auth)

### Fields
- **user**: object
  - **id**: string (Unique user identifier)
  - **email**: string (User's email address)
  - **name**: string | null (User's name, optional)
- **token**: string (JWT token for API authentication)
- **expires**: string (Expiration date/time in ISO format)

### Validation Rules
- `token` must be present for authenticated API requests
- `expires` indicates when the session becomes invalid
- `user.id` is used to verify ownership of tasks

## API Response Structures

### Single Task Response
```json
{
  "id": 1,
  "title": "Sample task",
  "description": "Task description",
  "completed": false,
  "created_at": "2026-01-20T10:00:00Z",
  "updated_at": "2026-01-20T10:00:00Z",
  "user_id": "user-123"
}
```

### Multiple Tasks Response
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Sample task",
      "description": "Task description",
      "completed": false,
      "created_at": "2026-01-20T10:00:00Z",
      "updated_at": "2026-01-20T10:00:00Z",
      "user_id": "user-123"
    }
  ]
}
```

### Error Response
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## TypeScript Interfaces

### Task Interface
```typescript
export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}
```

### Session Interface
```typescript
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Session {
  user: User;
  token: string;
  expires: string;
}
```