<template>
        <Analytics/>
            <WindowObserver
             v-if="settings">
                <FeedbacksManager>
                        <LocationManager>
                            <ModalManager>
                                <Resume/>
                            </ModalManager>
                        </LocationManager>
                </FeedbacksManager>
            </WindowObserver>
</template>

<script setup>
import { computed } from "vue"
import FeedbacksManager from "/src/vue/stack/FeedbacksManager.vue"
import LocationManager from "/src/vue/stack/LocationManager.vue"
import ModalManager from "/src/vue/stack/ModalManager.vue"
import WindowObserver from "/src/vue/stack/WindowObserver.vue"
import Resume from "/src/vue/stack/Resume.vue"
import { Analytics } from "@vercel/analytics/vue"

import { useDataManagerStore } from "../../stores/DataManager"
const dataManagerStore = useDataManagerStore()

const settings = computed(() => {
    return dataManagerStore.settings
})

dataManagerStore.loadData()
</script>
<style lang="scss" scoped>
 @import "/src/scss/_theming.scss";
</style>
