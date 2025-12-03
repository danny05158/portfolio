<template>
  <div class="image-view" :class="props.class">
    <img class="image"
          :class="imageClass"
          ref="img"
          :src="src"
          :alt="alt"
    />
    <!-- <h4 class="nav-profile-card-title" v-html="name" /> -->
    <!-- <h6 class="nav-profile-card-role" v-html="role" /> -->
  </div>
</template>

<script setup>
const name = 'Daniel Casasola'
const role = 'Software Engieer'

const props = defineProps({
    src: String,
    alt: String,
    class: String,
    spinnerEnabled: Boolean,
    imageClass: String,
    resolvePath: Boolean
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

h4.nav-profile-card-title {
    margin-top: 17px;
    text-transform: uppercase;
    opacity: 0.95;
    letter-spacing: 0.15rem;
    font-size: 1.25rem;
    text-align: center;

    @media (max-height: 660px) {
        margin-top: 15px;
        font-size: 1.175rem;
        margin-bottom: 5px;
    }

    @media (max-height: 580px) {
        margin-top: 12px;
        font-size: 1.1rem;
    }

    @include media-breakpoint-down($navigation-sidebar-breakpoint) {
        margin-top: 15px;
        font-size: 1.1rem;
    }

    @include media-breakpoint-down(sm) {
        font-size: 1.05rem;
    }
}

h6.nav-profile-card-role {
    font-size: 1rem;
    color: $nav-highlight;
    opacity: 0.9;
    margin-bottom: 0;

    @media (max-height: 660px) {
        font-size: 0.95rem;
    }

    @media (max-height: 580px) {
        font-size: 0.9rem;
    }

    @include media-breakpoint-down($navigation-sidebar-breakpoint) {
        font-size: 0.95rem;
    }

    @include media-breakpoint-down(sm) {
        font-size: 0.9rem;
    }
}

div.image-view {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

img.image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

img.spinner {
    position: absolute;
}

div.image-not-found-fallback {
    background-color: rgba(black, 0.2);
    border-radius: 20px;

    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    color: $light-2;
}
</style>
