<template>
    <v-row v-if="testStore.stage === 'intro'" justify="center" align="center">
        <v-col cols="auto">
            <div class="saturn">
                <img src="../assets/saturn.png " alt="Saturn" width="500" />
            </div>
        </v-col>
        <v-col cols="12" md="6">
            <transition name="fade">
                <v-card elevation="4" class="pa-6" rounded="lg">
                    <h3 class="mb-4">O teste:</h3>
                    <ul class="text-left">
                        <li>Kognitívny screening test na hodnotenie pamäte, pozornosti a mentálnych funkcií</li>
                        <li>Trvá približne 10-15 minút</li>
                        <li>Maximálne skóre: 30 bodov</li>
                        <li>Test obsahuje úlohy na pamäť, orientáciu, výpočty, pozornosť a vizuospatiálne funkcie</li>
                        <li>Vyplňuje sa samostatne bez pomoci administrátora</li>
                    </ul>

                    <v-alert type="warning" variant="tonal" class="mt-4">
                        <strong>⚠️ Upozornenie:</strong> Tento test slúži len na informatívne účely a screeningové
                        použitie.
                        Nemôže nahradiť odbornú lekársku diagnózu. Pri akýchkoľvek obavách týkajúcich sa kognitívnych
                        funkcií sa
                        obráťte na lekára.
                    </v-alert>

                    <v-btn color="primary" size="large" block class="mt-4" @click="testStore.startTest">
                        Začať test
                    </v-btn>
                </v-card>
            </transition>
        </v-col>
    </v-row>

</template>

<script>
import { useThemeStore } from '@/stores/themeStore'
import { useTestStore } from '@/stores/testStore'



export default {
    components: {
    },
    // props: {
    //     stage: {
    //         type: String,
    //         required: true,
    //     },
    // },
    data() {
        return {
            themeStore: useThemeStore(),
            testStore: useTestStore(),
        }
    },
    methods: {


    },
    computed: {

    },

}

</script>