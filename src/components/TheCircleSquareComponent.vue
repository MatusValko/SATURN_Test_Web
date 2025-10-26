<template>
  <transition name="move-center">
    <v-container v-if="testStore.currentTaskDataType === 'select-shape'">
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <!-- <v-card elevation="4" class="pa-4"> -->
          <!-- <v-card-title class="text-h5 justify-center mb-4">
              Vyberte kruh a pokračujte
            </v-card-title> -->

          <v-row>
            <v-col cols="6">
              <v-card :color="selectedShape === 'kruh' ? 'primary' : ''" :theme="selectedShape === 'kruh' ? 'dark' : ''"
                class="shape-card" @click="selectShape('kruh')" variant="outlined"
                :elevation="selectedShape === 'kruh' ? 8 : 2">
                <v-card-text>
                  <div class="shape-container">
                    <div class="circle" :style="{ backgroundColor: circleColor }"></div>
                  </div>
                  <!-- <div class="text-center text-h6 mt-2">Kruh</div> -->
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="6">
              <v-card :color="selectedShape === 'štvorec' ? 'error' : ''"
                :theme="selectedShape === 'štvorec' ? 'dark' : ''" class="shape-card" @click="selectShape('štvorec')"
                variant="outlined" :elevation="selectedShape === 'štvorec' ? 8 : 2">
                <v-card-text>
                  <div class="shape-container">
                    <div class="square" :style="{ backgroundColor: squareColor }"></div>
                  </div>
                  <!-- <div class="text-center text-h6 mt-2">Štvorec</div> -->
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- <v-card-actions class="justify-center mt-4">
            <v-btn color="success" size="large" @click="handleContinue" :disabled="!selectedShape">
              <v-icon start>mdi-arrow-right</v-icon>
              Pokračovať
            </v-btn>
          </v-card-actions> -->
          <!-- </v-card> -->
        </v-col>
      </v-row>
    </v-container>
  </transition>

  <!-- Snackbar pre upozornenie
  <v-snackbar v-model="snackbar" :timeout="3000" color="error" location="top">
    <v-icon start>mdi-alert-circle</v-icon>
    {{ snackbarText }}
    <template v-slot:actions>
      <v-btn variant="text" @click="snackbar = false"> Zavrieť </v-btn>
    </template>
</v-snackbar> -->

  <!-- Dialóg pre úspech -->
  <!-- <v-dialog v-model="successDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h5 bg-success text-white">
        <v-icon start color="white">mdi-check-circle</v-icon>
        Správne!
      </v-card-title>
      <v-card-text class="text-center pa-6">
        <v-icon size="80" color="success">mdi-emoticon-happy</v-icon>
        <div class="text-h6 mt-4">Vybrali ste kruh. Môžete pokračovať!</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" variant="text" @click="successDialog = false"> OK </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> -->

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

    // handleContinue() {
    //   if (this.selectedShape === 'kruh') {
    //     this.successDialog = true
    //   } else if (this.selectedShape === 'štvorec') {
    //     this.snackbarText = 'Nesprávny výber! Musíte vybrať kruh.'
    //     this.snackbar = true
    //   }
    // },
  },
}
</script>

<style scoped>
.shape-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.shape-card:hover {
  transform: translateY(-8px);
}

.shape-container {
  width: 150px;
  height: 150px;
  margin: 20px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.square {
  width: 120px;
  height: 120px;
  transition: background-color 0.3s ease;
}
</style>