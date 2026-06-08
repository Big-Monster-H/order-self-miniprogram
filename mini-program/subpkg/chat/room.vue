<template>
  <view class="page-chat-room">
    <scroll-view scroll-y class="msg-list" :scroll-into-view="scrollToId" :scroll-with-animation="true">
      <view class="msg-date"><text>2026-05-30 15:30</text></view>

      <view class="msg-item left" v-for="(m, i) in messages" :key="i" :id="'msg-' + i">
        <image v-if="m.from === 'other'" class="msg-avatar" :src="otherAvatar" mode="aspectFill" />
        <view class="msg-bubble" :class="{ 'other': m.from === 'other', 'self': m.from === 'self' }">
          <text v-if="m.type === 'text'">{{ m.content }}</text>
          <image v-if="m.type === 'image'" :src="m.content" mode="widthFix" class="msg-img" @click="preview(m.content)" />
        </view>
        <image v-if="m.from === 'self'" class="msg-avatar" :src="myAvatar" mode="aspectFill" />
      </view>
    </scroll-view>

    <view class="input-bar">
      <view class="input-actions">
        <view class="ri-image-2-line" style="font-size:44rpx;" @click="chooseImg" />
      </view>
      <view class="input-wrap">
        <input class="msg-input" v-model="inputText" placeholder="输入消息..." confirm-type="send" @confirm="sendMsg" />
      </view>
      <text class="send-btn" @click="sendMsg">发送</text>
    </view>
  </view>
</template>

<script setup>
const chooseImg = () => uni.chooseImage({ count: 1, success: (res) => console.log(res) });
const preview = (urls, current) => uni.previewImage({ urls, current });
import { ref, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useChatStore } from '@/store/chat.js';
import { useAuthStore } from '@/store/auth.js';

const chatStore = useChatStore();
const authStore = useAuthStore();
const messages = ref([]);
const inputText = ref('');
const targetId = ref(0);
const sessionId = ref(0);
const loading = ref(false);

onLoad(async (options) => {
  sessionId.value = +options.sessionId;
  targetId.value = +options.targetId;
  await loadMessages();
  // 标记已读
  try { await chatStore.store.markRead(sessionId.value); } catch(e){}
});

const loadMessages = async () => {
  loading.value = true;
  try {
    await chatStore.fetchMessages(sessionId.value);
    messages.value = chatStore.messages || [];
    await nextTick();
    // 滚动到底部
  } catch (e) { console.log(e); }
  finally { loading.value = false; }
};

const sendMsg = async () => {
  const text = inputText.value.trim();
  if (!text) return;
  inputText.value = '';
  try {
    await chatStore.sendMessage(sessionId.value, text, targetId.value);
    await loadMessages();
  } catch (e) {
    uni.showToast({ title: '发送失败', icon: 'none' });
  }
};
</script>

<style lang="scss" scoped>
.page-chat-room { height: 100vh; display: flex; flex-direction: column; background: var(--bg-page); }
.msg-list { flex: 1; padding: 20rpx 24rpx; }
.msg-date { text-align: center; padding: 20rpx 0; font-size: 22rpx; color: var(--text-light); }
.msg-item { display: flex; margin-bottom: 30rpx; gap: 16rpx; }
.msg-item.left { flex-direction: row; }
.msg-item.right { flex-direction: row-reverse; }
.msg-avatar { width: 72rpx; height: 72rpx; border-radius: 50%; flex-shrink: 0; background: #f0f0f0; }
.msg-bubble { max-width: 480rpx; padding: 20rpx 24rpx; border-radius: 12rpx; font-size: 28rpx; line-height: 1.5; }
.msg-bubble.other { background: #fff; border-top-left-radius: 4rpx; }
.msg-bubble.self { background: var(--primary-light); border-top-right-radius: 4rpx; }
.msg-img { max-width: 300rpx; border-radius: 8rpx; display: block; }
.input-bar { display: flex; align-items: center; gap: 16rpx; padding: 16rpx 20rpx; background: #fff; padding-bottom: calc(16rpx + env(safe-area-inset-bottom)); box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.04); }
.input-wrap { flex: 1; background: var(--bg-page); border-radius: 36rpx; padding: 12rpx 24rpx; }
.msg-input { width: 100%; font-size: 28rpx; line-height: 1.4; }
.send-btn { flex-shrink: 0; font-size: 28rpx; color: var(--primary); font-weight: 700; padding: 10rpx 20rpx; }
</style>
