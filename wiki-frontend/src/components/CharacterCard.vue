<script setup lang="ts">
import type { Post } from '@/types'

defineProps<{ character: Post }>()
</script>

<template>
  <article class="character-card" @click="$router.push(`/post/${character._id}`)">
    <div class="character-portrait">
      <img
        :src="character.cover || '/icons.svg'"
        :alt="character.title"
        loading="lazy"
      />
    </div>
    <div class="character-body">
      <h3 class="character-name">{{ character.title }}</h3>
      <div class="character-tags">
        <el-tag v-if="character.hp" type="danger" size="small">❤️ HP {{ character.hp }}</el-tag>
        <el-tag v-if="character.initialRelic" type="warning" size="small" effect="plain">
          {{ character.initialRelic }}
        </el-tag>
      </div>
      <p class="character-mechanic" v-if="character.coreMechanic">
        {{ character.coreMechanic }}
      </p>
      <p class="character-summary" v-if="character.summary">
        {{ character.summary }}
      </p>
    </div>
  </article>
</template>

<style scoped>
.character-card {
  display: flex;
  gap: 20px;
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
}
.character-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
}

.character-portrait {
  width: 200px;
  min-height: 200px;
  flex-shrink: 0;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
}
.character-portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.character-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.character-name {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.character-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.character-mechanic {
  font-size: 14px;
  color: var(--el-color-primary);
  font-weight: 500;
  margin-bottom: 6px;
}

.character-summary {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 540px) {
  .character-card { flex-direction: column; }
  .character-portrait { width: 100%; height: 200px; }
}
</style>
