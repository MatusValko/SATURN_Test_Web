<template>
    <div v-if="testStore.currentTaskDataType === 'trails'">
        <v-card elevation="2" class="pa-4 position-relative trails-container" rounded="lg">
            <!-- SVG Canvas pre čiary -->
            <svg class="trails-svg" :style="{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1
            }">
                <line v-for="(item, index) in testStore.trailsSequence.slice(0, -1)" :key="`line-${index}`"
                    :x1="buttonPositions[item]?.x || 0" :y1="buttonPositions[item]?.y || 0"
                    :x2="buttonPositions[testStore.trailsSequence[index + 1]]?.x || 0"
                    :y2="buttonPositions[testStore.trailsSequence[index + 1]]?.y || 0" stroke="#4DD0E1" stroke-width="8"
                    stroke-linecap="round" />
            </svg>

            <!-- Náhodne rozmiestnené čísla a písmená -->
            <div v-for="item in testStore.shuffledTrails" :key="`${testStore.currentTaskIndex}-${item}`"
                :ref="`trail-${item}`" class="trail-number-wrapper" :style="{
                    position: 'absolute',
                    left: `${numberPositions[item]?.x || 0}%`,
                    top: `${numberPositions[item]?.y || 0}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2
                }">
                <v-btn size="large" :color="getButtonColor(item)"
                    :variant="testStore.trailsSequence.includes(item) ? 'elevated' : 'outlined'"
                    :disabled="testStore.trailsSequence.includes(item) || testStore.answerSubmitted"
                    @click="testStore.handleTrailClick(item)" class="text-h5 font-weight-bold trail-button"
                    :class="{ 'completed-trail': testStore.trailsSequence.includes(item) }" rounded="circle" width="60"
                    height="60" min-width="60">
                    <v-icon v-if="testStore.trailsSequence.includes(item)" class="position-absolute"
                        style="top: 2px; right: 2px;" size="x-small">
                        mdi-check-circle
                    </v-icon>
                    {{ item }}
                </v-btn>
            </div>
        </v-card>
    </div>
</template>

<script>
import { useTestStore } from '@/stores/testStore';
import { useThemeStore } from '@/stores/themeStore';

export default {
    data() {
        return {
            buttonPositions: {},
            numberPositions: {},
            currentTaskId: null
        };
    },
    methods: {
        getButtonColor(item) {
            if (this.testStore.trailsSequence.includes(item)) {
                return 'success';
            }
            return typeof item === 'string' && isNaN(item) ? 'secondary' : 'primary';
        },

        generateRandomPositions() {
            const positions = {};
            const minDistance = 25; // Zvýšená minimálna vzdialenosť
            const buttonSize = 12; // Väčší buffer

            this.testStore.shuffledTrails.forEach((item) => {
                let attempts = 0;
                let x, y;
                let validPosition = false;

                while (!validPosition && attempts < 500) {
                    x = 20 + Math.random() * 60; // Ešte menšia pracovná plocha
                    y = 20 + Math.random() * 60;

                    validPosition = true;

                    // Skontroluj vzdialenosť od všetkých existujúcich pozícií
                    for (const [, pos] of Object.entries(positions)) {
                        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
                        if (distance < minDistance) {
                            validPosition = false;
                            break;
                        }
                    }

                    // Skontroluj okraje
                    if (validPosition) {
                        if (x < buttonSize || x > 100 - buttonSize ||
                            y < buttonSize || y > 100 - buttonSize) {
                            validPosition = false;
                        }
                    }

                    attempts++;
                }

                // Grid-based fallback s lepším rozostupom
                if (!validPosition) {
                    const index = Object.keys(positions).length;
                    const cols = Math.ceil(Math.sqrt(this.testStore.shuffledTrails.length));
                    const spacing = 60 / (cols + 1);
                    const row = Math.floor(index / cols);
                    const col = index % cols;
                    x = 20 + (col + 1) * spacing + (Math.random() - 0.5) * 3;
                    y = 20 + (row + 1) * spacing + (Math.random() - 0.5) * 3;
                }

                positions[item] = { x, y };
            });

            this.numberPositions = positions;
        },

        updateButtonPositions() {
            this.$nextTick(() => {
                this.testStore.shuffledTrails.forEach(item => {
                    const ref = this.$refs[`trail-${item}`];
                    if (ref && ref[0]) {
                        const button = ref[0].querySelector('.trail-button');
                        if (button) {
                            const rect = button.getBoundingClientRect();
                            const containerRect = this.$el.querySelector('.trails-container').getBoundingClientRect();

                            this.buttonPositions[item] = {
                                x: rect.left - containerRect.left + rect.width / 2,
                                y: rect.top - containerRect.top + rect.height / 2
                            };
                        }
                    }
                });
            });
        },

        resetPositions() {
            this.buttonPositions = {};
            this.numberPositions = {};
            this.generateRandomPositions();
            this.$nextTick(() => {
                this.updateButtonPositions();
            });
        }
    },
    computed: {
        testStore() {
            return useTestStore()
        },
        themeStore() {
            return useThemeStore()
        },
    },
    mounted() {
        this.currentTaskId = this.testStore.currentTaskIndex;
        this.generateRandomPositions();
        this.$nextTick(() => {
            this.updateButtonPositions();
        });
        window.addEventListener('resize', this.updateButtonPositions);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.updateButtonPositions);
    },
    watch: {
        'testStore.trailsSequence': {
            handler() {
                this.$nextTick(() => {
                    this.updateButtonPositions();
                });
            },
            deep: true
        },
        'testStore.shuffledTrails': {
            handler() {
                this.resetPositions();
            }
        },
        'testStore.currentTaskIndex': {
            handler(newVal) {
                if (newVal !== this.currentTaskId) {
                    this.currentTaskId = newVal;
                    this.resetPositions();
                }
            }
        }
    }
};
</script>

<style scoped>
.trails-container {
    min-height: 450px;
    height: 450px;
    position: relative;
}

.trail-number-wrapper {
    position: absolute;
}

.position-relative {
    position: relative;
}

.completed-trail {
    opacity: 0.7;
}

.trail-button {
    transition: all 0.3s ease;
}
</style>