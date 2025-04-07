const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// 获取评论列表（无需登录）
router.get('/', commentController.getComments);

// 需要登录的路由
router.use(auth);

// 创建评论
router.post('/', commentController.createComment);

// 删除评论
router.delete('/:commentId', commentController.deleteComment);

module.exports = router;