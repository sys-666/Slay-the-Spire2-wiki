<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPosts } from '@/api/posts'
import type { Post } from '@/types'
import BossCard from '@/components/BossCard.vue'
import Pagination from '@/components/Pagination.vue'

const route = useRoute()
const bosses = ref<Post[]>([])
const loading = ref(false)
const page = ref(1)
const total = ref(0)
const pageSize = 10

const floors = [
  { value: '', label: '全部' },
  { value: '1', label: '🌿 第一层' },
  { value: '2', label: '🐝 第二层' },
  { value: '3', label: '👑 第三层' },
]

const currentFloor = ref('')

function selectFloor(floor: string) {
  currentFloor.value = floor
  page.value = 1
  fetch()
}

async function fetch() {
  loading.value = true
  try {
    const params: any = {
      page: page.value,
      pageSize,
      postType: 'boss',
    }
    if (currentFloor.value) {
      params.bossFloor = currentFloor.value
    }
    const res = await getPosts(params)
    bosses.value = res.data
    total.value = res.pagination.total
  } catch { /* handled */ }
  finally { loading.value = false }
}

function onPageChange(p: number) {
  page.value = p
  fetch()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(() => route.query.floor, (val) => {
  currentFloor.value = (val as string) || ''
  page.value = 1
  fetch()
}, { immediate: false })

onMounted(() => {
  currentFloor.value = (route.query.floor as string) || ''
  fetch()
})
</script>

<template>
  <div class="boss-list container">
    <div class="page-header">
      <h2>🐉 Boss 介绍</h2>
      <p class="page-desc">《杀戮尖塔2》每层关底的 Boss 图鉴，了解它们的机制和应对策略。</p>
    </div>

    <div class="floor-tabs">
      <button
        v-for="f in floors"
        :key="f.value"
        class="tab-btn"
        :class="{ active: currentFloor === f.value }"
        @click="selectFloor(f.value)"
      >
        {{ f.label }}
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      <p>加载中...</p>
    </div>

    <template v-else-if="bosses.length">
      <BossCard v-for="boss in bosses" :key="boss._id" :boss="boss" />
      <Pagination :current-page="page" :total="total" :page-size="pageSize" @change="onPageChange" />
    </template>

    <el-empty v-else description="暂无Boss数据" />
  </div>
</template>

<style scoped>
.boss-list { padding-top: 24px; }

.page-header {
  margin-bottom: 20px;
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

.floor-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
  background: var(--bg-card);
  padding: 6px;
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.tab-btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}
.tab-btn.active {
  background: var(--el-color-primary);
  color: #fff;
  font-weight: 600;
}

.loading-state {
  text-align: center;
  padding: 80px 0;
  color: var(--text-muted);
}
</style>
