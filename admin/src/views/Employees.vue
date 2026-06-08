<template>
<div><div class="page-hd"><h2>员工审核</h2></div>
<div class="card">
  <table class="table"><thead><tr><th>ID</th><th>用户</th><th>技能</th><th>评分</th><th>保证金</th><th>状态</th><th>操作</th></tr></thead>
    <tbody><tr v-for="e in list" :key="e.id"><td>{{e.id}}</td><td>{{e.user?.nickname||'-'}}</td><td>{{(e.skill_tags||[]).join(', ')}}</td><td>{{e.rating}}</td><td>{{e.deposit_paid?'已缴':'未缴'}}</td><td><span :class="'tag '+(e.status==='approved'?'tag-green':e.status==='pending'?'tag-orange':'tag-red')">{{statusLabel(e.status)}}</span></td><td v-if="e.status==='pending'"><button class="btn btn-success btn-sm" @click="audit(e,true)">通过</button><button class="btn btn-danger btn-sm" style="margin-left:4px" @click="audit(e,false)">拒绝</button></td><td v-else>-</td></tr></tbody>
  </table>
  <p v-if="!list.length" class="empty"><i class="ri-inbox-line"></i>暂无员工</p>
</div>
</div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import api from "@/api"
const list=ref([])
const sl={pending:"待审核",approved:"已通过",rejected:"已拒绝",frozen:"已冻结"}
const statusLabel=s=>sl[s]||s
const fetchList=async()=>{try{const r=await api.get("/employee",{params:{pageSize:100}});list.value=r.list||[]}catch(e){}}
onMounted(fetchList)
const audit=async(e,approved)=>{
  const remark=prompt(approved?"通过备注(可选):":"拒绝原因:")
  if(remark===null)return
  try{
    await api.put("/employee/"+e.id+"/audit",{approved,remark})
    await fetchList()
  }catch(err){alert(err.message)}
}
</script>
