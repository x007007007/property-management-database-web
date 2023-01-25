import { defineStore } from 'pinia'

export const useLocationStore = defineStore('locationStore', {
  state: () => {
    return { selected: null }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    increment() {
    },
  },
})
