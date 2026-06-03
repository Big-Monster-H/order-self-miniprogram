<template>
  <view class="page-product-list">
    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view class="filter-item" :class="{ active: sortType === 'default' }" @click="setSort('default')">综合排序</view>
      <view class="filter-item" :class="{ active: sortType === 'sales' }" @click="setSort('sales')">销量优先</view>
      <view class="filter-item" :class="{ active: sortType === 'price' }" @click="setSort('price')">
        价格 <text>{{ sortType === 'price' ? (priceOrder ? '↑' : '↓') : '' }}</text>
      </view>
      <view class="filter-item" :class="{ active: sortType === 'rating' }" @click="setSort('rating')">评分优先</view>
    </view>

    <!-- 商品列表 -->
    <view class="product-list">
      <view class="product-item" v-for="p in products" :key="p.id" @click="goDetail(p)">
        <image class="p-img" :src="p.cover" mode="aspectFill" />
        <view class="p-info">
          <text class="p-name text-ellipsis-2">{{ p.title }}</text>
          <view class="p-meta">
            <view class="p-rating">
              <text class="star">⭐</text>
              <text>{{ p.rating }}</text>
            </view>
            <text class="p-sold">已售{{ p.soldCount }}</text>
          </view>
          <view class="p-footer">
            <view class="p-price">
              <text class="symbol">¥</text>
              <text class="value">{{ p.price }}</text>
              <text class="unit">/次</text>
            </view>
            <view class="btn-buy">立即下单</view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="loading" class="loading">加载中...</view>
    <view v-if="finished && !products.length" class="empty">暂无相关服务</view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useProductStore } from '@/store/product.js';

const productStore = useProductStore();
const sortType = ref('default');
const priceOrder = ref(false);
const products = ref([]);
const loading = ref(true);
const finished = ref(false);
let categoryId = null;
let page = 1;

onLoad((options) => {
  categoryId = options.categoryId || null;
  if (options.categoryName) uni.setNavigationBarTitle({ title: options.categoryName });
  loadProducts();
});

const setSort = (type) => {
  if (type === 'price') {
    priceOrder.value = sortType.value === 'price' ? !priceOrder.value : false;
  }
  sortType.value = type;
  page = 1;
  products.value = [];
  loadProducts();
};

const loadProducts = async () => {
  loading.value = true;
  try {
    const params = { page, pageSize: 10 };
    if (categoryId) params.category_id = categoryId;
    const res = await productStore.fetchList(params);
    if (page === 1) {
      products.value = productStore.list || [];
    } else {
      products.value = [...products.value, ...(productStore.list || [])];
    }
    finished.value = productStore.list.length < 10;
  } catch (e) {
    console.log('加载失败:', e);
  } finally {
    loading.value = false;
  }
};

const fmtPrice = (fen) => (fen / 100).toFixed(0);

const goDetail = (p) => uni.navigateTo({ url: '/subpkg/product/detail?id=' + p.id });
</script>

<style lang="scss" scoped>
.page-product-list { min-height: 100vh; background: var(--bg-page); }
.filter-bar { display: flex; background: #fff; padding: 0 20rpx; border-bottom: 1rpx solid var(--border); position: sticky; top: 0; z-index: 10; }
.filter-item { flex: 1; text-align: center; padding: 24rpx 0; font-size: 26rpx; color: var(--text-secondary); }
.filter-item.active { color: var(--primary); font-weight: 700; }
.product-list { padding: 20rpx; }
.product-item { display: flex; gap: 24rpx; padding: 24rpx; background: #fff; border-radius: var(--radius); margin-bottom: 16rpx; box-shadow: var(--shadow); }
.p-img { width: 200rpx; height: 200rpx; border-radius: 12rpx; flex-shrink: 0; background: #f0f0f0; }
.p-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.p-name { font-size: 28rpx; font-weight: 600; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; line-height: 1.4; }
.p-meta { display: flex; align-items: center; gap: 20rpx; font-size: 24rpx; color: var(--text-light); }
.p-rating { color: var(--warning); }
.p-footer { display: flex; justify-content: space-between; align-items: center; }
.p-price { .symbol { color: var(--danger); font-size: 24rpx; font-weight: 700; } .value { color: var(--danger); font-size: 36rpx; font-weight: 700; } .unit { color: var(--text-light); font-size: 22rpx; } }
.btn-buy { background: linear-gradient(135deg, #2979FF, #1565C0); color: #fff; font-size: 24rpx; padding: 12rpx 28rpx; border-radius: 30rpx; font-weight: 600; }
.loading, .empty { text-align: center; padding: 60rpx; color: var(--text-light); }
</style>
