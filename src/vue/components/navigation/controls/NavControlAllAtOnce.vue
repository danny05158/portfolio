<template>
</template>

<script setup lang="ts">
import {computed, inject, onMounted, ref, watch, type Ref, type ComputedRef} from "vue"
import {useScheduler} from "/src/composables/scheduler.js"
import { useDataManagerStore } from "../../../../stores/DataManager"
import { useLanguageManagerStore } from "../../../../stores/LanguageManager"
import type Section from "/src/models/Section"


const dataManagerStore = useDataManagerStore()
const languageManagerStore = useLanguageManagerStore()

const scheduler = useScheduler()

/** @type {{value: Section}} */
const currentSection = inject<Ref<Section | null>>("currentSection")

/** @type {{value: Section}} */
const previousSection = inject("previousSection")

/** @type {Function} */
const navigateToSection = inject<(section: Section) => void>("navigateToSection")

/** @type {{value: Boolean}} */
const shouldResetScroll = inject<Ref<boolean>>("shouldResetScroll")

/** @type {{value: Boolean}} */
const isDesktopLayout = inject<ComputedRef<boolean>>("isDesktopLayout")

/** @type {{value: Boolean}} */
const windowScrollY = inject<Ref<number>>("windowScrollY")

/** @type {{value: Boolean}} */
const windowWidth = inject<Ref<number>>("windowWidth")

/** @type {{value: Boolean}} */
const windowHeight = inject<Ref<number>>("windowHeight")

const selectedLanguage = languageManagerStore.selectedLanguage

/** @type {{value: Boolean}} */
const canScroll = inject<Ref<boolean>>("canScroll")

const didInitialize = ref(false)
const spyScrollSection = ref(null)
const isScrollingToTargetSection = ref(false)

watch(() => canScroll.value, () => {_forceScrollToCurrentSection()})
watch(() => windowScrollY.value, () => { _spyScroll() })
watch(() => windowWidth.value, () => { _onWindowSizeChanged() })
watch(() => windowHeight.value, () => { _onWindowSizeChanged() })
watch(() => selectedLanguage, () => { _onLanguageChanged() })
watch(() => shouldResetScroll.value, () => { _onScrollResetTriggered() })

onMounted(() => {
    setTimeout(() => {
        _init()
    }, 500)
})

const highlightedSection = computed(() => {
    return spyScrollSection.value
})

const pillsControllerOptions = computed(() => {
    return null
})

const tabControllerOptions = computed(() =>
    dataManagerStore.sections?.map(section => ({
        active: spyScrollSection.value && spyScrollSection.value.id === section.id,
        model: section
    })) || []
)

const _init = () => {
    const initialSection = currentSection.value || dataManagerStore.sections[0]
    _forceScrollToSection(initialSection, true)
    didInitialize.value = true
    _spyScroll()
}

const _forceScrollToSection = (section, animated) => {
    if(!section)
        return

    const sectionEl = document.getElementById(section.htmlId)
    if(!sectionEl)
        return

    if(!animated) {
        sectionEl.scrollIntoView({behavior: "instant"})
        return
    }

    isScrollingToTargetSection.value = true
    sectionEl.scrollIntoView({behavior: "smooth"})

    scheduler.clearAllWithTag('ts-reset')
    scheduler.schedule(() => {
        isScrollingToTargetSection.value = false
    }, 1200, 'ts-reset')
}

const _forceScrollToCurrentSection = () => {
    if(!currentSection.value || !canScroll.value)
        return

    _forceScrollToSection(currentSection.value, true)
}

const _spyScroll = () => {
    if(!didInitialize.value)
        return

    let newTargetSection = null
    let lowestOffset = null

    for(const section of dataManagerStore.sections) {
        const el = document.getElementById(section.htmlId)
        const bounds = el?.getBoundingClientRect()
        const distanceFromZero = Math.abs(bounds?.y)

        if(lowestOffset === null || distanceFromZero < lowestOffset) {
            lowestOffset = distanceFromZero
            newTargetSection = section
        }
    }

    spyScrollSection.value = newTargetSection
    if(!isScrollingToTargetSection.value) {
        navigateToSection(spyScrollSection.value)
    }
}

const _onWindowSizeChanged = () => {
    if(!isDesktopLayout.value)
        return
    _spyScroll()
}

const onSidebarLinkClicked = (section) => {
    navigateToSection(section)
    _forceScrollToSection(section,true)
}

const onTabControllerLinkClicked = (section) => {
    onSidebarLinkClicked(section)
}

const onPillControllerLinkClicked = (section) => {
    throw new Error("This menu is not supported within this navigation method!")
}

const _onLanguageChanged = () => {
    const targetSection = currentSection.value
    setTimeout(() => {
        _forceScrollToSection(targetSection, true)
    }, 100)
}

const _onScrollResetTriggered = () => {
    if(!shouldResetScroll.value)
        return

    _onLanguageChanged()
    shouldResetScroll.value = false
}

defineExpose({
    highlightedSection,
    pillsControllerOptions,
    tabControllerOptions,
    onSidebarLinkClicked,
    onPillControllerLinkClicked,
    onTabControllerLinkClicked
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";
</style>
