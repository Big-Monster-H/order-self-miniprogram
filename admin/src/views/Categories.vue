<template>
<div><div class="page-hd"><h2>服务分类</h2><button class="btn btn-primary" @click="showForm(null)"><i class="ri-add-line"></i> 新增分类</button></div>
<div class="card">
  <table class="table"><thead><tr><th>ID</th><th>名称</th><th>排序</th><th>状态</th><th>操作</th></tr></thead>
    <tbody><tr v-for="c in list" :key="c.id"><td>{{c.id}}</td><td>{{c.name}}</td><td>{{c.sort}}</td><td><span :class="'tag '+(c.status===1?'tag-green':'tag-red')">{{c.status===1?'启用':'禁用'}}</span></td><td><button class="btn btn-outline btn-sm" @click="showForm(c)"><i class="ri-edit-line"></i> 编辑</button><button class="btn btn-outline btn-sm btn-danger" @click="del(c.id)"><i class="ri-delete-bin-line"></i></button></td></tr></tbody>
  </table>
  <p v-if="!list.length" class="empty"><i class="ri-inbox-line"></i>暂无分类</p>
</div>
<div class="modal-mask" v-if="editing" @click.self="editing=null"><div class="modal-box">
  <div class="modal-hd"><h3>{{form.id?'编辑':'新增'}}分类</h3><i class="ri-close-line" style="cursor:pointer;font-size:20px" @click="editing=null"></i></div>
  <div class="form-group"><label class="form-label">名称</label><input class="form-input" v-model="form.name" /></div>
  <div class="form-row"><div class="form-group"><label class="form-label">排序</label><input class="form-input" type="number" v-model="form.sort" /></div><div class="form-group"><label class="form-label">状态</label><select class="form-input" v-model="form.status"><option :value="1">启用</option><option :value="0">禁用</option></select></div></div>
  <div class="modal-ft"><button class="btn btn-outline" @click="editing=null">取消</button><button class="btn btn-primary" @click="save">保存</button></div>
</div></div>
</div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import api from "@/api"
const list=ref([])
const editing=ref(null)
const form=ref({name:"",sort:0,status:1})
const fetchList=async()=>{try{list.value=await api.get("/categories",{params:{all:1}})}catch(e){}}
onMounted(fetchList)
const showForm=(c)=>{form.value=c?{...c}:{name:"",sort:0,status:1};editing.value=true}
const save=async()=>{
  try{
    if(form.value.id) await api.put("/categories/"+form.value.id,form.value)
    else await api.post("/categories",form.value)
    editing.value=null;await fetchList()
  }catch(e){alert(e.message||"保存失败")}
}
const del=async(id)=>{
  if(!confirm("确定删除?"))return
  try{await api.delete("/categories/"+id);await fetchList()}catch(e){alert(e.message||"删除失败")}
}
</script>
