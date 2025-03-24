const express = require('express');
const { 
  getAllTodos, 
  getTodo, 
  createTodo, 
  updateTodo, 
  deleteTodo 
} = require('../controllers/todoController');

const router = express.Router();

router
  .route('/')
  .get(getAllTodos)
  .post(createTodo);

router
  .route('/:id')
  .get(getTodo)
  .put(updateTodo)
  .delete(deleteTodo);

module.exports = router;