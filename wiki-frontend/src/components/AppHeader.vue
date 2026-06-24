<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Sunny, Moon } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const auth = useAuthStore()
const theme = useThemeStore()

const keyword = ref('')

function handleSearch() {
  if (keyword.value.trim()) {
    router.push({ name: 'search', query: { q: keyword.value.trim() } })
  }
}
</script>

<template>
  <header class="app-header">
    <div class="header-inner container">
      <router-link to="/" class="logo">🗡️ 杀戮尖塔2 Wiki</router-link>

      <div class="header-search">
        <el-input
          v-model="keyword"
          placeholder="搜索文章..."
          size="default"
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #suffix>
            <el-icon class="search-icon" @click="handleSearch"><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <div class="header-actions">
        <el-button :icon="theme.isDark ? Sunny : Moon" circle @click="theme.toggle()" />

        <template v-if="auth.isAdmin">
          <el-button type="primary" @click="router.push('/admin')">管理后台</el-button>
          <el-button @click="auth.logout(); router.push('/')">退出</el-button>
        </template>
        <template v-else>
          <el-button @click="router.push('/admin/login')">登录</el-button>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--header-bg);
  border-bottom: 1px solid var(--header-border);
  padding: 0 16px;
  height: 60px;
  display: flex;
  align-items: center;
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  text-decoration: none;
}

.header-search {
  flex: 1;
  max-width: 400px;
}

.search-icon {
  cursor: pointer;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

@media (max-width: 768px) {
  .header-search {
    display: none;
  }
  .logo {
    font-size: 16px;
  }
}
</style>
