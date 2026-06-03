import { defineStore } from "pinia";
import { api } from "@/api/request.js";

export const useChatStore = defineStore("chat", {
  state: () => ({
    sessions: [],
    messages: [],
    currentSession: null,
  }),
  actions: {
    async fetchSessions() {
      this.sessions = await api.get("/chat/sessions");
    },
    async createSession(target_id, order_id) {
      this.currentSession = await api.post("/chat/sessions", { target_id, order_id });
    },
    async fetchMessages(sessionId, page = 1) {
      const res = await api.get(`/chat/messages/${sessionId}`, { page });
      this.messages = res.list;
    },
    async sendMessage(sessionId, content, receiver_id) {
      const msg = await api.post(`/chat/messages/${sessionId}`, { content, receiver_id });
      this.messages.push(msg);
      return msg;
    },
  },
});