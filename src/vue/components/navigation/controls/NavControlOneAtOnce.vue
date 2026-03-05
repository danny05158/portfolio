<template>
</template>

<script setup lang="ts">
import {computed, inject, onBeforeMount, onMounted, watch, type Ref, type ComputedRef} from "vue"
import {useConstants} from "/src/composables/constants.js"
import { useDataManagerStore } from "../../../../stores/DataManager"
import { useLanguageManagerStore } from "../../../../stores/LanguageManager"
import type Category from "/src/models/Category"
import type Section from "/src/models/Section"


const constants = useConstants()
const dataManagerStore = useDataManagerStore()
const languageManagerStore = useLanguageManagerStore()

/** @type {{value: Section}} */
const previousSection = inject<Ref<Section | null>>("previousSection")

/** @type {{value: Section}} */
const currentSection = inject<Ref<Section | null>>("currentSection")

/** @type {{value: Boolean}} */
const shouldResetScroll = inject<Ref<boolean>>("shouldResetScroll")

/** @type {Function} */
const navigateToSection = inject<(section: Section) => void>("navigateToSection")

/** @type {Function} */
const navigateToCategory = inject<(category: Category) => void>("navigateToCategory")

/** @type {{value: Boolean}} */
const isDesktopLayout = inject<ComputedRef<boolean>>("isDesktopLayout")

/** @type {{value: Language}} */
const selectedLanguage = languageManagerStore.selectedLanguage

const highlightedSection = computed(() => {
    return currentSection.value
})

watch(() => currentSection.value, () => { _onSectionChanged() })
watch(() => selectedLanguage, () => { _onViewportChanged() })
watch(() => shouldResetScroll.value, () => { _onScrollResetTriggered() })

onBeforeMount(() => {
    window.scrollTo({top: 0, behavior: "instant"})
})

const pillsControllerOptions = computed(() =>
    currentSection.value?.category.sections.map(section => ({
        active: currentSection.value.id === section.id,
        model: section
    })) || []
)

const tabControllerOptions = computed(() =>
    dataManagerStore.categories?.map(category => ({
        active: currentSection.value?.category.id === category.id,
        model: category
    })) || []
)

const onSidebarLinkClicked = (section) => {
    navigateToSection(section)
}

const onPillControllerLinkClicked = (section) => {
    navigateToSection(section)
}

const onTabControllerLinkClicked = (category) => {
    if(currentSection.value && currentSection.value.category.id === category.id) {
        window.scrollTo({top: 0, behavior: "smooth"})
        return
    }

    navigateToCategory(category)
}

const _onSectionChanged = () => {
    if(currentSection.value.isCover) {
        _resetScroll()
        return
    }

    if(isDesktopLayout.value)
        _resetScroll()
    else
        _resetScrollForMobile()
}

const _onViewportChanged = () => {
    _resetScroll()
}

const _onScrollResetTriggered = () => {
    if(!shouldResetScroll.value)
        return

    const currentSectionEl = document.getElementById(currentSection.value?.htmlId || "")
    if(currentSectionEl) {
        currentSectionEl.scrollIntoView({behavior: "smooth"})
    }
    shouldResetScroll.value = false
}

const _resetScroll = () => {
    window.scrollTo({top: 0, behavior: "instant"})
}

const _resetScrollForMobile = () => {
    const navMobileHeaderEl = document.getElementById("nav-mobile-header")
    const navMobileHeaderElHeight = navMobileHeaderEl?.getBoundingClientRect().height || 0

    if(window.scrollY < navMobileHeaderElHeight*0.9)
        return

    const previousSectionHadPicker =  previousSection.value?.category.sections.length >= 2
    const currentSectionWillHavePicker = currentSection.value?.category.sections.length >= 2

    const pickerHeight = window.innerWidth <= constants.BOOTSTRAP_BREAKPOINTS.sm ?
        constants.NAV_SECTION_PICKER_COMPRESSED_HEIGHT :
        constants.NAV_SECTION_PICKER_HEIGHT

    let offset = 0
    if(previousSectionHadPicker && !currentSectionWillHavePicker)
        offset += pickerHeight
    else if(!previousSectionHadPicker && currentSectionWillHavePicker)
        offset = 0

    window.scrollTo({
        top: navMobileHeaderElHeight + offset,
        behavior: "instant"
    })
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
