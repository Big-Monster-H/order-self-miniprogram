<template>
  <view class="c-icon" :class="iconClass" :style="iconStyle" />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: { type: String, required: true },
  size: { type: String, default: "" },
  color: { type: String, default: "" },
});

const iconClass = computed(() => {
  return "ri-" + props.name + (props.size ? " ri-" + props.size : "");
});

const iconStyle = computed(() => {
  const style = {};
  if (props.color) style.color = props.color;
  return style;
});
</script>

<style>
/* Remix Icon */
@import "@/static/fonts/remixicon-trimmed.css";

.c-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  line-height: 1;
  vertical-align: middle;
}
.c-icon.ri-sm { font-size: 32rpx; }
.c-icon.ri-lg { font-size: 48rpx; }
.c-icon.ri-xl { font-size: 64rpx; }
.c-icon.ri-xxl { font-size: 80rpx; }
</style>
