const express = require('express');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// GET /api/comments?postId=xxx
router.get('/comments', async (req, res) => {
  try {
    const { postId, page = 1, pageSize = 50 } = req.query;

    if (!postId) {
      return res.status(400).json({ message: '缺少 postId 参数' });
    }

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    const [comments, total] = await Promise.all([
      Comment.find({ post: postId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Comment.countDocuments({ post: postId }),
    ]);

    res.json({
      data: comments,
      pagination: {
        page: parseInt(page),
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: '获取评论失败', error: err.message });
  }
});

// POST /api/comments — 创建评论（游客可提交）
router.post('/comments', async (req, res) => {
  try {
    const { postId, author, content } = req.body;

    if (!postId || !author || !content) {
      return res.status(400).json({ message: '请填写完整信息（文章ID、昵称、评论内容）' });
    }

    if (author.trim().length > 20) {
      return res.status(400).json({ message: '昵称不能超过20个字符' });
    }

    if (content.trim().length > 1000) {
      return res.status(400).json({ message: '评论内容不能超过1000个字符' });
    }

    const comment = await Comment.create({
      post: postId,
      author: author.trim(),
      content: content.trim(),
    });

    res.status(201).json({ data: comment });
  } catch (err) {
    res.status(500).json({ message: '发布评论失败', error: err.message });
  }
});

// DELETE /api/comments/:id — 删除评论（需管理员）
router.delete('/comments/:id', auth, admin, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }
    res.json({ message: '评论已删除' });
  } catch (err) {
    res.status(500).json({ message: '删除评论失败', error: err.message });
  }
});

module.exports = router;
