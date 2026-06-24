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
    postType: { type: String, enum: ['character', 'card', 'boss'], default: null, index: true },
    cardSubtype: { type: String, enum: ['attack', 'skill', 'power'], default: null },
    bossFloor: { type: Number, enum: [1, 2, 3], default: null },
    // 类型专属扩展字段
    cost: { type: Number, default: null },          // 卡牌费用
    rarity: { type: String, default: null },         // 卡牌稀有度
    hp: { type: Number, default: null },             // Boss 生命值 / 角色初始血量
    initialRelic: { type: String, default: null },   // 角色初始遗物
    coreMechanic: { type: String, default: null },   // 核心机制简述
  },
  { timestamps: true }
);

postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ category: 1 });
postSchema.index({ isPinned: -1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
