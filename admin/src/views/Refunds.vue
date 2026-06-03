<template>
<div><div class="page-hd"><h2>退款审核</h2></div>
<div class="card">
  <table class="table"><thead><tr><th>编号</th><th>订单</th><th>金额</th><th>原因</th><th>状态</th><th>操作</th></tr></thead>
    <tbody><tr v-for="r in list" :key="r.id"><td>{{r.refund_no}}</td><td>{{r.order?.order_no?.slice(0,12)}}</td><td>{{(r.amount/100).toFixed(2)}}</td><td>{{r.reason?.slice(0,20)}}</td><td><span :class="'tag '+(r.status==='pending'?'tag-orange':r.status==='approved'?'tag-green':'tag-red')">{{r.status==='pending'?'待审核':r.status==='approved'?'已通过':'已拒绝'}}</span></td><td v-if="r.status==='pending'"><button class="btn btn-success btn-sm" @click="handle(r.id,true)">通过</button><button class="btn btn-danger btn-sm" style="margin-left:6px" @click="handle(r.id,false)">拒绝</button></td></tr></tbody>
  </table>
  <p v-if="!list.length" class="empty"><i class="ri-inbox-line"></i>暂无退款申请</p>
</div>
</div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import api from "@/api"
const list=ref([])
const fetchList=async()=>{try{list.value=await api.get("/refunds")}catch(e){}}
onMounted(fetchList)
const handle=async(id,approved)=>{
  const remark=prompt(approved?"通过备注(可选):":"拒绝原因:")
  if(remark===null)return
  try{
    const url=approved?"/refunds/"+id+"/approve":"/refunds/"+id+"/reject"
    await api.put(url,{remark})
    await fetchList()
  }catch(e){alert(e.message)}
}
</script>
