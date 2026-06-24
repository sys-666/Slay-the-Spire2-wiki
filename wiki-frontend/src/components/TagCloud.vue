<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPosts } from '@/api/posts'

const tags = ref<{ name: string; count: number }[]>([])

defineEmits<{ select: [tag: string] }>()
const props = defineProps<{ active?: string }>()

onMounted(async () => {
  try {
    // Fetch all posts to aggregate tags
    const res = await getPosts({ pageSize: 1000 })
    const tagMap = new Map<string, number>()
    res.data.forEach((post: { tags?: string[] }) => {
      post.tags?.forEach((t) => tagMap.set(t, (tagMap.get(t) || 0) + 1))
    })
    tags.value = Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 30)
  } catch { /* ignore */ }
})
</script>

<template>
  <div class="tag-cloud">
    <h3 class="tag-title">标签云</h3>
    <div class="tags">
      <span
        v-for="tag in tags"
        :key="tag.name"
        class="tag-item"
        :class="{ active: tag.name === active }"
        @click="$emit('select', tag.name)"
      >
        {{ tag.name }} ({{ tag.count }})
      </span>
    </div>
  </div>
</template>

<style scoped>
.tag-cloud {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow);
}

.tag-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: inline-block;
  padding: 4px 12px;
  background: var(--bg-secondary);
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
  color: var(--text-secondary);
}
.tag-item:hover {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
.tag-item.active {
  background: var(--el-color-primary);
  color: #fff;
}
</style>
