import { defineStore } from "pinia";
import { api } from "@/api/request.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: uni.getStorageSync("token") || "",
    userInfo: uni.getStorageSync("userInfo") ? JSON.parse(uni.getStorageSync("userInfo")) : null,
  }),
  getters: {
    isLogin: (state) => !!state.token,
  },
  actions: {
    /** 微信小程序登录 */
    async wxLogin(code, nickname, avatar) {
      const res = await api.post("/auth/wx-login", { code, nickname, avatar });
      this.token = res.token;
      this.userInfo = res.user;
      uni.setStorageSync("token", res.token);
      uni.setStorageSync("userInfo", JSON.stringify(res.user));
      return res;
    },

    /** 更新用户信息 */
    async updateProfile(data) {
      const res = await api.put("/user/profile", data);
      this.userInfo = { ...this.userInfo, ...res };
      uni.setStorageSync("userInfo", JSON.stringify(this.userInfo));
    },

    /** 退出登录 */
    logout() {
      this.token = "";
      this.userInfo = null;
      uni.removeStorageSync("token");
      uni.removeStorageSync("userInfo");
      uni.reLaunch({ url: "/pages/index/index" });
    },
  },
});