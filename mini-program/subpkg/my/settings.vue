<template>
  <view class="page-settings">
    <view class="menu card">
      <view class="menu-item" @click="editProfile">
        <view class="ri-tab-my" style="font-size:36rpx;" /><text class="mi-label">个人信息</text><view class="ri-arrow-right-s-line" style="font-size:32rpx;" />
      </view>
      <view class="menu-item" @click="goAddress">
        <view class="ri-map-pin-2-line" style="font-size:36rpx;" /><text class="mi-label">地址管理</text><view class="ri-arrow-right-s-line" style="font-size:32rpx;" />
      </view>
      <view class="menu-item">
        <view class="ri-notification-3-line" style="font-size:36rpx;" /><text class="mi-label">消息通知</text>
        <switch :checked="notifyEnabled" @change="notifyEnabled = $event.detail.value" color="#2979FF" />
      </view>
      <view class="menu-item" @click="clearCache">
        <view class="ri-refresh-line" style="font-size:36rpx;" /><text class="mi-label">清除缓存</text>
        <text class="mi-value">12.5MB</text><view class="ri-arrow-right-s-line" style="font-size:32rpx;" />
      </view>
    </view>
    <view class="menu card">
      <view class="menu-item" @click="goAbout">
        <view class="ri-information-line" style="font-size:36rpx;" /><text class="mi-label">关于我们</text><view class="ri-arrow-right-s-line" style="font-size:32rpx;" />
      </view>
      <view class="menu-item" @click="goPrivacy">
        <view class="ri-eye-2-line" style="font-size:36rpx;" /><text class="mi-label">隐私政策</text><view class="ri-arrow-right-s-line" style="font-size:32rpx;" />
      </view>
      <view class="menu-item" @click="goAgreement">
        <view class="ri-check-line" style="font-size:36rpx;background:var(--primary);border-radius:50%;" /><text class="mi-label">用户协议</text><view class="ri-arrow-right-s-line" style="font-size:32rpx;" />
      </view>
    </view>
    <view class="logout-area">
      <button class="btn-logout" @click="logout">
        <view class="ri-logout-box-line" style="font-size:32rpx;margin-right:10rpx;" />退出登录
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth.js';

const authStore = useAuthStore();
const cacheSize = ref('0MB');

const clearCache = () => {
  uni.showToast({ title: '缓存已清除', icon: 'success' });
  cacheSize.value = '0MB';
};

const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) authStore.logout();
    },
  });
};

const goPage = (url) => uni.navigateTo({ url });
</script>

<style lang="scss" scoped>
.page-settings { padding: 20rpx; background: var(--bg-page); min-height: 100vh; }
.menu { margin-bottom: 20rpx; }
.menu-item { display: flex; align-items: center; gap: 20rpx; padding: 30rpx 0; border-bottom: 1rpx solid var(--border); }
.menu-item:last-child { border-bottom: none; }
.mi-label { flex: 1; font-size: 28rpx; }
.mi-value { font-size: 26rpx; color: var(--text-light); }
.logout-area { padding: 40rpx 0; }
.btn-logout { width: 100%; height: 88rpx; line-height: 88rpx; background: #fff; color: var(--danger); font-size: 30rpx; border-radius: 44rpx; border: 2rpx solid var(--danger); display: flex; align-items: center; justify-content: center; }
</style>
