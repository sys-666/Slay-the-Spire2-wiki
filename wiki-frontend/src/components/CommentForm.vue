<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { createComment } from '@/api/comments'

const props = defineProps<{ postId: string }>()
const emit = defineEmits<{ submitted: [] }>()

const author = ref('')
const content = ref('')
const loading = ref(false)

async function submit() {
  if (!author.value.trim()) return ElMessage.warning('请输入昵称')
  if (!content.value.trim()) return ElMessage.warning('请输入评论内容')

  loading.value = true
  try {
    await createComment({
      postId: props.postId,
      author: author.value.trim(),
      content: content.value.trim(),
    })
    ElMessage.success('评论发布成功')
    content.value = ''
    emit('submitted')
  } catch { /* handled */ }
  finally { loading.value = false }
}
</script>

<template>
  <div class="comment-form">
    <h3>发表评论</h3>
    <el-input v-model="author" placeholder="你的昵称" maxlength="20" show-word-limit style="margin-bottom: 12px" />
    <el-input
      v-model="content"
      type="textarea"
      :rows="3"
      placeholder="写下你的想法..."
      maxlength="1000"
      show-word-limit
    />
    <el-button type="primary" :loading="loading" @click="submit" style="margin-top: 12px">
      发布评论
    </el-button>
  </div>
</template>

<style scoped>
.comment-form {
  margin-top: 32px;
  padding: 20px;
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: var(--shadow);
}
.comment-form h3 {
  margin-bottom: 16px;
}
</style>
