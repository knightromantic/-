const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', diaryController.createDiary);
router.get('/', diaryController.getDiaries);
router.get('/:id', diaryController.getDiary);
router.put('/:id', diaryController.updateDiary);
router.delete('/:id', diaryController.deleteDiary);

module.exports = router;