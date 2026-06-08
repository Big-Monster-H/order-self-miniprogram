<script setup>
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useAuthStore } from "@/store/auth.js";

onLaunch(() => {
  console.log("App Launch");
  // 尝试自动登录
  tryAutoLogin();
});

onShow(() => { console.log("App Show"); });
onHide(() => { console.log("App Hide"); });

const tryAutoLogin = async () => {
  const token = uni.getStorageSync("token");
  if (token) return; // 已登录

  try {
    // 微信小程序环境：调用 uni.login 获取 code
    const loginRes = await uni.login({ provider: "weixin" });
    if (loginRes.code) {
      const authStore = useAuthStore();
      await authStore.wxLogin(loginRes.code);
      console.log("自动登录成功");
    }
  } catch (e) {
    console.log("自动登录失败，可手动触发:", e);
    // 开发环境：静默失败，允许未登录浏览
  }
};
</script>

<style lang="scss">
@import "@/static/fonts/remixicon-trimmed.css";

page {
  --primary: #2979FF;
  --primary-light: #E3F2FD;
  --primary-dark: #1565C0;
  --success: #00C853;
  --warning: #FF9100;
  --danger: #FF3D00;
  --info: #909399;
  --text-main: #1A1A2E;
  --text-secondary: #666666;
  --text-light: #999999;
  --bg-page: #F5F6FA;
  --bg-card: #FFFFFF;
  --border: #EEEEEE;
  --radius: 16rpx;
  --shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
  
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  font-size: 28rpx;
  color: var(--text-main);
  background-color: var(--bg-page);
  box-sizing: border-box;
}

[class^="ri-"], [class*=" ri-"] { line-height: 1; vertical-align: middle; }

.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-center { display: flex; align-items: center; justify-content: center; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
.flex-1 { flex: 1; }
.text-center { text-align: center; }
.text-primary { color: var(--primary); }
.text-secondary { color: var(--text-secondary); }
.text-light { color: var(--text-light); }
.font-12 { font-size: 24rpx; }
.font-14 { font-size: 28rpx; }
.font-bold { font-weight: 700; }
.mt-20 { margin-top: 20rpx; }
.p-30 { padding: 30rpx; }
.rounded { border-radius: var(--radius); }
.bg-white { background: var(--bg-card); }
.card { background: var(--bg-card); border-radius: var(--radius); padding: 30rpx; box-shadow: var(--shadow); }
</style>