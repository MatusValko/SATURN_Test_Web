<template>
  <!-- TODO DAT NASPAT <v-container v-if="testStore.stage === 'intro'" class="text-center"> -->
  <!-- <v-container class="text-center"> -->
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
    <p>{{ testStore.stage }}</p>
    <p>{{ testStore.currentTaskData.type }}</p>
    <p>Correct answer: {{ testStore.currentTaskData.correct }}</p>
    <p>Current answer: {{ testStore.currentAnswer }}</p>
  </v-container>
  <v-container>
    <!-- INTRO STAGE -->
    <TheIntro />
    <!-- Circle/Square STAGE -->


    <!-- MEMORIZE STAGE -->
    <!-- <transition name="move-center">
      <v-container v-if="testStore.stage === 'memorize'" class="memorize-container">
        <v-card elevation="6" class="pa-8" rounded="lg">
          <h2 class="mb-6">Fáza zapamätania</h2>

          <v-card color="blue-lighten-5" class="pa-6 mb-6" rounded="lg">
            <h3 class="mb-4">{{ instruction }}</h3>
            <div class="number-display text-h2 font-weight-bold">{{ displayNumber }}</div>
          </v-card>

          <h3 class="mb-4">Zapamätajte si týchto 5 slov:</h3>
          <v-row justify="center" class="mb-6">
            <v-col v-for="(word, index) in wordsToMemorize" :key="index" cols="auto">
              <v-chip size="x-large" color="primary" variant="elevated" class="text-h6 pa-6">
                {{ word }}
              </v-chip>
            </v-col>
          </v-row>

          <p class="mb-4">Kliknite na jedno z tlačidiel nižšie, keď ste pripravení pokračovať:</p>

          <v-row justify="center">
            <v-col cols="auto">
              <v-btn color="primary" size="x-large" @click="selectShape('štvorec')">
                ŠTVOREC
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn color="secondary" size="x-large" @click="selectShape('kruh')">
                KRUH
              </v-btn>
            </v-col>
          </v-row>

          <v-alert type="info" variant="tonal" class="mt-6">
            💡 Tip: Slová si zapamätáte lepšie, ak si ich zopakujete nahlas alebo vytvoríte príbeh
          </v-alert>
        </v-card>
      </v-container>
    </transition> -->

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
              <v-chip color="primary" variant="elevated">
                Skóre: {{ testStore.score }} / 30
              </v-chip>
            </v-col>
          </v-row>
          <v-progress-linear :model-value="testStore.progressPercent" color="primary" height="8" rounded class="mt-2" />
        </v-card>

        <v-card elevation="4" class="pa-6" rounded="lg">
          <v-container v-if="testStore.currentTaskData.type === 'text-instruction'">
            <h1 :class="['mb-4', $vuetify.display.xs ? 'text-h4' : $vuetify.display.sm ? 'text-h3' : 'text-h2']"
              :key="value" v-for="value in testStore.currentTaskData.question">
              {{ value }}
            </h1>
            <v-img v-if="testStore.currentTaskData.correct" :class="{ inverted: themeStore.theme === 'dark' }"
              :src="testStore.currentTaskData.correct" alt="Ukážka obrázku" />
          </v-container>

          <v-container v-else>
            <h1 :class="$vuetify.display.xs ? 'text-h4' : $vuetify.display.sm ? 'text-h3' : 'text-h2'">
              {{ testStore.currentTaskDataQuestion }}
            </h1>
          </v-container>




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





          <!-- STROOP TEST -->
          <div v-if="testStore.currentTaskDataType === 'stroop'">
            <v-alert type="warning" variant="tonal" prominent class="mb-6">
              <div class="text-h6">
                <v-icon class="mr-2">mdi-alert</v-icon>
                Pozor! Kliknite na FARBU textu, nie na to čo je napísané
              </div>
            </v-alert>

            <v-card elevation="8" class="pa-10 text-center mb-6" rounded="lg" color="grey-lighten-5">
              <div class="text-h1 font-weight-bold" :style="{ color: testStore.currentStroopItem.color }">
                {{ testStore.currentStroopItem.word }}
              </div>
            </v-card>

            <v-row justify="center">
              <v-col v-for="color in testStore.stroopColors" :key="color.name" cols="6" sm="3">
                <v-btn block size="x-large" :style="{ backgroundColor: color.hex, color: 'white' }"
                  @click="testStore.handleStroopAnswer(color.name)" class="text-h6 font-weight-bold stroop-color-btn"
                  rounded="lg" elevation="4">
                  {{ color.name.toUpperCase() }}
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <!-- PATTERN -->


          <div v-if="testStore.currentTaskDataType === 'pattern'">
            <!-- Vzorový obrázok hore v strede -->
            <v-row justify="center" class="mb-6">
              <v-col cols="12" sm="8" md="6" lg="4">
                <v-img :class="{ inverted: themeStore.theme === 'dark' }" :src="testStore.currentTaskData.pattern"
                  alt="Ukážka obrázku" max-height="200" contain />
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
                    :src="testStore.currentTaskData.src[option - 1]" alt="Option obrázok" max-height="120" contain />
                  <v-icon v-if="testStore.currentAnswer && testStore.currentAnswer.includes(option)" color="primary"
                    size="large" class="position-absolute top-0 right-0 ma-2">
                    mdi-check-circle
                  </v-icon>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- TRAILS TEST -->
          <div v-if="testStore.currentTaskDataType === 'trails'">
            <v-alert type="info" variant="tonal" class="mb-4" prominent>
              <div class="text-body-1 mb-2">
                <v-icon class="mr-2">mdi-information</v-icon>
                Kliknite na čísla v správnom poradí od najmenšieho po najväčšie
              </div>
              <v-progress-linear :model-value="(trailsSequence.length / currentTaskData.sequence.length) * 100"
                color="primary" height="10" rounded class="mt-2" />
              <div class="text-subtitle-1 mt-2 font-weight-bold">
                Pokrok: {{ trailsSequence.length }} / {{ currentTaskData.sequence.length }}
              </div>
            </v-alert>

            <v-card elevation="2" class="pa-4" rounded="lg">
              <v-row>
                <v-col v-for="num in shuffledTrails" :key="num" cols="3" sm="2">
                  <v-btn block size="x-large" :color="trailsSequence.includes(num) ? 'success' : 'primary'"
                    :variant="trailsSequence.includes(num) ? 'elevated' : 'outlined'"
                    :disabled="trailsSequence.includes(num) || answerSubmitted" @click="handleTrailClick(num)"
                    class="text-h4 font-weight-bold" :class="{ 'completed-trail': trailsSequence.includes(num) }"
                    rounded="lg">
                    <v-icon v-if="trailsSequence.includes(num)" class="position-absolute" style="top: 4px; right: 4px;"
                      size="small">mdi-check-circle</v-icon>
                    {{ num }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </div>


          <!-- CONTINUE BUTTON -->
          <div v-if="testStore.currentTaskDataType !== 'stroop' && testStore.currentTaskDataType !== 'show-words'">
            <!-- ✅ Alert bez close button, väčší bold text -->
            <v-alert v-if="testStore.showWrongAnswerSnackbar" type="error" variant="tonal" class="mb-4" prominent>
              <div class="d-flex align-center">
                <div class="text-h6 font-weight-bold">
                  {{ testStore.wrongAnswerMessage }}
                </div>
              </div>
            </v-alert>

            <v-row justify="center" class="mt-6">
              <v-col cols="12" sm="8" md="6">
                <v-btn block size="x-large" color="success" @click="testStore.continueToNext"
                  class="text-h6 font-weight-bold continue-btn" rounded="pill" :elevation="4">
                  <v-icon class="mr-2">mdi-arrow-right-circle</v-icon>
                  Pokračovať
                </v-btn>
              </v-col>
            </v-row>
          </div>



          <!-- <div v-if="testStore.currentTaskDataType !== 'stroop'">
            <v-row justify="center" class="mt-6">
              <v-col cols="12" sm="8" md="6">
                <v-btn block size="x-large" :color="testStore.canContinue ? 'success' : 'grey'"
                  :disabled="!testStore.canContinue" @click="testStore.continueToNext"
                  class="text-h6 font-weight-bold continue-btn" rounded="pill"
                  :elevation="testStore.canContinue ? 8 : 0">
                  <v-icon class="mr-2" v-if="testStore.canContinue">mdi-arrow-right-circle</v-icon>
                  <v-icon class="mr-2" v-else>mdi-alert-circle</v-icon>
                  {{ testStore.canContinue ? 'Pokračovať' : testStore.getValidationMessage }}
                </v-btn>
              </v-col>
            </v-row>
          </div> -->
        </v-card>
      </v-container>
    </transition>

    <!-- RESULTS STAGE -->
    <transition name="move-center">
      <v-container v-if="testStore.stage === 'results'">
        <v-card elevation="8" class="pa-8" rounded="lg">
          <h1 class="mb-4">🎉 Test dokončený!</h1>
          <p class="text-h6 mb-6">Gratulujeme, úspešne ste dokončili SATURN test</p>

          <v-card color="primary" variant="tonal" class="pa-6 mb-6" rounded="lg">
            <p class="text-h6">Vaše skóre:</p>
            <h2 class="text-h2 font-weight-bold my-4">{{ testStore.score }} / 30</h2>
            <p class="text-h5">{{ testStore.scorePercentage }}%</p>
          </v-card>

          <v-card :color="interpretation.color" variant="tonal" class="pa-6 mb-6" rounded="lg">
            <h3 class="text-h4 mb-2">{{ testStore.interpretation.level }}</h3>
            <p class="text-h6">{{ testStore.interpretation.description }}</p>
          </v-card>

          <v-card elevation="2" class="pa-6 mb-6" rounded="lg">
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
                <tr :class="{ 'bg-blue-lighten-4': testStore.score >= 21 && score < 26 }">
                  <td>21-25</td>
                  <td class="font-weight-bold text-blue">Dobré</td>
                  <td>Mierne kognitívne zmeny</td>
                </tr>
                <tr :class="{ 'bg-orange-lighten-4': testStore.score >= 16 && score < 21 }">
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

          <v-alert type="info" variant="tonal" class="mb-6">
            <p><strong>⏱️ Čas testovania:</strong> {{ testStore.formatTime(timeSpent) }}</p>
            <p class="mt-2">
              <strong>📌 Poznámka:</strong> Tento test je orientačný nástroj pre kognitívny screening.
              Skóre nižšie ako 21 bodov môže indikovať potrebu ďalšieho vyšetrenia.
              Pre presnú diagnostiku kognitívnych funkcií a zdravotného stavu sa vždy obráťte na odborného lekára alebo
              neurológa.
            </p>
          </v-alert>

          <v-btn color="primary" size="large" block @click="resetTest">
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

import { useTestStore } from '@/stores/testStore';
import { useThemeStore } from '@/stores/themeStore';


// import { useThemeStore } from '@/stores/theme'


export default {
  name: 'HomeView',
  components: {
    TheIntro,
    TheCircleSquareComponent,
    ShowWordsComponent,

  },
  data() {
    return {
      // testStore: useTestStore(),
      // testStore: null,

      // currentTask: 0,
      // score: 0,
      // timeSpent: 0,
      // startTime: null,
      // timerInterval: null,
      // userInput: '',
      // selectedWords: [],
      // selectedShape: '',
      // answerSubmitted: false,
      // currentAnswer: null,

      // instruction: 'Kliknite na štvorec aby ste pokračovali',
      // displayNumber: '7294',
      // wordsToMemorize: ['JABLKO', 'PERO', 'KRAVATA', 'DOM', 'AUTO'],

      // stroopIndex: 0,
      // stroopCorrect: 0,
      // stroopItems: [
      //   { word: 'ČERVENÁ', color: '#2196f3', correct: 'modrá' },
      //   { word: 'ZELENÁ', color: '#f44336', correct: 'červená' },
      //   { word: 'MODRÁ', color: '#4caf50', correct: 'zelená' },
      //   { word: 'ŽLTÁ', color: '#f44336', correct: 'červená' }
      // ],
      // stroopColors: [
      //   { name: 'červená', hex: '#f44336' },
      //   { name: 'modrá', hex: '#2196f3' },
      //   { name: 'zelená', hex: '#4caf50' },
      //   { name: 'žltá', hex: '#ffc107' }
      // ],

      // trailsSequence: [],
      // shuffledTrails: [],

      // allWords: [
      //   'KRAVATA', 'CHLIEB', 'ČAS', 'POKOJ', 'DVERE', 'OBCHOD',
      //   'DOM', 'ŽALÚDOK', 'TELEFÓN', 'PIVO', 'POŠTA', 'ALKOHOL',
      //   'CERUZKA', 'OKO', 'HUDBA', 'POSTEĽ', 'BICYKEL', 'CITRÓN',
      //   'VÍNO', 'PRIATEĽ', 'KNIŽNICA', 'JABLKO', 'VAJCE', 'ÚSTA',
      //   'FARBA', 'ZAHRADA', 'TÝŽDEŇ', 'ŠŤASTIE', 'BANKA', 'KOSTOL',
      //   'KÚPEĽŇA', 'ZELENÁ', 'SESTRA', 'OVCA', 'TANEC', 'HOKEJ',
      //   'AUTO', 'VLAK', 'MOZOG', 'NOS', 'ROK', 'MINÚTA',
      //   'ŠKOLA', 'BABKA', 'HVIEZDA', 'PAPIER', 'BANÁN', 'MRKVA',
      //   'MOTÝĽ', 'MÚZEUM', 'SLNKO', 'FIALOVÁ', 'RYBA', 'SLIEPKA',
      //   'KVET', 'STROM', 'ČOKOLÁDA', 'CHLAPEC', 'TULIPÁN', 'HRUŠKA',
      //   'ŽENA', 'BLESK', 'STOLIČKA', 'VČELA', 'MLIEKO', 'VODA',
      //   'OKNO', 'LEKÁR', 'BÚRKA', 'PES', 'RADOSŤ', 'ZEMIAK',
      //   'NOHA', 'LÁSKA', 'JAHODA', 'AUTOBUS', 'PERO', 'ORANŽOVÁ',
      //   'ZELENINA', 'SYR', 'VODIČ', 'HLAVA', 'MUŽ', 'DÚHA',
      //   'JEDLO', 'SNEH', 'LIETADLO', 'MESIAC', 'POČÍTAČ', 'KNIHA',
      //   'NÁDEJ', 'SRDCE', 'KRAVA', 'POMARANČ', 'MAČKA', 'SEKUNDA',
      //   'KUCHYŇA', 'DEŇ', 'SKÚŠKA'
      // ],

      // tasks: []
    };
  },

  // computed: {
  //   progressPercent() {
  //     return ((this.currentTask + 1) / this.tasks.length) * 100;
  //   },

  //   currentTaskData() {
  //     return this.tasks[this.currentTask] || {};
  //   },

  //   currentStroopItem() {
  //     return this.stroopItems[this.stroopIndex] || this.stroopItems[0];
  //   },

  //   scorePercentage() {
  //     return Math.round((this.score / 30) * 100);
  //   },

  //   interpretation() {
  //     if (this.score >= 26) {
  //       return {
  //         level: 'Výborné',
  //         color: '#4caf50',
  //         class: 'excellent',
  //         description: 'Kognitívne funkcie v norme'
  //       };
  //     } else if (this.score >= 21) {
  //       return {
  //         level: 'Dobré',
  //         color: '#2196f3',
  //         class: 'good',
  //         description: 'Mierne kognitívne zmeny'
  //       };
  //     } else if (this.score >= 16) {
  //       return {
  //         level: 'Stredné',
  //         color: '#ffc107',
  //         class: 'medium',
  //         description: 'Stredné kognitívne zhoršenie'
  //       };
  //     } else {
  //       return {
  //         level: 'Nízke',
  //         color: '#f44336',
  //         class: 'poor',
  //         description: 'Výrazné kognitívne zhoršenie'
  //       };
  //     }
  //   },

  //   canContinue() {
  //     const task = this.currentTaskData;

  //     // Pre Stroop test - nemá tlačidlo pokračovať, automaticky postupuje
  //     if (task.type === 'stroop') return false;

  //     // Pre instruction-recall, shape-recall, orientation - musí byť vybraná odpoveď
  //     if (['instruction-recall', 'shape-recall', 'orientation'].includes(task.type)) {
  //       return this.currentAnswer !== null;
  //     }

  //     // Pre number-recall - musí mať 4 číslice
  //     if (task.type === 'number-recall') {
  //       return this.userInput.length === 4;
  //     }

  //     // Pre calculation - musí mať aspoň 1 číslicu
  //     if (task.type === 'calculation') {
  //       return this.userInput.length > 0;
  //     }

  //     // Pre word-recall - musí mať vybraných 5 slov
  //     if (task.type === 'word-recall') {
  //       return this.selectedWords.length === 5;
  //     }

  //     // Pre pattern - musí byť vybraná odpoveď
  //     if (task.type === 'pattern') {
  //       return this.currentAnswer !== null;
  //     }

  //     // Pre trails - musí dokončiť celú sekvenciu
  //     if (task.type === 'trails') {
  //       return this.trailsSequence.length === task.sequence.length;
  //     }

  //     return false;
  //   }
  // },

  methods: {
    // // Pridať číslicu do inputu
    // addDigit(digit) {
    //   if (this.currentTaskData.type === 'number-recall' && this.userInput.length < 4) {
    //     this.userInput += digit.toString();
    //   } else if (this.currentTaskData.type === 'calculation') {
    //     this.userInput += digit.toString();
    //   }
    // },

    // // Vymazať input
    // clearInput() {
    //   this.userInput = '';
    // },

    // // Vybrať odpoveď (pre multiple choice úlohy)
    // selectAnswer(answer) {
    //   if (!this.answerSubmitted) {
    //     this.currentAnswer = answer;
    //   }
    // },

    // // Získať validačnú správu pre tlačidlo
    // getValidationMessage() {
    //   const task = this.currentTaskData;

    //   if (task.type === 'number-recall') {
    //     return `Zadajte 4 číslice (${this.userInput.length}/4)`;
    //   }
    //   if (task.type === 'calculation') {
    //     return 'Zadajte odpoveď';
    //   }
    //   if (task.type === 'word-recall') {
    //     return `Vyberte 5 slov (${this.selectedWords.length}/5)`;
    //   }
    //   if (task.type === 'trails') {
    //     return `Dokončite sekvenciu (${this.trailsSequence.length}/${task.sequence.length})`;
    //   }
    //   if (['instruction-recall', 'shape-recall', 'orientation', 'pattern'].includes(task.type)) {
    //     return 'Vyberte odpoveď';
    //   }

    //   return 'Dokončite úlohu';
    // },

    // // Pokračovať na ďalšiu úlohu
    // continueToNext() {
    //   if (!this.canContinue) return;

    //   const task = this.currentTaskData;
    //   let points = 0;

    //   // Vyhodnotenie podľa typu úlohy
    //   if (['instruction-recall', 'shape-recall', 'orientation', 'pattern'].includes(task.type)) {
    //     if (this.currentAnswer === task.correct) {
    //       points = task.points;
    //     }
    //   } else if (task.type === 'number-recall') {
    //     if (this.userInput === task.correct) {
    //       points = task.points;
    //     }
    //   } else if (task.type === 'calculation') {
    //     if (Number(this.userInput) === Number(task.correct)) {
    //       points = task.points;
    //     }
    //   } else if (task.type === 'word-recall') {
    //     const correctCount = this.selectedWords.filter(w => task.correct.includes(w)).length;
    //     points = correctCount;
    //   } else if (task.type === 'trails') {
    //     if (this.trailsSequence.length === task.sequence.length) {
    //       points = task.points;
    //     }
    //   }

    //   this.score += points;

    //   // Reset stavu pre ďalšiu úlohu
    //   this.answerSubmitted = false;
    //   this.currentAnswer = null;
    //   this.userInput = '';
    //   this.selectedWords = [];
    //   this.trailsSequence = [];

    //   this.nextTask();
    // },

    // selectShape(shape) {
    //   this.selectedShape = shape;
    //   this.initializeTasks();
    //   this.testStore.stage = 'test';
    //   this.startTime = Date.now();
    //   this.timerInterval = setInterval(() => {
    //     this.timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
    //   }, 1000);
    // },

    // initializeTasks() {
    //   const currentMonth = new Date().toLocaleString('sk-SK', { month: 'long' });
    //   const currentYear = new Date().getFullYear().toString();
    //   const currentDay = new Date().toLocaleString('sk-SK', { weekday: 'long' });

    //   this.tasks = [
    //     {
    //       type: 'select-shape',
    //       question: 'Vyber kruh, potom klikni na tlačidlo "pokračovať"',
    //       options: [
    //         'Zatvorte oči',
    //         'Kliknite na štvorec aby ste pokračovali',
    //         'Začnite test',
    //         'Pokračujte ďalej',
    //         'Stlačte tlačidlo',
    //         'Prečítajte si pokyny'
    //       ],
    //       correct: this.instruction,
    //       points: 1
    //     },
    //     // {
    //     //   type: 'instruction-recall',
    //     //   question: 'Aký príkaz ste videli na začiatku testu?',
    //     //   options: [
    //     //     'Zatvorte oči',
    //     //     'Kliknite na štvorec aby ste pokračovali',
    //     //     'Začnite test',
    //     //     'Pokračujte ďalej',
    //     //     'Stlačte tlačidlo',
    //     //     'Prečítajte si pokyny'
    //     //   ],
    //     //   correct: this.instruction,
    //     //   points: 1
    //     // },
    //     {
    //       type: 'shape-recall',
    //       question: 'Ktorý tvar ste si vybrali?',
    //       options: ['štvorec', 'kruh', 'trojuholník', 'hviezda', 'obdĺžnik', 'oval'],
    //       correct: this.selectedShape,
    //       points: 1
    //     },
    //     {
    //       type: 'number-recall',
    //       question: 'Zadajte štvorciferné číslo, ktoré ste videli:',
    //       correct: this.displayNumber,
    //       points: 1
    //     },
    //     {
    //       type: 'orientation',
    //       question: 'Aký je aktuálny mesiac?',
    //       options: ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December'],
    //       correct: currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1),
    //       points: 1
    //     },
    //     {
    //       type: 'orientation',
    //       question: 'Aký je aktuálny rok?',
    //       options: [
    //         (parseInt(currentYear) - 1).toString(),
    //         (parseInt(currentYear) - 2).toString(),
    //         currentYear,
    //         (parseInt(currentYear) + 2).toString(),
    //         (parseInt(currentYear) + 1).toString(),
    //         (parseInt(currentYear) + 3).toString(),
    //       ],
    //       correct: currentYear,
    //       points: 1
    //     },
    //     {
    //       type: 'orientation',
    //       question: 'Aký je dnes deň v týždni?',
    //       options: ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota', 'Nedeľa'],
    //       correct: currentDay.charAt(0).toUpperCase() + currentDay.slice(1),
    //       points: 1
    //     },
    //     {
    //       type: 'orientation',
    //       question: 'V ktorej krajine sa nachádzate?',
    //       options: ['Slovensko', 'Česko', 'Poľsko', 'Maďarsko', 'Rakúsko', 'Nemecko'],
    //       correct: 'Slovensko',
    //       points: 1
    //     },
    //     {
    //       type: 'word-recall',
    //       question: 'Vyberte 5 slov, ktoré ste si zapamätali na začiatku testu:',
    //       correct: this.wordsToMemorize,
    //       points: 5
    //     },
    //     {
    //       type: 'calculation',
    //       question: 'Koľko stojí spolu bicykel za 60€ a jablká za 7€?',
    //       correct: 67,
    //       points: 1
    //     },
    //     {
    //       type: 'calculation',
    //       question: 'Koľko zostane zo 100€, ak utratíte 67€?',
    //       correct: 33,
    //       points: 2
    //     },
    //     {
    //       type: 'stroop',
    //       question: 'Stroop test: Kliknite na farbu textu',
    //       points: 4
    //     },
    //     {
    //       type: 'pattern',
    //       question: 'Ktorý tvar doplní vzor?',
    //       pattern: ['⬜', '⬛', '⬜', '⬛', '?'],
    //       options: ['⬜', '⬛', '🔲', '🔳'],
    //       correct: '⬜',
    //       points: 2
    //     },
    //     {
    //       type: 'trails',
    //       question: 'Trail Making Test: Pripojte čísla v správnom poradí',
    //       sequence: [1, 2, 3, 4, 5, 6, 7, 8],
    //       points: 3
    //     }
    //   ];

    //   this.shuffledTrails = [...this.tasks.find(t => t.type === 'trails').sequence].sort(() => Math.random() - 0.5);
    // },

    //   toggleWord(word) {
    //     if (this.answerSubmitted) return;
    //     if (this.selectedWords.includes(word)) {
    //       this.selectedWords = this.selectedWords.filter(w => w !== word);
    //     } else if (this.selectedWords.length < 5) {
    //       this.selectedWords.push(word);
    //     }
    //   },

    //   handleStroopAnswer(color) {
    //     if (color === this.currentStroopItem.correct) {
    //       this.stroopCorrect++;
    //     }

    //     if (this.stroopIndex < this.stroopItems.length - 1) {
    //       this.stroopIndex++;
    //     } else {
    //       this.score += this.stroopCorrect;
    //       this.stroopIndex = 0;
    //       this.stroopCorrect = 0;
    //       this.nextTask();
    //     }
    //   },

    //   handleTrailClick(num) {
    //     if (this.answerSubmitted) return;
    //     const task = this.currentTaskData;
    //     const expectedNum = task.sequence[this.trailsSequence.length];

    //     if (num === expectedNum) {
    //       this.trailsSequence.push(num);
    //     }
    //   },

    //   nextTask() {
    //     if (this.currentTask < this.tasks.length - 1) {
    //       this.currentTask++;
    //     } else {
    //       clearInterval(this.timerInterval);
    //       this.testStore.stage = 'results';
    //     }
    //   },

    //   formatTime(seconds) {
    //     const mins = Math.floor(seconds / 60);
    //     const secs = seconds % 60;
    //     return `${mins}:${secs.toString().padStart(2, '0')}`;
    //   },

    //   resetTest() {
    //     this.testStore.stage = 'intro';
    //     this.currentTask = 0;
    //     this.score = 0;
    //     this.timeSpent = 0;
    //     this.startTime = null;
    //     this.userInput = '';
    //     this.selectedWords = [];
    //     this.selectedShape = '';
    //     this.stroopIndex = 0;
    //     this.stroopCorrect = 0;
    //     this.trailsSequence = [];
    //     this.tasks = [];
    //     this.answerSubmitted = false;
    //     this.currentAnswer = null;
    //     if (this.timerInterval) {
    //       clearInterval(this.timerInterval);
    //     }
    //   }
    // },


  },
  computed: {
    testStore() {
      return useTestStore()
    },
    themeStore() {
      return useThemeStore()
    },
  },
  created() {
    // this.testStore = useTestStore();
  },
  mounted() {
    // this.testStore.debuggingLog;
  },
  // beforeUnmount() {
  //   if (this.testStore.timerInterval) {
  //     clearInterval(this.testStore.timerInterval);
  //   }
  // }
};
</script>
