import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { noAuth: true },
  },
  {
    path: '/',
    component: () => import('@/views/Layout.vue'),
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/Dashboard.vue') },
      { path: 'categories', name: 'Categories', component: () => import('@/views/Categories.vue') },
      { path: 'products', name: 'Products', component: () => import('@/views/Products.vue') },
      { path: 'products/edit/:id?', name: 'ProductEdit', component: () => import('@/views/ProductEdit.vue') },
      { path: 'orders', name: 'Orders', component: () => import('@/views/Orders.vue') },
      { path: 'orders/:id', name: 'OrderDetail', component: () => import('@/views/OrderDetail.vue') },
      { path: 'employees', name: 'Employees', component: () => import('@/views/Employees.vue') },
      { path: 'refunds', name: 'Refunds', component: () => import('@/views/Refunds.vue') },
      { path: 'users', name: 'Users', component: () => import('@/views/Users.vue') },
      { path: 'page-builder', name: 'PageBuilder', component: () => import('@/views/PageBuilder.vue') },
      { path: 'cms', name: 'Cms', component: () => import('@/views/Cms.vue') },
      { path: 'cms/edit/:id?', name: 'CmsEdit', component: () => import('@/views/CmsEdit.vue') },
      { path: 'admins', name: 'Admins', component: () => import('@/views/Admins.vue') },
      { path: 'settings', name: 'Settings', component: () => import('@/views/Settings.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 角色等级: super_admin > admin > editor
const ROLE_LEVEL = { super_admin: 3, admin: 2, editor: 1 }

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token')
  const info = JSON.parse(localStorage.getItem('admin_info') || '{}')

  // 未登录
  if (!to.meta.noAuth && !token) return next('/login')
  // 已登录访问登录页
  if (to.meta.noAuth && token) return next('/dashboard')

  // 角色权限检查
  const requiredRole = to.meta.role || 'editor'
  const userRole = info.role || 'editor'
  if ((ROLE_LEVEL[userRole] || 0) < (ROLE_LEVEL[requiredRole] || 0)) {
    console.warn('权限不足, 需 ' + requiredRole)
    return next('/dashboard')
  }

  next()
})

export default router