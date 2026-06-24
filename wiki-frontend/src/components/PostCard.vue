<script setup lang="ts">
import type { Post } from '@/types'

defineProps<{ post: Post }>()
</script>

<template>
  <article class="post-card" @click="$router.push(`/post/${post._id}`)">
    <div class="post-card-cover" v-if="post.cover">
      <img :src="post.cover" :alt="post.title" loading="lazy" />
    </div>
    <div class="post-card-body">
      <div class="post-card-header">
        <el-tag v-if="post.isPinned" type="danger" size="small" effect="dark">置顶</el-tag>
        <el-tag size="small">{{ post.category }}</el-tag>
      </div>
      <h2 class="post-card-title">{{ post.title }}</h2>
      <p class="post-card-summary" v-if="post.summary">{{ post.summary }}</p>
      <div class="post-card-meta">
        <span>{{ post.createdAt?.slice(0, 10) }}</span>
        <span>{{ post.author }}</span>
        <span>👁 {{ post.viewCount }}</span>
      </div>
      <div class="post-card-tags" v-if="post.tags?.length">
        <el-tag v-for="tag in post.tags" :key="tag" size="small" type="info" effect="plain">{{ tag }}</el-tag>
      </div>
    </div>
  </article>
</template>

<style scoped>
.post-card {
  display: flex;
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: var(--shadow);
  margin-bottom: 16px;
}
.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.post-card-cover {
  width: 240px;
  min-height: 160px;
  flex-shrink: 0;
  overflow: hidden;
}
.post-card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-card-body {
  padding: 16px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-card-header {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.post-card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card-summary {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.post-card-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--text-muted);
}

.post-card-tags {
  margin-top: 8px;
  display: flex;
  gap: 6px;
}

@media (max-width: 640px) {
  .post-card {
    flex-direction: column;
  }
  .post-card-cover {
    width: 100%;
    height: 180px;
  }
}
</style>
