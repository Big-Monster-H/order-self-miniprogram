import { defineStore } from "pinia";
import { api } from "@/api/request.js";

export const useCategoryStore = defineStore("category", {
  state: () => ({
    list: [],
  }),
  actions: {
    async fetchAll() {
      this.list = await api.get("/categories");
    },
  },
});