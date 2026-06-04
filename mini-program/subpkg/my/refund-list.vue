<template>
  <view class="page-refund">
    <view class="refund-item card" v-for="r in list" :key="r.id" @click="goDetail(r)">
      <view class="ri-header">
        <text class="ri-order">订单：{{ r.orderNo }}</text>
        <text class="ri-status" :style="{ color: statusColor(r.status) }">{{ r.statusText }}</text>
      </view>
      <view class="ri-body">
        <image class="ri-img" :src="r.cover" mode="aspectFill" />
        <view class="ri-info">
          <text class="ri-name">{{ r.title }}</text>
          <text class="ri-reason">退款原因：{{ r.reason }}</text>
        </view>
        <text class="ri-amount">¥{{ r.amount }}</text>
      </view>
    </view>
    <view v-if="!list.length" class="empty">暂无退款记录</view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { api } from '@/api/request.js';

const refunds = ref([]);
const loading = ref(true);

onShow(async () => {
  loading.value = true;
  try {
    refunds.value = await api.get('/refunds/my');
  } catch (e) { console.log(e); }
  finally { loading.value = false; }
});

const statusMap = { pending: '审核中', approved: '已通过', rejected: '已拒绝', completed: '已退款' };
const fmtPrice = (fen) => (fen / 100).toFixed(2);
</script>

<style lang="scss" scoped>
.page-refund { padding: 20rpx; min-height: 100vh; background: var(--bg-page); }
.refund-item { margin-bottom: 20rpx; }
.ri-header { display: flex; justify-content: space-between; margin-bottom: 16rpx; }
.ri-order { font-size: 24rpx; color: var(--text-light); }
.ri-status { font-size: 26rpx; font-weight: 600; }
.ri-body { display: flex; gap: 16rpx; align-items: center; }
.ri-img { width: 100rpx; height: 100rpx; border-radius: 8rpx; background: #f0f0f0; }
.ri-info { flex: 1; }
.ri-name { font-size: 26rpx; font-weight: 600; display: block; }
.ri-reason { font-size: 22rpx; color: var(--text-light); display: block; margin-top: 6rpx; }
.ri-amount { font-size: 28rpx; color: var(--danger); font-weight: 700; }
.empty { text-align: center; padding: 100rpx; color: var(--text-light); }
</style>
