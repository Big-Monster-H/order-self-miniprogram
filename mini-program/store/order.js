import { defineStore } from "pinia";
import { api } from "@/api/request.js";

export const useOrderStore = defineStore("order", {
  state: () => ({
    myOrders: { list: [], total: 0 },
    taskPool: { list: [], total: 0 },
    employeeOrders: { list: [], total: 0 },
    currentOrder: null,
  }),
  actions: {
    async fetchMyOrders(status) {
      this.myOrders = await api.get("/orders/my", { status });
    },
    async createOrder(data) {
      const order = await api.post("/orders", data);
      return order;
    },
    async fetchDetail(id) {
      this.currentOrder = await api.get(`/orders/${id}`);
    },
    async fetchTaskPool(category_id, page = 1) {
      this.taskPool = await api.get("/orders/task-pool", { category_id, page, pageSize: 10 });
    },
    async acceptOrder(orderId) {
      const res = await api.post(`/orders/${orderId}/accept`);
      this.currentOrder = res;
    },
    async completeOrder(orderId) {
      const res = await api.post(`/orders/${orderId}/complete`);
      this.currentOrder = res;
    },
    async fetchEmployeeOrders(status) {
      this.employeeOrders = await api.get("/orders/employee", { status });
    },
  },
});