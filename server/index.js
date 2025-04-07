const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const diaryRoutes = require('./src/routes/diaryRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const authRoutes = require('./src/routes/authRoutes');

// 加载环境变量
dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 连接数据库
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/diary-app')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 基础路由
app.get('/', (req, res) => {
  res.json({ message: 'Diary API is running' });
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/diaries/:diaryId/comments', commentRoutes);
app.use('/api/diaries', diaryRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

// 处理 404
app.use((req, res) => {
  res.status(404).json({ message: '请求的资源不存在' });
});

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});