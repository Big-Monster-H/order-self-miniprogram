<template>
  <view class="page-order-detail">
    <!-- 状态横幅 -->
    <view class="status-banner" :style="{ background: statusInfo.bg }">
      <view :class="'ri-' + statusInfo.iconType" style="font-size:56rpx;" />
      <text class="status-title">{{ order.statusText }}</text>
      <text class="status-desc">{{ statusInfo.desc }}</text>
    </view>

    <!-- 进度时间线 -->
    <view class="timeline card">
      <view class="tl-item" v-for="(log, idx) in order.logs" :key="idx" :class="{ active: idx <= order.activeStep }">
        <view class="tl-dot" />
        <view class="tl-line" v-if="idx < order.logs.length - 1" />
        <text class="tl-title">{{ log.title }}</text>
        <text class="tl-time">{{ log.time }}</text>
      </view>
    </view>

    <!-- 接单员工 -->
    <view class="employee card" v-if="order.employee" @click="goChat">
      <image class="emp-avatar" :src="order.employee.avatar" mode="aspectFill" />
      <view class="emp-info">
        <text class="emp-name">{{ order.employee.nickname }}</text>
        <view class="emp-rate">
          <view class="ri-star-fill" style="font-size:22rpx;" />
          <text>{{ order.employee.rating }} · {{ order.employee.completedOrders }}单</text>
        </view>
      </view>
      <view class="emp-contact">
        <view class="ri-chat-3-line" style="font-size:28rpx;" />
        <text>联系</text>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="order-info card">
      <text class="oi-title">订单信息</text>
      <view class="oi-row"><text>订单编号</text><text class="copyable" @click="copy(order.orderNo)">{{ order.orderNo }}</text></view>
      <view class="oi-row"><text>创建时间</text><text>{{ order.createTime }}</text></view>
      <view class="oi-row" v-if="order.payTime"><text>付款时间</text><text>{{ order.payTime }}</text></view>
      <view class="oi-row" v-if="order.takeTime"><text>接单时间</text><text>{{ order.takeTime }}</text></view>
      <view class="oi-row"><text>服务地址</text><text>{{ order.address }}</text></view>
      <view class="oi-row"><text>联系人</text><text>{{ order.contactName }} {{ order.contactPhone }}</text></view>
      <view class="oi-row"><text>备注</text><text>{{ order.remark || '无' }}</text></view>
    </view>

    <!-- 费用 -->
    <view class="price-detail card">
      <view class="pd-row"><text>商品金额</text><text>¥{{ order.price }}</text></view>
      <view class="pd-row"><text>服务费</text><text>¥0.00</text></view>
      <view class="pd-row total"><text>实付款</text><text class="total-price">¥{{ order.price }}</text></view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-bar" v-if="order.actions && order.actions.length">
      <view v-for="(action, ai) in order.actions" :key="ai" class="btn" :class="action.type || 'outline'" @click="onAction(action)">
        {{ action.label }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useOrderStore } from '@/store/order.js';

const orderStore = useOrderStore();
const order = ref(null);
const loading = ref(true);

onLoad(async (options) => {
  try {
    await orderStore.fetchDetail(options.id);
    order.value = orderStore.currentOrder;
  } catch (e) { console.log(e); }
  finally { loading.value = false; }
});

const fmtPrice = (fen) => (fen / 100).toFixed(2);

const statusMap = {
  pending: '待付款', paid: '待接单', accepted: '已接单',
  delivering: '交付中', completed: '已完成', cancelled: '已取消',
  refunding: '退款中', refunded: '已退款',
};

const goChat = () => {
  if (order.value?.employee_id) {
    uni.navigateTo({ url: '/subpkg/chat/room?sessionId=0&targetId=' + order.value.employee_id + '&orderId=' + order.value.id });
  }
};
</script>

<style lang="scss" scoped>
.page-order-detail { padding-bottom: 140rpx; }
.status-banner { padding: 50rpx 30rpx; display: flex; flex-direction: column; align-items: center; gap: 14rpx; }
.status-title { font-size: 36rpx; font-weight: 700; color: #fff; }
.status-desc { font-size: 26rpx; color: rgba(255,255,255,0.8); }
.timeline { margin: 20rpx; padding: 30rpx; position: relative; }
.tl-item { display: flex; align-items: flex-start; padding-left: 40rpx; margin-bottom: 40rpx; position: relative; }
.tl-item:last-child { margin-bottom: 0; }
.tl-dot { position: absolute; left: 12rpx; top: 6rpx; width: 16rpx; height: 16rpx; border-radius: 50%; background: var(--border); z-index: 1; }
.tl-item.active .tl-dot { background: var(--primary); box-shadow: 0 0 0 6rpx var(--primary-light); }
.tl-line { position: absolute; left: 19rpx; top: 22rpx; width: 2rpx; height: calc(100% + 40rpx); background: var(--border); }
.tl-item.active .tl-line { background: var(--primary); }
.tl-title { font-size: 28rpx; display: block; }
.tl-item.active .tl-title { font-weight: 700; color: var(--primary); }
.tl-time { font-size: 22rpx; color: var(--text-light); display: block; margin-top: 6rpx; }
.employee { margin: 20rpx; display: flex; align-items: center; gap: 20rpx; }
.emp-avatar { width: 80rpx; height: 80rpx; border-radius: 50%; background: #f0f0f0; }
.emp-info { flex: 1; }
.emp-name { font-size: 28rpx; font-weight: 600; display: block; }
.emp-rate { display: flex; align-items: center; gap: 4rpx; font-size: 24rpx; color: var(--text-light); }
.emp-contact { display: flex; align-items: center; gap: 6rpx; font-size: 24rpx; color: var(--primary); padding: 12rpx 24rpx; background: var(--primary-light); border-radius: 30rpx; }
.order-info { margin: 20rpx; }
.oi-title { font-size: 30rpx; font-weight: 700; display: block; margin-bottom: 20rpx; }
.oi-row { display: flex; justify-content: space-between; padding: 16rpx 0; font-size: 26rpx; color: var(--text-secondary); border-bottom: 1rpx solid var(--border); }
.oi-row:last-child { border-bottom: none; }
.copyable { color: var(--primary); text-decoration: underline; }
.price-detail { margin: 20rpx; }
.pd-row { display: flex; justify-content: space-between; padding: 16rpx 0; font-size: 26rpx; color: var(--text-secondary); }
.pd-row.total { border-top: 1rpx solid var(--border); margin-top: 10rpx; padding-top: 20rpx; }
.total-price { color: var(--danger); font-size: 32rpx; font-weight: 700; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; display: flex; justify-content: flex-end; gap: 20rpx; padding: 16rpx 30rpx; padding-bottom: calc(16rpx + env(safe-area-inset-bottom)); box-shadow: 0 -2rpx 16rpx rgba(0,0,0,0.06); }
.btn { padding: 16rpx 36rpx; border-radius: 36rpx; font-size: 28rpx; font-weight: 600; }
.btn.outline { border: 2rpx solid var(--border); color: var(--text-main); background: #fff; }
.btn.primary { background: linear-gradient(135deg, #2979FF, #1565C0); color: #fff; }
.btn.danger { border: 2rpx solid var(--danger); color: var(--danger); background: #fff; }
</style>
