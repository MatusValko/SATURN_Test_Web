<template>
    <v-footer class="text-center d-flex flex-column ga-2 py-4" :theme="themeStore.theme">
        <div class="d-flex ga-3">
            <v-btn v-for="icon in icons" :key="icon" :icon="icon" density="comfortable" variant="text"
                :href="getIconLink(icon)" target="_blank"></v-btn>
        </div>

        <v-divider class="my-2" thickness="2" width="500"></v-divider>

        <!-- <div class="text-caption font-weight-regular opacity-60">
            Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet. Mauris cursus commodo interdum. Praesent
            ut
            risus eget metus luctus accumsan id ultrices nunc. Sed at orci sed massa consectetur dignissim a sit amet
            dui.
            Duis commodo vitae velit et faucibus. Morbi vehicula lacinia malesuada. Nulla placerat augue vel ipsum
            ultrices,
            cursus iaculis dui sollicitudin. Vestibulum eu ipsum vel diam elementum tempor vel ut orci. Orci varius
            natoque
            penatibus et magnis dis parturient montes, nascetur ridiculus mus.
        </div> -->
        <v-row align="center" class="px-8">

            <!-- <v-col cols="30" lg="6">
                <img src="/src/assets/SK_FundedbytheEU_RGB_Monochrome.png" alt="Financovaný Európskou úniou"
                    width="200px">
            </v-col> -->

            <!-- <v-col cols="30" lg="6"> -->
            <!-- <v-row> -->
            <!-- {{ new Date().getFullYear() }} <strong> {{ companyName }}</strong> -->
            <div class="text-caption font-weight-regular " v-html="getFooterInfo"></div>
            <!-- </v-row> -->
            <!-- </v-col> -->
        </v-row>

        <v-divider></v-divider>

    </v-footer>

</template>

<script>
import { useThemeStore } from '@/stores/theme'


export default {
    components: {
    },
    data() {
        return {
            companyName: 'GAMETHERAPY s.r.o.',
            icons: [
                'mdi-facebook',
                'mdi-linkedin',
                'mdi-youtube',
                'mdi-instagram',
                'mdi-web',
            ],
            themeStore: useThemeStore(),
        }
    },
    methods: {

    },
    computed: {
        getIconLink() {
            return (icon) => {
                switch (icon) {
                    case 'mdi-facebook':
                        return 'https://www.facebook.com/gametherapy.eu/?locale=sk_SK4'
                    case 'mdi-youtube':
                        return 'https://www.youtube.com/channel/UCkIpNVVI4PGeRCswdavDhzw'
                    case 'mdi-linkedin':
                        return 'https://www.linkedin.com/company/gametherapy-s-r-o/'
                    case 'mdi-instagram':
                        return 'https://www.instagram.com/gametherapy.eu/'
                    case 'mdi-web':
                        return 'https://gametherapy.eu/'
                    default:
                        return '#'
                }
            }
        },
        getFooterInfo() {
            return `© ${new Date().getFullYear()} <strong>${this.companyName}</strong>`
        }
    },

}

</script>