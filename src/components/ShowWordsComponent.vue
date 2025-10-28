<template>
    <transition>
        <v-container v-if="testStore.currentTaskData.type === 'show-words'">
            <h1 :class="['mb-4', $vuetify.display.xs ? 'text-h4' : $vuetify.display.sm ? 'text-h3' : 'text-h2']">
                {{ currentWord }}
            </h1>
        </v-container>
    </transition>
</template>

<script>
import { useTestStore } from '@/stores/testStore';

export default {
    data() {
        return {
            currentWordIndex: 0,
            intervalId: null
        };
    },
    computed: {
        testStore() {
            return useTestStore()
        },
        currentWord() {
            if (this.testStore.currentTaskData.type === 'show-words' &&
                this.testStore.currentTaskData.correct) {
                return this.testStore.currentTaskData.correct[this.currentWordIndex] || '';
            }
            return '';
        }
    },
    mounted() {
        this.startWordCycle();
    },
    beforeUnmount() {
        this.stopWordCycle();
    },
    methods: {
        startWordCycle() {
            if (this.testStore.currentTaskData.type === 'show-words' &&
                this.testStore.currentTaskData.correct &&
                this.testStore.currentTaskData.correct.length > 0) {

                this.currentWordIndex = 0;

                this.intervalId = setInterval(() => {
                    this.currentWordIndex++;

                    if (this.currentWordIndex >= this.testStore.currentTaskData.correct.length) {
                        this.stopWordCycle();
                        this.onWordsComplete();
                        return;
                    }
                }, this.testStore.wordsToMemorizeInterval);
            }
        },
        stopWordCycle() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        },
        onWordsComplete() {
            // Akcia po zobrazení všetkých slov
            console.log('Všetky slová boli zobrazené!');
            this.testStore.continueToNext();

            // Príklad: presun na ďalšiu úlohu
            // this.testStore.moveToNextTask();
        }
    },
    watch: {
        'testStore.currentTaskData.type'() {
            this.stopWordCycle();
            this.startWordCycle();
        }
    }
};
</script>