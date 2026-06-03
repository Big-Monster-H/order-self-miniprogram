<template>
<div><div class="page-hd"><h2>{{isEdit?'编辑':'新增'}}内容</h2></div>
<div class="card" style="max-width:700px">
  <div class="form-group"><label class="form-label">标题</label><input class="form-input" v-model="form.title" /></div>
  <div class="form-row">
    <div class="form-group"><label class="form-label">类型</label><select class="form-input" v-model="form.type"><option value="notice">公告</option><option value="help">帮助</option><option value="about">关于</option><option value="banner">轮播</option></select></div>
    <div class="form-group"><label class="form-label">状态</label><select class="form-input" v-model="form.status"><option :value="1">显示</option><option :value="0">隐藏</option></select></div>
  </div>
  <div class="form-group"><label class="form-label">内容 (HTML)</label><textarea class="form-input" v-model="form.content" rows="6"></textarea></div>
  <div class="form-group"><label class="form-label">摘要</label><input class="form-input" v-model="form.summary" /></div>
  <div style="display:flex;gap:10px;margin-top:20px"><button class="btn btn-outline" @click="back">取消</button><button class="btn btn-primary" @click="save" :disabled="saving">{{saving?'保存中...':'保存'}}</button></div>
</div>
</div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api'
const router=useRouter();const route=useRoute()
const isEdit=!!route.params.id;const saving=ref(false)
const form=ref({title:'',type:'notice',content:'',summary:'',status:1})
onMounted(async()=>{if(isEdit){const a=await api.get('/cms/articles/'+route.params.id);form.value={...a}}})
const save=async()=>{
  saving.value=true
  try{
    if(isEdit) await api.put('/cms/articles/'+form.value.id,form.value)
    else await api.post('/cms/articles',form.value)
    router.push('/cms')
  }catch(e){alert(e.message)}
  finally{saving.value=false}
}
const back=()=>router.push('/cms')
</script>