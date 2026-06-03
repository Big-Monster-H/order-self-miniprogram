<template>
<div><div class="page-hd"><h2>订单详情</h2><button class="btn btn-outline btn-sm" @click="$router.push('/orders')"><i class="ri-arrow-left-line"></i> 返回</button></div>
<div v-if="order" class="detail-wrap">
  <div class="card" style="margin-bottom:16px">
    <h3 style="margin-bottom:12px">基本信息</h3>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">订单编号</span><span class="info-val">{{order.order_no}}</span></div>
      <div class="info-item"><span class="info-label">下单用户</span><span class="info-val">{{order.user?.nickname||'-'}} ({{order.user?.phone||'-'}})</span></div>
      <div class="info-item"><span class="info-label">商品名称</span><span class="info-val">{{order.product?.title||'-'}}</span></div>
      <div class="info-item"><span class="info-label">数量</span><span class="info-val">{{order.quantity}}</span></div>
      <div class="info-item"><span class="info-label">单价</span><span class="info-val">¥{{(order.unit_price/100).toFixed(2)}}</span></div>
      <div class="info-item"><span class="info-label">总金额</span><span class="info-val" style="font-weight:700;color:#E65100">¥{{(order.total_amount/100).toFixed(2)}}</span></div>
      <div class="info-item"><span class="info-label">平台抽佣</span><span class="info-val">¥{{(order.commission/100).toFixed(2)}}</span></div>
      <div class="info-item"><span class="info-label">当前状态</span><span class="info-val"><span :class="'tag '+tagClass(order.status)">{{label(order.status)}}</span></span></div>
      <div class="info-item"><span class="info-label">接单员工</span><span class="info-val">{{order.employee?.name||'-'}}</span></div>
      <div class="info-item"><span class="info-label">微信交易号</span><span class="info-val">{{order.wx_transaction_id||'-'}}</span></div>
      <div class="info-item"><span class="info-label">创建时间</span><span class="info-val">{{order.created_at}}</span></div>
      <div class="info-item"><span class="info-label">付款时间</span><span class="info-val">{{order.paid_at||'-'}}</span></div>
      <div class="info-item"><span class="info-label">完成时间</span><span class="info-val">{{order.completed_at||'-'}}</span></div>
      <div v-if="order.remark" class="info-item" style="grid-column:span 2"><span class="info-label">备注</span><span class="info-val">{{order.remark}}</span></div>
    </div>
  </div>
  <div class="card" style="margin-bottom:16px">
    <h3 style="margin-bottom:12px">状态操作</h3>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button v-if="order.status==='paid'" class="btn btn-warning" @click="updateStatus('cancelled')">取消订单</button>
      <button v-if="order.status==='refunding'" class="btn btn-success" @click="updateStatus('refunded')">确认退款</button>
      <button v-if="order.status==='refunding'" class="btn btn-danger" @click="updateStatus('paid')">拒绝退款</button>
    </div>
    <p v-if="['pending','accepted','delivering','completed','cancelled','refunded'].includes(order.status)" style="color:var(--text3);margin-top:8px">当前状态无可执行操作</p>
  </div>
  <div class="card" v-if="order.logs?.length">
    <h3 style="margin-bottom:12px">操作日志</h3>
    <div class="log-list">
      <div v-for="l in order.logs" :key="l.id" class="log-item"><span class="log-time">{{l.created_at?.slice(0,19)}}</span><span>{{l.content}}</span></div>
    </div>
  </div>
</div>
<div v-else class="card"><p style="text-align:center;padding:40px;color:var(--text3)">加载中...</p></div>
</div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import api from "@/api"
const route=useRoute();const router=useRouter()
const order=ref(null)
const sm={pending:"待付款",paid:"已付款",accepted:"已接单",delivering:"服务中",completed:"已完成",cancelled:"已取消",refunding:"退款中",refunded:"已退款"}
const sc={pending:"tag-orange",paid:"tag-blue",accepted:"tag-blue",delivering:"tag-blue",completed:"tag-green",refunding:"tag-orange",refunded:"tag-red",cancelled:"tag-red"}
const label=s=>sm[s]||s;const tagClass=s=>sc[s]||""
const updateStatus=async(status)=>{
  if(!confirm(`确定将订单状态改为"${label(status)}"?`)) return
  try{
    await api.put(`/orders/${route.params.id}/status`,{status})
    await loadOrder()
  }catch(e){alert(e.message||"操作失败")}
}
const loadOrder=async()=>{
  try{const r=await api.get(`/orders/${route.params.id}`);order.value=r}catch(e){}
}
onMounted(loadOrder)
</script>
<style scoped>
.detail-wrap{max-width:800px}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.info-item{display:flex;flex-direction:column;gap:4px}
.info-label{font-size:12px;color:var(--text3)}.info-val{font-size:14px;color:var(--text1)}
.log-list{display:flex;flex-direction:column;gap:8px}
.log-item{display:flex;gap:12px;font-size:13px;color:var(--text2);padding:6px 0;border-bottom:1px solid var(--border)}
.log-time{color:var(--text3);flex-shrink:0}
</style>
