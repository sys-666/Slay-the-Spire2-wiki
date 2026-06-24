<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import AppHeader from '@/components/AppHeader.vue'

const theme = useThemeStore()
</script>

<template>
  <el-config-provider :locale="undefined">
    <AppHeader />
    <main class="page-container">
      <router-view />
    </main>
  </el-config-provider>
</template>
