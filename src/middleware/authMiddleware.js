// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Kiểm tra header có authorization bearer token không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Nếu không có token
    if (!token) {
      return res.status(401).json({ message: 'Không được phép truy cập, hãy đăng nhập' });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Gán thông tin user vào request
      req.user = await User.findById(decoded.id);
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware kiểm tra quyền sở hữu todo
exports.checkTodoOwnership = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ message: 'Không tìm thấy todo' });
    }
    
    // Kiểm tra nếu user id trong todo khớp với id của user đang đăng nhập
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Không có quyền thực hiện hành động này' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware cho admin role (nếu muốn mở rộng)
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Chỉ admin mới có quyền truy cập' });
  }
};