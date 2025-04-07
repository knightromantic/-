const Comment = require('../models/Comment');
const Diary = require('../models/Diary');

exports.createComment = async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.diaryId);
    if (!diary) {
      return res.status(404).json({ message: '日记不存在' });
    }

    const comment = new Comment({
      content: req.body.content,
      author: req.user.id,
      diary: req.params.diaryId
    });

    await comment.save();
    await comment.populate('author', 'username');
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: '创建评论失败' });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ diary: req.params.diaryId })
      .populate('author', 'username')
      .sort('-createdAt');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: '获取评论列表失败' });
  }
};

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
    res.json({ message: '评论已删除' });
  } catch (err) {
    res.status(500).json({ message: '删除评论失败' });
  }
};