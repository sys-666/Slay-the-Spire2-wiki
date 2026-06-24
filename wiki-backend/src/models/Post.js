const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    summary: { type: String, default: '' },
    cover: { type: String, default: '' },
    category: { type: String, default: '未分类' },
    tags: [{ type: String }],
    isPinned: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    author: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ category: 1 });
postSchema.index({ isPinned: -1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
