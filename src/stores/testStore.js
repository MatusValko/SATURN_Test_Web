import { defineStore } from 'pinia'

export const useTestStore = defineStore('test', {
  state: () => ({
    developmentMode: true,

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
    // instruction: 'Kliknite na štvorec aby ste pokračovali',
    displayNumber: '7294',
    fruitsToSelect: ['BANÁN', 'POMARANČ'],
    wordsToMemorize: ['JABLKO', 'PERO', 'KRAVATA', 'DOM', 'AUTO'],

    stroopIndex: 0,
    stroopCorrect: 0,
    stroopItems: [
      { word: 'ČERVENÁ', color: '#2196f3', correct: 'modrá' },
      { word: 'ZELENÁ', color: '#f44336', correct: 'červená' },
      { word: 'MODRÁ', color: '#4caf50', correct: 'zelená' },
      { word: 'ŽLTÁ', color: '#f44336', correct: 'červená' },
    ],
    stroopColors: [
      { name: 'červená', hex: '#f44336' },
      { name: 'modrá', hex: '#2196f3' },
      { name: 'zelená', hex: '#4caf50' },
      { name: 'žltá', hex: '#ffc107' },
    ],

    trailsSequence: [],
    shuffledTrails: [],
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

    currentTaskDataType(state) {
      let taskTMP = state.tasks[state.currentTask]
      if (taskTMP) {
        return taskTMP.type
      } else {
        return '' // vrať prázdny string namiesto {}
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

      if (task.type === 'stroop') return false

      if (
        [
          'instruction-recall',
          'shape-recall',
          'orientation',
          'select-shape',
          'j-word',
          'select-words',
        ].includes(task.type)
      ) {
        return state.currentAnswer !== null
      }

      if (task.type === 'number-recall') {
        return state.userInput.length === 4
      }

      if (task.type === 'calculation') {
        return state.userInput.length > 0
      }

      if (task.type === 'word-recall') {
        return state.selectedWords.length === task.correct.length
      }
      // if (task.type === 'select-words') {
      //   //if all selcted words are correct and the number of selected words matches the correct answers then return true
      //   if (state.selectedWords.length === 0) {
      //     return false
      //   }
      // }

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
          type: 'j-word',
          question: 'Vyberte slovo, ktoré začína na písmeno J:',
          options: ['Hrad', 'List', 'Ruka', 'Meno', 'Voda', 'Dážď', 'Jar', 'Kruh', 'Znak', 'Tvor'],
          correct: 'Jar',
          points: 1,
        },
        {
          type: 'select-words',
          question: 'Vyberte slová, ktoré označujú ovocie:',
          options: this.all4Words,
          correct: this.fruitsToSelect,
          points: 2,
        },
        // {
        //   type: 'instruction-recall',
        //   question: 'Aký príkaz ste videli na začiatku testu?',
        //   options: [
        //     'Zatvorte oči',
        //     'Kliknite na štvorec aby ste pokračovali',
        //     'Začnite test',
        //     'Pokračujte ďalej',
        //     'Stlačte tlačidlo',
        //     'Prečítajte si pokyny'
        //   ],
        //   correct: this.instruction,
        //   points: 1
        // },
        {
          type: 'shape-recall',
          question: 'Ktorý tvar ste si vybrali?',
          options: ['štvorec', 'kruh', 'trojuholník', 'hviezda', 'obdĺžnik', 'oval'],
          correct: this.correctShape,
          points: 1,
        },
        {
          type: 'number-recall',
          question: 'Zadajte štvorciferné číslo, ktoré ste videli:',
          correct: this.displayNumber,
          points: 1,
        },
        {
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
          type: 'orientation',
          question: 'Aký je dnes deň v týždni?',
          options: ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota', 'Nedeľa'],
          correct: currentDay.charAt(0).toUpperCase() + currentDay.slice(1),
          points: 1,
        },
        {
          type: 'orientation',
          question: 'V ktorej krajine sa nachádzate?',
          options: ['Slovensko', 'Česko', 'Poľsko', 'Maďarsko', 'Rakúsko', 'Nemecko'],
          correct: 'Slovensko',
          points: 1,
        },
        {
          type: 'word-recall',
          question: 'Vyberte 5 slov, ktoré ste si zapamätali na začiatku testu:',
          options: this.allWords,
          correct: this.wordsToMemorize,
          points: 5,
        },
        {
          type: 'calculation',
          question: 'Koľko stojí spolu bicykel za 60€ a jablká za 7€?',
          correct: 67,
          points: 1,
        },
        {
          type: 'calculation',
          question: 'Koľko zostane zo 100€, ak utratíte 67€?',
          correct: 33,
          points: 2,
        },
        {
          type: 'stroop',
          question: 'Stroop test: Kliknite na farbu textu',
          points: 4,
        },
        {
          type: 'pattern',
          question: 'Ktorý tvar doplní vzor?',
          pattern: ['⬜', '⬛', '⬜', '⬛', '?'],
          options: ['⬜', '⬛', '🔲', '🔳'],
          correct: '⬜',
          points: 2,
        },
        {
          type: 'trails',
          question: 'Trail Making Test: Pripojte čísla v správnom poradí',
          sequence: [1, 2, 3, 4, 5, 6, 7, 8],
          points: 3,
        },
      ]

      this.shuffledTrails = [...this.tasks.find((t) => t.type === 'trails').sequence].sort(
        () => Math.random() - 0.5,
      )
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
      }
      this.currentAnswer = this.selectedWords
    },

    handleStroopAnswer(color) {
      if (color === this.currentStroopItem.correct) {
        this.stroopCorrect++
      }

      if (this.stroopIndex < this.stroopItems.length - 1) {
        this.stroopIndex++
      } else {
        this.score += this.stroopCorrect
        this.stroopIndex = 0
        this.stroopCorrect = 0
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
    },

    nextTask() {
      this.resetWrongAnswerDialog()
      if (this.currentTask < this.tasks.length - 1) {
        this.currentTask++
      } else {
        clearInterval(this.timerInterval)
        this.testStore.stage = 'results'
      }
    },

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },

    resetTest() {
      this.testStore.stage = 'intro'
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

      if (this.currentTaskData.type === 'number-recall' && this.userInput.length < 4) {
        this.userInput += digit.toString()
      } else if (this.currentTaskData.type === 'calculation') {
        this.userInput += digit.toString()
      }
    },

    // Vymazať input
    clearInput() {
      this.userInput = ''
    },

    // Vybrať odpoveď (pre multiple choice úlohy)
    selectAnswer(answer) {
      if (!this.answerSubmitted) {
        this.currentAnswer = answer
      }
      this.resetWrongAnswerDialog()
    },

    // // Získať validačnú správu pre tlačidlo
    // getValidationMessage() {
    //   console.log('Getting validation message for task:', task)
    //   const task = this.currentTaskData

    //   if (task.type === 'number-recall') {
    //     return `Zadajte 4 číslice (${this.userInput.length}/4)`
    //   }
    //   if (task.type === 'calculation') {
    //     return 'Zadajte odpoveď'
    //   }
    //   if (task.type === 'word-recall') {
    //     return `Vyberte 5 slov (${this.selectedWords.length}/5)`
    //   }
    //   if (task.type === 'trails') {
    //     return `Dokončite sekvenciu (${this.trailsSequence.length}/${task.sequence.length})`
    //   }
    //   if (['instruction-recall', 'shape-recall', 'orientation', 'pattern'].includes(task.type)) {
    //     return 'Vyberte odpoveď'
    //   }

    //   return 'Dokončite úlohu'
    // },

    test() {
      console.log('Test function called')
    },

    // Pokračovať na ďalšiu úlohu
    continueToNext() {
      if (!this.canContinue) {
        console.log('Cannot continue, task not completed:', this.currentTaskData)
        this.wrongAnswerMessage = `Neúplná úloha! Prosím dokončite ju pred pokračovaním.`
        this.showWrongAnswerSnackbar = true
        return
      }

      const task = this.currentTaskData
      let points = 0

      if (
        [
          'instruction-recall',
          'shape-recall',
          'select-shape',
          'orientation',
          'pattern',
          'j-word',
        ].includes(task.type)
      ) {
        if (this.currentAnswer === task.correct) {
          points = task.points
        } else {
          console.log('Wrong answer. Given:', this.currentAnswer, 'Expected:', task.correct)
          // ✅ Zobraz snackbar
          this.wrongAnswerMessage = `Nesprávna odpoveď! Vybrali ste: "${this.currentAnswer}"`
          this.showWrongAnswerSnackbar = true
          return
        }
      } else if (task.type === 'number-recall') {
        if (this.userInput === task.correct) {
          points = task.points
        } else {
          this.wrongAnswerMessage = `Nesprávne číslo! Zadali ste: "${this.userInput}"`
          this.showWrongAnswerSnackbar = true
          return
        }
      } else if (task.type === 'calculation') {
        if (Number(this.userInput) === Number(task.correct)) {
          points = task.points
        } else {
          this.wrongAnswerMessage = `Nesprávny výsledok! Zadali ste: "${this.userInput}"`
          this.showWrongAnswerSnackbar = true
          return
        }
      } else if (task.type === 'word-recall') {
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
