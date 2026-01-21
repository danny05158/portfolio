<template>
    <Article class="article-contact"
             :model="model">
        <OptionsList :items="contactLinks"/>
    </Article>
</template>

<script setup>
import {computed, inject} from "vue"
import Article from "/src/vue/components/articles/base/Article.vue"
import OptionsList from "/src/vue/components/widgets/OptionsList.vue"
import { useDataManagerStore } from "../../../../stores/DataManager"
import { useLanguageManagerStore } from "../../../../stores/LanguageManager"

const dataManagerStore = useDataManagerStore()
const languageManagerStore = useLanguageManagerStore()

const props = defineProps({
    /** @type {Article} **/
    model: {
        type: Object,
        required: true
    }
})

const localize = languageManagerStore.localize
const localizeFromStrings = languageManagerStore.localizeFromStrings

const contactLinks = computed(() => {
    const contactIds = props.model.getSetting("contact_ids", [])
    return contactIds.map(contactId => {
        return dataManagerStore.profile.getContactOptionWithId(contactId)
    }).filter(contact => Boolean(contact)).map(item => {
        return {
            faIcon: item.faIcon.replace('regular', 'solid'),
            label: localizeFromStrings(item.id).replace("locales.", ""),
            href: item.href,
            value: item.getValue(localize, false)
        }
    })
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";
</style>
