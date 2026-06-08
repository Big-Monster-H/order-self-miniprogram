<template>
  <view class="page-task-pool">
    <!-- 顶部统计 -->
    <view class="pool-stats">
      <view class="ps-item">
        <view class="ps-icon" style="background:#E3F2FD;"><i class="ri-file-list-2-line" style="font-size:32rpx;color:#2979FF;" /></view>
        <view class="ps-info">
          <text class="ps-num">12</text>
          <text class="ps-label">可接任务</text>
        </view>
      </view>
      <view class="ps-item">
        <view class="ps-icon" style="background:#E8F5E9;"><i class="ri-time-line" style="font-size:32rpx;color:#00C853;" /></view>
        <view class="ps-info">
          <text class="ps-num">3</text>
          <text class="ps-label">进行中</text>
        </view>
      </view>
      <view class="ps-item">
        <view class="ps-icon" style="background:#FFF3E0;"><i class="ri-wallet-3-line" style="font-size:32rpx;color:#FF9100;" /></view>
        <view class="ps-info">
          <text class="ps-num">¥2,880</text>
          <text class="ps-label">本月收入</text>
        </view>
      </view>
    </view>

    <!-- 筛选 -->
    <view class="filter-bar">
      <view class="fb-chip" :class="{ on: activeFilter === 'all' }" @click="activeFilter = 'all'">
        <i class="ri-arrow-up-down-line" style="margin-right:6rpx;" />综合
      </view>
      <view class="fb-chip" :class="{ on: activeFilter === 'distance' }" @click="activeFilter = 'distance'">
        <i class="ri-map-pin-2-line" style="margin-right:6rpx;" />离我最近
      </view>
      <view class="fb-chip" :class="{ on: activeFilter === 'price' }" @click="activeFilter = 'price'">
        <i class="ri-money-cny-circle-line" style="margin-right:6rpx;" />价格
      </view>
    </view>

    <!-- 任务列表 -->
    <scroll-view scroll-y class="task-list" @scrolltolower="loadMore">
      <view class="task-card" v-for="task in tasks" :key="task.id" @click="goDetail(task)">
        <view class="tk-header">
          <view class="tk-cat">{{ task.category }}</view>
          <view class="tk-time">
            <i class="ri-time-line" style="font-size:20rpx;" />
            <text>{{ task.publishTime }}</text>
          </view>
        </view>
        <text class="tk-title">{{ task.title }}</text>
        <text class="tk-desc">{{ task.description }}</text>
        <view class="tk-info">
          <view class="tk-info-item">
            <i class="ri-map-pin-2-line" style="font-size:22rpx;color:#999;" />
            <text>{{ task.address }}</text>
          </view>
          <view class="tk-info-item">
            <i class="ri-calendar-2-line" style="font-size:22rpx;color:#999;" />
            <text>{{ task.appointDate }}</text>
          </view>
        </view>
        <view class="tk-footer">
          <view class="tk-price">
            <text class="tk-symbol">¥</text>
            <text class="tk-value">{{ task.price }}</text>
            <text class="tk-unit">/次</text>
            <text class="tk-commission" v-if="task.commission">预估收入 ¥{{ Math.round(task.price * (1 - task.commission / 100)) }}</text>
          </view>
          <view class="tk-btn" @click.stop="takeOrder(task)">
            <i class="ri-thumb-up-line" style="margin-right:6rpx;" />立即接单
          </view>
        </view>
      </view>
      <view v-if="loading" class="load-more">加载中...</view>
      <view v-if="!loading && !tasks.length" class="empty-state">
        <i class="ri-inbox-line" style="font-size:80rpx;color:#ddd;" />
        <text>暂无可接任务</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
const goDetail = (task) => uni.navigateTo({ url: "/subpkg/order/detail?id=" + (task?.id || "") });
const loadMore = () => uni.showToast({ title: "加载更多", icon: "none" });
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useOrderStore } from '@/store/order.js';
import { useEmployeeStore } from '@/store/employee.js';

const orderStore = useOrderStore();
const empStore = useEmployeeStore();
const tasks = ref([]);
const activeFilter = ref('');
const stats = ref({ taskCount: 0, todayNew: 0, estIncome: 0 });

onShow(async () => {
  try {
    await orderStore.fetchTaskPool(activeFilter.value || undefined);
    tasks.value = orderStore.taskPool.list || [];
    stats.value = {
      taskCount: orderStore.taskPool.total || 0,
      todayNew: tasks.value.length,
      estIncome: tasks.value.reduce((s, t) => s + (t.total_amount || 0), 0),
    };
  } catch (e) { console.log(e); }
});

const filterBy = async (categoryId) => {
  activeFilter.value = categoryId;
  await orderStore.fetchTaskPool(categoryId || undefined);
  tasks.value = orderStore.taskPool.list || [];
};

const grabOrder = async (orderId) => {
  try {
    await orderStore.acceptOrder(orderId);
    uni.showToast({ title: '抢单成功！', icon: 'success' });
    // 刷新列表
    await orderStore.fetchTaskPool(activeFilter.value || undefined);
    tasks.value = orderStore.taskPool.list || [];
  } catch (e) {
    uni.showToast({ title: e.message || '抢单失败', icon: 'none' });
  }
};

const fmtPrice = (fen) => (fen / 100).toFixed(0);
</script>

<style lang="scss" scoped>
.page-task-pool {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F5F6FA;
}

/* 顶部统计 */
.pool-stats {
  display: flex;
  background: #fff;
  padding: 24rpx 28rpx;
  gap: 20rpx;
}
.ps-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.ps-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ps-num {
  font-size: 30rpx;
  font-weight: 700;
  color: #1A1A2E;
  display: block;
}
.ps-label {
  font-size: 20rpx;
  color: #999;
}

/* 筛选 */
.filter-bar {
  display: flex;
  gap: 16rpx;
  padding: 20rpx 28rpx;
  background: #fff;
  border-bottom: 1rpx solid #F0F0F0;
}
.fb-chip {
  display: flex;
  align-items: center;
  padding: 12rpx 24rpx;
  border-radius: 30rpx;
  background: #F5F6FA;
  font-size: 24rpx;
  color: #666;
  transition: all 0.2s;
}
.fb-chip.on {
  background: #E3F2FD;
  color: #1565C0;
  font-weight: 600;
}

/* 任务列表 */
.task-list {
  flex: 1;
  padding: 20rpx 24rpx;
}
.task-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}
.tk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14rpx;
}
.tk-cat {
  font-size: 22rpx;
  color: #1565C0;
  background: #E3F2FD;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  font-weight: 500;
}
.tk-time {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 22rpx;
  color: #bbb;
}
.tk-title {
  font-size: 30rpx;
  font-weight: 700;
  display: block;
  margin-bottom: 10rpx;
  line-height: 1.4;
}
.tk-desc {
  font-size: 26rpx;
  color: #888;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-bottom: 16rpx;
}
.tk-info {
  display: flex;
  gap: 28rpx;
  margin-bottom: 16rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #F5F5F5;
}
.tk-info-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 24rpx;
  color: #999;
}
.tk-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.tk-price {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4rpx;
}
.tk-symbol { color: #FF3D00; font-size: 24rpx; font-weight: 700; }
.tk-value { color: #FF3D00; font-size: 42rpx; font-weight: 700; }
.tk-unit { color: #999; font-size: 20rpx; margin-right: 12rpx; }
.tk-commission {
  font-size: 20rpx;
  color: #00C853;
  background: #E8F5E9;
  padding: 4rpx 10rpx;
  border-radius: 6rpx;
}
.tk-btn {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #2979FF, #1565C0);
  color: #fff;
  font-size: 26rpx;
  padding: 14rpx 28rpx;
  border-radius: 30rpx;
  font-weight: 600;
}
.tk-btn:active {
  opacity: 0.85;
}

.load-more {
  text-align: center;
  padding: 24rpx;
  color: #bbb;
  font-size: 24rpx;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
  gap: 16rpx;
  font-size: 28rpx;
  color: #ccc;
}
</style>