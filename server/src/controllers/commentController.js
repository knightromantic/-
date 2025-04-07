const Comment = require('../models/Comment');
const Diary = require('../models/Diary');

// 获取日记的所有评论
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ diary: req.params.diaryId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 创建评论
exports.createComment = async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.diaryId);
    if (!diary) {
      return res.status(404).json({ message: '日记不存在' });
    }

    if (diary.isPrivate && diary.author.toString() !== req.user.id) {
      return res.status(403).json({ message: '无权评论此日记' });
    }

    const comment = new Comment({
      content: req.body.content,
      author: req.user.id,
      diary: req.params.diaryId
    });

    await comment.save();
    await diary.updateOne({ $push: { comments: comment._id } });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 删除评论
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: '无权删除此评论' });
    }

    await comment.remove();
    await Diary.findByIdAndUpdate(comment.diary, {
      $pull: { comments: comment._id }
    });

    res.json({ message: '评论已删除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};