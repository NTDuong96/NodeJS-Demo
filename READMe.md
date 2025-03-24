# Todo List API

A RESTful API for managing a todo list built with Node.js, Express, and MongoDB.

## Features

- CRUD operations for todo items
- MongoDB database integration
- RESTful API design

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
4. Run in development: `npm run dev`
5. Run in production: `npm start`

## API Endpoints

| Method | Endpoint     | Description          |
|--------|--------------|----------------------|
| GET    | /api/todos   | Get all todos        |
| POST   | /api/todos   | Create a new todo    |
| GET    | /api/todos/:id | Get a specific todo |
| PUT    | /api/todos/:id | Update a todo       |
| DELETE | /api/todos/:id | Delete a todo       |