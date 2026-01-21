<template>
    <nav class="nav-sidebar" :class="{'nav-sidebar-shrink': toggled, 'nav-sidebar-svh': utils.isIOS()}">
        <!-- Main Content -->
        <div class="nav-sidebar-content">
            <NavProfileCard :avatar="profile.profilePictureUrl"
                            :name="localize(profile.locales, 'name', true) || profile.name"
                            :role="localize(profile.locales, 'role')"
                            :shrink="toggled"
                            :include-toggle-button="settings.navToggleEnabled"
                            @toggle="_onToggle"/>

            <NavSidebarLinkList :sections="sections"
                                :current-section="highlightedSection"
                                :shrink="toggled"
                                @link-clicked="_onLinkClicked"/>
        </div>

        <!-- Footer -->
        <NavSidebarFooter :shrink="toggled"
                          :credits="localize(profile.locales, 'credits')"/>
    </nav>
</template>

<script setup>
import {inject, watch, computed} from "vue"
import NavProfileCard from "/src/vue/components/navigation/layout/NavProfileCard.vue"
import NavSidebarLinkList from "/src/vue/components/navigation/sidebar/NavSidebarLinkList.vue"
import NavSidebarFooter from "/src/vue/components/navigation/sidebar/NavSidebarFooter.vue"
import {useUtils} from "/src/composables/utils.js"

import { useDataManagerStore } from "../../../../stores/DataManager"
import { useLanguageManagerStore } from "../../../../stores/LanguageManager"

const dataManagerStore = useDataManagerStore()
const languageManagerStore = useLanguageManagerStore()

const utils = useUtils()

const props = defineProps({
    toggled: Boolean,
    highlightedSection: Object
})

const emit = defineEmits(['toggle', 'select'])

/** @type {Function} */
const localize = languageManagerStore.localize

/** @type {{value: Object}} */
const lastKeyPressed = inject("lastKeyPressed")

const profile = computed(() => {
    return dataManagerStore.profile
})

const sections = computed(() => {
    return dataManagerStore.sections
})

const settings = computed(() => {
    return dataManagerStore.settings
})

watch(() => lastKeyPressed.value, () => {
    if(!settings.navToggleEnabled)
        return

    if(lastKeyPressed.value.id === "ArrowLeft")
        emit('toggle', true)
    else if(lastKeyPressed.value.id === "ArrowRight")
        emit('toggle', false)
})

const _onLinkClicked = (section) => {
    emit('select', section)
}

const _onToggle = () => {
    emit('toggle', !props.toggled)
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

nav.nav-sidebar {
    position: fixed;
    display: flex;
    flex-direction: column;

    height: 100vh;
    height: 100dvh;
    min-width: $nav-sidebar-width;
    width: $nav-sidebar-width;
    z-index: $z-index-sidebar;
    background-color: $nav-background;

    @include media-breakpoint-down(xl) {
        min-width: $nav-sidebar-width-lg;
        width: $nav-sidebar-width-lg;
    }

    &-shrink {
        min-width: $nav-sidebar-width-shrink;
        width: $nav-sidebar-width-shrink;
    }
}

div.nav-sidebar-content {
    display: flex;
    flex-direction: column;
    height: calc(100% - $nav-sidebar-footer-height);
    align-items: center;
    justify-content: center;
    @media (max-height: $nav-sidebar-footer-compress-screen-height) {
        height: calc(100% - $nav-sidebar-footer-height-compressed);
    }
}

nav.nav-sidebar-svh {
    height: 100vh!important;
    div.nav-sidebar-content {
        height: calc(100vh - $nav-sidebar-footer-height);
        height: calc(100svh - $nav-sidebar-footer-height);
    }
}
</style>
