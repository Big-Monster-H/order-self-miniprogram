<template>
<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#667eea,#764ba2)">
<div class="card" style="width:400px;padding:40px">
  <h2 style="text-align:center;margin-bottom:30px;font-size:24px">
    <i class="ri-admin-line" style="color:var(--primary)"></i> 管理后台
  </h2>
  <div class="form-group">
    <label class="form-label">用户名</label>
    <input class="form-input" v-model="username" placeholder="admin" />
  </div>
  <div class="form-group">
    <label class="form-label">密码</label>
    <input class="form-input" type="password" v-model="password" placeholder="admin123" />
  </div>
  <div v-if="error" style="color:var(--danger);margin-bottom:12px;font-size:13px">{{ error }}</div>
  <button class="btn btn-primary" style="width:100%;justify-content:center;padding:12px" @click="doLogin" :disabled="loading">
    {{ loading ? '登录中...' : '登录' }}
  </button>
  <p style="text-align:center;margin-top:16px;color:var(--text3);font-size:12px">默认账号: admin / admin123</p>
</div>
</div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/store/admin'
const router = useRouter()
const store = useAdminStore()
const username = ref('admin')
const password = ref('admin123')
const loading = ref(false)
const error = ref('')
const doLogin = async () => {
  error.value = ''
  loading.value = true
  try { await store.login(username.value, password.value); router.push('/') }
  catch (e) { error.value = e.message || '登录失败' }
  finally { loading.value = false }
}
</script>