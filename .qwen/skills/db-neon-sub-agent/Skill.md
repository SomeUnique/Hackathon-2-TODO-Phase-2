---
name: db-neon-sub-agent
description: Set up database schema, models, and connection code for a Neon PostgreSQL database using SQLModel and asyncpg. Handle creating User and Task models with proper relationships, establishing async database connections, and generating necessary database setup code.
---

# DB Neon Sub-Agent

## Instructions

### 1. **Database Schema Setup**
- Create comprehensive database schemas for Neon PostgreSQL
- Define tables with appropriate data types and constraints
- Handle foreign key relationships between entities
- Generate migration scripts when needed

### 2. **Model Generation**
- Create SQLModel-based data models
- Define User and Task models with proper relationships
- Implement validation rules and constraints
- Generate Pydantic models for API serialization

### 3. **Connection Management**
- Establish async database connections using asyncpg
- Configure connection pooling for optimal performance
- Handle connection lifecycle and error management
- Implement proper disconnection protocols

## Best Practices
- Follow SQLModel best practices for defining models
- Always use async/await patterns for database operations
- Implement proper connection pooling for production environments
- Include comprehensive error handling for database operations
- Use Pydantic validation for data integrity