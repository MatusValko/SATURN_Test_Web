<template>
    <div v-if="testStore.currentTaskDataType === 'trails'">
        <v-card elevation="2" class="pa-2 pa-sm-4 position-relative trails-container" rounded="lg">
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
                <v-btn :size="buttonSize" :color="getButtonColor(item)"
                    :variant="testStore.trailsSequence.includes(item) ? 'elevated' : 'outlined'"
                    :disabled="testStore.trailsSequence.includes(item) || testStore.answerSubmitted"
                    @click="testStore.handleTrailClick(item)"
                    :class="['trail-button', { 'completed-trail': testStore.trailsSequence.includes(item) }]"
                    rounded="circle" :width="buttonDimensions" :height="buttonDimensions" :min-width="buttonDimensions">
                    <v-icon v-if="testStore.trailsSequence.includes(item)" class="position-absolute check-icon"
                        :size="checkIconSize">
                        mdi-check-circle
                    </v-icon>
                    <span :class="buttonTextClass">{{ item }}</span>
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
            currentTaskId: null,
            windowWidth: window.innerWidth
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
            const isMobile = this.windowWidth < 600;
            const isTablet = this.windowWidth >= 600 && this.windowWidth < 960;

            // Adaptívne nastavenia podľa veľkosti obrazovky
            // Zvýšené minimálne vzdialenosti aby sa buttony určite neprekrývali
            let minDistance, workspaceStart, workspaceSize, buttonBuffer;

            if (isMobile) {
                minDistance = 18; // Percento, nie px - cca 72px pri 400px šírke
                workspaceStart = 12;
                workspaceSize = 76;
                buttonBuffer = 12;
            } else if (isTablet) {
                minDistance = 16; // Percento
                workspaceStart = 14;
                workspaceSize = 72;
                buttonBuffer = 14;
            } else {
                minDistance = 14; // Percento - cca 63px pri 450px šírke
                workspaceStart = 15;
                workspaceSize = 70;
                buttonBuffer = 15;
            }

            this.testStore.shuffledTrails.forEach((item) => {
                let attempts = 0;
                let x, y;
                let validPosition = false;

                while (!validPosition && attempts < 1000) {
                    x = workspaceStart + Math.random() * workspaceSize;
                    y = workspaceStart + Math.random() * workspaceSize;

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
                        if (x < buttonBuffer || x > 100 - buttonBuffer ||
                            y < buttonBuffer || y > 100 - buttonBuffer) {
                            validPosition = false;
                        }
                    }

                    attempts++;
                }

                // Grid-based fallback s väčším rozostupom
                if (!validPosition) {
                    const index = Object.keys(positions).length;
                    const itemCount = this.testStore.shuffledTrails.length;
                    const cols = Math.ceil(Math.sqrt(itemCount));
                    const rows = Math.ceil(itemCount / cols);
                    const spacing = Math.min(workspaceSize / (cols + 1), workspaceSize / (rows + 1));
                    const row = Math.floor(index / cols);
                    const col = index % cols;

                    // Centrované umiestnenie gridu
                    const totalWidth = (cols - 1) * spacing;
                    const totalHeight = (rows - 1) * spacing;
                    const startX = 50 - totalWidth / 2;
                    const startY = 50 - totalHeight / 2;

                    x = startX + col * spacing + (Math.random() - 0.5) * 2;
                    y = startY + row * spacing + (Math.random() - 0.5) * 2;

                    // Uisti sa že sme v hraniciach
                    x = Math.max(buttonBuffer, Math.min(100 - buttonBuffer, x));
                    y = Math.max(buttonBuffer, Math.min(100 - buttonBuffer, y));
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
        },

        handleResize() {
            this.windowWidth = window.innerWidth;
            this.resetPositions();
        }
    },
    computed: {
        testStore() {
            return useTestStore()
        },
        themeStore() {
            return useThemeStore()
        },
        isMobile() {
            return this.windowWidth < 600;
        },
        isTablet() {
            return this.windowWidth >= 600 && this.windowWidth < 960;
        },
        buttonSize() {
            if (this.isMobile) return 'small';
            if (this.isTablet) return 'default';
            return 'large';
        },
        buttonDimensions() {
            if (this.isMobile) return 48;
            if (this.isTablet) return 54;
            return 60;
        },
        checkIconSize() {
            if (this.isMobile) return 'xx-small';
            if (this.isTablet) return 'x-small';
            return 'x-small';
        },
        buttonTextClass() {
            if (this.isMobile) return 'text-body-1 font-weight-bold';
            if (this.isTablet) return 'text-h6 font-weight-bold';
            return 'text-h5 font-weight-bold';
        }
    },
    mounted() {
        this.currentTaskId = this.testStore.currentTaskIndex;
        this.windowWidth = window.innerWidth;
        this.generateRandomPositions();
        this.$nextTick(() => {
            this.updateButtonPositions();
        });
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
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

@media (max-width: 599px) {
    .trails-container {
        min-height: 400px;
        height: 400px;
    }
}

@media (min-width: 600px) and (max-width: 959px) {
    .trails-container {
        min-height: 425px;
        height: 425px;
    }
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

.check-icon {
    top: 2px;
    right: 2px;
}
</style>