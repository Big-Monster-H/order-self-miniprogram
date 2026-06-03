<template>
  <view class="page-message">
    <view class="msg-item" v-for="m in list" :key="m.id" @click="onTap(m)">
      <view class="msg-ri-wrap" :style="{ background: m.iconBg }">
        <view :class="'ri-' + m.icon" style="font-size:36rpx;" />
      </view>
      <view class="msg-info">
        <view class="msg-top">
          <text class="msg-title">{{ m.title }}</text>
          <text class="msg-time">{{ m.time }}</text>
        </view>
        <text class="msg-desc text-ellipsis">{{ m.desc }}</text>
      </view>
      <view class="msg-dot" v-if="!m.read" />
    </view>
    <view v-if="!list.length" class="empty">暂无消息</view>
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
    sessions.value = (chatStore.sessions || []).map(s => ({
      ...s,
      displayName: s.last_message || '暂无消息',
      lastMsg: s.last_message || '',
      time: s.last_message_at || '',
      unread: s.user_unread || 0,
    }));
  } catch (e) { console.log(e); }
});

const goRoom = (s) => {
  const targetId = s.target_id === authStore.userInfo?.id ? s.user_id : s.target_id;
  uni.navigateTo({ url: '/subpkg/chat/room?sessionId=' + s.id + '&targetId=' + targetId });
};
</script>

<style lang="scss" scoped>
.page-message { min-height: 100vh; background: #fff; }
.msg-item { display: flex; align-items: center; gap: 20rpx; padding: 24rpx 30rpx; border-bottom: 1rpx solid var(--border); }
.msg-item:active { background: #f8f8f8; }
.msg-ri-wrap { width: 80rpx; height: 80rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.msg-info { flex: 1; overflow: hidden; }
.msg-top { display: flex; justify-content: space-between; align-items: center; }
.msg-title { font-size: 28rpx; font-weight: 600; }
.msg-time { font-size: 22rpx; color: var(--text-light); }
.msg-desc { font-size: 24rpx; color: var(--text-light); margin-top: 6rpx; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
.msg-dot { width: 14rpx; height: 14rpx; background: var(--danger); border-radius: 50%; flex-shrink: 0; }
.empty { text-align: center; padding: 100rpx; color: var(--text-light); }
</style>
