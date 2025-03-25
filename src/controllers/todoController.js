// src/controllers/todoController.js
const Todo = require('../models/todoModel');

/**
 * @desc    Lấy tất cả todos của người dùng hiện tại
 * @route   GET /api/todos
 * @access  Private
 */
exports.getTodos = async (req, res) => {
  try {
    // Chỉ lấy todos của người dùng đang đăng nhập
    const todos = await Todo.find({ user: req.user._id });
    
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy todos',
      error: error.message
    });
  }
};

/**
 * @desc    Lấy một todo theo ID
 * @route   GET /api/todos/:id
 * @access  Private
 */
exports.getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    // Kiểm tra nếu todo tồn tại
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy todo với ID này'
      });
    }

    // Kiểm tra xem todo có thuộc về người dùng hiện tại không
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập todo này'
      });
    }

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    // Kiểm tra lỗi ID không hợp lệ
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID todo không hợp lệ'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Không thể lấy todo',
      error: error.message
    });
  }
};

/**
 * @desc    Tạo todo mới
 * @route   POST /api/todos
 * @access  Private
 */
exports.createTodo = async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    // Validate đầu vào
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tiêu đề cho todo'
      });
    }

    // Tạo todo mới và gán cho user hiện tại
    const todo = await Todo.create({
      title,
      description,
      completed: completed || false,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể tạo todo',
      error: error.message
    });
  }
};

/**
 * @desc    Cập nhật todo
 * @route   PUT /api/todos/:id
 * @access  Private
 */
exports.updateTodo = async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    // Tìm todo theo ID
    let todo = await Todo.findById(req.params.id);

    // Kiểm tra nếu todo tồn tại
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy todo với ID này'
      });
    }

    // Kiểm tra xem todo có thuộc về người dùng hiện tại không
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền cập nhật todo này'
      });
    }

    // Cập nhật todo
    todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { 
        title: title || todo.title,
        description: description !== undefined ? description : todo.description,
        completed: completed !== undefined ? completed : todo.completed
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    // Kiểm tra lỗi ID không hợp lệ
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID todo không hợp lệ'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Không thể cập nhật todo',
      error: error.message
    });
  }
};

/**
 * @desc    Xóa todo
 * @route   DELETE /api/todos/:id
 * @access  Private
 */
exports.deleteTodo = async (req, res) => {
  try {
    // Tìm todo theo ID
    const todo = await Todo.findById(req.params.id);

    // Kiểm tra nếu todo tồn tại
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy todo với ID này'
      });
    }

    // Kiểm tra xem todo có thuộc về người dùng hiện tại không
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa todo này'
      });
    }

    // Xóa todo
    await todo.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Todo đã được xóa thành công'
    });
  } catch (error) {
    // Kiểm tra lỗi ID không hợp lệ
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID todo không hợp lệ'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Không thể xóa todo',
      error: error.message
    });
  }
};

/**
 * @desc    Thay đổi trạng thái hoàn thành của todo
 * @route   PATCH /api/todos/:id/toggle
 * @access  Private
 */
exports.toggleCompleted = async (req, res) => {
  try {
    // Tìm todo theo ID
    let todo = await Todo.findById(req.params.id);

    // Kiểm tra nếu todo tồn tại
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy todo với ID này'
      });
    }

    // Kiểm tra xem todo có thuộc về người dùng hiện tại không
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền cập nhật todo này'
      });
    }

    // Đảo ngược trạng thái completed
    todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed: !todo.completed },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    // Kiểm tra lỗi ID không hợp lệ
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID todo không hợp lệ'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Không thể cập nhật trạng thái todo',
      error: error.message
    });
  }
};

/**
 * @desc    Lấy tất cả todos đã hoàn thành của người dùng hiện tại
 * @route   GET /api/todos/completed
 * @access  Private
 */
exports.getCompletedTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ 
      user: req.user._id,
      completed: true 
    });
    
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy todos đã hoàn thành',
      error: error.message
    });
  }
};

/**
 * @desc    Lấy tất cả todos chưa hoàn thành của người dùng hiện tại
 * @route   GET /api/todos/incomplete
 * @access  Private
 */
exports.getIncompleteTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ 
      user: req.user._id,
      completed: false 
    });
    
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy todos chưa hoàn thành',
      error: error.message
    });
  }
};

/**
 * @desc    Xóa tất cả todos đã hoàn thành của người dùng hiện tại
 * @route   DELETE /api/todos/completed
 * @access  Private
 */
exports.deleteCompletedTodos = async (req, res) => {
  try {
    const result = await Todo.deleteMany({ 
      user: req.user._id,
      completed: true 
    });
    
    res.status(200).json({
      success: true,
      message: `Đã xóa ${result.deletedCount} todos đã hoàn thành`,
      count: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể xóa todos đã hoàn thành',
      error: error.message
    });
  }
};