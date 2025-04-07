const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');
const auth = require('../middleware/auth'); // 这个我们稍后实现

// 所有路由都需要认证
router.use(auth);

// 创建日记
router.post('/', diaryController.createDiary);

// 获取所有公开日记
router.get('/public', diaryController.getAllPublicDiaries);

// 获取我的日记
router.get('/my', diaryController.getMyDiaries);

// 获取单个日记
router.get('/:id', diaryController.getDiary);

// 更新日记
router.put('/:id', diaryController.updateDiary);

// 删除日记
router.delete('/:id', diaryController.deleteDiary);

module.exports = router;