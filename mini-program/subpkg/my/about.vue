<template>
  <view class="page-about">
    <view class="logo-area card">
      <image class="logo" src="/static/icons/logo.png" mode="aspectFit" />
      <text class="app-name">自主接单平台</text>
      <text class="version">Version 1.0.0</text>
    </view>

    <view class="info card">
      <text class="info-title">平台介绍</text>
      <text class="info-desc">自主接单平台是一个连接用户与服务提供者的通用任务平台。用户可以发布需求，经过认证的服务能手可以自主接单，高效完成各类服务任务。平台提供在线支付、实时沟通、评价体系等完整服务闭环。</text>
    </view>

    <view class="contact card">
      <view class="contact-item">
        <text class="ci-label">客服电话</text>
        <text class="ci-value link" @click="callPhone">400-888-8888</text>
      </view>
      <view class="contact-item">
        <text class="ci-label">客服邮箱</text>
        <text class="ci-value">support@jiedan.com</text>
      </view>
      <view class="contact-item">
        <text class="ci-label">工作时间</text>
        <text class="ci-value">周一至周日 9:00-21:00</text>
      </view>
    </view>

    <text class="copyright">© 2026 自主接单平台 All Rights Reserved</text>
  </view>
</template>

<script setup>
const callPhone = () => uni.makePhoneCall({ phoneNumber: "4008888888" });
</script>

<style lang="scss" scoped>
.page-about { padding: 20rpx; background: var(--bg-page); min-height: 100vh; text-align: center; }
.logo-area { padding: 60rpx 30rpx; margin-bottom: 20rpx; display: flex; flex-direction: column; align-items: center; gap: 16rpx; }
.logo { width: 120rpx; height: 120rpx; border-radius: 30rpx; background: var(--primary); }
.app-name { font-size: 36rpx; font-weight: 700; }
.version { font-size: 24rpx; color: var(--text-light); }
.info { margin-bottom: 20rpx; text-align: left; }
.info-title { font-size: 28rpx; font-weight: 700; display: block; margin-bottom: 16rpx; }
.info-desc { font-size: 26rpx; color: var(--text-secondary); line-height: 1.8; }
.contact { margin-bottom: 20rpx; text-align: left; }
.contact-item { display: flex; justify-content: space-between; padding: 20rpx 0; border-bottom: 1rpx solid var(--border); }
.contact-item:last-child { border-bottom: none; }
.ci-label { font-size: 28rpx; color: var(--text-secondary); }
.ci-value { font-size: 28rpx; }
.ci-value.link { color: var(--primary); }
.copyright { font-size: 24rpx; color: var(--text-light); padding: 40rpx 0; display: block; }
</style>
