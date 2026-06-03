import { defineStore } from 'pinia'
import api from '@/api'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    token: localStorage.getItem('admin_token') || '',
    admin: JSON.parse(localStorage.getItem('admin_info') || 'null'),
  }),
  actions: {
    async login(username, password) {
      const res = await api.post('/auth/admin-login', { username, password })
      this.token = res.token
      this.admin = res.admin
      localStorage.setItem('admin_token', res.token)
      localStorage.setItem('admin_info', JSON.stringify(res.admin))
    },
    logout() {
      this.token = ''
      this.admin = null
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_info')
    },
  },
})