import { defineStore } from 'pinia'

export const useTestStore = defineStore('test', {
  state: () => ({
    developmentMode: false,

    showWrongAnswerSnackbar: false,
    wrongAnswerMessage: '',

    stage: 'intro',
    currentTask: 0,
    score: 0,
    timeSpent: 0,
    startTime: null,
    timerInterval: null,
    userInput: '',
    selectedWords: [],
    selectedShape: '',
    correctShape: 'kruh',

    answerSubmitted: false,
    currentAnswer: null,
    count: 0,
    displayNumber: '1239',
    fruitsToSelect: ['BANÁN', 'POMARANČ'],
    wordsToMemorize: ['JABLKO', 'PERO', 'KRAVATA', 'DOM', 'AUTO'],
    wordsToMemorizeInterval: 100,
    stroopIndex: 0,
    stroopCorrect: 0,
    stroopItems: [
      { word: 'RUKA', color: '#2196f3', correct: 'modrá' },
      { word: 'KNIHA', color: '#f44336', correct: 'červená' },
      { word: 'STÔL', color: '#4caf50', correct: 'zelená' },
      { word: 'ZELENÁ', color: '#2196f3', correct: 'modrá' },
      { word: 'ČERVENÁ', color: '#4caf50', correct: 'zelená' },
      { word: 'MODRÁ', color: '#f44336', correct: 'červená' },
      { word: 'ČERVENÁ', color: '#2196f3', correct: 'modrá' },
      { word: 'MODRÁ', color: '#4caf50', correct: 'zelená' },
      { word: 'ZELENÁ', color: '#f44336', correct: 'červená' },
      { word: 'ČERVENÁ', color: '#4caf50', correct: 'zelená' },
      { word: 'MODRÁ', color: '#f44336', correct: 'červená' },
      { word: 'ČERVENÁ', color: '#2196f3', correct: 'modrá' },
      { word: 'ZELENÁ', color: '#f44336', correct: 'červená' },
      { word: 'MODRÁ', color: '#4caf50', correct: 'zelená' },
      { word: 'ZELENÁ', color: '#2196f3', correct: 'modrá' },
    ],
    stroopColors: [
      { name: 'červená', hex: '#f44336' },
      { name: 'modrá', hex: '#2196f3' },
      { name: 'zelená', hex: '#4caf50' },
    ],

    trailsSequence: [],
    all4Words: ['BANÁN', 'KOSTOL', 'POMARANČ', 'SPONKA'],
    allWords: [
      'KRAVATA',
      'CHLIEB',
      'ČAS',
      'POKOJ',
      'DVERE',
      'OBCHOD',
      'DOM',
      'ŽALÚDOK',
      'TELEFÓN',
      'PIVO',
      'POŠTA',
      'ALKOHOL',
      'CERUZKA',
      'OKO',
      'HUDBA',
      'POSTEĽ',
      'BICYKEL',
      'CITRÓN',
      'VÍNO',
      'PRIATEĽ',
      'KNIŽNICA',
      'JABLKO',
      'VAJCE',
      'ÚSTA',
      'FARBA',
      'ZAHRADA',
      'TÝŽDEŇ',
      'ŠŤASTIE',
      'BANKA',
      'KOSTOL',
      'KÚPEĽŇA',
      'ZELENÁ',
      'SESTRA',
      'OVCA',
      'TANEC',
      'HOKEJ',
      'AUTO',
      'VLAK',
      'MOZOG',
      'NOS',
      'ROK',
      'MINÚTA',
      'ŠKOLA',
      'BABKA',
      'HVIEZDA',
      'PAPIER',
      'BANÁN',
      'MRKVA',
      'MOTÝĽ',
      'MÚZEUM',
      'SLNKO',
      'FIALOVÁ',
      'RYBA',
      'SLIEPKA',
      'KVET',
      'STROM',
      'ČOKOLÁDA',
      'CHLAPEC',
      'TULIPÁN',
      'HRUŠKA',
      'ŽENA',
      'BLESK',
      'STOLIČKA',
      'VČELA',
      'MLIEKO',
      'VODA',
      'OKNO',
      'LEKÁR',
      'BÚRKA',
      'PES',
      'RADOSŤ',
      'ZEMIAK',
      'NOHA',
      'LÁSKA',
      'JAHODA',
      'AUTOBUS',
      'PERO',
      'ORANŽOVÁ',
      'ZELENINA',
      'SYR',
      'VODIČ',
      'HLAVA',
      'MUŽ',
      'DÚHA',
      'JEDLO',
      'SNEH',
      'LIETADLO',
      'MESIAC',
      'POČÍTAČ',
      'KNIHA',
      'NÁDEJ',
      'SRDCE',
      'KRAVA',
      'POMARANČ',
      'MAČKA',
      'SEKUNDA',
      'KUCHYŇA',
      'DEŇ',
      'SKÚŠKA',
    ],

    tasks: [],
  }),
  getters: {
    getIcon: (state) => (state.theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'),

    progressPercent(state) {
      return ((state.currentTask + 1) / state.tasks.length) * 100
    },

    currentTaskData(state) {
      return state.tasks[state.currentTask] || {}
    },

    currentTaskIndex(state) {
      return state.currentTask
    },

    currentTaskDataType(state) {
      let taskTMP = state.tasks[state.currentTask]
      if (taskTMP) {
        return taskTMP.type
      } else {
        return ''
      }
    },

    currentTaskDataQuestion(state) {
      let taskTMP = state.tasks[state.currentTask]
      if (taskTMP) {
        return taskTMP.question
      } else {
        return ''
      }
    },

    currentStroopItem(state) {
      return state.stroopItems[state.stroopIndex] || state.stroopItems[0]
    },

    scorePercentage(state) {
      return Math.round((state.score / 30) * 100)
    },

    // ✅ OPRAVA: shuffledTrails ako getter
    shuffledTrails(state) {
      const task = state.tasks[state.currentTask]
      if (task && task.type === 'trails' && task.sequence) {
        return [...task.sequence].sort(() => Math.random() - 0.5)
      }
      return []
    },

    interpretation(state) {
      if (state.score >= 26) {
        return {
          level: 'Výborné',
          color: '#4caf50',
          class: 'excellent',
          description: 'Kognitívne funkcie v norme',
        }
      } else if (state.score >= 21) {
        return {
          level: 'Dobré',
          color: '#2196f3',
          class: 'good',
          description: 'Mierne kognitívne zmeny',
        }
      } else if (state.score >= 16) {
        return {
          level: 'Stredné',
          color: '#ffc107',
          class: 'medium',
          description: 'Stredné kognitívne zhoršenie',
        }
      } else {
        return {
          level: 'Nízke',
          color: '#f44336',
          class: 'poor',
          description: 'Výrazné kognitívne zhoršenie',
        }
      }
    },

    canContinue(state) {
      const task = state.tasks[state.currentTask] || {}

      if (task.type === 'stroop') {
        if (state.currentAnswer !== null) {
          return true
        } else {
          return false
        }
      }
      if (
        task.type === 'text-instruction' ||
        task.type === 'show-words' ||
        task.type === 'shape-recall'
      )
        return true

      if (
        [
          'instruction-recall',
          'orientation',
          'select-shape',
          'j-word',
          'j-word-recall',
          'select-words',
        ].includes(task.type)
      ) {
        return state.currentAnswer !== null
      }

      if (task.type === 'number-recall' || task.type === 'number-write') {
        return state.userInput.length === 4
      }

      if (task.type === 'calculation') {
        return state.userInput.length > 0
      }

      if (task.type === 'word-recall') {
        return state.selectedWords.length === task.correct.length
      }

      if (task.type === 'pattern') {
        return state.currentAnswer !== null
      }

      if (task.type === 'trails') {
        return state.trailsSequence.length === task.sequence.length
      }

      return false
    },
  },
  actions: {
    developlmentModeToggle() {
      this.developmentMode = !this.developmentMode
    },
    debuggingLog() {
      console.log('Store:', this.testStore)
      console.log('Current task:', this.testStore.currentTask)
      console.log('Tasks:', this.testStore.tasks)
      console.log('Getter result:', this.testStore.currentTaskDataType)
    },
    resetWrongAnswerDialog() {
      if (this.showWrongAnswerSnackbar) {
        this.showWrongAnswerSnackbar = false
        this.wrongAnswerMessage = ''
      }
    },
    selectShape(shape) {
      this.selectedShape = shape
      this.currentAnswer = shape

      this.resetWrongAnswerDialog()
    },
    startTest() {
      this.stage = 'test'
      this.initializeTasks()
      this.startTime = Date.now()
      this.timerInterval = setInterval(() => {
        this.timeSpent = Math.floor((Date.now() - this.startTime) / 1000)
      }, 1000)
    },
    initializeTasks() {
      const currentMonth = new Date().toLocaleString('sk-SK', { month: 'long' })
      const currentYear = new Date().getFullYear().toString()
      const currentDay = new Date().toLocaleString('sk-SK', { weekday: 'long' })

      this.tasks = [
        {
          //1
          type: 'select-shape',
          question: `Vyber ${this.correctShape}, potom klikni na tlačidlo "pokračovať"`,
          options: [
            //TODO zatial sa nebere options pri ulohe select-shape
            'kruh',
            'štvorec',
          ],
          correct: this.correctShape,
          points: 1,
        },
        {
          //2
          type: 'j-word',
          question: 'Vyberte slovo, ktoré začína na písmeno J:',
          options: ['Hrad', 'List', 'Ruka', 'Meno', 'Voda', 'Dážď', 'Jar', 'Kruh', 'Znak', 'Tvor'],
          correct: 'Jar',
          points: 1,
        },
        {
          //3
          type: 'select-words',
          question: 'Vyberte slová, ktoré označujú ovocie:',
          options: this.all4Words,
          correct: this.fruitsToSelect,
          points: 1,
        },
        {
          //4
          type: 'number-write',
          question: `Zadaj číslo ${this.displayNumber}:`,
          correct: this.displayNumber,
          points: 1,
        },
        {
          //5
          type: 'text-instruction',
          question: [
            'Ďalej nasleduje pamäťová úloha.',
            'Zapamätajte si päť slov.',
            'Zobrazia sa automaticky na ďalšej strane.',
            'Sústreď sa!',
            'Každé slovo uvidíš len na pár sekúnd.',
            ' Tvojou úlohou je zapamätať si tieto slová.',
          ],
          // correct: null,
          // points: 1,
        },
        {
          //6
          type: 'text-instruction',
          question: ['Zapamätaj si slová.', '...Už prichádzajú!...'],
          // correct: null,
          // points: 1
        },
        {
          //7
          type: 'show-words',
          question: '',
          correct: this.wordsToMemorize,
          // points: 1
        },
        {
          //8
          type: 'text-instruction',
          question: [
            ' Zapamätaj si tých päť slov na neskôr.',
            'Teraz, prosím, odpovedz na niekoľko ďalších otázok.',
          ],
          // correct: null,
          // points: 1
        },
        {
          //9
          type: 'shape-recall',
          question: 'Aký tvar ste mali pred chvíľou vybrať?',
          options: ['Kruh', 'Obdĺžnik', 'Štvorec', 'Trojuholník'],
          correct: this.correctShape,
          points: 1,
        },
        {
          //   //10
          type: 'j-word-recall',
          question:
            'Pred chvíľou ste mali vybrať slovo začínajúce určitým písmenom. Vyberte rovnaké slovo znovu:',
          options: ['Hrad', 'List', 'Ruka', 'Meno', 'Voda', 'Dážď', 'Jar', 'Kruh', 'Znak', 'Tvor'],
          correct: 'Jar',
          points: 1,
        },
        {
          //11
          type: 'number-recall',
          question:
            'Keď si prvýkrát videl túto numerickú klávesnicu, musel si zadať konkrétne štvormiestne číslo. Zadaj to isté číslo znova.:',
          correct: this.displayNumber,
          points: 1,
        },
        {
          //12
          type: 'orientation',
          question: 'Aký je aktuálny mesiac?',
          options: [
            'Január',
            'Február',
            'Marec',
            'Apríl',
            'Máj',
            'Jún',
            'Júl',
            'August',
            'September',
            'Október',
            'November',
            'December',
          ],
          correct: currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1),
          points: 1,
        },
        {
          //13
          type: 'orientation',
          question: 'Aký je aktuálny rok?',
          options: [
            (parseInt(currentYear) - 1).toString(),
            (parseInt(currentYear) - 2).toString(),
            currentYear,
            (parseInt(currentYear) + 2).toString(),
            (parseInt(currentYear) + 1).toString(),
            (parseInt(currentYear) + 3).toString(),
          ],
          correct: currentYear,
          points: 1,
        },
        {
          //14
          type: 'orientation',
          question: 'Aký je dnes deň v týždni?',
          options: ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota', 'Nedeľa'],
          correct: currentDay.charAt(0).toUpperCase() + currentDay.slice(1),
          points: 1,
        },
        {
          //15
          type: 'orientation',
          question: 'V ktorej krajine sa nachádzate?',
          options: ['Slovensko', 'Česko', 'Poľsko', 'Maďarsko', 'Rakúsko', 'Nemecko'],
          correct: 'Slovensko',
          points: 1,
        },
        {
          //16
          type: 'word-recall',
          question: 'Predtým ste si mali zapamätať 5 slov. Vybertie tie isté slová zo zoznamu:',
          options: this.allWords,
          correct: this.wordsToMemorize,
          points: 5,
        },
        {
          //17
          type: 'calculation',
          question:
            'Ideš do obchodu s presne 100€. Kúpiš tucet jabĺk za 7€ a trojkolku za 60€. Koľko si minul?',
          correct: 67,
          points: 1,
        },
        {
          //18
          type: 'calculation',
          question: 'Po tomto nákupe, koľko Vám zostalo peňazí?',
          correct: 33,
          points: 1,
        },
        {
          //19
          type: 'text-instruction',
          question: [
            'Ďalej uvidíš niekoľko obrázkov.',
            'Vyber malé obrázky, z ktorých sa skladá veľký obrázok.',
          ],
          correct: '/src/assets/drawingExample.png',
        },
        {
          //20
          type: 'pattern',
          question: 'Ktoré malé obrázky tvoria veľký obrázok?',
          pattern: '/src/assets/firstPattern/shapes-answer.webp',
          options: [1, 2, 3, 4, 5, 6],
          src: [
            '/src/assets/firstPattern/shapes1.webp',
            '/src/assets/firstPattern/shapes2.webp',
            '/src/assets/firstPattern/shapes3.webp',
            '/src/assets/firstPattern/shapes4.webp',
            '/src/assets/firstPattern/shapes5.webp',
            '/src/assets/firstPattern/shapes6.webp',
          ],
          correct: [1, 5],
          points: 1,
        },
        {
          //21
          type: 'pattern',
          question: 'Ktoré malé obrázky tvoria veľký obrázok?',
          pattern: '/src/assets/secondPattern/face-answer.webp',
          options: [1, 2, 3, 4, 5, 6],
          src: [
            '/src/assets/secondPattern/face1.webp',
            '/src/assets/secondPattern/face2.webp',
            '/src/assets/secondPattern/face3.webp',
            '/src/assets/secondPattern/face4.webp',
            '/src/assets/secondPattern/face5.webp',
            '/src/assets/secondPattern/face6.webp',
          ],
          correct: [2, 6],
          points: 1,
        },
        {
          //22
          type: 'pattern',
          question: 'Ktoré malé obrázky tvoria veľký obrázok?',
          pattern: '/src/assets/thirdPattern/diagonal-line-answer.webp',
          options: [1, 2, 3, 4, 5, 6],
          src: [
            '/src/assets/thirdPattern/diagonal-line1.webp',
            '/src/assets/thirdPattern/diagonal-line2.webp',
            '/src/assets/thirdPattern/diagonal-line3.webp',
            '/src/assets/thirdPattern/diagonal-line4.webp',
            '/src/assets/thirdPattern/diagonal-line5.webp',
            '/src/assets/thirdPattern/diagonal-line6.webp',
          ],
          correct: [3, 6],
          points: 1,
        },
        {
          //23
          type: 'pattern',
          question: 'Ktoré malé obrázky tvoria veľký obrázok?',
          pattern: '/src/assets/fourthPattern/cube-answer.webp',
          options: [1, 2, 3, 4, 5, 6],
          src: [
            '/src/assets/fourthPattern/cube1.webp',
            '/src/assets/fourthPattern/cube2.webp',
            '/src/assets/fourthPattern/cube3.webp',
            '/src/assets/fourthPattern/cube4.webp',
            '/src/assets/fourthPattern/cube5.webp',
            '/src/assets/fourthPattern/cube6.webp',
          ],
          correct: [3, 4],
          points: 1,
        },
        {
          //24
          type: 'text-instruction',
          question: [
            'Ďalej uvidíš niekoľko slov.',
            'Vyberte <span class="rainbow">FARBU</span>, ktorou je každé slovo napísané.',
          ],
        },

        {
          //25
          type: 'stroop',
          // question: 'Stroop test: Kliknite na farbu textu',
          question: '',
          correct: this.currentStroopItem.correct,

          points: 4,
        },
        {
          //26
          type: 'text-instruction',
          question: ['Už si takmer na konci!', 'V posledných úlohách budeš spájať body.'],
        },
        {
          //27
          type: 'text-instruction',
          question: [
            'Kreslite čiary od jedného bodu k druhému.',
            'Body s číslami spájaj podľa poradia od najnižšieho po najvyššie (1, 2, 3, …).',
            ' Body s písmenami spájaj v abecednom poradí (A, B, C, …).',
          ],
        },
        {
          //28
          type: 'text-instruction',
          question: [
            'Body sa zafarbia nazeleno, keď ich spájaš v správnom poradí...',
            '… inak farbue nezmenia, ak sa pomýliš v poradí.',
          ],
        },
        {
          //29
          type: 'trails',
          question: 'Pripojte čísla v správnom poradí',
          sequence: [1, 2, 3, 4, 5, 6, 7, 8],
          points: 2,
        },
        {
          //30
          type: 'trails',
          question: 'Pripojte čísla v správnom poradí',
          sequence: [1, 'A', 2, 'B', 3, 'C', 4, 'D', 5, 'E'],
          points: 2,
        },

        // {
        //   type: 'pattern',
        //   question:
        //     'Ďalej uvidíš niekoľko obrázkov. Vyber malé obrázky, z ktorých sa skladá veľký obrázok.',
        //   pattern: ['⬜', '⬛', '⬜', '⬛', '?'],
        //   options: ['⬜', '⬛', '🔲', '🔳'],
        //   correct: '⬜',
        //   points: 2,
        // },
        // {
        //   type: 'trails',
        //   question: 'Trail Making Test: Pripojte čísla v správnom poradí',
        //   sequence: [1, 2, 3, 4, 5, 6, 7, 8],
        //   points: 3,
        // },
      ]
    },
    toggleWord(word) {
      if (this.answerSubmitted) return
      if (this.selectedWords.includes(word)) {
        this.selectedWords = this.selectedWords.filter((w) => w !== word)
      } else if (this.currentTaskData.type === 'word-recall') {
        if (this.selectedWords.length < this.currentTaskData.correct.length) {
          this.selectedWords.push(word)
        }
      } else if (this.currentTaskData.type === 'select-words') {
        this.selectedWords.push(word)
      } else if (this.currentTaskData.type === 'pattern') {
        if (this.selectedWords.length < this.currentTaskData.correct.length)
          this.selectedWords.push(word)
      }
      this.currentAnswer = this.selectedWords
    },

    selectStroopColor(color) {
      this.currentAnswer = color
      this.resetWrongAnswerDialog()
    },

    handleStroopAnswer() {
      if (this.currentAnswer === this.currentStroopItem.correct) {
        console.log('stroop correct')
        this.stroopCorrect++
      } else {
        console.log('stroop INcorrect')
      }

      if (this.stroopIndex < this.stroopItems.length - 1) {
        this.stroopIndex++
        this.currentAnswer = null
        this.currentTaskData.correct = this.currentStroopItem.correct
      } else {
        this.score += this.stroopCorrect
        this.stroopIndex = 0
        this.stroopCorrect = 0
        this.currentAnswer = null
        this.nextTask()
      }
    },

    handleTrailClick(num) {
      if (this.answerSubmitted) return
      const task = this.currentTaskData
      const expectedNum = task.sequence[this.trailsSequence.length]

      if (num === expectedNum) {
        this.trailsSequence.push(num)
      }
      this.resetWrongAnswerDialog()
    },

    nextTask() {
      this.resetWrongAnswerDialog()
      if (this.currentTask < this.tasks.length - 1) {
        this.currentTask++
      } else {
        clearInterval(this.timerInterval)
        this.stage = 'results'
      }
    },

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },

    resetTest() {
      this.stage = 'intro'
      this.currentTask = 0
      this.score = 0
      this.timeSpent = 0
      this.startTime = null
      this.userInput = ''
      this.selectedWords = []
      this.selectedShape = ''
      this.stroopIndex = 0
      this.stroopCorrect = 0
      this.trailsSequence = []
      this.tasks = []
      this.answerSubmitted = false
      this.currentAnswer = null
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
      }
    },

    addDigit(digit) {
      this.resetWrongAnswerDialog()

      if (
        (this.currentTaskData.type === 'number-write' ||
          this.currentTaskData.type === 'number-recall') &&
        this.userInput.length < 4
      ) {
        this.userInput += digit.toString()
      } else if (this.currentTaskData.type === 'calculation') {
        this.userInput += digit.toString()
      }
    },

    clearInput() {
      this.userInput = ''
    },

    selectAnswer(answer) {
      if (!this.answerSubmitted) {
        this.currentAnswer = answer
      }
      this.resetWrongAnswerDialog()
    },

    continueToNext() {
      if (!this.canContinue) {
        console.log('Cannot continue, task not completed:', this.currentTaskData)
        this.wrongAnswerMessage = `Neúplná úloha! Prosím dokončite ju pred pokračovaním.`
        this.showWrongAnswerSnackbar = true
        return
      }

      const task = this.currentTaskData
      let points = 0

      if (['instruction-recall', 'select-shape', 'j-word'].includes(task.type)) {
        if (this.currentAnswer === task.correct) {
          points = task.points
        } else {
          console.log('Wrong answer. Given:', this.currentAnswer, 'Expected:', task.correct)
          this.wrongAnswerMessage = `Nesprávna odpoveď! Vybrali ste: "${this.currentAnswer}"`
          this.showWrongAnswerSnackbar = true
          return
        }
      } else if (task.type === 'number-write') {
        if (this.userInput === task.correct) {
          points = task.points
        } else {
          this.wrongAnswerMessage = `Nesprávne číslo! Zadali ste: "${this.userInput}"`
          this.showWrongAnswerSnackbar = true
          return
        }
      } else if (task.type === 'number-recall') {
        if (this.userInput === task.correct) {
          points = task.points
        } else {
          console.log('Wrong answer. Given:', this.currentAnswer, 'Expected:', task.correct)
        }
      } else if (task.type === 'calculation') {
        if (Number(this.userInput) === Number(task.correct)) {
          points = task.points
        }
      } else if (task.type === 'word-recall') {
        const correctCount = this.selectedWords.filter((w) => task.correct.includes(w)).length
        points = correctCount
      } else if (task.type === 'pattern') {
        if (this.selectedWords.length !== task.correct.length) {
          this.wrongAnswerMessage = `Musíte vybrať presne ${task.correct.length} obrázky.`
          this.showWrongAnswerSnackbar = true
          return
        }
        const correctCount = this.selectedWords.filter((w) => task.correct.includes(w)).length
        points = correctCount
      } else if (task.type === 'select-words') {
        if (
          this.selectedWords.every((word) => task.correct.includes(word)) &&
          this.selectedWords.length === task.correct.length
        ) {
          points = task.correct.length
        } else {
          this.wrongAnswerMessage = `Na pokračovanie musíš vybrať obe slová označujúce ovocie`
          this.showWrongAnswerSnackbar = true
          return
        }
      } else if (task.type === 'trails') {
        if (this.trailsSequence.length === task.sequence.length) {
          points = task.points
        }
      } else if (task.type === 'text-instruction' || task.type === 'show-words') {
        console.log('Text-instruction task, no points awarded.')
      } else if (task.type === 'j-word-recall' || task.type === 'shape-recall') {
        if (this.currentAnswer.toLowerCase() == task.correct.toLowerCase()) {
          points = task.points
        } else {
          console.log('Wrong answer. Given:', this.currentAnswer, 'Expected:', task.correct)
        }
      } else if (task.type === 'stroop') {
        this.handleStroopAnswer()
        return
      } else if (task.type === 'orientation') {
        if (this.currentAnswer == task.correct) {
          points = task.points
        } else {
          console.log('Wrong answer. Given:', this.currentAnswer, 'Expected:', task.correct)
        }
      }
      this.score += points

      // Reset stavu pre ďalšiu úlohu
      this.answerSubmitted = false
      this.currentAnswer = null
      this.userInput = ''
      this.selectedWords = []
      this.trailsSequence = []

      this.nextTask()
    },
    closeWrongAnswerDialog() {
      this.showWrongAnswerSnackbar = false
      this.wrongAnswerMessage = ''
    },
  },
})
