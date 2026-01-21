<template>
    <Article class="article-profile"
             :model="model">
        <h1 class="title display-1 mb-3"
            v-html="title"/>

        <InlineLinkList :items="InlineLinkListLinks"/>

        <div class="items-wrapper py-2 py-lg-3">
            <ArticleProfileItem v-for="item in model.items"
                                :item="item"/>
        </div>

        <SocialLinks :items="socialLinks"
                     class="pt-lg-1"
                     size="3"
                     variant="dark"/>
    </Article>
</template>

<script setup>
import {computed, inject} from "vue"
import Article from "/src/vue/components/articles/base/Article.vue"
import ArticleProfileItem from "/src/vue/components/articles/profile/ArticleProfileItem.vue"
import SocialLinks from "/src/vue/components/widgets/SocialLinks.vue"
import InlineLinkList from "/src/vue/components/widgets/InlineLinkList.vue"
import { useDataManagerStore } from "../../../../stores/DataManager"
import { useLanguageManagerStore } from "../../../../stores/LanguageManager"

const dataManagerStore = useDataManagerStore()
const languageManagerStore = useLanguageManagerStore()
const localize = languageManagerStore.localize

const props = defineProps({
    model: {
        /** @type {Article} **/
        type: Object,
        required: true
    }
})


/** @type {{value:Boolean}} */
const isScreenXlOrLarger = inject("isScreenXlOrLarger")

const title = computed(() => {
    return localize(
        props.model.section.locales,
        isScreenXlOrLarger.value ? "title" : "title_short"
    )
})

const InlineLinkListLinks = computed(() => {
    const contactIds = props.model.getSetting("contact_list_ids", [])
    return contactIds.map(contactId => {
        return dataManagerStore.profile.getContactOptionWithId(contactId)
    }).filter(contact => Boolean(contact))
})

const socialLinks = computed(() => {
    const contactIds = props.model.getSetting("contact_circles_ids", [])
    return contactIds.map(contactId => {
        return dataManagerStore.profile.getContactOptionWithId(contactId)
    }).filter(contact => Boolean(contact))
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

h1.title {
    font-weight: bold;
    letter-spacing: .5px;
    @include media-breakpoint-down($navigation-sidebar-breakpoint) {
        display: none;
    }
}
</style>
