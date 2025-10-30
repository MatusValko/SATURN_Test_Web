<template>
  <!-- TODO DAT NASPAT <v-container v-if="testStore.stage === 'intro'" class="text-center"> -->
  <div v-if="testStore.stage === 'intro'" class="text-center">
    <v-row align="center" justify="center">
      <v-col>
        <h1>SATURN Test</h1>
        <p class="subtitle">Self-Administered Tasks Uncovering Risk of Neurodegeneration</p>
      </v-col>
    </v-row>
  </div>
  <!-- </v-container> -->
  <v-container v-if="testStore.developmentMode">
    <p>Stage: {{ testStore.stage }}, Task type {{ testStore.currentTaskData.type }}</p>
    <p>Correct answer: {{ testStore.currentTaskData.correct }}</p>
    <p>Current answer: {{ testStore.currentAnswer }}</p>
    <p v-if="testStore.tasks">Current task: {{ testStore.currentTask }}, Task length: {{ testStore.tasks.length }} </p>
  </v-container>
  <v-container>
    <!-- INTRO STAGE -->
    <TheIntro />


    <!-- TEST STAGE -->
    <transition name="move-center">
      <v-container v-if="testStore.stage === 'test'">
        <!-- Header info -->
        <v-card elevation="2" class="mb-4 pa-4" rounded="lg">
          <v-row align="center">
            <v-col cols="4" class="text-center">
              <v-icon class="mr-2">mdi-clock-outline</v-icon>
              {{ testStore.formatTime(testStore.timeSpent) }}
            </v-col>
            <v-col cols="4" class="text-center">
              <strong>Úloha {{ testStore.currentTask + 1 }} / {{ testStore.tasks.length }}</strong>
            </v-col>
            <v-col cols="4" class="text-center">
              <v-chip v-if="testStore.developmentMode" color="primary" variant="elevated">
                Skóre: {{ testStore.score }} / 30
              </v-chip>
            </v-col>
          </v-row>
          <v-progress-linear :model-value="testStore.progressPercent" color="primary" height="8" rounded class="mt-2" />
        </v-card>

        <v-card elevation="4" class="pa-6" rounded="lg">
          <v-container v-if="testStore.currentTaskData.type === 'text-instruction'">
            <h1 class="continueButton" :key="value" v-for="value in testStore.currentTaskData.question" v-html="value">
            </h1>
            <v-img v-if="testStore.currentTaskData.correct" :class="{ inverted: themeStore.theme === 'dark' }"
              :src="testStore.currentTaskData.correct" alt="Ukážka obrázku" />
          </v-container>

          <v-container v-else>
            <!-- <h1 :class="$vuetify.display.xs ? 'text-h4' : $vuetify.display.sm ? 'text-h3' : 'text-h2'">
              {{ testStore.currentTaskDataQuestion }}
            </h1> -->
            <h1 class="continueButton">
              {{ testStore.currentTaskDataQuestion }}
            </h1>
          </v-container>



          <!-- Circle/Square-->
          <TheCircleSquareComponent />

          <!--SELECT WORDS -->
          <transition>
            <v-container v-if="testStore.currentTaskData.type === 'select-words'">
              <v-alert type="info" variant="tonal" class="mb-4" prominent>
                <v-row align="center">
                  <v-col>
                    <div class="text-h6">
                      Vybrané slová: {{ testStore.selectedWords.length }}
                    </div>
                  </v-col>
                </v-row>
              </v-alert>
              <v-card elevation="2" class="pa-4" rounded="lg" style="max-height: 500px; overflow-y: auto;">
                <v-row dense>
                  <v-col v-for="word in testStore.currentTaskData.options" :key="word" cols="6" sm="4" md="3">
                    <v-btn block size="small" :color="testStore.selectedWords.includes(word) ? 'secondary' : 'default'"
                      :variant="testStore.selectedWords.includes(word) ? 'elevated' : 'outlined'"
                      :disabled="testStore.answerSubmitted" @click="testStore.toggleWord(word)" class="text-caption"
                      :class="{ 'selected-word': testStore.selectedWords.includes(word) }" rounded="lg">
                      <v-icon v-if="testStore.selectedWords.includes(word)" size="small" class="mr-1">mdi-check</v-icon>
                      {{ word }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-container>
          </transition>

          <!-- NUMBER RECALL -->
          <transition>
            <div
              v-if="testStore.currentTaskDataType === 'number-recall' || testStore.currentTaskData.type === 'number-write'">
              <v-row align="center" justify="center">
                <v-col cols="12" sm="4" md="6" class="d-flex justify-center">
                  <v-text-field v-model="testStore.userInput" label="Štvorciferné číslo" variant="outlined" readonly
                    maxlength="4" class="text-center text-field-center " color="primary"
                    prepend-inner-icon="mdi-numeric" :hint="`${testStore.userInput.length}/4 číslic`" persistent-hint />
                </v-col>
              </v-row>

              <v-row justify="center">
                <v-col cols="12" sm="10" md="8">
                  <v-card elevation="3" class="pa-4" rounded="lg">
                    <v-row dense>
                      <v-col v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9]" :key="num" cols="4">
                        <v-btn block size="x-large" color="primary" variant="elevated"
                          :disabled="testStore.answerSubmitted || testStore.userInput.length >= 4"
                          @click="testStore.addDigit(num)" class="text-h5 font-weight-bold" rounded="lg">
                          {{ num }}
                        </v-btn>
                      </v-col>
                      <v-col cols="4">
                        <v-btn block size="x-large" color="error" variant="elevated"
                          :disabled="testStore.answerSubmitted" @click="testStore.clearInput" class="text-h6"
                          rounded="lg">
                          <v-icon>mdi-backspace</v-icon>
                          Vymazať
                        </v-btn>
                      </v-col>
                      <v-col cols="4">
                        <v-btn block size="x-large" color="primary" variant="elevated"
                          :disabled="testStore.answerSubmitted || testStore.userInput.length >= 4"
                          @click="testStore.addDigit(0)" class="text-h5 font-weight-bold" rounded="lg">
                          0
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </transition>

          <!-- WORD RECALL -->
          <div v-if="testStore.currentTaskData.type === 'word-recall'">
            <v-alert type="info" variant="tonal" class="mb-4" prominent>
              <v-row align="center">
                <v-col>
                  <div class="text-h6">
                    Vybrané slová: {{ testStore.selectedWords.length }} /{{ testStore.currentTaskData.correct.length }}
                  </div>
                </v-col>
                <v-col cols="auto">
                  <v-progress-circular
                    :model-value="(testStore.selectedWords.length / testStore.currentTaskData.correct.length) * 100"
                    :size="60" :width="6" color="primary">
                    {{ testStore.selectedWords.length }}
                  </v-progress-circular>
                </v-col>
              </v-row>
            </v-alert>

            <v-card elevation="2" class="pa-4" rounded="lg" style="max-height: 500px; overflow-y: auto;">
              <v-row dense>
                <v-col v-for="word in testStore.currentTaskData.options" :key="word" cols="6" sm="4" md="3" lg="2">
                  <v-btn block size="small" :color="testStore.selectedWords.includes(word) ? 'secondary' : 'default'"
                    :variant="testStore.selectedWords.includes(word) ? 'elevated' : 'outlined'"
                    :disabled="testStore.answerSubmitted" @click="testStore.toggleWord(word)" class="text-caption"
                    :class="{ 'selected-word': testStore.selectedWords.includes(word) }" rounded="lg">
                    <v-icon v-if="testStore.selectedWords.includes(word)" size="small" class="mr-1">mdi-check</v-icon>
                    {{ word }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </div>

          <!-- FIRST LETTER WORD/INSTRUCTION/SHAPE/ORIENTATION RECALL -->
          <div
            v-if="['instruction-recall', 'shape-recall', 'orientation', 'j-word', 'j-word-recall'].includes(this.testStore.currentTaskDataType)">
            <v-row>
              <v-col v-for="option in testStore.currentTaskData.options" :key="option" cols="12" sm="6" md="2.4">
                <v-btn block size="large" :color="testStore.currentAnswer === option ? 'primary' : 'default'"
                  :variant="testStore.currentAnswer === option ? 'elevated' : 'outlined'"
                  :disabled="testStore.answerSubmitted" @click="testStore.selectAnswer(option)" class="text-body-1 pa-6"
                  :class="{ 'selected-answer': testStore.currentAnswer === option }" rounded="lg">
                  <v-icon v-if="testStore.currentAnswer === option" class="mr-2">mdi-check-circle</v-icon>
                  {{ option }}
                </v-btn>
              </v-col>
            </v-row>
          </div>


          <ShowWordsComponent />



          <!-- CALCULATION -->
          <transition>
            <div v-if="testStore.currentTaskDataType === 'calculation'">
              <v-row justify="center">
                <v-col cols="12" sm="8" md="6">
                  <v-text-field v-model="testStore.userInput" label="Váš výsledok" variant="outlined" readonly
                    class="text-h4 text-center" color="primary" prepend-inner-icon="mdi-calculator" />
                </v-col>
              </v-row>

              <v-row justify="center" class="mt-4">
                <v-col cols="12" sm="10" md="8">
                  <v-card elevation="3" class="pa-4" rounded="lg">
                    <v-row dense>
                      <v-col v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9]" :key="num" cols="4">
                        <v-btn block size="x-large" color="primary" variant="elevated"
                          :disabled="testStore.answerSubmitted" @click="testStore.addDigit(num)"
                          class="text-h5 font-weight-bold" rounded="lg">
                          {{ num }}
                        </v-btn>
                      </v-col>
                      <v-col cols="4">
                        <v-btn block size="x-large" color="error" variant="elevated"
                          :disabled="testStore.answerSubmitted" @click="testStore.clearInput" class="text-h6"
                          rounded="lg">
                          <v-icon>mdi-backspace</v-icon>
                          Vymazať
                        </v-btn>
                      </v-col>
                      <v-col cols="4">
                        <v-btn block size="x-large" color="primary" variant="elevated"
                          :disabled="testStore.answerSubmitted" @click="testStore.addDigit(0)"
                          class="text-h5 font-weight-bold" rounded="lg">
                          0
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </transition>


          <!-- PATTERN -->
          <div v-if="testStore.currentTaskDataType === 'pattern'">
            <!-- Vzorový obrázok hore v strede -->
            <v-row justify="center" class="mb-6">
              <v-col cols="12" sm="8" md="6" lg="4">
                <v-img :class="{ inverted: themeStore.theme === 'dark' }"
                  :src="testStore.currentTaskData.images.pattern" alt="Ukážka obrázku" max-height="200" contain />
              </v-col>
            </v-row>

            <!-- Options s menšími obrázkami -->
            <v-row justify="center">
              <v-col v-for="option in testStore.currentTaskData.options" :key="option" cols="4">
                <v-card elevation="2"
                  :color="testStore.currentAnswer && testStore.currentAnswer.includes(option) ? 'primary' : 'default'"
                  :variant="testStore.currentAnswer && testStore.currentAnswer.includes(option) ? 'elevated' : 'outlined'"
                  :disabled="testStore.answerSubmitted" @click="testStore.toggleWord(option)"
                  :class="{ 'selected-pattern': testStore.currentAnswer && testStore.currentAnswer.includes(option) }"
                  rounded="lg" class="pa-1 cursor-pointer" hover>
                  <v-img :class="{ inverted: themeStore.theme === 'dark' }"
                    :src="testStore.currentTaskData.images.src[option - 1]" alt="Option obrázok" max-height="120"
                    contain />
                  <!-- <v-icon v-if="testStore.currentAnswer && testStore.currentAnswer.includes(option)" color="primary"
                    size="large" class="position-absolute top-0 right-0 ma-2">
                    mdi-check-circle
                  </v-icon> -->
                </v-card>
              </v-col>
            </v-row>
          </div>


          <!-- STROOP TEST -->
          <div v-if="testStore.currentTaskDataType === 'stroop'">
            <v-card elevation="8" :class="['text-center', 'mb-6', $vuetify.display.xs ? 'pa-3' : 'pa-10']" rounded="lg"
              color="grey-lighten-5">
              <div :class="[
                'font-weight-bold',
                'stroop-word-responsive'
              ]" :style="{ color: testStore.currentStroopItem.color }">
                {{ testStore.currentStroopItem.word }}
              </div>
            </v-card>

            <v-row justify="center">
              <v-col v-for="color in testStore.stroopColors" :key="color.name" cols="6" sm="3">
                <v-btn block :size="$vuetify.display.xs ? 'default' : 'x-large'"
                  :color="testStore.currentAnswer === color.name ? 'primary' : 'default'"
                  :variant="testStore.currentAnswer === color.name ? 'elevated' : 'outlined'"
                  :disabled="testStore.answerSubmitted" @click="testStore.selectStroopColor(color.name)" :class="[
                    'font-weight-bold',
                    'stroop-color-btn',
                    'stroop-btn-responsive',
                    { 'selected-stroop': testStore.currentAnswer === color.name }
                  ]" rounded="lg" elevation="4">
                  <v-icon v-if="testStore.currentAnswer === color.name"
                    :size="$vuetify.display.xs ? 'x-small' : 'default'" class="mr-1">
                    mdi-check-circle
                  </v-icon>
                  {{ color.name.toUpperCase() }}
                </v-btn>
              </v-col>
            </v-row>
          </div>


          <!-- TRAILS TEST -->
          <TrailTestComponent />

          <!-- CONTINUE BUTTON -->
          <div v-if="testStore.currentTaskDataType !== 'show-words'">
            <!-- ✅ Alert bez close button, väčší bold text -->
            <v-alert v-if="testStore.showWrongAnswerSnackbar" type="error" variant="tonal" class="mb-4 mt-4 " prominent>
              <div class="d-flex align-center">
                <div class="continueButton font-weight-bold ">
                  {{ testStore.wrongAnswerMessage }}
                </div>
              </div>
            </v-alert>

            <v-row justify="center" class="mt-6">
              <v-col cols="12" sm="8" md="6">
                <v-btn block size="x-large" color="success" @click="testStore.continueToNext" class="continueButton"
                  rounded="pill" :elevation="4">
                  <v-icon class="mr-2">mdi-arrow-right-circle</v-icon>
                  Pokračovať
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-container>
    </transition>

    <!-- RESULTS STAGE -->
    <transition name="move-center">
      <v-container v-if="testStore.stage === 'results'">
        <v-card elevation="8" class="pa-8" rounded="lg">
          <h1 class="mb-4">🎉 Test dokončený!</h1>
          <!-- <p class="text-h6 mb-6">Gratulujeme, úspešne ste dokončili SATURN test</p> -->
          <div>
            <v-card color="primary" variant="tonal" class="pa-6 mb-6" rounded="lg">
              <p class="text-h6">Vaše skóre:</p>
              <h2 class="text-h2 font-weight-bold my-4">{{ testStore.score }} / 30</h2>
              <p v-if="testStore.developmentMode" class="text-h5">{{ testStore.scorePercentage }}%</p>
            </v-card>

            <v-card v-if="testStore.developmentMode" :color="testStore.interpretation.color" variant="tonal"
              class="pa-6 mb-6" rounded="lg">
              <h3 class="text-h4 mb-2">{{ testStore.interpretation.level }}</h3>
              <p class="text-h6">{{ testStore.interpretation.description }}</p>
            </v-card>

            <v-card v-if="testStore.developmentMode" elevation="2" class="pa-6 mb-6" rounded="lg">
              <h3 class="mb-4">📊 Porovnávacia tabuľka:</h3>
              <v-table>
                <thead>
                  <tr>
                    <th>Skóre</th>
                    <th>Hodnotenie</th>
                    <th>Popis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr :class="{ 'bg-green-lighten-4': testStore.score >= 26 }">
                    <td>26-30</td>
                    <td class="font-weight-bold text-green">Výborné</td>
                    <td>Kognitívne funkcie v norme</td>
                  </tr>
                  <tr :class="{ 'bg-blue-lighten-4': testStore.score >= 21 && testStore.score < 26 }">
                    <td>21-25</td>
                    <td class="font-weight-bold text-blue">Dobré</td>
                    <td>Mierne kognitívne zmeny</td>
                  </tr>
                  <tr :class="{ 'bg-orange-lighten-4': testStore.score >= 16 && testStore.score < 21 }">
                    <td>16-20</td>
                    <td class="font-weight-bold text-orange">Stredné</td>
                    <td>Stredné kognitívne zhoršenie</td>
                  </tr>
                  <tr :class="{ 'bg-red-lighten-4': testStore.score < 16 }">
                    <td>0-15</td>
                    <td class="font-weight-bold text-red">Nízke</td>
                    <td>Výrazné kognitívne zhoršenie</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </div>
          <v-alert type="info" variant="tonal" class="mb-6">
            <p><strong>⏱️ Čas testovania:</strong> {{ testStore.formatTime(testStore.timeSpent) }}</p>
            <p class="mt-2">
              <strong>📌 Poznámka:</strong> Tento test je orientačný nástroj pre kognitívny screening.
              Skóre nižšie ako 21 bodov môže indikovať potrebu ďalšieho vyšetrenia.
              Pre presnú diagnostiku kognitívnych funkcií a zdravotného stavu sa vždy obráťte na odborného lekára alebo
              neurológa.
            </p>
          </v-alert>

          <v-btn color="primary" size="large" block @click="testStore.resetTest">
            <v-icon class="mr-2">mdi-refresh</v-icon>
            Zopakovať test
          </v-btn>
        </v-card>
      </v-container>

    </transition>
  </v-container>
</template>


<script>
import TheIntro from '@/components/TheIntro.vue';
import TheCircleSquareComponent from '@/components/TheCircleSquareComponent.vue';
import ShowWordsComponent from '@/components/ShowWordsComponent.vue';
import TrailTestComponent from '@/components/TrailTestComponent.vue';

import { useTestStore } from '@/stores/testStore';
import { useThemeStore } from '@/stores/themeStore';


// import { useThemeStore } from '@/stores/theme'


export default {
  name: 'HomeView',
  components: {
    TheIntro,
    TheCircleSquareComponent,
    ShowWordsComponent,
    TrailTestComponent

  },
  data() {
    return {
    };
  },

  computed: {
    testStore() {
      return useTestStore()
    },
    themeStore() {
      return useThemeStore()
    },
  },
};
</script>

<style scoped>
::v-deep(.rainbow) {
  background: linear-gradient(90deg, red, green, blue);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}
</style>