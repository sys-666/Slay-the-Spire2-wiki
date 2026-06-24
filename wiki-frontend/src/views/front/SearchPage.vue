<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PostList from '@/components/PostList.vue'

const route = useRoute()
const keyword = ref((route.query.q as string) || '')

watch(() => route.query.q, (val) => {
  keyword.value = (val as string) || ''
})
</script>

<template>
  <div class="search-page container">
    <div class="search-header">
      <h2>搜索"{{ keyword }}"的结果</h2>
    </div>
    <PostList :key="keyword" :keyword="keyword" />
  </div>
</template>

<style scoped>
.search-header {
  margin-bottom: 24px;
}
.search-header h2 {
  font-size: 20px;
}
</style>
