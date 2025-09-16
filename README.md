# Task Manager API

A RESTful API for managing tasks built with Node.js and Express.js. This API provides full CRUD (Create, Read, Update, Delete) operations with in-memory data storage, input validation, error handling, and additional features like priority management and filtering.

## Features

- ✅ **CRUD Operations**: Create, read, update, and delete tasks
- ✅ **Input Validation**: Validates task fields (title, description, completed, priority)
- ✅ **Error Handling**: Proper HTTP status codes and error messages
- ✅ **Filtering**: Filter tasks by completion status and priority level
- ✅ **Sorting**: Sort tasks by creation date
- ✅ **Priority Management**: Assign and manage task priorities (low, medium, high)
- ✅ **In-Memory Storage**: Fast, lightweight data storage for development
- ✅ **Comprehensive Testing**: Full test suite included

## Project Structure

```
task-manager-api/
├── app.js              # Main application file
├── package.json        # Project configuration and dependencies
├── task.json          # Sample task data
├── test/
│   └── server.test.js # Test suite
└── README.md          # This file
```

## Setup Instructions

### Prerequisites

- Node.js (version 18 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd task-manager-api-DevAvishArora
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   node app.js
   ```

   The server will start on `http://localhost:3000`

4. **Run tests:**
   ```bash
   npm test
   ```

## API Documentation

### Task Schema

Each task has the following structure:

```json
{
  "id": 1,
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "priority": "medium",
  "createdAt": "2025-09-16T05:52:16.138Z"
}
```

**Field Descriptions:**
- `id` (number): Unique identifier (auto-generated)
- `title` (string): Task title (required, non-empty)
- `description` (string): Task description (required, non-empty)
- `completed` (boolean): Task completion status (default: false)
- `priority` (string): Task priority level - "low", "medium", or "high" (default: "medium")
- `createdAt` (string): ISO timestamp when task was created (auto-generated)

### API Endpoints

#### 1. Get All Tasks
**GET** `/tasks`

Retrieves all tasks with optional filtering and sorting.

**Query Parameters:**
- `completed` (optional): Filter by completion status (`true` or `false`)
- `priority` (optional): Filter by priority level (`low`, `medium`, `high`)
- `sort` (optional): Sort by creation date
  - `createdAt` or `date`: Ascending order (oldest first)
  - `createdAt-desc` or `date-desc`: Descending order (newest first)

**Examples:**
```bash
# Get all tasks
curl http://localhost:3000/tasks

# Get only completed tasks
curl http://localhost:3000/tasks?completed=true

# Get high priority tasks
curl http://localhost:3000/tasks?priority=high

# Get tasks sorted by creation date (newest first)
curl http://localhost:3000/tasks?sort=date-desc

# Combine filters: get incomplete high priority tasks
curl http://localhost:3000/tasks?completed=false&priority=high
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true,
    "priority": "medium",
    "createdAt": "2025-09-16T05:52:16.138Z"
  }
]
```

#### 2. Get Task by ID
**GET** `/tasks/:id`

Retrieves a specific task by its ID.

**Example:**
```bash
curl http://localhost:3000/tasks/1
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true,
  "priority": "medium",
  "createdAt": "2025-09-16T05:52:16.138Z"
}
```

**Error Response:** `404 Not Found`
```json
{
  "error": "Task not found"
}
```

#### 3. Create New Task
**POST** `/tasks`

Creates a new task.

**Request Body:**
```json
{
  "title": "New task title",
  "description": "New task description",
  "completed": false,
  "priority": "high"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Express.js",
    "description": "Complete the Express.js tutorial",
    "completed": false,
    "priority": "high"
  }'
```

**Response:** `201 Created`
```json
{
  "id": 16,
  "title": "Learn Express.js",
  "description": "Complete the Express.js tutorial",
  "completed": false,
  "priority": "high",
  "createdAt": "2025-09-16T06:00:00.000Z"
}
```

**Validation Errors:** `400 Bad Request`
```json
{
  "error": "Title is required and must be a non-empty string"
}
```

#### 4. Update Task
**PUT** `/tasks/:id`

Updates an existing task.

**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated task description",
  "completed": true,
  "priority": "low"
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated title",
    "description": "Updated description",
    "completed": true,
    "priority": "low"
  }'
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Updated title",
  "description": "Updated description",
  "completed": true,
  "priority": "low",
  "createdAt": "2025-09-16T05:52:16.138Z"
}
```

#### 5. Delete Task
**DELETE** `/tasks/:id`

Deletes a task by its ID.

**Example:**
```bash
curl -X DELETE http://localhost:3000/tasks/1
```

**Response:** `200 OK`
```json
{
  "message": "Task deleted successfully",
  "task": {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true,
    "priority": "medium",
    "createdAt": "2025-09-16T05:52:16.138Z"
  }
}
```

#### 6. Get Tasks by Priority
**GET** `/tasks/priority/:level`

Retrieves all tasks with a specific priority level.

**Parameters:**
- `level`: Priority level (`low`, `medium`, `high`)

**Example:**
```bash
curl http://localhost:3000/tasks/priority/high
```

**Response:** `200 OK`
```json
[
  {
    "id": 16,
    "title": "Urgent task",
    "description": "High priority task",
    "completed": false,
    "priority": "high",
    "createdAt": "2025-09-16T06:00:00.000Z"
  }
]
```

### Error Responses

The API returns appropriate HTTP status codes and error messages:

- **400 Bad Request**: Invalid input data or malformed request
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

Example error response:
```json
{
  "error": "Priority must be one of: low, medium, high"
}
```

## Testing

### Running Tests

Run the complete test suite:
```bash
npm test
```

The test suite covers:
- ✅ Creating tasks with valid data
- ✅ Creating tasks with invalid data (validation)
- ✅ Retrieving all tasks
- ✅ Retrieving tasks by ID
- ✅ Retrieving non-existent tasks (404 handling)
- ✅ Updating tasks with valid data
- ✅ Updating tasks with invalid data
- ✅ Updating non-existent tasks
- ✅ Deleting tasks
- ✅ Deleting non-existent tasks

### Manual Testing with curl

You can also test the API manually using curl commands. Here are some examples:

```bash
# 1. Get all tasks
curl http://localhost:3000/tasks

# 2. Create a new task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Task", "description": "Test Description", "priority": "high"}'

# 3. Get a specific task
curl http://localhost:3000/tasks/1

# 4. Update a task
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Task", "description": "Updated Description", "completed": true}'

# 5. Delete a task
curl -X DELETE http://localhost:3000/tasks/1

# 6. Filter tasks by completion status
curl http://localhost:3000/tasks?completed=false

# 7. Filter tasks by priority
curl http://localhost:3000/tasks/priority/high

# 8. Sort tasks by creation date
curl http://localhost:3000/tasks?sort=date-desc
```

### Testing with Postman

1. **Import Collection**: Create a new Postman collection
2. **Set Base URL**: `http://localhost:3000`
3. **Create Requests**: Add requests for each endpoint
4. **Test Scenarios**: Test both valid and invalid inputs

Example Postman requests:
- **GET** `{{baseUrl}}/tasks` - Get all tasks
- **POST** `{{baseUrl}}/tasks` - Create task (with JSON body)
- **GET** `{{baseUrl}}/tasks/1` - Get specific task
- **PUT** `{{baseUrl}}/tasks/1` - Update task (with JSON body)
- **DELETE** `{{baseUrl}}/tasks/1` - Delete task

## Development Notes

### Data Storage
- Uses in-memory storage for simplicity
- Data is lost when the server restarts
- Initial sample data is loaded from `task.json`

### Validation Rules
- **Title**: Required, non-empty string
- **Description**: Required, non-empty string
- **Completed**: Optional boolean (default: false)
- **Priority**: Optional string, must be "low", "medium", or "high" (default: "medium")

### Priority Levels
- **Low**: Non-urgent tasks
- **Medium**: Regular priority tasks (default)
- **High**: Urgent, high-priority tasks

