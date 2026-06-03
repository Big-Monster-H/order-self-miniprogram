<template>
<div><div class="page-hd"><h2>商品管理</h2><router-link to="/products/edit" class="btn btn-primary"><i class="ri-add-line"></i> 新增商品</router-link></div>
<div class="card">
  <table class="table"><thead><tr><th>ID</th><th>标题</th><th>分类</th><th>价格</th><th>销量</th><th>状态</th><th>操作</th></tr></thead>
    <tbody><tr v-for="p in list" :key="p.id"><td>{{p.id}}</td><td>{{p.title}}</td><td>{{p.category?.name||'-'}}</td><td>{{(p.price/100).toFixed(2)}}</td><td>{{p.sold_count}}</td><td><span :class="'tag '+(p.status===1?'tag-green':'tag-red')">{{p.status===1?'上架':'下架'}}</span></td><td><router-link :to="'/products/edit/'+p.id" class="btn btn-outline btn-sm"><i class="ri-edit-line"></i> 编辑</router-link><button class="btn btn-outline btn-sm btn-danger" @click="del(p.id)"><i class="ri-delete-bin-line"></i></button></td></tr></tbody>
  </table>
</div>
</div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import api from "@/api"
const list=ref([])
const fetchList=async()=>{try{const r=await api.get("/products",{params:{pageSize:200,all:"1"}});list.value=r.list}catch(e){}}
onMounted(fetchList)
const del=async(id)=>{if(!confirm("确定下架?"))return;try{await api.delete("/products/"+id);await fetchList()}catch(e){alert(e.message)}}
</script>
