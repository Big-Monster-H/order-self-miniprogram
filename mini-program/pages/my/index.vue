<template>
  <view class="page-my">
    <!-- 头部 -->
    <view class="header" :style="{ paddingTop: statusBarHeight + 30 + 'px' }">
      <view class="header-bg" />
      <view class="header-content">
        <view class="user-card" @click="goLogin" v-if="!isLogin">
          <image class="uc-avatar" src="/static/icons/default-avatar.png" mode="aspectFill" />
          <view class="uc-info">
            <text class="uc-name">点击登录</text>
            <text class="uc-desc">登录解锁更多功能</text>
          </view>
          <i class="ri-arrow-right-s-line" style="font-size:36rpx;color:rgba(255,255,255,0.5);" />
        </view>
        <view class="user-card" v-else @click="goEditProfile">
          <image class="uc-avatar" :src="userInfo.avatar" mode="aspectFill" />
          <view class="uc-info">
            <text class="uc-name">{{ userInfo.nickname }}</text>
            <text class="uc-desc">{{ userInfo.phone }}</text>
          </view>
          <view class="uc-edit">
            <i class="ri-pencil-line" style="font-size:28rpx;color:#fff;" />
          </view>
        </view>

        <!-- 数据统计 -->
        <view class="header-stats" v-if="isLogin">
          <view class="stat-item">
            <text class="stat-num">8</text>
            <text class="stat-label">全部订单</text>
          </view>
          <view class="stat-divider" />
          <view class="stat-item">
            <text class="stat-num">2</text>
            <text class="stat-label">待接单</text>
          </view>
          <view class="stat-divider" />
          <view class="stat-item">
            <text class="stat-num">3</text>
            <text class="stat-label">进行中</text>
          </view>
          <view class="stat-divider" />
          <view class="stat-item">
            <text class="stat-num">3</text>
            <text class="stat-label">已完成</text>
          </view>
        </view>
      </view>

      <!-- 角色切换 -->
      <view class="role-switch" v-if="isLogin">
        <view class="role-tab" :class="{ active: userInfo.role === 'user' }" @click="switchRole('user')">
          <i :class="userInfo.role === 'user' ? 'ri-user-3-fill' : 'ri-user-3-line'" style="font-size:32rpx;margin-right:8rpx;" />
          <text>我是用户</text>
        </view>
        <view class="role-tab" :class="{ active: userInfo.role === 'employee' }" @click="switchRole('employee')">
          <i :class="userInfo.role === 'employee' ? 'ri-briefcase-4-fill' : 'ri-briefcase-4-line'" style="font-size:32rpx;margin-right:8rpx;" />
          <text>我是能手</text>
        </view>
      </view>
    </view>

    <!-- 订单入口 -->
    <view class="order-entry">
      <view class="oe-header">
        <text class="oe-title">我的订单</text>
        <view class="oe-more" @click="goOrder()">
          <text>全部订单</text>
          <i class="ri-arrow-right-s-line" style="font-size:26rpx;" />
        </view>
      </view>
      <view class="oe-grid">
        <view class="oe-item" @click="goOrder('pending_pay')">
          <view class="oe-icon-box">
            <i class="ri-wallet-3-line" style="font-size:44rpx;color:#FF9100;" />
          </view>
          <text class="oe-label">待付款</text>
        </view>
        <view class="oe-item" @click="goOrder('pending_take')">
          <view class="oe-icon-box">
            <i class="ri-file-list-2-line" style="font-size:44rpx;color:#2979FF;" />
            <view class="oe-dot" v-if="pendingTakeCount">{{ pendingTakeCount }}</view>
          </view>
          <text class="oe-label">待接单</text>
        </view>
        <view class="oe-item" @click="goOrder('in_progress')">
          <view class="oe-icon-box">
            <i class="ri-time-line" style="font-size:44rpx;color:#00C853;" />
            <view class="oe-dot" v-if="inProgressCount">{{ inProgressCount }}</view>
          </view>
          <text class="oe-label">进行中</text>
        </view>
        <view class="oe-item" @click="goOrder('done')">
          <view class="oe-icon-box">
            <i class="ri-checkbox-circle-fill" style="font-size:44rpx;color:#999;" />
          </view>
          <text class="oe-label">已完成</text>
        </view>
        <view class="oe-item" @click="goRefundList">
          <view class="oe-icon-box">
            <i class="ri-refund-2-line" style="font-size:44rpx;color:#FF3D00;" />
          </view>
          <text class="oe-label">退款/售后</text>
        </view>
      </view>
    </view>

    <!-- 能手专享 -->
    <view class="menu-group" v-if="userInfo.role === 'employee'">
      <view class="menu-title">能手服务</view>
      <view class="menu-list">
        <view class="menu-item" @click="goEmployeeCenter">
          <i class="ri-dashboard-line ri-xl" style="color:#2979FF;" />
          <text class="mi-label">接单中心</text>
          <i class="ri-arrow-right-s-line" style="font-size:28rpx;color:#ccc;" />
        </view>
        <view class="menu-item" @click="goTaskPool">
          <i class="ri-layout-grid-line ri-xl" style="color:#FF9100;" />
          <text class="mi-label">任务大厅</text>
          <i class="ri-arrow-right-s-line" style="font-size:28rpx;color:#ccc;" />
        </view>
        <view class="menu-item">
          <i class="ri-funds-line ri-xl" style="color:#00C853;" />
          <text class="mi-label">收入明细</text>
          <i class="ri-arrow-right-s-line" style="font-size:28rpx;color:#ccc;" />
        </view>
      </view>
    </view>

    <!-- 其他功能 -->
    <view class="menu-group">
      <view class="menu-title">其他</view>
      <view class="menu-list">
        <view class="menu-item" @click="goSettings">
          <i class="ri-settings-4-line ri-xl" style="color:#666;" />
          <text class="mi-label">设置</text>
          <i class="ri-arrow-right-s-line" style="font-size:28rpx;color:#ccc;" />
        </view>
        <view class="menu-item" @click="goAbout">
          <i class="ri-information-line ri-xl" style="color:#666;" />
          <text class="mi-label">关于我们</text>
          <i class="ri-arrow-right-s-line" style="font-size:28rpx;color:#ccc;" />
        </view>
      </view>
    </view>

    <view class="safe-bottom" />
  </view>
</template>

<script setup>
import { ref, onShow } from 'vue';
import { useAuthStore } from '@/store/auth.js';
import { useOrderStore } from '@/store/order.js';

const authStore = useAuthStore();
const orderStore = useOrderStore();
const userInfo = ref(null);
const stats = ref({ all: 0, active: 0, done: 0, spent: 0 });

onShow(async () => {
  userInfo.value = authStore.userInfo;
  if (authStore.isLogin) {
    try {
      const res = await orderStore.fetchMyOrders();
      const list = orderStore.myOrders.list || [];
      stats.value = {
        all: orderStore.myOrders.total || 0,
        active: list.filter(o => ['accepted','delivering'].includes(o.status)).length,
        done: list.filter(o => o.status === 'completed').length,
        spent: list.reduce((s, o) => s + (o.total_amount || 0), 0),
      };
    } catch (e) {}
  }
});

const fmtYuan = (fen) => (fen / 100).toFixed(0);

const goPage = (url) => {
  if (!authStore.isLogin) {
    uni.showToast({ title: '请先登录', icon: 'none' });
    return;
  }
  uni.navigateTo({ url });
};
</script>

<style lang="scss" scoped>
.page-my {
  min-height: 100vh;
  background: #F5F6FA;
}

/* 头部 */
.header {
  position: relative;
  padding: 0 28rpx 0;
  overflow: hidden;
}
.header-bg {
  position: absolute;
  inset: 0;
  bottom: 60rpx;
  background: linear-gradient(160deg, #2979FF 0%, #4A90D9 40%, #1565C0 100%);
  border-radius: 0 0 48rpx 48rpx;
}
.header-content {
  position: relative;
  z-index: 1;
}
.user-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 10rpx 0;
}
.uc-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255,255,255,0.3);
  background: #eee;
}
.uc-info {
  flex: 1;
}
.uc-name {
  font-size: 38rpx;
  font-weight: 700;
  color: #fff;
  display: block;
}
.uc-desc {
  font-size: 24rpx;
  color: rgba(255,255,255,0.7);
  display: block;
  margin-top: 8rpx;
}
.uc-edit {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 数据统计 */
.header-stats {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.12);
  border-radius: 20rpx;
  padding: 24rpx 10rpx;
  margin-top: 24rpx;
  backdrop-filter: blur(10rpx);
}
.stat-item {
  flex: 1;
  text-align: center;
}
.stat-num {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
  display: block;
}
.stat-label {
  font-size: 22rpx;
  color: rgba(255,255,255,0.65);
  display: block;
  margin-top: 4rpx;
}
.stat-divider {
  width: 2rpx;
  height: 36rpx;
  background: rgba(255,255,255,0.15);
}

/* 角色切换 */
.role-switch {
  position: relative;
  z-index: 1;
  display: flex;
  margin: 20rpx 8rpx 0;
  background: rgba(255,255,255,0.12);
  border-radius: 18rpx;
  padding: 6rpx;
  backdrop-filter: blur(10rpx);
}
.role-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14rpx 0;
  border-radius: 14rpx;
  font-size: 28rpx;
  color: rgba(255,255,255,0.7);
  transition: all 0.25s;
}
.role-tab.active {
  background: #fff;
  color: #2979FF;
  font-weight: 700;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

/* 订单入口 */
.order-entry {
  background: #fff;
  margin: 24rpx 24rpx 16rpx;
  border-radius: 24rpx;
  padding: 28rpx 20rpx 8rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}
.oe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8rpx;
  margin-bottom: 20rpx;
}
.oe-title {
  font-size: 30rpx;
  font-weight: 700;
}
.oe-more {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 24rpx;
  color: #999;
}
.oe-grid {
  display: flex;
}
.oe-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12rpx 0 20rpx;
  gap: 12rpx;
}
.oe-icon-box {
  position: relative;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #F5F6FA;
  display: flex;
  align-items: center;
  justify-content: center;
}
.oe-dot {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
  min-width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FF3D00;
  color: #fff;
  font-size: 18rpx;
  border-radius: 16rpx;
  padding: 0 6rpx;
}
.oe-label {
  font-size: 22rpx;
  color: #666;
}

/* 菜单分组 */
.menu-group {
  margin: 0 24rpx 16rpx;
}
.menu-title {
  font-size: 24rpx;
  color: #999;
  padding: 8rpx 8rpx 12rpx;
}
.menu-list {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.03);
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-item:active {
  background: #fafafa;
}
.mi-label {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.safe-bottom {
  height: calc(120rpx + env(safe-area-inset-bottom));
}
</style>
