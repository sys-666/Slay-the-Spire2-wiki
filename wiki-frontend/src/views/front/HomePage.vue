<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import PostList from '@/components/PostList.vue'
import TagCloud from '@/components/TagCloud.vue'

const activeTag = ref('')
const activeCategory = ref('')
const activePostType = ref('')

const navItems = [
  { value: '', icon: '📋', label: '全部' },
  { value: 'character', icon: '🎮', label: '角色介绍' },
  { value: 'card', icon: '🃏', label: '卡牌介绍' },
  { value: 'boss', icon: '🐉', label: 'Boss介绍' },
]

function selectPostType(val: string) {
  activePostType.value = val
}

function selectTag(tag: string) {
  activeTag.value = activeTag.value === tag ? '' : tag
}

function goBack() {
  activePostType.value = ''
  activeTag.value = ''
  activeCategory.value = ''
}
</script>

<template>
  <div class="home container">
    <div class="home-layout">
      <aside class="sidebar">
        <div class="nav-widget">
          <h3>📖 板块导航</h3>
          <div class="nav-list">
            <div
              v-for="item in navItems"
              :key="item.value"
              class="nav-item"
              :class="{ active: activePostType === item.value }"
              @click="selectPostType(item.value)"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label">{{ item.label }}</span>
            </div>
          </div>
        </div>
        <TagCloud :active="activeTag" @select="selectTag" />
      </aside>

      <div class="main-content">
        <!-- 移动端板块导航 -->
        <div class="mobile-nav">
          <div class="mobile-nav-header">
            <el-button :icon="ArrowLeft" circle size="small" class="back-btn" @click="goBack">返回</el-button>
            <span class="mobile-nav-title">板块导航</span>
          </div>
          <div class="mobile-nav-tabs">
            <div
              v-for="item in navItems"
              :key="item.value"
              class="mobile-nav-item"
              :class="{ active: activePostType === item.value }"
              @click="selectPostType(item.value)"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </div>
        <PostList :category="activeCategory" :tag="activeTag" :post-type="activePostType" />
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

/* 移动端板块导航 — 默认隐藏 */
.mobile-nav {
  display: none;
  margin-bottom: 16px;
  background: var(--bg-card);
  border-radius: 12px;
  padding: 16px;
  box-shadow: var(--shadow);
}

.mobile-nav-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.back-btn {
  flex-shrink: 0;
}

.mobile-nav-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.mobile-nav-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 4px;
}
.mobile-nav-tabs::-webkit-scrollbar {
  display: none;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 13px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  flex-shrink: 0;
}
.mobile-nav-item:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}
.mobile-nav-item.active {
  background: var(--el-color-primary);
  color: #fff;
  font-weight: 600;
}
.mobile-nav-item .nav-icon {
  font-size: 14px;
}

.nav-widget {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow);
}

.nav-widget h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: var(--text-primary);
  user-select: none;
}
.nav-item:hover {
  background: var(--hover-bg);
}
.nav-item.active {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-weight: 600;
}
.nav-icon {
  font-size: 18px;
}

@media (max-width: 768px) {
  .sidebar { display: none; }
  .mobile-nav { display: block; }
}
</style>
