import { defineStore } from "pinia";
import { api } from "@/api/request.js";

export const useProductStore = defineStore("product", {
  state: () => ({
    list: [],
    total: 0,
    hotList: [],
    current: null,
  }),
  actions: {
    async fetchList(params = {}) {
      const res = await api.get("/products", params);
      this.list = res.list;
      this.total = res.total;
    },
    async fetchHot(limit = 6) {
      this.hotList = await api.get("/products/hot", { limit });
    },
    async fetchDetail(id) {
      this.current = await api.get(`/products/${id}`);
    },
  },
});