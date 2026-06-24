import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/front/HomePage.vue'),
    },
    {
      path: '/characters',
      name: 'characters',
      component: () => import('@/views/front/CharacterList.vue'),
    },
    {
      path: '/cards',
      name: 'cards',
      component: () => import('@/views/front/CardList.vue'),
    },
    {
      path: '/bosses',
      name: 'bosses',
      component: () => import('@/views/front/BossList.vue'),
    },
    {
      path: '/post/:id',
      name: 'post-detail',
      component: () => import('@/views/front/PostDetail.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/front/SearchPage.vue'),
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/LoginPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('@/views/admin/Dashboard.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/post/new',
      name: 'post-create',
      component: () => import('@/views/admin/PostEditor.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/post/:id/edit',
      name: 'post-edit',
      component: () => import('@/views/admin/PostEditor.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/comments',
      name: 'admin-comments',
      component: () => import('@/views/admin/CommentManage.vue'),
      meta: { requiresAdmin: true },
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAdmin) {
    if (!auth.isAdmin) {
      return next('/admin/login')
    }
  }

  if (to.meta.guest && auth.isAdmin) {
    return next('/admin')
  }

  next()
})

export default router
