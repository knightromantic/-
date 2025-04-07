const Diary = require('../models/Diary');

exports.createDiary = async (req, res) => {
  try {
    const { title, content, isPrivate } = req.body;
    const diary = new Diary({
      title,
      content,
      isPrivate,
      author: req.user.id
    });
    await diary.save();
    res.status(201).json(diary);
  } catch (err) {
    res.status(500).json({ message: '创建日记失败' });
  }
};

exports.getDiaries = async (req, res) => {
  try {
    const diaries = await Diary.find({
      $or: [
        { author: req.user.id },
        { isPrivate: false }
      ]
    }).populate('author', 'username');
    res.json(diaries);
  } catch (err) {
    res.status(500).json({ message: '获取日记列表失败' });
  }
};

exports.getDiary = async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.id).populate('author', 'username');
    if (!diary) {
      return res.status(404).json({ message: '日记不存在' });
    }
    if (diary.isPrivate && diary.author._id.toString() !== req.user.id) {
      return res.status(403).json({ message: '无权访问此日记' });
    }
    res.json(diary);
  } catch (err) {
    res.status(500).json({ message: '获取日记失败' });
  }
};

exports.updateDiary = async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.id);
    if (!diary) {
      return res.status(404).json({ message: '日记不存在' });
    }
    if (diary.author.toString() !== req.user.id) {
      return res.status(403).json({ message: '无权修改此日记' });
    }
    
    const { title, content, isPrivate } = req.body;
    diary.title = title;
    diary.content = content;
    diary.isPrivate = isPrivate;
    await diary.save();
    
    res.json(diary);
  } catch (err) {
    res.status(500).json({ message: '更新日记失败' });
  }
};

exports.deleteDiary = async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.id);
    if (!diary) {
      return res.status(404).json({ message: '日记不存在' });
    }
    if (diary.author.toString() !== req.user.id) {
      return res.status(403).json({ message: '无权删除此日记' });
    }
    
    await diary.remove();
    res.json({ message: '日记已删除' });
  } catch (err) {
    res.status(500).json({ message: '删除日记失败' });
  }
};