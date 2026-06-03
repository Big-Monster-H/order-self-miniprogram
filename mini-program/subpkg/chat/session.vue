<template>
  <view class="page-session-list">
    <view class="session-item" v-for="s in sessions" :key="s.id" @click="goRoom(s)">
      <view class="avatar-wrap">
        <image class="avatar" :src="s.avatar" mode="aspectFill" />
        <view class="dot" v-if="s.unread" />
      </view>
      <view class="info">
        <view class="top">
          <text class="name">{{ s.nickname }}</text>
          <text class="time">{{ s.lastTime }}</text>
        </view>
        <view class="bottom">
          <text class="last-msg text-ellipsis">{{ s.lastMsg }}</text>
          <view class="badge" v-if="s.unread">{{ s.unread > 99 ? '99+' : s.unread }}</view>
        </view>
      </view>
    </view>
    <view v-if="!sessions.length" class="empty">暂无消息</view>
  </view>
</template>

<script setup>
import { ref, onShow } from 'vue';
import { useChatStore } from '@/store/chat.js';
import { useAuthStore } from '@/store/auth.js';

const chatStore = useChatStore();
const authStore = useAuthStore();
const sessions = ref([]);

onShow(async () => {
  if (!authStore.isLogin) return;
  try {
    await chatStore.fetchSessions();
    sessions.value = chatStore.sessions || [];
  } catch (e) {
    console.log('加载会话失败:', e);
  }
});

const goRoom = (s) => uni.navigateTo({ url: '/subpkg/chat/room?sessionId=' + s.id + '&targetId=' + (s.target_id === authStore.userInfo?.id ? s.user_id : s.target_id) });
</script>

<style lang="scss" scoped>
.page-session-list { min-height: 100vh; background: #fff; }
.session-item { display: flex; align-items: center; gap: 24rpx; padding: 24rpx 30rpx; border-bottom: 1rpx solid var(--border); }
.session-item:active { background: #f8f8f8; }
.avatar-wrap { position: relative; }
.avatar { width: 96rpx; height: 96rpx; border-radius: 50%; background: #f0f0f0; }
.dot { position: absolute; top: -4rpx; right: -4rpx; width: 20rpx; height: 20rpx; background: var(--danger); border-radius: 50%; border: 2rpx solid #fff; }
.info { flex: 1; overflow: hidden; }
.top { display: flex; justify-content: space-between; align-items: center; }
.name { font-size: 30rpx; font-weight: 600; }
.time { font-size: 22rpx; color: var(--text-light); }
.bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 10rpx; }
.last-msg { font-size: 26rpx; color: var(--text-light); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.badge { background: var(--danger); color: #fff; font-size: 20rpx; padding: 4rpx 10rpx; border-radius: 20rpx; min-width: 36rpx; text-align: center; }
.empty { text-align: center; padding: 100rpx; color: var(--text-light); }
</style>
