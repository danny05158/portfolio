<template>
    <slot v-if="selectedLanguage"/>
</template>

<script setup lang="ts">
import {onMounted, provide, ref, computed} from "vue"
import { useDataManagerStore } from "../../stores/DataManager"

const dataManagerStore = useDataManagerStore()
const supportedLanguages = dataManagerStore.settings.supportedLanguages

const strings = computed(() => {
    return dataManagerStore.strings
})

const selectedLanguage = computed(() => {
    if (!supportedLanguages.length) {
        throw new Error("You must add at least one language to the supported languages setting.");
    }

    const savedId = dataManagerStore.languageId

    return supportedLanguages.find(language => language.id === savedId) ||
        supportedLanguages.find(language => navigator.language.includes(language.id)) ||
        defaultLanguage.value ||
        supportedLanguages[0]
})

const defaultLanguage = computed(() => {
    return supportedLanguages.find(language => language.isDefault)
})

/**
 * @param {Locales} locales
 * @param {String} key
 * @param {Boolean} [returnNullIfNotFound=false]
 */
const localize = (locales, key, returnNullIfNotFound?) => {
    if(!locales)
        return ''

    const translation = locales.getTranslation(key, selectedLanguage.value, defaultLanguage.value)
    if(typeof translation !== 'string' || !translation.includes('locales.'))
        return translation

    return returnNullIfNotFound ?
        null :
        translation
}

/**
 * @param {String} key
 */
const localizeFromStrings = (key) => {
    return localize(strings.value, key)
}

/**
 * @param {Date|String} dateOrString
 * @return {string}
 */
const localizeDate = (dateOrString) => {
    if(!dateOrString)
        return 'date.null'

    if(typeof dateOrString === 'string')
        return `<strong>${localizeFromStrings(dateOrString)}</strong>`

    const languageId = selectedLanguage.value?.id || defaultLanguage.value?.id || "en"
    const localeString = dateOrString.toLocaleString(
        String(languageId),
        { year: 'numeric', month: 'short'}
    )

    const formattedString = localeString.charAt(0).toUpperCase() + localeString.slice(1).replaceAll('.', '')
    return formattedString.replace(/\d{4}/, (year) => `<strong>${year}</strong>`)
}

provide("selectedLanguage", selectedLanguage)
provide("defaultLanguage", defaultLanguage)
provide("localize", localize)
provide("localizeFromStrings", localizeFromStrings)
provide("localizeDate", localizeDate)
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";
</style>
