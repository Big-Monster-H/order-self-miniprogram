<template>
<div><div class="page-hd"><h2>订单管理</h2></div>
<div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap">
  <button v-for="t in tabs" :key="t.key" @click="filterBy(t.key)" :class="'btn '+(activeTab===t.key?'btn-primary':'btn-outline')+' btn-sm'">{{t.label}}</button>
</div>
<div class="card">
  <table class="table"><thead><tr><th>单号</th><th>用户</th><th>商品</th><th>金额</th><th>状态</th><th>时间</th></tr></thead>
    <tbody><tr v-for="o in list" :key="o.id"><td>{{o.order_no?.slice(0,14)}}</td><td>{{o.user?.nickname||'-'}}</td><td>{{o.product?.title||'-'}}</td><td>{{(o.total_amount/100).toFixed(2)}}</td><td><span :class="'tag '+tagClass(o.status)">{{label(o.status)}}</span></td><td>{{o.created_at?.slice(0,10)}}</td></tr></tbody>
  </table>
  <p v-if="!list.length" class="empty"><i class="ri-inbox-line"></i>暂无订单</p>
</div>
</div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import api from "@/api"
const list=ref([]);const activeTab=ref("")
const tabs=[
  {key:"",label:"全部"},
  {key:"pending",label:"待付款"},
  {key:"paid",label:"已付款"},
  {key:"accepted",label:"进行中"},
  {key:"completed",label:"已完成"},
]
const sm={pending:"待付款",paid:"已付款",accepted:"进行中",completed:"已完成",cancelled:"已取消",refunding:"退款中",refunded:"已退款"}
const sc={pending:"tag-orange",paid:"tag-blue",accepted:"tag-blue",completed:"tag-green",refunding:"tag-orange",refunded:"tag-red",cancelled:"tag-red"}
const label=s=>sm[s]||s;const tagClass=s=>sc[s]||""
const filterBy=async(k)=>{
  activeTab.value=k
  try{
    const params={pageSize:50}
    if(k) params.status=k
    const r=await api.get("/orders",{params})
    list.value=r.list||[]
  }catch(e){}
}
onMounted(()=>filterBy(""))
</script>
