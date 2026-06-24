<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getPosts } from '@/api/posts'
import type { Post } from '@/types'
import PostCard from './PostCard.vue'
import Pagination from './Pagination.vue'

const props = defineProps<{
  category?: string
  keyword?: string
  tag?: string
}>()

const posts = ref<Post[]>([])
const loading = ref(false)
const page = ref(1)
const total = ref(0)
const pageSize = 12

async function fetch() {
  loading.value = true
  try {
    const res = await getPosts({
      page: page.value,
      pageSize,
      category: props.category,
      keyword: props.keyword,
    })
    posts.value = res.data
    total.value = res.pagination.total
  } catch { /* handled by interceptor */ }
  finally { loading.value = false }
}

watch(() => [props.category, props.keyword, props.tag], () => {
  page.value = 1
  fetch()
})

function onPageChange(p: number) {
  page.value = p
  fetch()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(fetch)

defineExpose({ refresh: fetch })
</script>

<template>
  <div class="post-list">
    <div v-if="loading" class="loading-state">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      <p>加载中...</p>
    </div>

    <template v-else-if="posts.length">
      <PostCard v-for="post in posts" :key="post._id" :post="post" />
      <Pagination :current-page="page" :total="total" :page-size="pageSize" @change="onPageChange" />
    </template>

    <el-empty v-else description="暂无文章" />
  </div>
</template>

<style scoped>
.loading-state {
  text-align: center;
  padding: 80px 0;
  color: var(--text-muted);
}
</style>
