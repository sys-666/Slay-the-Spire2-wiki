<script setup lang="ts">
import { ref } from 'vue'
import PostList from '@/components/PostList.vue'
import TagCloud from '@/components/TagCloud.vue'

const activeTag = ref('')
const activeCategory = ref('')

const categories = ['全部', '技术', '前端', '后端', '生活', '未分类']

function selectCategory(cat: string) {
  activeCategory.value = cat === '全部' ? '' : cat
}

function selectTag(tag: string) {
  activeTag.value = tag
}
</script>

<template>
  <div class="home container">
    <div class="home-layout">
      <aside class="sidebar">
        <div class="category-widget">
          <h3>分类</h3>
          <div class="category-list">
            <span
              v-for="cat in categories"
              :key="cat"
              class="cat-item"
              :class="{ active: (cat === '全部' ? '' : cat) === activeCategory }"
              @click="selectCategory(cat)"
            >
              {{ cat }}
            </span>
          </div>
        </div>
        <TagCloud :active="activeTag" @select="selectTag" />
      </aside>

      <div class="main-content">
        <PostList :category="activeCategory" :tag="activeTag" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.sidebar {
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 76px;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.category-widget {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow);
}

.category-widget h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cat-item {
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 14px;
}
.cat-item:hover { background: var(--hover-bg); }
.cat-item.active {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-weight: 600;
}

@media (max-width: 768px) {
  .sidebar { display: none; }
}
</style>
