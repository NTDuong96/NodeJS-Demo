// src/routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { protect, checkTodoOwnership } = require('../middleware/authMiddleware');

// Tất cả routes cần auth
router.use(protect);

// Routes
router.route('/')
  .get(todoController.getTodos)
  .post(todoController.createTodo);

router.route('/:id')
  .get(checkTodoOwnership, todoController.getTodoById)
  .put(checkTodoOwnership, todoController.updateTodo)
  .delete(checkTodoOwnership, todoController.deleteTodo);

module.exports = router;