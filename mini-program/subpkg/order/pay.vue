<template>
  <view class="page-pay">
    <view class="pay-header">
      <view class="ri-time-line" style="font-size:36rpx;" />
      <text class="pay-countdown">请在 {{ countdown }} 内完成支付</text>
    </view>

    <view class="pay-amount card">
      <text class="amount-label">实付金额</text>
      <view class="amount-value"><text class="symbol">¥</text><text class="value">{{ price }}</text></view>
      <text class="order-no">订单号：{{ orderNo }}</text>
    </view>

    <view class="pay-methods card">
      <text class="pm-title">支付方式</text>
      <view class="pm-item active">
        <view class="ri-wechat-2-line" style="font-size:44rpx;" />
        <text class="pm-name">微信支付</text>
        <view class="pm-check"><view class="ri-check-line" style="font-size:18rpx;" /></view>
      </view>
    </view>

    <view class="pay-submit">
      <button class="btn-pay" @click="toPay">微信支付 ¥{{ price }}</button>
    </view>
  </view>
</template>

<script setup>
const toPay = () => { uni.showToast({ title: "调起支付", icon: "none" }); };
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useOrderStore } from '@/store/order.js';
import { api } from '@/api/request.js';

const orderStore = useOrderStore();
const order = ref(null);
const payMethod = ref('wechat');
const paying = ref(false);

onLoad(async (options) => {
  await orderStore.fetchDetail(options.orderId);
  order.value = orderStore.currentOrder;
});

const fmtPrice = (fen) => (fen / 100).toFixed(2);

const doPay = async () => {
  if (paying.value) return;
  paying.value = true;
  try {
    const res = await api.post('/payment/wxpay', { order_id: order.value.id });
    // 微信小程序支付 - 调起支付
    uni.requestPayment({
      provider: 'wxpay',
      timeStamp: res.payParams.timeStamp,
      nonceStr: res.payParams.nonceStr,
      package: res.payParams.package,
      signType: res.payParams.signType || 'MD5',
      paySign: res.payParams.paySign,
      success: () => {
        uni.showToast({ title: '支付成功', icon: 'success' });
        setTimeout(() => uni.switchTab({ url: '/pages/order/list' }), 1500);
      },
      fail: (e) => {
        uni.showToast({ title: '支付取消或失败', icon: 'none' });
      },
    });
  } catch (e) {
    uni.showToast({ title: e.message || '支付失败', icon: 'none' });
  } finally {
    paying.value = false;
  }
};
</script>

<style lang="scss" scoped>
.page-pay { min-height: 100vh; background: var(--bg-page); }
.pay-header { display: flex; align-items: center; justify-content: center; gap: 12rpx; padding: 30rpx; background: #FFF3E0; }
.pay-countdown { font-size: 28rpx; color: var(--warning); font-weight: 600; }
.pay-amount { margin: 20rpx; text-align: center; padding: 50rpx 30rpx; }
.amount-label { font-size: 26rpx; color: var(--text-light); display: block; }
.amount-value { margin: 20rpx 0; }
.symbol { font-size: 40rpx; color: var(--danger); font-weight: 700; }
.value { font-size: 72rpx; color: var(--danger); font-weight: 700; }
.order-no { font-size: 24rpx; color: var(--text-light); }
.pay-methods { margin: 20rpx; }
.pm-title { font-size: 28rpx; font-weight: 700; display: block; margin-bottom: 20rpx; }
.pm-item { display: flex; align-items: center; gap: 16rpx; padding: 24rpx 0; }
.pm-name { flex: 1; font-size: 30rpx; }
.pm-check { width: 40rpx; height: 40rpx; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; }
.pay-submit { padding: 30rpx; padding-bottom: calc(30rpx + env(safe-area-inset-bottom)); }
.btn-pay { width: 100%; height: 88rpx; line-height: 88rpx; background: linear-gradient(135deg, #2979FF, #1565C0); color: #fff; font-size: 32rpx; border-radius: 44rpx; text-align: center; border: none; font-weight: 600; padding: 0; }
</style>
