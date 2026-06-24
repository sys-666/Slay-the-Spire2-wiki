<script setup lang="ts">
defineProps<{
  currentPage: number
  total: number
  pageSize: number
}>()
defineEmits<{ change: [page: number] }>()
</script>

<template>
  <div class="pagination-wrapper" v-if="total > pageSize">
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
      background
      @current-change="(p: number) => $emit('change', p)"
    />
  </div>
</template>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
</style>
