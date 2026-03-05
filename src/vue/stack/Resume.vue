<template>
    <div v-if="didLoadAllJsonFiles" id="resume">
        <NavigationWrapper>
            <Section v-for="section in sections"
                     :presentation-mode="String(presentationMode)"
                     :model="section"
                     :active="_isSectionActive(section)"/>
        </NavigationWrapper>
    </div>
</template>

<script setup lang="ts">
import {computed, inject, onMounted, type Ref} from "vue"
import Section from "/src/vue/components/sections/Section.vue"
import NavigationWrapper from "/src/vue/components/navigation/NavigationWrapper.vue"
import {useUtils} from "/src/composables/utils.js"
import { useDataManagerStore } from "../../stores/DataManager"

const dataManagerStore = useDataManagerStore()
const utils = useUtils()

/** @type {{value: String}} */
const presentationMode = inject<Ref<string>>("presentationMode")

/** @type {{value: Section}} */
const currentSection = inject<Ref<{ id: string } | null>>("currentSection")

const sections = computed(() => {
    return dataManagerStore.sections
})

const didLoadAllJsonFiles = computed(() => {
  return dataManagerStore.didLoadAllJsonFiles
})

/**
 * @description This hook can be used to report a visit to an external analytics service.
 * Here, you can integrate Google Analytics, Mixpanel, or your own custom analytics implementation.
 */
onMounted(() => {
    fetch("https://ryanbalieiro.com/api/analytics/mock", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            params: {
                url: utils.getRootLocation(),
                template_id: "vue-resume"
            }
        })
    })
})

const _isSectionActive = (section) => {
    if(!currentSection.value)
        return false
    return currentSection.value.id === section.id
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

#resume {
    display: flex;
    min-height: 100vh;
    background-color: $nav-background;
    @include media-breakpoint-down($navigation-sidebar-breakpoint) {
        background-color: $default-section-background;
    }
}
</style>
