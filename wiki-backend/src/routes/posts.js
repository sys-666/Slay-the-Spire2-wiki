const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// GET /api/posts — 分页 + 分类筛选 + 关键词搜索
router.get('/posts', async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      category,
      keyword,
    } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (keyword) {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { content: { $regex: escaped, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content')
        .lean(),
      Post.countDocuments(filter),
    ]);

    res.json({
      data: posts,
      pagination: {
        page: parseInt(page),
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: '获取文章列表失败', error: err.message });
  }
});

// GET /api/posts/:id — 文章详情（阅读量 +1）
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).lean();

    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    res.json({ data: post });
  } catch (err) {
    res.status(500).json({ message: '获取文章详情失败', error: err.message });
  }
});

// POST /api/posts — 创建文章（需管理员）
router.post('/posts', auth, admin, async (req, res) => {
  try {
    const { title, content, summary, cover, category, tags } = req.body;
    if (!title) {
      return res.status(400).json({ message: '标题不能为空' });
    }

    const post = await Post.create({
      title,
      content: content || '',
      summary: summary || '',
      cover: cover || '',
      category: category || '未分类',
      tags: tags || [],
      author: req.user.username,
    });

    res.status(201).json({ data: post });
  } catch (err) {
    res.status(500).json({ message: '创建文章失败', error: err.message });
  }
});

// PUT /api/posts/:id — 编辑文章（需管理员）
router.put('/posts/:id', auth, admin, async (req, res) => {
  try {
    const { title, content, summary, cover, category, tags, isPinned } = req.body;

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, summary, cover, category, tags, isPinned },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    res.json({ data: post });
  } catch (err) {
    res.status(500).json({ message: '更新文章失败', error: err.message });
  }
});

// DELETE /api/posts/:id — 删除文章（需管理员）
router.delete('/posts/:id', auth, admin, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // Also delete associated comments
    const Comment = require('../models/Comment');
    await Comment.deleteMany({ post: req.params.id });

    res.json({ message: '文章已删除' });
  } catch (err) {
    res.status(500).json({ message: '删除文章失败', error: err.message });
  }
});

module.exports = router;
