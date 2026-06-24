<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getComments } from '@/api/comments'
import { deleteComment } from '@/api/comments'
import type { Comment } from '@/types'
import { getPosts } from '@/api/posts'

const comments = ref<(Comment & { postTitle?: string })[]>([])
const loading = ref(false)

async function fetch() {
  loading.value = true
  try {
    // Fetch recent posts to get their comments
    const postsRes = await getPosts({ pageSize: 100 })
    const postMap = new Map(postsRes.data.map((p: { _id: string; title: string }) => [p._id, p.title]))

    // Fetch comments for each post
    const allComments: (Comment & { postTitle?: string })[] = []
    for (const post of postsRes.data) {
      try {
        const res = await getComments(post._id)
        allComments.push(
          ...res.data.map((c: Comment) => ({ ...c, postTitle: post.title }))
        )
      } catch { /* skip */ }
    }
    comments.value = allComments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  } catch { /* handled */ }
  finally { loading.value = false }
}

async function handleDelete(comment: Comment) {
  try {
    await ElMessageBox.confirm('确定删除该评论？', '确认', { type: 'warning' })
    await deleteComment(comment._id)
    ElMessage.success('评论已删除')
    fetch()
  } catch { /* cancelled */ }
}

onMounted(fetch)
</script>

<template>
  <div class="comment-manage container">
    <h2>评论管理</h2>

    <el-table :data="comments" v-loading="loading" stripe style="width: 100%; margin-top: 16px">
      <el-table-column prop="author" label="评论者" width="120" />
      <el-table-column prop="content" label="内容" min-width="250" show-overflow-tooltip />
      <el-table-column prop="postTitle" label="所属文章" width="200" show-overflow-tooltip />
      <el-table-column label="时间" width="160">
        <template #default="{ row }">{{ row.createdAt?.slice(0, 16).replace('T', ' ') }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.comment-manage { padding-top: 24px; }
.comment-manage h2 { margin-bottom: 8px; }
</style>
