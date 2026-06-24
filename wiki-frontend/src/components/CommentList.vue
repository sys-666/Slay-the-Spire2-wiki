<script setup lang="ts">
import type { Comment } from '@/types'

defineProps<{ comments: Comment[] }>()
</script>

<template>
  <div class="comment-list">
    <div v-if="comments.length === 0" class="empty">暂无评论，来抢沙发吧~</div>
    <div v-for="c in comments" :key="c._id" class="comment-item">
      <div class="comment-avatar">{{ c.author.charAt(0) }}</div>
      <div class="comment-body">
        <div class="comment-header">
          <span class="comment-author">{{ c.author }}</span>
          <span class="comment-time">{{ c.createdAt?.slice(0, 16).replace('T', ' ') }}</span>
        </div>
        <p class="comment-content">{{ c.content }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-list { margin-top: 24px; }

.empty {
  text-align: center;
  color: var(--text-muted);
  padding: 32px 0;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--el-color-primary-light-5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.comment-body { flex: 1; }

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.comment-author { font-weight: 600; }

.comment-time {
  font-size: 12px;
  color: var(--text-muted);
}

.comment-content {
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>
