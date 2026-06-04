<template>
  <view class="page-ec">
    <!-- 头部数据 -->
    <view class="ec-header">
      <view class="ec-bg" />
      <view class="ec-user">
        <image class="ecu-avatar" src="https://picsum.photos/100/100?random=31" mode="aspectFill" />
        <view class="ecu-info">
          <text class="ecu-name">张师傅</text>
          <view class="ecu-rate">
            <i v-for="n in 5" :key="n" class="ri-star-fill" style="font-size:22rpx;" :style="{ color: n <= 4.9 ? '#FFD600' : 'rgba(255,255,255,0.3)' }" />
            <text class="ecu-rate-num">4.9</text>
          </view>
        </view>
      </view>
      <view class="ec-stats">
        <view class="ecs-item">
          <text class="ecs-val">523</text>
          <text class="ecs-lbl">已完成</text>
        </view>
        <view class="ecs-div" />
        <view class="ecs-item">
          <text class="ecs-val">98%</text>
          <text class="ecs-lbl">好评率</text>
        </view>
        <view class="ecs-div" />
        <view class="ecs-item">
          <text class="ecs-val">¥32,880</text>
          <text class="ecs-lbl">累计收入</text>
        </view>
      </view>
    </view>

    <!-- 今日待办 -->
    <view class="ec-today">
      <view class="ect-header">
        <text class="ect-title"><i class="ri-calendar-check-line" style="margin-right:8rpx;color:#2979FF;" />今日待办</text>
        <text class="ect-count">3项</text>
      </view>
      <view class="ect-list">
        <view class="ect-item" v-for="t in todos" :key="t.id">
          <view class="ecti-time">
            <text class="ecti-hour">{{ t.time }}</text>
            <view class="ecti-line" />
          </view>
          <view class="ecti-card" :class="t.status">
            <view class="ectic-top">
              <text class="ectic-title">{{ t.title }}</text>
              <view class="ectic-tag" :class="t.status">{{ t.statusText }}</view>
            </view>
            <view class="ectic-bottom">
              <text class="ectic-addr"><i class="ri-map-pin-2-line" style="font-size:20rpx;" />{{ t.address }}</text>
              <text class="ectic-price">¥{{ t.price }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能入口 -->
    <view class="ec-menu">
      <view class="ecm-grid">
        <view class="ecm-item" @click="go('orders')">
          <view class="ecmi-icon" style="background:#E3F2FD;"><i class="ri-file-list-2-line" style="font-size:36rpx;color:#2979FF;" /></view>
          <text class="ecmi-label">我的接单</text>
        </view>
        <view class="ecm-item" @click="go('income')">
          <view class="ecmi-icon" style="background:#E8F5E9;"><i class="ri-funds-line" style="font-size:36rpx;color:#00C853;" /></view>
          <text class="ecmi-label">收入明细</text>
        </view>
        <view class="ecm-item" @click="go('withdraw')">
          <view class="ecmi-icon" style="background:#FFF3E0;"><i class="ri-bank-line" style="font-size:36rpx;color:#FF9100;" /></view>
          <text class="ecmi-label">提现</text>
        </view>
        <view class="ecm-item" @click="go('deposit')">
          <view class="ecmi-icon" style="background:#F3E5F5;"><i class="ri-lock-2-line" style="font-size:36rpx;color:#9C27B0;" /></view>
          <text class="ecmi-label">保证金</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onShow } from 'vue';
import { useEmployeeStore } from '@/store/employee.js';

const empStore = useEmployeeStore();
const stats = ref(null);
const profile = ref(null);

onShow(async () => {
  try {
    await empStore.fetchStats();
    stats.value = empStore.stats;
    await empStore.fetchProfile();
    profile.value = empStore.profile;
  } catch (e) { console.log(e); }
});

const fmtPrice = (fen) => (fen / 100).toFixed(0);
</script>

<style lang="scss" scoped>
.page-ec { min-height: 100vh; background: #F5F6FA; }

.ec-header {
  position: relative;
  padding: 0 28rpx 28rpx;
  overflow: hidden;
}
.ec-bg {
  position: absolute; inset: 0; bottom: -20rpx;
  background: linear-gradient(160deg, #2979FF, #1565C0);
  border-radius: 0 0 36rpx 36rpx;
}
.ec-user {
  position: relative; z-index: 1;
  display: flex; align-items: center; gap: 20rpx; padding: 30rpx 0 20rpx;
}
.ecu-avatar { width: 96rpx; height: 96rpx; border-radius: 50%; border: 4rpx solid rgba(255,255,255,.3); background: #eee; }
.ecu-name { font-size: 34rpx; font-weight: 700; color: #fff; display: block; }
.ecu-rate { display: flex; align-items: center; gap: 4rpx; margin-top: 6rpx; }
.ecu-rate-num { color: rgba(255,255,255,.8); font-size: 22rpx; margin-left: 6rpx; }
.ec-stats {
  position: relative; z-index: 1;
  display: flex; background: rgba(255,255,255,.12); border-radius: 16rpx; padding: 20rpx 8rpx;
  background: rgba(255,255,255,0.85); backdrop-filter: blur(10rpx);
}
.ecs-item { flex: 1; text-align: center; }
.ecs-val { font-size: 36rpx; font-weight: 700; color: #fff; display: block; }
.ecs-lbl { font-size: 20rpx; color: rgba(255,255,255,.6); display: block; margin-top: 4rpx; }
.ecs-div { width: 2rpx; height: 36rpx; background: rgba(255,255,255,.12); align-self: center; }

/* 今日待办 */
.ec-today {
  background: #fff; margin: 20rpx 24rpx; border-radius: 24rpx;
  padding: 24rpx 24rpx 8rpx; box-shadow: 0 4rpx 20rpx rgba(0,0,0,.04);
}
.ect-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; padding: 0 4rpx; }
.ect-title { font-size: 30rpx; font-weight: 700; display: flex; align-items: center; }
.ect-count { font-size: 24rpx; color: #2979FF; background: #E3F2FD; padding: 4rpx 16rpx; border-radius: 12rpx; }
.ect-list { padding-left: 20rpx; }
.ect-item { display: flex; gap: 16rpx; padding-bottom: 20rpx; }
.ecti-time { display: flex; flex-direction: column; align-items: center; width: 80rpx; flex-shrink: 0; }
.ecti-hour { font-size: 24rpx; color: #999; font-weight: 500; }
.ecti-line { width: 2rpx; flex: 1; background: #E8E8E8; margin-top: 8rpx; }
.ect-item:last-child .ecti-line { display: none; }
.ecti-card {
  flex: 1; background: #F5F6FA; border-radius: 14rpx; padding: 18rpx 20rpx;
  border-left: 4rpx solid #E0E0E0;
}
.ecti-card.progress { border-left-color: #00C853; background: #F1F8E9; }
.ectic-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8rpx; }
.ectic-title { font-size: 26rpx; font-weight: 600; }
.ectic-tag { font-size: 20rpx; padding: 4rpx 12rpx; border-radius: 8rpx; background: #E8E8E8; color: #999; }
.ectic-tag.progress { background: #E8F5E9; color: #00C853; }
.ectic-bottom { display: flex; justify-content: space-between; align-items: center; }
.ectic-addr { font-size: 22rpx; color: #999; display: flex; align-items: center; gap: 4rpx; }
.ectic-price { font-size: 26rpx; font-weight: 700; color: #FF3D00; }

/* 功能入口 */
.ec-menu { margin: 0 24rpx; }
.ecm-grid { display: flex; background: #fff; border-radius: 20rpx; padding: 28rpx 12rpx; box-shadow: 0 2rpx 12rpx rgba(0,0,0,.03); }
.ecm-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 14rpx; }
.ecmi-icon { width: 80rpx; height: 80rpx; border-radius: 20rpx; display: flex; align-items: center; justify-content: center; }
.ecmi-label { font-size: 24rpx; color: #666; }
</style>
