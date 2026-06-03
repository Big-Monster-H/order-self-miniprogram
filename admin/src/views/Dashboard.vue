<template>
<div><div class="page-hd"><h2>仪表盘</h2></div>
<div class="stat-cards">
  <div class="stat-card"><div class="stat-icon" style="background:#E3F2FD;color:#1565C0"><i class="ri-user-3-line"></i></div><div><div class="stat-val">{{stats.users}}</div><div class="stat-lbl">用户总数</div></div></div>
  <div class="stat-card"><div class="stat-icon" style="background:#FFF3E0;color:#E65100"><i class="ri-file-list-3-line"></i></div><div><div class="stat-val">{{stats.orders}}</div><div class="stat-lbl">订单总数</div></div></div>
  <div class="stat-card"><div class="stat-icon" style="background:#E8F5E9;color:#2E7D32"><i class="ri-money-cny-circle-line"></i></div><div><div class="stat-val">{{stats.revenue}}</div><div class="stat-lbl">平台收入(元)</div></div></div>
  <div class="stat-card"><div class="stat-icon" style="background:#F3E5F5;color:#6A1B9A"><i class="ri-user-star-line"></i></div><div><div class="stat-val">{{stats.employees}}</div><div class="stat-lbl">认证员工</div></div></div>
</div>
<div class="chart-row">
  <div class="card"><h3 style="margin-bottom:16px">最近订单</h3>
    <table class="table"><thead><tr><th>单号</th><th>金额</th><th>状态</th></tr></thead>
      <tbody><tr v-for="o in recentOrders" :key="o.id"><td>{{o.order_no?.slice(0,16)}}</td><td>{{(o.total_amount/100).toFixed(2)}}</td><td><span :class="'tag '+statusTag(o.status)">{{statusLabel(o.status)}}</span></td></tr></tbody>
    </table>
  </div>
  <div class="card"><h3 style="margin-bottom:16px">待退款</h3>
    <table class="table"><thead><tr><th>订单</th><th>金额</th><th>原因</th></tr></thead>
      <tbody><tr v-for="r in pendingRefunds" :key="r.id"><td>{{r.order?.order_no?.slice(0,14)}}</td><td>{{(r.amount/100).toFixed(2)}}</td><td>{{r.reason?.slice(0,15)}}</td></tr></tbody>
    </table>
    <p v-if="!pendingRefunds.length" style="text-align:center;padding:30px;color:var(--text3)">暂无</p>
  </div>
</div></div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import api from "@/api"
const stats = ref({users:0,orders:0,revenue:0,employees:0})
const recentOrders = ref([])
const pendingRefunds = ref([])
const smap={pending:"待付款",paid:"已付款",accepted:"进行中",completed:"已完成",cancelled:"已取消",refunding:"退款中",refunded:"已退款"}
const scl={pending:"tag-orange",paid:"tag-blue",accepted:"tag-blue",completed:"tag-green",refunding:"tag-orange",refunded:"tag-red"}
const statusLabel=s=>smap[s]||s
const statusTag=s=>scl[s]||""
onMounted(async()=>{
  try{
    const [usersRes, ordersRes, refsRes, empRes] = await Promise.all([
      api.get("/users",{params:{pageSize:1}}),
      api.get("/orders",{params:{pageSize:5}}),
      api.get("/refunds"),
      api.get("/employee/top")
    ])
    stats.value.users = usersRes.total||0
    stats.value.orders = ordersRes.total||0
    stats.value.revenue = (ordersRes.list||[]).reduce((s,o)=>s+(o.commission||0),0)/100
    stats.value.employees = (empRes||[]).length
    recentOrders.value = (ordersRes.list||[]).slice(0,5)
    pendingRefunds.value = (refsRes||[]).filter(r=>r.status==="pending").slice(0,5)
  }catch(e){console.log(e)}
})
</script>
