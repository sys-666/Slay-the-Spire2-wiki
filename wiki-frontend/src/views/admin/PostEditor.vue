<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createPost, updatePost, getPost } from '@/api/posts'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const isEdit = !!route.params.id
const saving = ref(false)
const coverUploading = ref(false)

const form = ref({
  title: '',
  summary: '',
  cover: '',
  category: '未分类',
  tags: '',
  postType: '',
  cardSubtype: '',
  bossFloor: null as number | null,
  cost: null as number | null,
  rarity: '',
  hp: null as number | null,
  initialRelic: '',
  coreMechanic: '',
})

const categories = ['铁甲战士', '静默猎手', '故障机器人', '储君', '亡灵契约师', '通用', '第一层·密林', '第一层·暗港', '第二层·巢穴', '第三层·荣耀']

const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    ImageExtension.configure({ inline: false, allowBase64: false }),
    Placeholder.configure({ placeholder: '开始撰写文章内容...' }),
  ],
})

async function uploadCover(file: File) {
  coverUploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const token = localStorage.getItem('token')
    const res = await axios.post('/api/upload', fd, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
    })
    form.value.cover = res.data.url
    ElMessage.success('封面上传成功')
  } catch {
    ElMessage.error('上传失败')
  }
  finally { coverUploading.value = false }
}

async function handleImageUpload() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post('/api/upload', fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      })
      editor.value?.chain().focus().setImage({ src: res.data.url }).run()
    } catch { ElMessage.error('图片上传失败') }
  }
  input.click()
}

async function save() {
  if (!form.value.title.trim()) return ElMessage.warning('请输入标题')
  if (!editor.value?.getHTML()) return ElMessage.warning('请输入内容')

  saving.value = true
  const payload: Record<string, any> = {
    title: form.value.title,
    content: editor.value?.getHTML() || '',
    summary: form.value.summary,
    cover: form.value.cover,
    category: form.value.category,
    tags: form.value.tags
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean),
    postType: form.value.postType || null,
    cardSubtype: form.value.cardSubtype || null,
    bossFloor: form.value.bossFloor,
    cost: form.value.cost,
    rarity: form.value.rarity || null,
    hp: form.value.hp,
    initialRelic: form.value.initialRelic || null,
    coreMechanic: form.value.coreMechanic || null,
  }

  try {
    if (isEdit) {
      await updatePost(route.params.id as string, payload)
      ElMessage.success('文章已更新')
    } else {
      await createPost(payload)
      ElMessage.success('文章已发布')
    }
    router.push('/admin')
  } catch { /* handled */ }
  finally { saving.value = false }
}

onMounted(async () => {
  if (isEdit) {
    try {
      const res = await getPost(route.params.id as string)
      const p = res.data
      form.value = {
        title: p.title,
        summary: p.summary,
        cover: p.cover,
        category: p.category,
        tags: p.tags?.join(', ') || '',
        postType: p.postType || '',
        cardSubtype: p.cardSubtype || '',
        bossFloor: p.bossFloor || null,
        cost: p.cost || null,
        rarity: p.rarity || '',
        hp: p.hp || null,
        initialRelic: p.initialRelic || '',
        coreMechanic: p.coreMechanic || '',
      }
      editor.value?.commands.setContent(p.content)
    } catch { ElMessage.error('加载文章失败'); router.push('/admin') }
  }
})
</script>

<template>
  <div class="editor-page container">
    <div class="editor-header">
      <h2>{{ isEdit ? '编辑文章' : '发布文章' }}</h2>
      <div class="editor-actions">
        <el-button @click="router.push('/admin')">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save">保存发布</el-button>
      </div>
    </div>

    <div class="editor-form">
      <el-input v-model="form.title" placeholder="文章标题" size="large" style="margin-bottom: 16px" />

      <div class="editor-meta">
        <el-select v-model="form.postType" placeholder="内容类型" style="width: 140px">
          <el-option label="通用" value="" />
          <el-option label="👤 角色" value="character" />
          <el-option label="🃏 卡牌" value="card" />
          <el-option label="🐉 Boss" value="boss" />
        </el-select>
        <el-select v-model="form.category" placeholder="分类">
          <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
        </el-select>
        <el-input v-model="form.tags" placeholder="标签（逗号分隔）" style="flex: 1" />
      </div>

      <!-- Card-specific fields -->
      <div v-if="form.postType === 'card'" class="editor-type-fields">
        <el-select v-model="form.cardSubtype" placeholder="卡牌子类" style="width: 130px">
          <el-option label="攻击牌" value="attack" />
          <el-option label="技能牌" value="skill" />
          <el-option label="能力牌" value="power" />
        </el-select>
        <el-input-number v-model="form.cost" :min="0" :max="10" placeholder="费用" style="width: 120px" />
        <el-input v-model="form.rarity" placeholder="稀有度（如：普通/罕见/稀有）" style="width: 200px" />
      </div>

      <!-- Boss-specific fields -->
      <div v-if="form.postType === 'boss'" class="editor-type-fields">
        <el-select v-model="form.bossFloor" placeholder="所属层数" style="width: 130px">
          <el-option label="第一层" :value="1" />
          <el-option label="第二层" :value="2" />
          <el-option label="第三层" :value="3" />
        </el-select>
        <el-input-number v-model="form.hp" :min="0" placeholder="生命值" style="width: 160px" />
      </div>

      <!-- Character-specific fields -->
      <div v-if="form.postType === 'character'" class="editor-type-fields">
        <el-input-number v-model="form.hp" :min="0" placeholder="初始血量" style="width: 130px" />
        <el-input v-model="form.initialRelic" placeholder="初始遗物" style="width: 200px" />
        <el-input v-model="form.coreMechanic" placeholder="核心机制" style="flex: 1" />
      </div>

      <div class="cover-upload">
        <span class="label">封面图：</span>
        <el-upload
          :show-file-list="false"
          :before-upload="(f: File) => { uploadCover(f); return false }"
          accept="image/*"
        >
          <el-button :loading="coverUploading" size="small">上传封面</el-button>
        </el-upload>
        <img v-if="form.cover" :src="form.cover" class="cover-preview" />
      </div>

      <el-input
        v-model="form.summary"
        type="textarea"
        :rows="2"
        placeholder="文章摘要（可选）"
        style="margin-bottom: 16px"
      />

      <div class="editor-toolbar">
        <el-button
          size="small"
          @click="editor?.chain().focus().toggleBold().run()"
          :type="editor?.isActive('bold') ? 'primary' : 'default'"
        ><b>B</b></el-button>
        <el-button
          size="small"
          @click="editor?.chain().focus().toggleItalic().run()"
          :type="editor?.isActive('italic') ? 'primary' : 'default'"
        ><i>I</i></el-button>
        <el-button
          size="small"
          @click="editor?.chain().focus().toggleStrike().run()"
          :type="editor?.isActive('strike') ? 'primary' : 'default'"
        ><s>S</s></el-button>
        <el-button size="small" @click="editor?.chain().focus().toggleCode().run()"
          :type="editor?.isActive('code') ? 'primary' : 'default'"
        >&lt;/&gt;</el-button>
        <span class="sep"></span>
        <el-button size="small" @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
          :type="editor?.isActive('heading', { level: 1 }) ? 'primary' : 'default'"
        >H1</el-button>
        <el-button size="small" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
          :type="editor?.isActive('heading', { level: 2 }) ? 'primary' : 'default'"
        >H2</el-button>
        <el-button size="small" @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
          :type="editor?.isActive('heading', { level: 3 }) ? 'primary' : 'default'"
        >H3</el-button>
        <span class="sep"></span>
        <el-button size="small" @click="editor?.chain().focus().toggleBulletList().run()"
          :type="editor?.isActive('bulletList') ? 'primary' : 'default'"
        >列表</el-button>
        <el-button size="small" @click="editor?.chain().focus().toggleOrderedList().run()"
          :type="editor?.isActive('orderedList') ? 'primary' : 'default'"
        >编号</el-button>
        <el-button size="small" @click="editor?.chain().focus().toggleBlockquote().run()"
          :type="editor?.isActive('blockquote') ? 'primary' : 'default'"
        >引用</el-button>
        <el-button size="small" @click="handleImageUpload">🖼 图片</el-button>
      </div>

      <div class="tiptap-editor">
        <EditorContent :editor="editor" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-page { padding-top: 24px; }

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.editor-form {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow);
}

.editor-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.editor-type-fields {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  padding: 10px 14px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.cover-upload {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.cover-upload .label { font-size: 14px; color: var(--text-secondary); }
.cover-preview { width: 80px; height: 60px; object-fit: cover; border-radius: 4px; }

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  margin-bottom: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
}
.sep { width: 1px; background: var(--border-color); margin: 0 6px; }

.tiptap-editor {
  border: 1px solid var(--border-color);
  border-radius: 0 0 8px 8px;
}

.tiptap-editor :deep(.tiptap) {
  padding: 16px;
  min-height: 400px;
  outline: none;
  color: var(--text-primary);
}

.tiptap-editor :deep(.tiptap p.is-editor-empty:first-child::before) {
  color: var(--text-muted);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
