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
            <el-tag>{{ post.category }}</el-tag>
            <el-tag v-for="t in post.tags" :key="t" type="info" size="small" effect="plain">{{ t }}</el-tag>
          </div>
          <h1>{{ post.title }}</h1>
          <div class="article-meta">
            <span>{{ post.author }}</span>
            <span>{{ post.createdAt?.slice(0, 10) }}</span>
            <span>👁 {{ post.viewCount }} 次阅读</span>
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
