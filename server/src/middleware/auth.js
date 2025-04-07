const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 获取 token
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: '无访问权限' });
  }

  try {
    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: '无效的 token' });
  }
};