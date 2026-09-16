# 📝 Todo List API

An asynchronous RESTful **Todo List API** built with **FastAPI** and **SQLAlchemy**.  
It provides user registration, JWT authentication, and full CRUD operations for managing personal todo items with isolated user access.

This project is inspired by the [roadmap.sh Todo List API project](https://roadmap.sh/projects/todo-list-api).

---

## 📂 Project Structure

```text
todo-api/
│
├── app/
│   ├── api/
│   │   ├── deps.py              # Dependencies (get_db, get_current_user, OAuth2)
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── auth.py      # Authentication routes (register, login)
│   │       │   └── todos.py     # Todo CRUD routes
│   │       └── router.py        # V1 Router aggregation
│   │
│   ├── core/
│   │   ├── config.py            # Pydantic environment settings
│   │   ├── database.py          # Async SQLAlchemy engine & session factory
│   │   └── security.py          # Password hashing (bcrypt) & JWT handling
│   │
│   ├── models/                  # SQLAlchemy ORM models (User, Todo)
│   ├── schemas/                 # Pydantic schemas for request validation
│   └── main.py                  # FastAPI application entry point
│
├── .env                         # Environment variables
├── requirements.txt             # Dependencies
└── todo_app.db                  # SQLite Database file
```
---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone [https://github.com/yourusername/todo-api.git](https://github.com/yourusername/todo-api.git)
cd todo-api
```

### 2. Create virtual environment

```bash
python -m venv venv
venv\Scripts\activate     # Windows (CMD/Git Bash)
source venv/bin/activate   # Linux/Mac
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables
Create a .env file in the root directory:

```code
PROJECT_NAME="Todo List API"
API_V1_STR="/api/v1"
SECRET_KEY="replace_with_your_64_character_generated_secret_key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=10080
DATABASE_URL="sqlite+aiosqlite:///./todo_app.db"
```

### 5. Start the app

```bash
uvicorn app.main:app --reload
```

### Access Interactive Documentation

- Swagger UI: http://127.0.0.1:8000/docs

- ReDoc: http://127.0.0.1:8000/redoc

---

## 🌐 API Endpoints

### 🔑 Authentication

| Method | Endpoint                  | Description                                   |
|--------|---------------------------|-----------------------------------------------|
| POST   | /api/v1/auth/register     | Register a new user account                   |
| POST   | /api/v1/auth/login        | Authenticate user and receive JWT access token |

### 📋 Todos (Requires Bearer Token)

| Method | Endpoint            | Description                               |
|--------|---------------------|-------------------------------------------|
| GET    | /api/v1/todos/      | List all todos for the authenticated user |
| POST   | /api/v1/todos/      | Create a new todo                         |
| GET    | /api/v1/todos/{id}  | Get details of a specific todo            |
| PUT    | /api/v1/todos/{id}  | Update an existing todo                   |
| DELETE | /api/v1/todos/{id}  | Delete a todo                             |

### 📦 Sample JSON Response
GET /api/v1/todos/1

```JSON
{
  "id": 1,
  "title": "Complete Backend API",
  "description": "Finalize FastAPI endpoints and test CRUD operations.",
  "is_completed": true,
  "user_id": 1,
  "created_at": "2026-08-15T12:31:51.596000",
  "updated_at": "2026-08-15T12:35:35.691000"
}
```
---

## 🛡 Features

- 🔐 Authentication & Security: JWT access token generation and raw bcrypt password hashing.

- ⚡ Asynchronous Operations: Fully non-blocking database queries powered by SQLAlchemy 2.0 and aiosqlite.

- 🔒 Data Isolation: Strict user scoping ensures users can only view, edit, or delete their own todos.

- 📖 Automated OpenAPI Docs: Interactive Swagger UI and ReDoc interface generated directly from FastAPI models.