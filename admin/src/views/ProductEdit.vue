<template>
<div><div class="page-hd"><h2>{{isEdit?'编辑':'新增'}}商品</h2></div>
<div class="card" style="max-width:700px">
  <div class="form-group"><label class="form-label">标题</label><input class="form-input" v-model="form.title" /></div>
  <div class="form-row">
    <div class="form-group"><label class="form-label">分类</label><select class="form-input" v-model="form.category_id"><option v-for="c in categories" :key="c.id" :value="c.id">{{c.name}}</option></select></div>
    <div class="form-group"><label class="form-label">交付周期</label><input class="form-input" v-model="form.delivery_days" placeholder="3-5天" /></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label class="form-label">价格(元)</label><input class="form-input" type="number" step="0.01" :value="(form.price/100).toFixed(2)" @input="form.price=Math.round($event.target.value*100)" /></div>
    <div class="form-group"><label class="form-label">原价(元)</label><input class="form-input" type="number" step="0.01" :value="(form.original_price/100).toFixed(2)" @input="form.original_price=Math.round($event.target.value*100)" /></div>
  </div>
  <div class="form-group"><label class="form-label">描述</label><textarea class="form-input" v-model="form.description" rows="3"></textarea></div>
  <div class="form-row">
    <div class="form-group"><label class="form-label">排序</label><input class="form-input" type="number" v-model="form.sort" /></div>
    <div class="form-group"><label class="form-label">状态</label><select class="form-input" v-model="form.status"><option :value="1">上架</option><option :value="0">下架</option></select></div>
  </div>
  <div style="display:flex;gap:10px;margin-top:20px"><button class="btn btn-outline" @click="back">取消</button><button class="btn btn-primary" @click="save" :disabled="saving">{{saving?'保存中...':'保存'}}</button></div>
</div>
</div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api'
const router=useRouter()
const route=useRoute()
const isEdit=!!route.params.id
const saving=ref(false)
const categories=ref([])
const form=ref({title:'',category_id:null,price:0,original_price:0,description:'',delivery_days:'',sort:0,status:1})
onMounted(async()=>{
  categories.value=await api.get('/categories')
  if(isEdit){const p=await api.get('/products/'+route.params.id);form.value={...p}}
})
const save=async()=>{
  saving.value=true
  try{
    if(isEdit) await api.put('/products/'+form.value.id,form.value)
    else await api.post('/products',form.value)
    router.push('/products')
  }catch(e){alert(e.message||'保存失败')}
  finally{saving.value=false}
}
const back=()=>router.push('/products')
</script>