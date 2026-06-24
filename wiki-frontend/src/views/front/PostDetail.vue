<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { getPost } from '@/api/posts'
import { getComments } from '@/api/comments'
import type { Post, Comment } from '@/types'
import CommentList from '@/components/CommentList.vue'
import CommentForm from '@/components/CommentForm.vue'

const route = useRoute()
const post = ref<Post | null>(null)
const comments = ref<Comment[]>([])
const loading = ref(true)

const md = new MarkdownIt({
  html: true,
  linkify: true,
  highlight(str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch { /* fall through */ }
    }
    return ''
  },
})

function renderContent(raw: string): string {
  // If content looks like HTML (from TipTap), render as-is; otherwise treat as markdown
  if (/<[^>]+>/.test(raw)) return raw
  return md.render(raw)
}

async function fetchComments() {
  if (!post.value) return
  try {
    const res = await getComments(post.value._id)
    comments.value = res.data
  } catch { /* ignore */ }
}

onMounted(async () => {
  try {
    const id = route.params.id as string
    const res = await getPost(id)
    post.value = res.data
    await fetchComments()
  } catch { /* handled */ }
  finally { loading.value = false }
})
</script>

<template>
  <div class="post-detail container">
    <div v-if="loading" class="loading">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
    </div>

    <template v-else-if="post">
      <article class="article">
        <header class="article-header">
          <div class="article-tags">
            <el-tag v-if="post.isPinned" type="danger" size="small" effect="dark">置顶</el-tag>
            <el-tag v-if="post.postType === 'character'" type="primary" size="small">👤 角色</el-tag>
            <el-tag v-else-if="post.postType === 'card'" :type="post.cardSubtype === 'attack' ? 'danger' : post.cardSubtype === 'skill' ? 'success' : '' " size="small">
              🃏 卡牌
            </el-tag>
            <el-tag v-else-if="post.postType === 'boss'" type="warning" size="small">🐉 Boss</el-tag>
            <el-tag>{{ post.category }}</el-tag>
            <el-tag v-for="t in post.tags" :key="t" type="info" size="small" effect="plain">{{ t }}</el-tag>
          </div>
          <h1>{{ post.title }}</h1>
          <div class="article-meta">
            <span>{{ post.author }}</span>
            <span>{{ post.createdAt?.slice(0, 10) }}</span>
            <span>👁 {{ post.viewCount }} 次阅读</span>
          </div>

          <!-- Type-specific info bar -->
          <div v-if="post.postType === 'character'" class="info-bar character-bar">
            <div class="info-item" v-if="post.hp">❤️ 初始血量: {{ post.hp }}</div>
            <div class="info-item" v-if="post.initialRelic">🏺 初始遗物: {{ post.initialRelic }}</div>
            <div class="info-item" v-if="post.coreMechanic">⚡ 核心机制: {{ post.coreMechanic }}</div>
          </div>

          <div v-if="post.postType === 'card'" class="info-bar card-bar">
            <div class="info-item cost-badge">💰 费用: {{ post.cost ?? '?' }}</div>
            <div class="info-item">
              类型:
              <span :class="`subtype-${post.cardSubtype}`">
                {{ post.cardSubtype === 'attack' ? '攻击牌' : post.cardSubtype === 'skill' ? '技能牌' : post.cardSubtype === 'power' ? '能力牌' : '-' }}
              </span>
            </div>
            <div class="info-item" v-if="post.rarity">💎 稀有度: {{ post.rarity }}</div>
          </div>

          <div v-if="post.postType === 'boss'" class="info-bar boss-bar">
            <div class="info-item" v-if="post.bossFloor">
              📍 所属层数: 第{{ post.bossFloor }}层
            </div>
            <div class="info-item" v-if="post.hp">❤️ 生命值: {{ post.hp }}</div>
            <div class="info-item" v-if="post.coreMechanic">⚡ 核心机制: {{ post.coreMechanic }}</div>
          </div>

          <img v-if="post.cover" :src="post.cover" :alt="post.title" class="article-cover" />
        </header>

        <div class="article-content content-renderer" v-html="renderContent(post.content)"></div>
      </article>

      <section class="comments-section">
        <h2>评论 ({{ comments.length }})</h2>
        <CommentForm :post-id="post._id" @submitted="fetchComments" />
        <CommentList :comments="comments" />
      </section>
    </template>

    <el-empty v-else description="文章不存在或已被删除" />
  </div>
</template>

<style scoped>
.loading { text-align: center; padding: 100px 0; }

.article {
  max-width: 800px;
  margin: 0 auto;
  background: var(--bg-card);
  border-radius: 12px;
  padding: 32px 40px;
  box-shadow: var(--shadow);
}

.article-header { margin-bottom: 24px; }
.article-tags { display: flex; gap: 8px; margin-bottom: 12px; }
.article-header h1 { font-size: 28px; font-weight: 700; margin-bottom: 12px; }
.article-meta { display: flex; gap: 16px; color: var(--text-muted); font-size: 14px; }
.article-cover { width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px; margin-top: 16px; }

/* Type-specific info bars */
.info-bar {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 12px;
  font-size: 14px;
}
.character-bar {
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1), rgba(64, 158, 255, 0.05));
  border: 1px solid rgba(64, 158, 255, 0.2);
}
.card-bar {
  background: linear-gradient(135deg, rgba(242, 156, 19, 0.1), rgba(242, 156, 19, 0.05));
  border: 1px solid rgba(242, 156, 19, 0.2);
}
.boss-bar {
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.1), rgba(231, 76, 60, 0.05));
  border: 1px solid rgba(231, 76, 60, 0.2);
}
.info-item {
  color: var(--text-secondary);
}
.cost-badge {
  font-weight: 600;
  color: var(--el-color-primary);
}
.subtype-attack { color: #e74c3c; font-weight: 600; }
.subtype-skill { color: #27ae60; font-weight: 600; }
.subtype-power { color: #3498db; font-weight: 600; }

.article-content {
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.comments-section {
  max-width: 800px;
  margin: 32px auto 0;
}
.comments-section h2 { margin-bottom: 16px; }

@media (max-width: 768px) {
  .article { padding: 20px 16px; }
  .article-header h1 { font-size: 22px; }
}
</style>
