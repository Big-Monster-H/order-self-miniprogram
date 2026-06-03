import { defineStore } from "pinia";
import { api } from "@/api/request.js";

export const useEmployeeStore = defineStore("employee", {
  state: () => ({
    profile: null,
    stats: null,
    topList: [],
  }),
  actions: {
    async fetchProfile() {
      this.profile = await api.get("/employee/profile");
    },
    async submitAuth(data) {
      this.profile = await api.post("/employee/auth", data);
    },
    async payDeposit() {
      this.profile = await api.post("/employee/pay-deposit");
    },
    async fetchStats() {
      this.stats = await api.get("/employee/stats");
    },
    async fetchTopEmployees() {
      this.topList = await api.get("/employee/top");
    },
  },
});