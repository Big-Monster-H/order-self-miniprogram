<template>
<div><div class="page-hd"><h2>CMS 内容管理</h2><router-link to="/cms/edit" class="btn btn-primary"><i class="ri-add-line"></i> 新增内容</router-link></div>
<div class="card">
  <table class="table"><thead><tr><th>ID</th><th>标题</th><th>类型</th><th>浏览量</th><th>状态</th><th>操作</th></tr></thead>
    <tbody><tr v-for="a in list" :key="a.id"><td>{{a.id}}</td><td>{{a.title}}</td><td><span class="tag tag-blue">{{a.type}}</span></td><td>{{a.views}}</td><td><span :class="'tag '+(a.status?'tag-green':'tag-red')">{{a.status?'显示':'隐藏'}}</span></td><td><router-link :to="'/cms/edit/'+a.id" class="btn btn-outline btn-sm"><i class="ri-edit-line"></i> 编辑</router-link><button class="btn btn-outline btn-sm btn-danger" @click="del(a.id)"><i class="ri-delete-bin-line"></i></button></td></tr></tbody>
  </table>
  <p v-if="!list.length" class="empty"><i class="ri-inbox-line"></i>暂无内容</p>
</div>
</div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import api from "@/api"
const list=ref([])
const fetchList=async()=>{
  try{
    const r=await api.get("/cms/articles/all",{params:{pageSize:200}})
    list.value=r.list||[]
  }catch(e){}
}
onMounted(fetchList)
const del=async(id)=>{
  if(!confirm("确定删除?"))return
  try{await api.delete("/cms/articles/"+id);await fetchList()}catch(e){alert(e.message||"删除失败")}
}
</script>
