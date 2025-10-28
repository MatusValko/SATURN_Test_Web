<template>

  <v-app @click.ctrl="testStore.developlmentModeToggle" :theme="themeStore.theme">
    <v-btn class="theme-btn" :prepend-icon="themeStore.getIcon" slim @click="themeStore.changeTheme">
    </v-btn>

    <v-main>
      <v-container>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>

  <TheFooter />

</template>

<script>
import { useThemeStore } from '@/stores/themeStore'
import { useTestStore } from '@/stores/testStore'


import TheFooter from './components/TheFooter.vue';
// import TheNavigation from './components/TheNavigation.vue'



export default {
  name: 'SaturnApp',
  components: {
    TheFooter,
  },
  data() {
    return {
      // themeStore: useThemeStore(),
    }
  },
  computed: {
    themeStore() {
      return useThemeStore()
    },
    testStore() {
      return useTestStore()
    },
  }
}
</script>

<style scoped>
.theme-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  min-width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(6px);
  transition: background-color 0.2s ease;
}
</style>