<template>
<div style="display:flex;min-height:100vh">
  <aside style="width:230px;background:#1A1A2E;color:#fff;flex-shrink:0;display:flex;flex-direction:column">
    <div style="padding:20px;font-size:17px;font-weight:700;border-bottom:1px solid rgba(255,255,255,.08)">
      <i class="ri-service-line" style="color:var(--primary)"></i> {CLIENT_NAME}
    </div>
    <nav style="flex:1;padding:12px 0;overflow-y:auto">
      <router-link to="/dashboard" class="nav-item" active-class="nav-active"><i class="ri-dashboard-line"></i> 仪表盘</router-link>
      <div class="nav-group">内容管理</div>
      <router-link to="/categories" class="nav-item" active-class="nav-active"><i class="ri-price-tag-3-line"></i> 服务分类</router-link>
      <router-link to="/products" class="nav-item" active-class="nav-active"><i class="ri-shopping-bag-3-line"></i> 商品管理</router-link>
      <router-link to="/page-builder" class="nav-item" active-class="nav-active"><i class="ri-layout-masonry-line"></i> 页面装修</router-link>
      <router-link to="/cms" class="nav-item" active-class="nav-active"><i class="ri-article-line"></i> CMS内容</router-link>
      <div class="nav-group">交易管理</div>
      <router-link to="/orders" class="nav-item" active-class="nav-active"><i class="ri-file-list-3-line"></i> 订单管理</router-link>
      <router-link to="/refunds" class="nav-item" active-class="nav-active"><i class="ri-refund-2-line"></i> 退款审核</router-link>
      <div class="nav-group">用户管理</div>
      <router-link to="/users" class="nav-item" active-class="nav-active"><i class="ri-user-3-line"></i> 用户管理</router-link>
      <router-link to="/employees" class="nav-item" active-class="nav-active"><i class="ri-user-star-line"></i> 员工审核</router-link>
      <div class="nav-group">系统设置</div>
      <router-link to="/admins" class="nav-item" active-class="nav-active"><i class="ri-shield-user-line"></i> 管理员</router-link>
      <router-link to="/settings" class="nav-item" active-class="nav-active"><i class="ri-settings-3-line"></i> 系统配置</router-link>
    </nav>
    <div style="padding:16px;border-top:1px solid rgba(255,255,255,.08);cursor:pointer" @click="doLogout">
      <i class="ri-logout-box-line"></i> 退出登录
    </div>
  </aside>
  <main style="flex:1;padding:24px;overflow-y:auto"><router-view /></main>
</div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/store/admin'
const router = useRouter()
const store = useAdminStore()
const doLogout = () => { store.logout(); router.push('/login') }
</script>
<style>
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 20px;color:rgba(255,255,255,.55);text-decoration:none;font-size:13px;transition:.2s}
.nav-item:hover{color:#fff;background:rgba(255,255,255,.05)}
.nav-active{color:#fff!important;background:rgba(41,121,255,.25);border-right:3px solid #2979FF}
.nav-group{padding:16px 20px 6px;font-size:11px;color:rgba(255,255,255,.25);text-transform:uppercase;letter-spacing:1px}
</style>
