import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    count: 0,
    theme: 'dark',
  }),
  getters: {
    getIcon: (state) => (state.theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'),
  },
  actions: {
    changeTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },
  },
})
