# Data Model: Backend Todo Application

## Task Entity

### Fields
- **id**: Integer, Primary Key, Auto-increment
- **user_id**: String, Foreign Key reference to users.id (from JWT), Not Null
- **title**: String, Max Length 200, Not Null
- **description**: String, Max Length 1000, Nullable
- **completed**: Boolean, Default False
- **created_at**: DateTime, Default datetime.utcnow
- **updated_at**: DateTime, Default datetime.utcnow, Updates on modification

### Relationships
- **user_id** references users.id from Better Auth (assumed to exist)

### Validation Rules
- title: Required, max 200 characters
- description: Optional, max 1000 characters
- completed: Boolean value (true/false)
- user_id: Must match authenticated user's ID for access

### State Transitions
- **created**: When POST /api/tasks is called successfully
- **updated**: When PUT /api/tasks/{task_id} is called successfully
- **completed**: When PATCH /api/tasks/{task_id}/complete is called (toggles current state)
- **deleted**: When DELETE /api/tasks/{task_id} is called successfully

## Pydantic Models

### TaskCreate
- **title**: Required string (max 200)
- **description**: Optional string (max 1000)

### TaskUpdate
- **title**: Optional string (max 200)
- **description**: Optional string (max 1000)

### TaskRead
- **id**: Integer
- **user_id**: String (excluded in API responses for security)
- **title**: String
- **description**: String or None
- **completed**: Boolean
- **created_at**: DateTime string (ISO format)
- **updated_at**: DateTime string (ISO format)