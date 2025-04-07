const Diary = require('../models/Diary');

// 创建日记
exports.createDiary = async (req, res) => {
  try {
    const { title, content, isPrivate } = req.body;
    const diary = new Diary({
      title,
      content,
      isPrivate,
      author: req.user.id // 这里假设我们已经有了用户认证中间件
    });

    await diary.save();
    res.status(201).json(diary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 获取所有公开日记
exports.getAllPublicDiaries = async (req, res) => {
  try {
    const diaries = await Diary.find({ isPrivate: false })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(diaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 获取用户自己的所有日记
exports.getMyDiaries = async (req, res) => {
  try {
    const diaries = await Diary.find({ author: req.user.id })
      .sort({ createdAt: -1 });
    res.json(diaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 获取单个日记
exports.getDiary = async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.id)
      .populate('author', 'username')
      .populate('comments');
    
    if (!diary) {
      return res.status(404).json({ message: '日记不存在' });
    }

    if (diary.isPrivate && diary.author.toString() !== req.user.id) {
      return res.status(403).json({ message: '无权访问此日记' });
    }

    res.json(diary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 更新日记
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
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 删除日记
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};