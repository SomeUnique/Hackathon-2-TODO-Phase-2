# Todo Backend Application

This is the backend for the Todo application, built with FastAPI, SQLModel, and Neon PostgreSQL.

## Prerequisites

- Python 3.11+
- pip package manager
- Access to Neon PostgreSQL database
- BETTER_AUTH_SECRET for JWT verification

## Setup Instructions

1. Navigate to the backend directory:
   ```bash
   cd backend/
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   # Create .env file with the following content:
   BETTER_AUTH_SECRET=70tvEiM4SIXNZegpxN5TQRvMiUGePVwU
   DATABASE_URL=postgresql://neondb_owner:npg_8USzj6FdhfkE@ep-delicate-credit-airvucw7-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```

4. Start the development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

## API Endpoints

Once the server is running, you can access the API at `http://localhost:8000`:

- **GET** `/api/tasks` - Retrieve all tasks for the authenticated user
- **POST** `/api/tasks` - Create a new task
- **GET** `/api/tasks/{task_id}` - Retrieve a specific task
- **PUT** `/api/tasks/{task_id}` - Update a task
- **DELETE** `/api/tasks/{task_id}` - Delete a task
- **PATCH** `/api/tasks/{task_id}/complete` - Toggle task completion status

## Authentication

All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Testing the API

You can test the API using curl or a tool like Postman:

```bash
# Get all tasks
curl -H "Authorization: Bearer <valid_jwt_token>" \
     http://localhost:8000/api/tasks

# Create a new task
curl -X POST \
     -H "Authorization: Bearer <valid_jwt_token>" \
     -H "Content-Type: application/json" \
     -d '{"title": "Sample task", "description": "Sample description"}' \
     http://localhost:8000/api/tasks
```

## Swagger UI

Access the interactive API documentation at:
- `http://localhost:8000/docs` - Swagger UI
- `http://localhost:8000/redoc` - ReDoc interface