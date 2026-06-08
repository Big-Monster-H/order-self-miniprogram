<template>
  <view class="page-create">
    <!-- 商品摘要 -->
    <view class="goods-card">
      <image class="gc-img" :src="product.cover" mode="aspectFill" />
      <view class="gc-info">
        <text class="gc-name">{{ product.title }}</text>
        <text class="gc-spec">{{ selectedSpec }}</text>
        <view class="gc-price-row">
          <text class="gc-price">¥{{ product.price }}</text>
          <text class="gc-qty">×1</text>
        </view>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="info-card">
      <view class="ic-title">订单信息</view>
      <view class="ic-row" @click="chooseAddress">
        <view class="ic-icon"><i class="ri-map-pin-2-line" style="font-size:36rpx;color:#2979FF;" /></view>
        <view class="ic-content">
          <text class="ic-label">服务地址</text>
          <text v-if="address" class="ic-value">{{ address }}</text>
          <text v-else class="ic-placeholder">请选择服务地址</text>
        </view>
        <i class="ri-arrow-right-s-line" style="font-size:28rpx;color:#ccc;" />
      </view>
      <view class="ic-row" @click="showDate">
        <view class="ic-icon"><i class="ri-calendar-2-line" style="font-size:36rpx;color:#FF9100;" /></view>
        <view class="ic-content">
          <text class="ic-label">预约时间</text>
          <text :class="appointDate ? 'ic-value' : 'ic-placeholder'">{{ appointDate || '请选择预约时间' }}</text>
        </view>
        <i class="ri-arrow-right-s-line" style="font-size:28rpx;color:#ccc;" />
      </view>
      <view class="ic-row">
        <view class="ic-icon"><i class="ri-user-3-line" style="font-size:36rpx;color:#00C853;" /></view>
        <view class="ic-content" style="flex-direction:row;gap:16rpx;">
          <input class="ic-input" v-model="contactName" placeholder="联系人姓名" placeholder-style="color:#ccc" />
          <input class="ic-input" v-model="contactPhone" type="number" maxlength="11" placeholder="联系电话" placeholder-style="color:#ccc" />
        </view>
      </view>
      <view class="ic-row" style="align-items:flex-start;">
        <view class="ic-icon"><i class="ri-chat-3-line" style="font-size:36rpx;color:#999;" /></view>
        <textarea class="ic-textarea" v-model="remark" placeholder="备注（选填）" :maxlength="200" placeholder-style="color:#ccc" />
      </view>
    </view>

    <!-- 费用明细 -->
    <view class="price-card">
      <view class="pc-row"><text>商品金额</text><text>¥{{ product.price }}</text></view>
      <view class="pc-row"><text class="pc-label">平台服务费</text><text class="pc-free">免费</text></view>
      <view class="pc-total"><text>合计</text><view class="pct-price"><text class="pct-symbol">¥</text><text class="pct-value">{{ product.price }}</text></view></view>
    </view>

    <!-- 协议 -->
    <view class="agree-row">
      <view class="ar-check" :class="{ on: agreed }" @click="agreed = !agreed">
        <i v-if="agreed" class="ri-check-line" style="font-size:22rpx;color:#fff;" />
      </view>
      <text>已阅读并同意</text>
      <text class="ar-link">《平台服务协议》</text>
    </view>

    <!-- 提交 -->
    <view class="submit-bar">
      <view class="sb-total">
        <text class="sbt-label">实付：</text>
        <text class="sbt-price">¥{{ product.price }}</text>
      </view>
      <button class="sb-btn" :disabled="!canSubmit" @click="submitOrder">提交订单</button>
    </view>
  </view>
</template>

<script setup>
const showDate = () => uni.showToast({ title: "选择日期", icon: "none" });
const chooseAddress = () => uni.showToast({ title: "选择地址", icon: "none" });
const agreed = () => uni.showToast({ title: "已同意协议", icon: "success" });
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useProductStore } from '@/store/product.js';
import { useOrderStore } from '@/store/order.js';

const productStore = useProductStore();
const orderStore = useOrderStore();
const product = ref(null);
const quantity = ref(1);
const remark = ref('');
const submitting = ref(false);

onLoad(async (options) => {
  await productStore.fetchDetail(options.productId);
  product.value = productStore.current;
});

const fmtPrice = (fen) => (fen / 100).toFixed(2);
const totalPrice = () => product.value ? (product.value.price * quantity.value / 100).toFixed(2) : '0.00';
const commission = () => product.value ? (product.value.price * quantity.value * 0.08 / 100).toFixed(2) : '0.00';

const submitOrder = async () => {
  if (submitting.value) return;
  submitting.value = true;
  try {
    const order = await orderStore.createOrder({
      product_id: product.value.id,
      quantity: quantity.value,
      remark: remark.value,
    });
    uni.navigateTo({ url: '/subpkg/order/pay?orderId=' + order.id });
  } catch (e) {
    uni.showToast({ title: '下单失败', icon: 'none' });
  } finally {
    submitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
.page-create { min-height: 100vh; background: #F5F6FA; padding-bottom: 140rpx; }

.goods-card {
  display: flex; gap: 20rpx; background: #fff; margin: 20rpx 24rpx; padding: 24rpx;
  border-radius: 20rpx; box-shadow: 0 4rpx 16rpx rgba(0,0,0,.04);
}
.gc-img { width: 140rpx; height: 140rpx; border-radius: 14rpx; background: #f0f0f0; }
.gc-info { flex: 1; display: flex; flex-direction: column; gap: 8rpx; }
.gc-name { font-size: 28rpx; font-weight: 600; line-height: 1.4; }
.gc-spec { font-size: 24rpx; color: #999; }
.gc-price-row { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
.gc-price { font-size: 32rpx; color: #FF3D00; font-weight: 700; }
.gc-qty { font-size: 24rpx; color: #999; }

.info-card { background: #fff; margin: 0 24rpx; border-radius: 20rpx; padding: 28rpx 24rpx; box-shadow: 0 4rpx 16rpx rgba(0,0,0,.04); }
.ic-title { font-size: 30rpx; font-weight: 700; margin-bottom: 20rpx; }
.ic-row { display: flex; align-items: center; gap: 16rpx; padding: 20rpx 0; border-bottom: 1rpx solid #F5F5F5; }
.ic-row:last-child { border-bottom: none; }
.ic-icon { width: 56rpx; height: 56rpx; border-radius: 50%; background: #F5F6FA; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ic-content { flex: 1; display: flex; flex-direction: column; }
.ic-label { font-size: 24rpx; color: #999; }
.ic-value { font-size: 28rpx; color: #333; font-weight: 500; margin-top: 4rpx; }
.ic-placeholder { font-size: 26rpx; color: #ccc; margin-top: 4rpx; }
.ic-input { flex: 1; font-size: 26rpx; }
.ic-textarea { flex: 1; font-size: 26rpx; min-height: 80rpx; }

.price-card { background: #fff; margin: 20rpx 24rpx; border-radius: 20rpx; padding: 24rpx 28rpx; box-shadow: 0 4rpx 16rpx rgba(0,0,0,.04); }
.pc-row { display: flex; justify-content: space-between; padding: 14rpx 0; font-size: 26rpx; color: #666; }
.pc-free { color: #00C853; font-weight: 500; }
.pc-total { display: flex; justify-content: space-between; align-items: center; padding: 18rpx 0 0; border-top: 1rpx solid #F0F0F0; font-size: 28rpx; font-weight: 700; }
.pct-symbol { color: #FF3D00; font-size: 28rpx; }
.pct-value { color: #FF3D00; font-size: 40rpx; font-weight: 700; }

.agree-row { display: flex; align-items: center; gap: 10rpx; padding: 0 28rpx; font-size: 24rpx; color: #999; margin-bottom: 20rpx; }
.ar-check { width: 34rpx; height: 34rpx; border: 2rpx solid #ddd; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.ar-check.on { background: #2979FF; border-color: #2979FF; }
.ar-link { color: #2979FF; }

.submit-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; padding: 16rpx 28rpx; padding-bottom: calc(16rpx + env(safe-area-inset-bottom)); display: flex; align-items: center; gap: 20rpx; box-shadow: 0 -4rpx 20rpx rgba(0,0,0,.06); }
.sb-total { flex-shrink: 0; }
.sbt-label { font-size: 24rpx; color: #999; }
.sbt-price { font-size: 36rpx; font-weight: 700; color: #FF3D00; }
.sb-btn { flex: 1; height: 88rpx; line-height: 88rpx; background: linear-gradient(135deg, #2979FF, #1565C0); color: #fff; font-size: 32rpx; border-radius: 44rpx; border: none; font-weight: 600; padding: 0; text-align: center; }
.sb-btn[disabled] { background: #ddd; color: #999; }
</style>
