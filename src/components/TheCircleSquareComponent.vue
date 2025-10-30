<template>
  <transition name="move-center">
    <v-container v-if="testStore.currentTaskDataType === 'select-shape'">
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-row>
            <v-col cols="6">
              <v-card :color="selectedShape === 'kruh' ? 'primary' : ''" :theme="selectedShape === 'kruh' ? 'dark' : ''"
                class="shape-card" @click="selectShape('kruh')" variant="outlined"
                :elevation="selectedShape === 'kruh' ? 8 : 2">
                <v-card-text class="pa-2 pa-sm-4">
                  <div class="shape-container">
                    <div class="circle" :style="{ backgroundColor: circleColor }"></div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="6">
              <v-card :color="selectedShape === 'štvorec' ? 'error' : ''"
                :theme="selectedShape === 'štvorec' ? 'dark' : ''" class="shape-card" @click="selectShape('štvorec')"
                variant="outlined" :elevation="selectedShape === 'štvorec' ? 8 : 2">
                <v-card-text class="pa-2 pa-sm-4">
                  <div class="shape-container">
                    <div class="square" :style="{ backgroundColor: squareColor }"></div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </transition>
</template>

<script>
import { useThemeStore } from '@/stores/themeStore'
import { useTestStore } from '@/stores/testStore'

export default {
  name: 'ShapeSelector',

  data() {
    return {
      selectedShape: null,
      snackbar: false,
      snackbarText: '',
      successDialog: false,
    }
  },

  computed: {
    testStore() {
      return useTestStore()
    },
    themeStore() {
      return useThemeStore()
    },

    circleColor() {
      return this.themeStore.theme === 'dark' ? '#64B5F6' : '#2196F3'
    },

    squareColor() {
      return this.themeStore.theme === 'dark' ? '#EF5350' : '#F44336'
    },
  },

  methods: {
    selectShape(shape) {
      this.selectedShape = shape
      this.testStore.selectShape(shape)
    },
  },
}
</script>
<!-- 
<style scoped>
.shape-card {
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 140px;
}

.shape-card:hover {
  transform: translateY(-8px);
}

.shape-container {
  width: 100%;
  aspect-ratio: 1;
  max-width: 150px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.circle {
  width: 100%;
  height: 100%;
  max-width: 120px;
  max-height: 120px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.square {
  width: 100%;
  height: 100%;
  max-width: 120px;
  max-height: 120px;
  transition: background-color 0.3s ease;
}

/* Mobilné zariadenia */
@media (max-width: 600px) {
  .shape-container {
    max-width: 100px;
    padding: 5px;
  }

  .circle,
  .square {
    max-width: 80px;
    max-height: 80px;
  }

  .shape-card {
    min-height: 100px;
  }
}

/* Veľmi malé mobily */
@media (max-width: 360px) {
  .shape-container {
    max-width: 80px;
  }

  .circle,
  .square {
    max-width: 60px;
    max-height: 60px;
  }

  .shape-card {
    min-height: 80px;
  }
}

/* Tablety a väčšie */
@media (min-width: 960px) {
  .shape-container {
    max-width: 180px;
  }

  .circle,
  .square {
    max-width: 150px;
    max-height: 150px;
  }

  .shape-card {
    min-height: 180px;
  }
}
</style> -->