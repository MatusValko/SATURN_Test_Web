import { defineStore } from 'pinia'

export const useTestStore = defineStore('test', {
  state: () => ({
    stage: 'intro',
    count: 0,
    theme: 'dark',
  }),
  getters: {
    getIcon: (state) => (state.theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'),
  },
  actions: {
    startTest() {
      this.stage = 'memorize'
    },
  },
})
