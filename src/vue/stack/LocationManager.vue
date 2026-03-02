<template>
    <slot/>
</template>

<script setup>
import {inject, onMounted, provide, ref, watch} from "vue"
import {useRoute, useRouter} from "vue-router"
import {useScheduler} from "/src/composables/scheduler.js"
import {useConstants} from "/src/composables/constants.js"
import { useDataManagerStore } from "../../stores/DataManager"
import { useLanguageManagerStore } from "../../stores/LanguageManager"

const dataManagerStore = useDataManagerStore()
const languageManagerStore = useLanguageManagerStore()
const constants = useConstants()
const scheduler = useScheduler()
const router = useRouter()
const route = useRoute()

const isDesktopLayout = inject("isDesktopLayout")

const setSpinnerEnabled = inject("setSpinnerEnabled")

const localizeFromStrings = languageManagerStore.localizeFromStrings

const currentSection = ref(null)
const previousSection = ref(null)
const presentationMode = ref(constants.PresentationModes.NONE)
const shouldResetScroll = ref(false)

onMounted(() => _init())

watch(() => dataManagerStore.didLoadAllJsonFiles, () => _init())
watch(() => route.path, () => _onRouteChanged())
watch(() => isDesktopLayout.value, () => _onViewportChanged(true))

const _init = () => {
    scheduler.clearAllWithTag('navigation-manager-hash')
    scheduler.schedule(() => {
        _onRouteChanged()
    }, 30, 'navigation-manager-hash')

    _onViewportChanged(false)
}

const navigateToSection = (section) => {
    if(!section)
        return

    if(route.path === '/' + section.urlHashId)
        return

    section.category.lastVisitedSection = section
    router.push('/' + section.urlHashId)
}

const navigateToCategory = (category) => {
    const targetSection = category.lastVisitedSection || category.sections[0]
    navigateToSection(targetSection)
    return targetSection
}

const scrollToTopOfCurrentSection = () => {
    setTimeout(() => {
        shouldResetScroll.value = true
    }, 100)
}

const _onRouteChanged = () => {
    if(!dataManagerStore.didLoadAllJsonFiles)
        return

    const sectionId = route.path.replace('/', '')
    const targetSection = dataManagerStore.sections.find((section) => section.urlHashId === sectionId)
    if(!targetSection) {
        navigateToSection(dataManagerStore.sections[0])
        return
    }

    previousSection.value = currentSection.value
    currentSection.value = targetSection
}

const _onViewportChanged = (showSpinner) => {
    presentationMode.value = isDesktopLayout.value
        ? constants.PresentationModes.ALL_AT_ONCE
        : constants.PresentationModes.ONE_AT_ONCE

    if(!showSpinner || presentationMode.value === constants.PresentationModes.ONE_AT_ONCE)
        return

    setSpinnerEnabled(true, localizeFromStrings("adjusting_viewport"))
    scheduler.clearAllWithTag('adjusting-viewport')
    scheduler.schedule(() => {
        setSpinnerEnabled(false)
    }, 700, 'adjusting-viewport')
}

provide("currentSection", currentSection)
provide("previousSection", previousSection)
provide("presentationMode", presentationMode)
provide("shouldResetScroll", shouldResetScroll)
provide("navigateToSection", navigateToSection)
provide("navigateToCategory", navigateToCategory)
provide("scrollToTopOfCurrentSection", scrollToTopOfCurrentSection)
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";
</style>
