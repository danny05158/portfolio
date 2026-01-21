<template>
    <nav class="nav-mobile-header"
         id="nav-mobile-header">
        <NavProfileCard :avatar="profile.profilePictureUrl"
                        :name="localize(profile.locales, 'name', true) || profile.name"
                        :role="localize(profile.locales, 'role')"
                        :shrink="false"
                        :include-toggle-button="false"
                        @toggle="null"/>

        <LanguagePicker :shrink="true"
                        :class="utils.isChromeOS() ? `language-picker-left` : `language-picker-right`"/>
    </nav>
</template>

<script setup>
import {computed, inject} from "vue"
import NavProfileCard from "/src/vue/components/navigation/layout/NavProfileCard.vue"
import LanguagePicker from "/src/vue/components/widgets/LanguagePicker.vue"
import {useUtils} from "/src/composables/utils.js"
import { useDataManagerStore } from "../../../../stores/DataManager"
import { useLanguageManagerStore } from "../../../../stores/LanguageManager"

const dataManagerStore = useDataManagerStore()
const languageManagerStore = useLanguageManagerStore()

const utils = useUtils()

const profile = computed(() => {
    return dataManagerStore.profile
})

const localize = languageManagerStore.localize
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

nav.nav-mobile-header {
    background-color: $nav-background;
    @include media-breakpoint-up($navigation-sidebar-breakpoint) {
        display: none;
    }

    position: relative;
}

div.language-picker {
    position: absolute;
    top: 5px;
    right: 5px;

    &-left {
        left: 5px;
        right: auto;
    }
}
</style>
