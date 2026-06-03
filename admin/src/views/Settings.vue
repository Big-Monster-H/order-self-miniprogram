<template>
<div><div class="page-hd"><h2>系统配置</h2></div>
<div class="card" style="max-width:600px">
  <div class="form-group"><label class="form-label">平台佣金比例 (%)</label><input class="form-input" type="number" v-model="commission" /></div>
  <div class="form-group"><label class="form-label">保证金金额 (元)</label><input class="form-input" type="number" :value="(deposit/100).toFixed(0)" @input="deposit=Math.round($event.target.value*100)" /></div>
  <div class="form-group"><label class="form-label">平台名称</label><input class="form-input" v-model="platformName" /></div>
  <button class="btn btn-primary" @click="save">保存配置 (本地存储)</button>
  <p style="margin-top:12px;color:var(--text3);font-size:12px">* 当前版本配置保存在浏览器本地</p>
</div>
</div>
</template>
<script setup>
import { ref } from 'vue'
const commission=ref(localStorage.getItem('cfg_commission')||'8')
const deposit=ref(Number(localStorage.getItem('cfg_deposit'))||50000)
const platformName=ref(localStorage.getItem('cfg_platform')||'自主接单平台')
const save=()=>{
  localStorage.setItem('cfg_commission',commission.value)
  localStorage.setItem('cfg_deposit',deposit.value)
  localStorage.setItem('cfg_platform',platformName.value)
  alert('配置已保存')
}
</script>