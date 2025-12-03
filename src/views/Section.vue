<template>
  <div class="resume-section-content">
    <div class="resume-section-header resume-section-header-no-description">
      <h1 class="title mb-1 mb-lg-2">Welcome,</h1>
      <hr class="divider mx-2 mt-2 mb-3" />
    </div>
    <div class="section-body section-body-centered">
      <article class="article article-with-no-margin article-profile">
        <ul class="inline-list eq-h6">
          <li class="inline-list-item">
            <a class="link-disabled">
              <i class="fa-regular fa-map"> </i><span>IL</span></a
            >
          </li>
          <li class="inline-list-item">
            <a class="link-darkened" href="mailto:dc90c@proton.me"
              ><i class="fa-regular fa-envelope"></i
              ><span>dc90c@proton.me</span></a
            >
          </li>
        </ul>
        <div class="items-wrapper py-2 py-lg-3">
          <p class="eq-h6">A passionate web app developer.</p>
          <p class="eq-h6">
            I've have been a software engineer for over
            <strong>5 years</strong>, building things for the web and utilizing
            modern web tech.
          </p>
          <p class="eq-h6">🚧 work in progress 🚧</p>
        </div>
        <div class="social-links pt-lg-1">
          <!-- Link --><a
            class="btn social-link social-link-size-3 social-link-color-dark"
            href="https://www.linkedin.com/in/dancasasola/"
            target="_blank"
            ><!-- ToolTip -->
            <div class="social-link-tooltip text-1">linkedin</div>
            <!-- Icon --><i class="fa-brands fa-linkedin"></i></a
          ><a
            class="btn social-link social-link-size-3 social-link-color-dark"
            href="https://github.com/danny05158"
            target="_blank"
            ><!-- ToolTip -->
            <div class="social-link-tooltip text-1">github</div>
            <!-- Icon --><i class="fa-brands fa-github"></i
          ></a>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import SectionHeader from "/src/vue/components/sections/SectionHeader.vue";
import SectionBody from "/src/vue/components/sections/SectionBody.vue";

const props = defineProps({
  model: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

div.resume-section-content {
  background-color: #fff;
  padding: 2rem 2rem 3rem;
}

div.resume-section-header {
  margin-bottom: 0.5rem;
  h1.title {
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  hr.divider {
    width: 50px;
    height: 4px;
    margin-top: 0.5rem;
    padding: 0;
    margin: 0;
    background-color: #9c70e4;
    border: none;
    opacity: 1;
  }
}

div.section-body {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

article.article {
    color: $text-default-color;
    overflow: hidden;
    width: 100%;
}
</style>
