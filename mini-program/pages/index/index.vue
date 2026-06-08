<template>
  <view class="page-index">
    <!-- 自定义导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-location" @click="switchCity">
          <i class="ri-map-pin-2-line" style="font-size:30rpx;color:#fff;" />
          <text class="city-name">{{ currentCity }}</text>
          <i class="ri-arrow-down-s-line" style="font-size:20rpx;color:rgba(255,255,255,0.6);" />
        </view>
        <view class="nav-search" @click="goSearch">
          <i class="ri-search-2-line" style="font-size:28rpx;color:rgba(255,255,255,0.7);" />
          <text class="search-placeholder">搜索服务...</text>
        </view>
        <view class="nav-avatar" @click="goMy">
          <image class="avatar-img" :src="userAvatar || '/static/icons/default-avatar.png'" mode="aspectFill" />
        </view>
      </view>
    </view>

    <!-- 轮播图 -->
    <view class="banner-wrap">
      <swiper class="banner-swiper" indicator-dots indicator-color="rgba(255,255,255,0.4)" indicator-active-color="#fff" autoplay circular interval="4000">
        <swiper-item v-for="banner in banners" :key="banner.id">
          <image class="banner-img" :src="banner.image" mode="aspectFill" @click="onBanner(banner)" />
        </swiper-item>
      </swiper>
    </view>

    <!-- 快捷入口 - 新设计 -->
    <view class="quick-entries">
      <view class="qe-card" v-for="item in quickEntries" :key="item.key" @click="onEntry(item)">
        <view class="qe-icon-box" :style="{ background: item.bgColor }">
          <i :class="'ri-' + item.icon" :style="{ color: item.iconColor, fontSize: '48rpx' }" />
        </view>
        <text class="qe-label">{{ item.label }}</text>
      </view>
    </view>

    <!-- 公告栏 -->
    <view class="notice-bar" v-if="notice.text" @click="goNotice">
      <view class="notice-icon-box">
        <i class="ri-alarm-line" style="font-size:32rpx;color:#FF9100;" />
      </view>
      <view class="notice-content">
        <text class="notice-tag">公告</text>
        <text class="notice-text">{{ notice.text }}</text>
      </view>
      <i class="ri-arrow-right-s-line" style="font-size:28rpx;color:#ccc;" />
    </view>

    <!-- 服务分类 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">服务分类</text>
        <view class="section-more" @click="goCategory">
          <text>全部分类</text>
          <i class="ri-arrow-right-s-line" style="font-size:28rpx;" />
        </view>
      </view>
      <view class="category-grid">
        <view class="category-item" v-for="cat in categories" :key="cat.id" @click="goProductList(cat)">
          <view class="cat-icon-box">
            <image class="cat-icon-img" :src="cat.icon" mode="aspectFit" />
          </view>
          <text class="cat-name">{{ cat.name }}</text>
        </view>
      </view>
    </view>

    <!-- 热门推荐 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">
          <text class="section-emoji">🔥</text>热门推荐
        </text>
        <view class="section-more" @click="goProductList()">
          <text>更多</text>
          <i class="ri-arrow-right-s-line" style="font-size:28rpx;" />
        </view>
      </view>
      <scroll-view scroll-x class="product-scroll" :show-scrollbar="false" enhanced>
        <view class="product-card" v-for="product in hotProducts" :key="product.id" @click="goProductDetail(product)">
          <view class="product-img-wrap">
            <image class="product-img" :src="product.cover" mode="aspectFill" />
            <view class="product-badge" v-if="product.tags && product.tags[0]">{{ product.tags[0] }}</view>
          </view>
          <view class="product-info">
            <text class="product-name">{{ product.title }}</text>
            <view class="product-bottom">
              <view class="product-price">
                <text class="price-symbol">¥</text>
                <text class="price-value">{{ product.price }}</text>
                <text class="price-unit">/次</text>
              </view>
              <text class="product-sold">{{ product.soldCount }}+人已购</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 推荐能手 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">
          <text class="section-emoji">⭐</text>推荐能手
        </text>
        <view class="section-more" @click="goEmployeeList">
          <text>更多</text>
          <i class="ri-arrow-right-s-line" style="font-size:28rpx;" />
        </view>
      </view>
      <scroll-view scroll-x class="employee-scroll" :show-scrollbar="false" enhanced>
        <view class="employee-card" v-for="emp in topEmployees" :key="emp.id">
          <view class="emp-avatar-ring">
            <image class="emp-avatar" :src="emp.avatar" mode="aspectFill" />
          </view>
          <text class="emp-name">{{ emp.nickname }}</text>
          <view class="emp-rate">
            <i class="ri-star-fill" style="font-size:20rpx;color:#FF9100;" />
            <text>{{ emp.rating }}</text>
          </view>
          <view class="emp-tags">
            <text class="emp-tag">{{ emp.completedOrders }}单</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 底部安全区 -->
    <view class="safe-bottom" />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useCategoryStore } from '@/store/category.js';
import { useProductStore } from '@/store/product.js';
import { useEmployeeStore } from '@/store/employee.js';
import { useAuthStore } from '@/store/auth.js';
import { api } from '@/api/request.js';

const authStore = useAuthStore();
const categoryStore = useCategoryStore();
const productStore = useProductStore();
const employeeStore = useEmployeeStore();

const statusBarHeight = ref(20);
const currentCity = ref('深圳');
const userAvatar = ref('');

// 动态分类
const categories = ref([]);
// 热门商品
const hotProducts = ref([]);
// 推荐能手
const topEmployees = ref([]);
// 公告
const notice = ref({ text: '' });
// 轮播
const banners = ref([]);

const quickEntries = ref([
  { key: 'task-pool', icon: 'task-line', label: '任务大厅', bgColor: 'linear-gradient(135deg,#E3F2FD,#BBDEFB)', iconColor: '#1565C0' },
  { key: 'employee', icon: 'user-star-line', label: '接单认证', bgColor: 'linear-gradient(135deg,#FFF3E0,#FFE0B2)', iconColor: '#E65100' },
  { key: 'coupon', icon: 'coupon-line', label: '优惠券', bgColor: 'linear-gradient(135deg,#E8F5E9,#C8E6C9)', iconColor: '#2E7D32' },
  { key: 'service', icon: 'customer-service-2-line', label: '客服', bgColor: 'linear-gradient(135deg,#F3E5F5,#E1BEE7)', iconColor: '#6A1B9A' },
]);

const fetchData = async () => {
  try {
    const [cats, hots, emps, notices] = await Promise.all([
      categoryStore.fetchAll().then(() => categoryStore.list),
      productStore.fetchHot().then(() => productStore.hotList),
      employeeStore.fetchTopEmployees().then(() => employeeStore.topList),
      api.get('/cms/articles', { type: 'notice' }),
    ]);
    categories.value = cats || [];
    hotProducts.value = hots || [];
    topEmployees.value = (emps || []).map(e => ({
      ...e,
      nickname: e.user?.nickname || '能手',
      avatar: e.user?.avatar || '',
    }));
    if (notices && notices.length > 0) {
      notice.value = { text: notices[0].title };
    }
  } catch (e) {
    console.log('首页数据加载失败:', e);
  }
};

onShow(() => {
  if (authStore.userInfo) {
    userAvatar.value = authStore.userInfo.avatar || '';
  }
  fetchData();
});

// 价格分转元
const fmtPrice = (fen) => (fen / 100).toFixed(0);

// 导航
const goSearch = () => uni.showToast({ title: '搜索功能开发中', icon: 'none' });
const goMy = () => uni.switchTab({ url: '/pages/my/index' });
const onBanner = () => {};
const onEntry = (item) => {
  if (item.key === 'task-pool') uni.navigateTo({ url: '/subpkg/employee/task-pool' });
  else if (item.key === 'employee') uni.navigateTo({ url: '/subpkg/employee/auth' });
  else uni.showToast({ title: item.label, icon: 'none' });
};
const goNotice = () => uni.showToast({ title: '查看公告', icon: 'none' });
const goCategory = () => uni.navigateTo({ url: '/subpkg/category/index' });
const goProductList = (cat) => {
  const query = cat ? '?categoryId=' + cat.id + '&categoryName=' + cat.name : '';
  uni.navigateTo({ url: '/subpkg/product/list' + query });
};
const goProductDetail = (product) => uni.navigateTo({ url: '/subpkg/product/detail?id=' + product.id });
const switchCity = () => uni.showToast({ title: "切换城市开发中", icon: "none" });
const goEmployeeList = () => uni.showToast({ title: '更多能手', icon: 'none' });
</script>

<style lang="scss" scoped>
.page-index {
  min-height: 100vh;
  background: #F5F6FA;
}

/* 导航栏 */
.nav-bar {
  background: linear-gradient(135deg, #2979FF 0%, #4A90D9 100%);
  position: sticky;
  top: 0;
  z-index: 100;
}
.nav-content {
  display: flex;
  align-items: center;
  padding: 20rpx 28rpx;
  gap: 20rpx;
}
.nav-location {
  display: flex;
  align-items: center;
  gap: 4rpx;
  flex-shrink: 0;
}
.city-name {
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
  max-width: 100rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.nav-search {
  flex: 1;
  display: flex;
  align-items: center;
  height: 68rpx;
  background: rgba(255,255,255,0.18);
  border-radius: 34rpx;
  padding: 0 28rpx;
  gap: 12rpx;
  background: rgba(255,255,255,0.85); backdrop-filter: blur(10rpx);
}
.search-placeholder {
  color: rgba(255,255,255,0.65);
  font-size: 26rpx;
}
.nav-avatar {
  flex-shrink: 0;
}
.avatar-img {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  border: 3rpx solid rgba(255,255,255,0.4);
  background: #eee;
  display: block;
}

/* 轮播 */
.banner-wrap {
  padding: 24rpx 24rpx 0;
}
.banner-swiper {
  width: 100%;
  height: 320rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 30rpx rgba(41,121,255,0.15);
}
.banner-img {
  width: 100%;
  height: 100%;
  display: block;
}

/* 快捷入口 */
.quick-entries {
  display: flex;
  justify-content: space-between;
  padding: 30rpx 24rpx;
  gap: 16rpx;
}
.qe-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14rpx;
  cursor: pointer;
}
.qe-icon-box {
  width: 96rpx;
  height: 96rpx;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08);
  transition: transform 0.2s;
}
.qe-card:active .qe-icon-box {
  transform: scale(0.92);
}
.qe-label {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}

/* 公告 */
.notice-bar {
  display: flex;
  align-items: center;
  margin: 10rpx 24rpx;
  padding: 20rpx 24rpx;
  background: linear-gradient(135deg, #FFF8E1, #FFF3E0);
  border-radius: 16rpx;
  gap: 16rpx;
}
.notice-icon-box {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: #FFF3E0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.notice-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  overflow: hidden;
}
.notice-tag {
  font-size: 20rpx;
  color: #FF9100;
  background: #FFE0B2;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  font-weight: 600;
  flex-shrink: 0;
}
.notice-text {
  font-size: 24rpx;
  color: #E65100;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 通用区块 */
.section {
  margin: 36rpx 0 0;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24rpx;
  margin-bottom: 20rpx;
}
.section-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1A1A2E;
}
.section-emoji {
  margin-right: 8rpx;
}
.section-more {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 26rpx;
  color: #999;
}

/* 分类网格 */
.category-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0 16rpx;
}
.category-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 0 24rpx;
  gap: 12rpx;
}
.cat-icon-box {
  width: 88rpx;
  height: 88rpx;
  border-radius: 24rpx;
  background: #fff;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.cat-icon-img {
  width: 56rpx;
  height: 56rpx;
}
.cat-name {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}

/* 商品横向滚动 */
.product-scroll {
  white-space: nowrap;
  padding: 0 20rpx 10rpx;
}
.product-card {
  display: inline-block;
  width: 340rpx;
  margin-right: 20rpx;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.06);
}
.product-img-wrap {
  position: relative;
}
.product-img {
  width: 100%;
  height: 220rpx;
  display: block;
}
.product-badge {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  background: linear-gradient(135deg, #FF6D00, #FF9100);
  color: #fff;
  font-size: 20rpx;
  padding: 6rpx 14rpx;
  border-radius: 6rpx;
  font-weight: 600;
}
.product-info {
  padding: 20rpx 24rpx 24rpx;
}
.product-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1A2E;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  white-space: normal;
  margin-bottom: 16rpx;
}
.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.price-symbol {
  color: #FF3D00;
  font-size: 24rpx;
  font-weight: 700;
}
.price-value {
  color: #FF3D00;
  font-size: 38rpx;
  font-weight: 700;
}
.price-unit {
  color: #999;
  font-size: 20rpx;
}
.product-sold {
  font-size: 22rpx;
  color: #999;
}

/* 员工横向滚动 */
.employee-scroll {
  white-space: nowrap;
  padding: 0 20rpx 10rpx;
}
.employee-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 170rpx;
  margin-right: 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx 16rpx 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.06);
  gap: 12rpx;
}
.emp-avatar-ring {
  padding: 4rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #2979FF, #00C853);
}
.emp-avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: #f0f0f0;
  display: block;
  border: 4rpx solid #fff;
}
.emp-name {
  font-size: 28rpx;
  font-weight: 600;
  white-space: normal;
}
.emp-rate {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 24rpx;
  color: #FF9100;
  font-weight: 500;
}
.emp-tags {
  display: flex;
  gap: 6rpx;
}
.emp-tag {
  font-size: 20rpx;
  color: #2979FF;
  background: #E3F2FD;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.safe-bottom {
  height: calc(120rpx + env(safe-area-inset-bottom));
}
</style>
