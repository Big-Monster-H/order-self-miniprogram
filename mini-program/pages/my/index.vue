<template>
  <view class="page-my">
    <!-- 头部 -->
    <view class="header" :style="{ paddingTop: statusBarHeight + 30 + 'px' }">
      <view class="header-bg" />
      <view class="header-content">
        <!-- 未登录 -->
        <view class="user-card" v-if="!isLogin">
          <image class="uc-avatar" src="/static/icons/default-avatar.png" mode="aspectFill" />
          <view class="uc-info">
            <text class="uc-name">点击登录</text>
            <text class="uc-desc">登录解锁更多功能</text>
          </view>
          <button class="phone-login-btn" open-type="getPhoneNumber" @getphonenumber="onGetPhone">
            微信一键登录
          </button>
        </view>
        <!-- 已登录 -->
        <view class="user-card" v-else @click="goEditProfile">
          <image class="uc-avatar" :src="userInfo.avatar" mode="aspectFill" />
          <view class="uc-info">
            <text class="uc-name">{{ userInfo.nickname }}</text>
            <text class="uc-desc">{{ userInfo.phone || '未绑定手机号' }}</text>
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
          <text>接单赚钱</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="section">
      <view class="section-title">服务</view>
      <view class="menu-grid">
        <view class="menu-item" @click="goPage('/subpkg/order/create')">
          <i class="ri-add-circle-line menu-icon" style="color:#2979FF;" />
          <text class="menu-text">发布需求</text>
        </view>
        <view class="menu-item" @click="goPage('/subpkg/employee/task-pool')">
          <i class="ri-task-line menu-icon" style="color:#FF6D00;" />
          <text class="menu-text">任务池</text>
        </view>
        <view class="menu-item" @click="goPage('/subpkg/employee/auth')">
          <i class="ri-shield-check-line menu-icon" style="color:#00C853;" />
          <text class="menu-text">员工认证</text>
        </view>
        <view class="menu-item" @click="goPage('/subpkg/my/employee-center')">
          <i class="ri-briefcase-4-line menu-icon" style="color:#AA00FF;" />
          <text class="menu-text">接单中心</text>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">其他</view>
      <view class="menu-list">
        <view class="menu-row" @click="goPage('/subpkg/my/refund-list')">
          <text>退款记录</text>
          <i class="ri-arrow-right-s-line" />
        </view>
        <view class="menu-row" @click="goPage('/subpkg/my/settings')">
          <text>设置</text>
          <i class="ri-arrow-right-s-line" />
        </view>
        <view class="menu-row" @click="goPage('/subpkg/my/about')">
          <text>关于我们</text>
          <i class="ri-arrow-right-s-line" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useAuthStore } from '@/store/auth.js';
import { useOrderStore } from '@/store/order.js';

const authStore = useAuthStore();
const orderStore = useOrderStore();
const userInfo = ref({});
const statusBarHeight = ref(44);

onShow(async () => {
  userInfo.value = authStore.userInfo;
  if (authStore.isLogin) {
    try {
      const res = await orderStore.fetchMyOrders();
    } catch (e) { console.log(e); }
  }
  uni.getSystemInfo({ success: s => statusBarHeight.value = s.statusBarHeight || 44 });
});

/** 微信一键登录 + 获取手机号 */
const onGetPhone = async (e) => {
  if (e.detail.errMsg !== 'getPhoneNumber:ok') return;
  try {
    // 1. 获取手机号
    const phoneRes = await uni.request({
      url: uni.getStorageSync('apiBase') + '/api/auth/wx-phone',
      method: 'POST',
      data: { code: e.detail.code },
    });
    const phone = phoneRes.data.phone;

    // 2. 微信登录（getUserInfo已废弃，使用wx.login获取openid）
    const loginRes = await uni.login();
    await authStore.wxLogin(loginRes.code, '', '');

    // 3. 绑定手机号
    await authStore.updateProfile({ phone });
    userInfo.value = authStore.userInfo;
    uni.showToast({ title: '登录成功', icon: 'success' });
  } catch (err) {
    uni.showToast({ title: '登录失败', icon: 'none' });
  }
};

const goPage = (url) => {
  if (!authStore.isLogin) {
    uni.showToast({ title: '请先登录', icon: 'none' });
    return;
  }
  uni.navigateTo({ url });
};

const goEditProfile = () => uni.navigateTo({ url: '/subpkg/my/settings' });
const switchRole = (role) => uni.showToast({ title: '切换为' + (role === 'employee' ? '接单模式' : '用户模式'), icon: 'none' });
</script>

<style lang="scss" scoped>
.page-my { min-height: 100vh; background: var(--bg); padding-bottom: 120rpx; }
.header { position: relative; overflow: hidden; }
.header-bg { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 0 0 50% 50%; transform: scaleX(1.5); }
.header-content { position: relative; z-index: 1; padding: 0 32rpx 40rpx; }
.user-card { display: flex; align-items: center; gap: 20rpx; }
.uc-avatar { width: 120rpx; height: 120rpx; border-radius: 50%; border: 4rpx solid rgba(255,255,255,.3); background: #eee; }
.uc-info { flex: 1; }
.uc-name { font-size: 36rpx; font-weight: 700; color: #fff; display: block; }
.uc-desc { font-size: 24rpx; color: rgba(255,255,255,.7); margin-top: 8rpx; display: block; }
.uc-edit { padding: 10rpx; }
.phone-login-btn { background: #fff; color: #2979FF; font-size: 26rpx; padding: 12rpx 28rpx; border-radius: 32rpx; border: none; line-height: 1.4; font-weight: 600; }

.header-stats { display: flex; margin-top: 32rpx; background: rgba(255,255,255,.15); border-radius: 16rpx; padding: 24rpx; }
.stat-item { flex: 1; text-align: center; }
.stat-num { font-size: 40rpx; font-weight: 700; color: #fff; display: block; }
.stat-label { font-size: 22rpx; color: rgba(255,255,255,.7); margin-top: 6rpx; display: block; }
.stat-divider { width: 1rpx; background: rgba(255,255,255,.2); }

.role-switch { display: flex; margin: -20rpx 32rpx 20rpx; background: #fff; border-radius: 16rpx; padding: 12rpx; box-shadow: 0 4rpx 20rpx rgba(0,0,0,.08); position: relative; z-index: 2; }
.role-tab { flex: 1; text-align: center; padding: 20rpx; border-radius: 12rpx; font-size: 28rpx; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; }
.role-tab.active { background: rgba(41,121,255,.08); color: #2979FF; font-weight: 600; }

.section { margin: 24rpx 32rpx; }
.section-title { font-size: 28rpx; font-weight: 700; color: var(--text-main); margin-bottom: 16rpx; }
.menu-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx; }
.menu-item { background: #fff; border-radius: 16rpx; padding: 28rpx 0; text-align: center; box-shadow: 0 2rpx 12rpx rgba(0,0,0,.04); }
.menu-icon { font-size: 48rpx; display: block; margin-bottom: 10rpx; }
.menu-text { font-size: 24rpx; color: var(--text-secondary); }

.menu-list { background: #fff; border-radius: 16rpx; overflow: hidden; }
.menu-row { display: flex; justify-content: space-between; align-items: center; padding: 28rpx 32rpx; font-size: 28rpx; color: var(--text-main); border-bottom: 1rpx solid var(--border); }
.menu-row:last-child { border-bottom: none; }
</style>
