<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '@/types'

const props = defineProps<{ card: Post }>()

const subtypeLabel = computed(() => {
  const map: Record<string, string> = {
    attack: '攻击牌',
    skill: '技能牌',
    power: '能力牌',
  }
  return map[props.card.cardSubtype || ''] || ''
})

const subtypeColor = computed(() => {
  const map: Record<string, string> = {
    attack: '#e74c3c',
    skill: '#27ae60',
    power: '#3498db',
  }
  return map[props.card.cardSubtype || ''] || '#666'
})

const rarityColor = computed(() => {
  const map: Record<string, string> = {
    '基础': '#999',
    '普通': '#999',
    '罕见': '#3498db',
    '稀有': '#f39c12',
    '金卡': '#f39c12',
  }
  return map[props.card.rarity || ''] || '#999'
})
</script>

<template>
  <article
    class="card-card"
    :style="{ borderLeftColor: subtypeColor }"
    @click="$router.push(`/post/${card._id}`)"
  >
    <div class="card-cost" :style="{ background: subtypeColor }">
      <span class="cost-num">{{ card.cost ?? '?' }}</span>
      <span class="cost-label">费</span>
    </div>
    <div class="card-body">
      <div class="card-header">
        <h3 class="card-name">{{ card.title }}</h3>
        <div class="card-badges">
          <span class="subtype-badge" :style="{ background: subtypeColor }">
            {{ subtypeLabel }}
          </span>
          <span v-if="card.rarity" class="rarity-badge" :style="{ color: rarityColor, borderColor: rarityColor }">
            {{ card.rarity }}
          </span>
        </div>
      </div>
      <p class="card-category" v-if="card.category">{{ card.category }}</p>
      <p class="card-summary" v-if="card.summary">{{ card.summary }}</p>
      <div class="card-mechanic" v-if="card.coreMechanic">
        {{ card.coreMechanic }}
      </div>
    </div>
  </article>
</template>

<style scoped>
.card-card {
  display: flex;
  background: var(--bg-card);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: var(--shadow);
  margin-bottom: 12px;
  border-left: 5px solid;
}
.card-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.card-cost {
  width: 64px;
  min-height: 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.cost-num {
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
}
.cost-label {
  font-size: 12px;
  margin-top: 2px;
}

.card-body {
  padding: 14px 18px;
  flex: 1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.card-name {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
}

.card-badges {
  display: flex;
  gap: 6px;
}

.subtype-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  color: #fff;
}

.rarity-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  border: 1px solid;
}

.card-category {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.card-summary {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.card-mechanic {
  margin-top: 8px;
  font-size: 13px;
  color: var(--el-color-primary);
  padding: 6px 10px;
  background: var(--el-color-primary-light-9);
  border-radius: 6px;
}
</style>
