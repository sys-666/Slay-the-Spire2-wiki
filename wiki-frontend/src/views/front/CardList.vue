<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPosts } from '@/api/posts'
import type { Post } from '@/types'
import CardCard from '@/components/CardCard.vue'
import Pagination from '@/components/Pagination.vue'

const route = useRoute()
const cards = ref<Post[]>([])
const loading = ref(false)
const page = ref(1)
const total = ref(0)
const pageSize = 10

const subTypes = [
  { value: '', label: '全部' },
  { value: 'attack', label: '⚔️ 攻击牌' },
  { value: 'skill', label: '🛡️ 技能牌' },
  { value: 'power', label: '⚡ 能力牌' },
]

const currentSubtype = ref('')

function selectSubtype(subtype: string) {
  currentSubtype.value = subtype
  page.value = 1
  fetch()
}

async function fetch() {
  loading.value = true
  try {
    const params: any = {
      page: page.value,
      pageSize,
      postType: 'card',
    }
    if (currentSubtype.value) {
      params.cardSubtype = currentSubtype.value
    }
    const res = await getPosts(params)
    cards.value = res.data
    total.value = res.pagination.total
  } catch { /* handled */ }
  finally { loading.value = false }
}

function onPageChange(p: number) {
  page.value = p
  fetch()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Sync URL query to state
watch(() => route.query.subtype, (val) => {
  currentSubtype.value = (val as string) || ''
  page.value = 1
  fetch()
}, { immediate: false })

onMounted(() => {
  currentSubtype.value = (route.query.subtype as string) || ''
  fetch()
})
</script>

<template>
  <div class="card-list container">
    <div class="page-header">
      <h2>🃏 卡牌介绍</h2>
      <p class="page-desc">浏览《杀戮尖塔2》中所有角色的卡牌，按类型筛选。</p>
    </div>

    <div class="subtype-tabs">
      <button
        v-for="st in subTypes"
        :key="st.value"
        class="tab-btn"
        :class="{ active: currentSubtype === st.value }"
        @click="selectSubtype(st.value)"
      >
        {{ st.label }}
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      <p>加载中...</p>
    </div>

    <template v-else-if="cards.length">
      <CardCard v-for="card in cards" :key="card._id" :card="card" />
      <Pagination :current-page="page" :total="total" :page-size="pageSize" @change="onPageChange" />
    </template>

    <el-empty v-else description="暂无卡牌数据" />
  </div>
</template>

<style scoped>
.card-list { padding-top: 24px; }

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

.subtype-tabs {
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
