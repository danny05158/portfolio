<template>
    <p class="eq-h6"
       v-html="localize(item.locales, 'description')"/>
</template>

<script setup lang="ts">
import {inject} from "vue"
import { useLanguageManagerStore } from "../../../../stores/LanguageManager"
const languageManagerStore = useLanguageManagerStore()

const props = defineProps({
    item: {
        /** @type {ArticleItem} **/
        type: Object,
        required: true
    }
})

const localize = languageManagerStore.localize
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";
</style>