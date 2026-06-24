<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '@/types'

const props = defineProps<{ boss: Post }>()

const floorLabel = computed(() => {
  const map: Record<number, string> = {
    1: '🌿 第一层',
    2: '🐝 第二层',
    3: '👑 第三层',
  }
  return map[props.boss.bossFloor || 0] || ''
})

const floorColor = computed(() => {
  const map: Record<number, string> = {
    1: '#27ae60',
    2: '#f39c12',
    3: '#e74c3c',
  }
  return map[props.boss.bossFloor || 0] || '#666'
})
</script>

<template>
  <article
    class="boss-card"
    :style="{ borderTopColor: floorColor }"
    @click="$router.push(`/post/${boss._id}`)"
  >
    <div class="boss-body">
      <div class="boss-header">
        <h3 class="boss-name">{{ boss.title }}</h3>
        <span class="floor-badge" :style="{ background: floorColor }">
          {{ floorLabel }}
        </span>
      </div>
      <div class="boss-stats">
        <span v-if="boss.hp" class="boss-hp">❤️ HP {{ boss.hp }}</span>
        <span v-if="boss.coreMechanic" class="boss-mechanic">
          ⚡ {{ boss.coreMechanic }}
        </span>
      </div>
      <p class="boss-summary" v-if="boss.summary">{{ boss.summary }}</p>
      <div v-if="boss.cover" class="boss-cover">
        <img :src="boss.cover" :alt="boss.title" loading="lazy" />
      </div>
    </div>
  </article>
</template>

<style scoped>
.boss-card {
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: var(--shadow);
  margin-bottom: 16px;
  border-top: 4px solid;
}
.boss-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.boss-body {
  padding: 18px 20px;
}

.boss-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.boss-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.floor-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: #fff;
  font-weight: 600;
}

.boss-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
  font-size: 14px;
  flex-wrap: wrap;
}

.boss-hp {
  color: #e74c3c;
  font-weight: 600;
}

.boss-mechanic {
  color: var(--el-color-primary);
  font-weight: 500;
}

.boss-summary {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 10px;
}

.boss-cover {
  max-height: 160px;
  overflow: hidden;
  border-radius: 8px;
}
.boss-cover img {
  width: 100%;
  object-fit: cover;
}
</style>
