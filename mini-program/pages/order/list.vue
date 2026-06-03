<template>
  <view class="page-order-list">
    <!-- 状态Tab -->
    <view class="tabs">
      <view v-for="tab in tabs" :key="tab.key" class="tab-item" :class="{ active: activeTab === tab.key }" @click="switchTab(tab.key)">
        <text>{{ tab.label }}</text>
        <text class="badge" v-if="tab.count">{{ tab.count }}</text>
      </view>
    </view>

    <!-- 订单列表 -->
    <scroll-view scroll-y class="order-list" @scrolltolower="loadMore">
      <view class="order-card" v-for="order in orders" :key="order.id" @click="goDetail(order)">
        <!-- 订单头 -->
        <view class="order-header">
          <text class="order-no">订单号：{{ order.orderNo }}</text>
          <text class="order-status" :style="{ color: statusColor(order.status) }">{{ order.statusText }}</text>
        </view>

        <!-- 商品信息 -->
        <view class="order-body">
          <image class="goods-img" :src="order.productCover" mode="aspectFill" />
          <view class="goods-info">
            <text class="goods-name text-ellipsis-2">{{ order.productTitle }}</text>
            <text class="goods-spec" v-if="order.spec">{{ order.spec }}</text>
            <text class="goods-count">×1</text>
          </view>
          <view class="goods-price">
            <text>¥{{ order.price }}</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="order-footer">
          <text class="total">共1件 合计：<text class="total-amount">¥{{ order.price }}</text></text>
          <view class="btn-group" v-if="order.actions">
            <view v-for="(action, ai) in order.actions" :key="ai" class="btn-action" :class="action.type || ''" @click.stop="onAction(order, action)">
              {{ action.label }}
            </view>
          </view>
        </view>
      </view>

      <view class="loading" v-if="loading">加载中...</view>
      <view class="empty" v-if="!loading && !orders.length">暂无订单</view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onShow } from 'vue';
import { useOrderStore } from '@/store/order.js';

const orderStore = useOrderStore();
const activeTab = ref('');
const orders = ref([]);

const tabs = [
  { key: '', label: '全部' },
  { key: 'pending', label: '待付款' },
  { key: 'paid', label: '待接单' },
  { key: 'accepted', label: '进行中' },
  { key: 'completed', label: '已完成' },
];

const switchTab = async (key) => {
  activeTab.value = key;
  await loadOrders();
};

const loadOrders = async () => {
  try {
    await orderStore.fetchMyOrders(activeTab.value || undefined);
    orders.value = orderStore.myOrders.list || [];
  } catch (e) { console.log(e); }
};

onShow(() => loadOrders());

const goDetail = (o) => uni.navigateTo({ url: '/subpkg/order/detail?id=' + o.id });
const fmtPrice = (fen) => (fen / 100).toFixed(0);
const statusMap = {
  pending: '待付款', paid: '待接单', accepted: '进行中',
  delivering: '交付中', completed: '已完成', cancelled: '已取消',
  refunding: '退款中', refunded: '已退款',
};
const statusLabel = (s) => statusMap[s] || s;
</script>

<style lang="scss" scoped>
.page-order-list { height: 100vh; display: flex; flex-direction: column; }
.tabs { display: flex; background: #fff; padding: 0 10rpx; border-bottom: 1rpx solid var(--border); }
.tab-item { flex: 1; text-align: center; padding: 28rpx 0; font-size: 28rpx; color: var(--text-secondary); position: relative; display: flex; justify-content: center; align-items: center; gap: 8rpx; }
.tab-item.active { color: var(--primary); font-weight: 700; }
.tab-item.active::after { content: ""; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 48rpx; height: 4rpx; background: var(--primary); border-radius: 2rpx; }
.badge { background: var(--danger); color: #fff; font-size: 20rpx; padding: 2rpx 8rpx; border-radius: 20rpx; font-weight: 400; }

.order-list { flex: 1; padding: 20rpx; }
.order-card { background: #fff; border-radius: var(--radius); padding: 24rpx; margin-bottom: 20rpx; box-shadow: var(--shadow); }
.order-header { display: flex; justify-content: space-between; padding-bottom: 20rpx; border-bottom: 1rpx solid var(--border); }
.order-no { font-size: 24rpx; color: var(--text-light); }
.order-status { font-size: 26rpx; font-weight: 600; }

.order-body { display: flex; gap: 20rpx; padding: 20rpx 0; }
.goods-img { width: 140rpx; height: 140rpx; border-radius: 10rpx; background: #f0f0f0; }
.goods-info { flex: 1; display: flex; flex-direction: column; gap: 10rpx; }
.goods-name { font-size: 26rpx; font-weight: 600; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; line-height: 1.4; }
.goods-spec { font-size: 22rpx; color: var(--text-light); }
.goods-count { font-size: 22rpx; color: var(--text-light); }
.goods-price { font-size: 28rpx; color: var(--text-main); font-weight: 700; display: flex; align-items: flex-end; }

.order-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16rpx; border-top: 1rpx solid var(--border); }
.total { font-size: 24rpx; color: var(--text-light); }
.total-amount { color: var(--text-main); font-weight: 700; font-size: 28rpx; }
.btn-group { display: flex; gap: 16rpx; }
.btn-action { padding: 12rpx 24rpx; border: 1rpx solid var(--border); border-radius: 28rpx; font-size: 24rpx; color: var(--text-secondary); }
.btn-action.primary { background: var(--primary); color: #fff; border-color: var(--primary); }

.loading, .empty { text-align: center; padding: 40rpx; color: var(--text-light); }
</style>
