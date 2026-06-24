<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getPosts } from '@/api/posts'
import type { Post } from '@/types'
import CharacterCard from '@/components/CharacterCard.vue'
import Pagination from '@/components/Pagination.vue'

const characters = ref<Post[]>([])
const loading = ref(false)
const page = ref(1)
const total = ref(0)
const pageSize = 8

async function fetch() {
  loading.value = true
  try {
    const res = await getPosts({
      page: page.value,
      pageSize,
      postType: 'character',
    })
    characters.value = res.data
    total.value = res.pagination.total
  } catch { /* handled */ }
  finally { loading.value = false }
}

function onPageChange(p: number) {
  page.value = p
  fetch()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(fetch)
</script>

<template>
  <div class="character-list container">
    <div class="page-header">
      <h2>🎮 角色介绍</h2>
      <p class="page-desc">《杀戮尖塔2》共有 5 位可玩角色，每位都有独特的机制和玩法风格。</p>
    </div>

    <div v-if="loading" class="loading-state">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      <p>加载中...</p>
    </div>

    <template v-else-if="characters.length">
      <CharacterCard v-for="c in characters" :key="c._id" :character="c" />
      <Pagination :current-page="page" :total="total" :page-size="pageSize" @change="onPageChange" />
    </template>

    <el-empty v-else description="暂无角色数据" />
  </div>
</template>

<style scoped>
.character-list { padding-top: 24px; }

.page-header {
  margin-bottom: 24px;
}
.page-header h2 {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 6px;
}
.page-desc {
  color: var(--text-secondary);
  font-size: 14px;
}

.loading-state {
  text-align: center;
  padding: 80px 0;
  color: var(--text-muted);
}
</style>
