<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPosts, deletePost, updatePost } from '@/api/posts'
import type { Post } from '@/types'

const router = useRouter()
const posts = ref<Post[]>([])
const loading = ref(false)
const page = ref(1)
const total = ref(0)
const pageSize = 10

async function fetch() {
  loading.value = true
  try {
    const res = await getPosts({ page: page.value, pageSize })
    posts.value = res.data
    total.value = res.pagination.total
  } catch { /* handled */ }
  finally { loading.value = false }
}

async function togglePin(post: Post) {
  try {
    await updatePost(post._id, { isPinned: !post.isPinned })
    ElMessage.success(post.isPinned ? '已取消置顶' : '已置顶')
    fetch()
  } catch { /* handled */ }
}

async function handleDelete(post: Post) {
  try {
    await ElMessageBox.confirm(`确定删除"${post.title}"？此操作不可恢复。`, '警告', {
      type: 'warning',
      confirmButtonText: '删除',
    })
    await deletePost(post._id)
    ElMessage.success('文章已删除')
    fetch()
  } catch { /* cancelled or error */ }
}

onMounted(fetch)
</script>

<template>
  <div class="dashboard container">
    <div class="dash-header">
      <h2>文章管理</h2>
      <el-button type="primary" @click="router.push('/admin/post/new')">+ 发布文章</el-button>
    </div>

    <el-table :data="posts" v-loading="loading" stripe style="width: 100%">
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column prop="category" label="分类" width="100" />
      <el-table-column label="类型" width="80">
        <template #default="{ row }">
          <el-tag v-if="row.postType === 'character'" type="primary" size="small">角色</el-tag>
          <el-tag v-else-if="row.postType === 'card'" type="success" size="small">卡牌</el-tag>
          <el-tag v-else-if="row.postType === 'boss'" type="warning" size="small">Boss</el-tag>
          <span v-else class="text-muted">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者" width="100" />
      <el-table-column label="置顶" width="70">
        <template #default="{ row }">
          <el-tag v-if="row.isPinned" type="danger" size="small">是</el-tag>
          <span v-else class="text-muted">-</span>
        </template>
      </el-table-column>
      <el-table-column label="阅读" width="80">
        <template #default="{ row }">{{ row.viewCount }}</template>
      </el-table-column>
      <el-table-column label="时间" width="120">
        <template #default="{ row }">{{ row.createdAt?.slice(0, 10) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="router.push(`/post/${row._id}`)">查看</el-button>
          <el-button size="small" type="warning" @click="router.push(`/admin/post/${row._id}/edit`)">编辑</el-button>
          <el-button size="small" type="info" @click="togglePin(row)">{{ row.isPinned ? '取消' : '置顶' }}</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="dash-pagination" v-if="total > pageSize">
      <el-pagination
        v-model:current-page="page"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        background
        @current-change="fetch"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard { padding-top: 24px; }

.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.text-muted { color: var(--text-muted); }

.dash-pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
</style>
