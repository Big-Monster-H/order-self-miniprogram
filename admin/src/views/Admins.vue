<template>
<div><div class="page-hd"><h2>管理员</h2></div>
<div class="card" style="max-width:500px">
  <table class="table"><thead><tr><th>用户名</th><th>显示名</th><th>角色</th><th>最后登录</th></tr></thead>
    <tbody><tr v-for="a in list" :key="a.id"><td>{{a.username}}</td><td>{{a.display_name}}</td><td><span class="tag tag-blue">{{a.role}}</span></td><td>{{a.last_login_at||'-'}}</td></tr></tbody>
  </table>
</div>
</div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'
const list=ref([])
onMounted(async()=>{try{list.value=await api.get('/admins')}catch(e){}})
</script>