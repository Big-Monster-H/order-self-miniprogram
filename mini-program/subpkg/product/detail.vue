<template>
  <view class="page-detail">
    <!-- 商品轮播 -->
    <view class="img-wrap">
      <swiper class="img-swiper" indicator-dots indicator-color="rgba(255,255,255,0.4)" indicator-active-color="#fff" circular>
        <swiper-item v-for="(img, idx) in product.images" :key="idx">
          <image class="swiper-img" :src="img" mode="aspectFill" @click="previewImg(idx)" />
        </swiper-item>
      </swiper>
      <view class="img-counter">{{ currentImg + 1 }}/{{ product.images.length }}</view>
    </view>

    <!-- 价格&标题 -->
    <view class="price-card">
      <view class="price-row">
        <view class="price">
          <text class="symbol">¥</text><text class="value">{{ product.price }}</text>
        </view>
        <text class="origin-price" v-if="product.originPrice">¥{{ product.originPrice }}</text>
        <view class="discount-tag" v-if="product.originPrice">
          {{ Math.round((1 - product.price / product.originPrice) * 100) }}% OFF
        </view>
      </view>
      <text class="title">{{ product.title }}</text>
      <view class="meta-row">
        <view class="meta-item">
          <i class="ri-star-fill" style="font-size:24rpx;color:#FF9100;" />
          <text>{{ product.rating }}</text>
          <text class="meta-sub">({{ product.reviewCount }}条)</text>
        </view>
        <view class="meta-divider" />
        <text class="meta-item">已售{{ product.soldCount }}</text>
      </view>
      <view class="tags" v-if="product.tags">
        <text class="tag" v-for="t in product.tags" :key="t">
          <i class="ri-check-line" style="font-size:20rpx;" />{{ t }}
        </text>
      </view>
    </view>

    <!-- 规格选择 -->
    <view class="spec-card" @click="showSpec">
      <view class="spec-left">
        <i class="ri-list-check ri-xl" style="font-size:36rpx;color:#2979FF;" />
        <text class="spec-label">选择规格</text>
      </view>
      <view class="spec-right">
        <text class="spec-value" :class="{ placeholder: !selectedSpec }">
          {{ selectedSpec || '请选择服务规格' }}
        </text>
        <i class="ri-arrow-right-s-line" style="font-size:28rpx;color:#ccc;" />
      </view>
    </view>

    <!-- 服务说明 -->
    <view class="desc-card">
      <view class="card-title">
        <i class="ri-article-line" style="font-size:34rpx;color:#2979FF;" />
        <text>服务说明</text>
      </view>
      <view class="desc-content">
        <text>{{ product.description }}</text>
      </view>
    </view>

    <!-- 可接单能手 -->
    <view class="emp-card">
      <view class="card-title">
        <i class="ri-user-star-line" style="font-size:34rpx;color:#2979FF;" />
        <text>可接单能手</text>
        <text class="card-more">全部 ›</text>
      </view>
      <view class="emp-list">
        <view class="emp-item" v-for="emp in product.employees" :key="emp.id">
          <image class="emp-avatar" :src="emp.avatar" mode="aspectFill" />
          <view class="emp-info">
            <text class="emp-name">{{ emp.nickname }}</text>
            <view class="emp-rate">
              <i class="ri-star-fill" style="font-size:20rpx;color:#FF9100;" />
              <text>{{ emp.rating }} · {{ emp.completedOrders }}单</text>
            </view>
          </view>
          <view class="emp-badge">推荐</view>
        </view>
      </view>
    </view>

    <!-- 用户评价 -->
    <view class="review-card">
      <view class="card-title">
        <i class="ri-chat-3-line" style="font-size:34rpx;color:#2979FF;" />
        <text>用户评价({{ product.reviewCount }})</text>
        <text class="card-more">全部 ›</text>
      </view>
      <view class="review-item" v-for="r in product.reviews" :key="r.id">
        <view class="reviewer">
          <image class="rv-avatar" :src="r.avatar" mode="aspectFill" />
          <view class="rv-info">
            <text class="rv-name">{{ r.nickname }}</text>
            <view class="rv-stars">
              <i v-for="s in 5" :key="s" class="ri-star-fill" style="font-size:22rpx;" :style="{ color: s <= r.rating ? '#FF9100' : '#E0E0E0' }" />
            </view>
          </view>
          <text class="rv-date">{{ r.date }}</text>
        </view>
        <text class="rv-content">{{ r.content }}</text>
        <view class="rv-images" v-if="r.images">
          <image v-for="(img, i) in r.images" :key="i" :src="img" mode="aspectFill" class="rv-img" />
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bar-left">
        <view class="bar-action" @click="goChat">
          <i class="ri-chat-3-line" style="font-size:40rpx;color:#666;" />
          <text class="bar-text">咨询</text>
        </view>
        <view class="bar-action" @click="toggleFav">
          <i :class="product.isFav ? 'ri-heart-3-fill' : 'ri-heart-3-line'" style="font-size:40rpx;" :style="{ color: product.isFav ? '#FF3D00' : '#666' }" />
          <text class="bar-text">收藏</text>
        </view>
      </view>
      <button class="btn-buy" @click="goOrder">立即下单</button>
    </view>

    <!-- 规格弹窗 -->
    <view class="spec-popup" v-if="specVisible" @click="specVisible = false">
      <view class="spec-panel" @click.stop>
        <view class="popup-header">
          <text class="popup-title">选择服务规格</text>
          <i class="ri-close-line" style="font-size:40rpx;color:#999;" @click="specVisible = false" />
        </view>
        <view class="spec-options">
          <view v-for="s in specs" :key="s" class="spec-opt" :class="{ active: selectedSpec === s }" @click="selectSpec(s)">
            <text>{{ s }}</text>
            <i v-if="selectedSpec === s" class="ri-check-line" style="font-size:28rpx;color:#fff;position:absolute;right:16rpx;" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useProductStore } from '@/store/product.js';
import { useAuthStore } from '@/store/auth.js';

const productStore = useProductStore();
const authStore = useAuthStore();
const product = ref(null);
const loading = ref(true);

onLoad(async (options) => {
  try {
    await productStore.fetchDetail(options.id);
    product.value = productStore.current;
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
});

const fmtPrice = (fen) => (fen / 100).toFixed(2);

const buyNow = () => {
  if (!authStore.isLogin) {
    uni.showToast({ title: '请先登录', icon: 'none' });
    return;
  }
  uni.navigateTo({ url: '/subpkg/order/create?productId=' + product.value.id });
};

const goChat = () => {
  uni.navigateTo({ url: '/subpkg/chat/session' });
};
</script>

<style lang="scss" scoped>
.page-detail {
  background: #F5F6FA;
  padding-bottom: 140rpx;
}

/* 图片轮播 */
.img-wrap {
  position: relative;
}
.img-swiper {
  width: 750rpx;
  height: 500rpx;
}
.swiper-img {
  width: 100%;
  height: 100%;
  display: block;
}
.img-counter {
  position: absolute;
  bottom: 28rpx;
  right: 28rpx;
  background: rgba(0,0,0,0.45);
  color: #fff;
  font-size: 22rpx;
  padding: 6rpx 18rpx;
  border-radius: 20rpx;
  backdrop-filter: blur(10rpx);
}

/* 价格卡片 */
.price-card {
  background: #fff;
  margin: -24rpx 24rpx 20rpx;
  padding: 28rpx;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 30rpx rgba(0,0,0,0.08);
  position: relative;
  z-index: 1;
}
.price-row {
  display: flex;
  align-items: baseline;
  gap: 14rpx;
}
.price {
  .symbol { color: #FF3D00; font-size: 36rpx; font-weight: 700; }
  .value { color: #FF3D00; font-size: 56rpx; font-weight: 700; }
}
.origin-price {
  color: #bbb;
  font-size: 28rpx;
  text-decoration: line-through;
}
.discount-tag {
  background: linear-gradient(135deg, #FF3D00, #FF6D00);
  color: #fff;
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  font-weight: 600;
}
.title {
  font-size: 34rpx;
  font-weight: 700;
  line-height: 1.5;
  display: block;
  margin-top: 16rpx;
}
.meta-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-top: 14rpx;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 24rpx;
  color: #666;
}
.meta-sub {
  font-size: 22rpx;
  color: #999;
}
.meta-divider {
  width: 2rpx;
  height: 20rpx;
  background: #e0e0e0;
}
.tags {
  display: flex;
  gap: 14rpx;
  margin-top: 18rpx;
  padding-top: 18rpx;
  border-top: 1rpx solid #f0f0f0;
}
.tag {
  font-size: 22rpx;
  color: #1565C0;
  background: #E3F2FD;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  gap: 4rpx;
}

/* 规格选择 */
.spec-card {
  background: #fff;
  margin: 0 24rpx 16rpx;
  padding: 24rpx 28rpx;
  border-radius: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.spec-left {
  display: flex;
  align-items: center;
  gap: 14rpx;
}
.spec-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}
.spec-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.spec-value {
  font-size: 26rpx;
  color: #333;
}
.spec-value.placeholder {
  color: #ccc;
}

/* 服务说明 */
.desc-card {
  background: #fff;
  margin: 0 24rpx 16rpx;
  padding: 28rpx;
  border-radius: 20rpx;
}
.card-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 30rpx;
  font-weight: 700;
  margin-bottom: 20rpx;
}
.card-more {
  margin-left: auto;
  font-size: 24rpx;
  color: #999;
  font-weight: 400;
}
.desc-content {
  font-size: 28rpx;
  line-height: 1.8;
  color: #666;
  white-space: pre-line;
}

/* 能手 */
.emp-card {
  background: #fff;
  margin: 0 24rpx 16rpx;
  padding: 28rpx;
  border-radius: 20rpx;
}
.emp-list {
  display: flex;
  gap: 20rpx;
}
.emp-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14rpx;
  padding: 18rpx;
  background: #F5F6FA;
  border-radius: 16rpx;
  position: relative;
}
.emp-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #e0e0e0;
}
.emp-info {
  flex: 1;
}
.emp-name {
  font-size: 26rpx;
  font-weight: 600;
  display: block;
}
.emp-rate {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 22rpx;
  color: #999;
  margin-top: 4rpx;
}
.emp-badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  background: linear-gradient(135deg, #2979FF, #1565C0);
  color: #fff;
  font-size: 18rpx;
  padding: 4rpx 10rpx;
  border-radius: 8rpx;
}

/* 评价 */
.review-card {
  background: #fff;
  margin: 0 24rpx 16rpx;
  padding: 28rpx;
  border-radius: 20rpx;
}
.review-item {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}
.review-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.reviewer {
  display: flex;
  align-items: center;
  gap: 14rpx;
}
.rv-avatar {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: #e0e0e0;
}
.rv-info {
  flex: 1;
}
.rv-name {
  font-size: 26rpx;
  font-weight: 600;
  display: block;
}
.rv-stars {
  display: flex;
  gap: 4rpx;
  margin-top: 4rpx;
}
.rv-date {
  font-size: 22rpx;
  color: #bbb;
}
.rv-content {
  margin-top: 16rpx;
  font-size: 26rpx;
  color: #444;
  line-height: 1.6;
}
.rv-images {
  display: flex;
  gap: 12rpx;
  margin-top: 14rpx;
}
.rv-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 10rpx;
  background: #f0f0f0;
}

/* 底部栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 14rpx 28rpx;
  padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.06);
  z-index: 50;
}
.bar-left {
  display: flex;
  gap: 36rpx;
  margin-right: 24rpx;
}
.bar-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}
.bar-text {
  font-size: 20rpx;
  color: #999;
}
.btn-buy {
  flex: 1;
  height: 84rpx;
  line-height: 84rpx;
  background: linear-gradient(135deg, #2979FF, #1565C0);
  color: #fff;
  font-size: 32rpx;
  border-radius: 42rpx;
  text-align: center;
  border: none;
  font-weight: 600;
  padding: 0;
}

/* 规格弹窗 */
.spec-popup {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: flex-end;
  z-index: 200;
  backdrop-filter: blur(4rpx);
}
.spec-panel {
  width: 100%;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  padding: 36rpx 28rpx;
  padding-bottom: calc(36rpx + env(safe-area-inset-bottom));
  animation: slideUp 0.25s ease-out;
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}
.popup-title {
  font-size: 32rpx;
  font-weight: 700;
}
.spec-options {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.spec-opt {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-radius: 16rpx;
  background: #F5F6FA;
  font-size: 28rpx;
  color: #333;
  position: relative;
  transition: all 0.2s;
}
.spec-opt.active {
  background: #E3F2FD;
  color: #1565C0;
  font-weight: 600;
  border: 2rpx solid #2979FF;
}
</style>
