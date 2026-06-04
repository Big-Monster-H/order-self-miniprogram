<template>
  <view class="page-category">
    <!-- 左侧一级分类 -->
    <scroll-view scroll-y class="sidebar">
      <view
        v-for="cat in categories"
        :key="cat.id"
        class="sidebar-item"
        :class="{ active: activeId === cat.id }"
        @click="switchCategory(cat)"
      >
        <text>{{ cat.name }}</text>
      </view>
    </scroll-view>

    <!-- 右侧二级+内容 -->
    <scroll-view scroll-y class="main-content">
      <!-- 二级分类 -->
      <view class="sub-cats" v-if="currentCat.children && currentCat.children.length">
        <view
          v-for="sub in currentCat.children"
          :key="sub.id"
          class="sub-cat-item"
          :class="{ active: activeSubId === sub.id }"
          @click="selectSub(sub)"
        >
          <text>{{ sub.name }}</text>
        </view>
      </view>

      <!-- 商品列表 -->
      <view class="product-list">
        <view class="product-item" v-for="p in products" :key="p.id" @click="goDetail(p)">
          <image class="p-img" :src="p.cover" mode="aspectFill" />
          <view class="p-info">
            <text class="p-name text-ellipsis-2">{{ p.title }}</text>
            <view class="p-tags">
              <text class="tag" v-for="t in p.tags" :key="t">{{ t }}</text>
            </view>
            <view class="p-footer">
              <view class="p-price">
                <text class="symbol">¥</text>
                <text class="value">{{ p.price }}</text>
                <text class="unit">/次</text>
              </view>
              <text class="p-sold">已售{{ p.soldCount }}</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="!products.length" class="empty">暂无服务</view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useCategoryStore } from '@/store/category.js';

const categoryStore = useCategoryStore();
const categories = ref([]);
const activeId = ref(null);

onShow(async () => {
  try {
    await categoryStore.fetchAll();
    categories.value = categoryStore.list || [];
  } catch (e) { console.log(e); }
});

const goProducts = (cat) => {
  uni.navigateTo({ url: '/subpkg/product/list?categoryId=' + cat.id + '&categoryName=' + cat.name });
};
</script>

<style lang="scss" scoped>
.page-category { display: flex; height: calc(100vh - var(--window-top)); }
.sidebar { width: 200rpx; background: #fff; }
.sidebar-item { padding: 30rpx 20rpx; font-size: 28rpx; color: var(--text-secondary); text-align: center; position: relative; }
.sidebar-item.active { color: var(--primary); font-weight: 700; background: var(--bg-page); }
.sidebar-item.active::before { content: ""; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 6rpx; height: 36rpx; background: var(--primary); border-radius: 0 4rpx 4rpx 0; }
.main-content { flex: 1; padding: 20rpx; }
.sub-cats { display: flex; flex-wrap: wrap; gap: 16rpx; margin-bottom: 24rpx; }
.sub-cat-item { padding: 12rpx 24rpx; background: #fff; border-radius: 30rpx; font-size: 24rpx; color: var(--text-secondary); }
.sub-cat-item.active { background: var(--primary-light); color: var(--primary); font-weight: 600; }
.product-item { display: flex; gap: 24rpx; padding: 24rpx; background: #fff; border-radius: var(--radius); margin-bottom: 16rpx; box-shadow: var(--shadow); }
.p-img { width: 180rpx; height: 180rpx; border-radius: 12rpx; flex-shrink: 0; background: #f0f0f0; }
.p-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.p-name { font-size: 28rpx; font-weight: 600; color: var(--text-main); display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; line-height: 1.4; }
.p-tags { display: flex; gap: 10rpx; }
.tag { font-size: 20rpx; color: var(--primary); background: var(--primary-light); padding: 4rpx 12rpx; border-radius: 6rpx; }
.p-footer { display: flex; justify-content: space-between; align-items: baseline; }
.p-price { .symbol { color: var(--danger); font-size: 24rpx; font-weight: 700; } .value { color: var(--danger); font-size: 36rpx; font-weight: 700; } .unit { color: var(--text-light); font-size: 22rpx; } }
.p-sold { font-size: 22rpx; color: var(--text-light); }
.empty { text-align: center; padding: 100rpx 0; color: var(--text-light); }
</style>
