<template>
    <Article class="article-timeline"
             :model="model">
        <ul class="timeline">
            <ArticleTimelineItem 
                v-for="item in model.items"
                    :key="item.id"
                    :item="item"
            />
        </ul>
    </Article>
</template>

<script setup>
import Article from "/src/vue/components/articles/base/Article.vue"
import ArticleTimelineItem from "/src/vue/components/articles/timeline/ArticleTimelineItem.vue"

const props = defineProps({
    model: {
        /** @type {Article} **/
        type: Object,
        required: true
    }
})

</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

ul.timeline {
    position: relative;
    list-style: none;
    padding: 0;
    margin: 0;
}

ul.timeline:before {
    position: absolute;
    top: 0;
    bottom: 0;
    content: "";
    z-index: 0;
    background-color: $article-timeline-line-color;
    width: $article-timeline-line-width;

    left: calc($article-timeline-image-size/2 - $article-timeline-line-width/2);
    height: calc(100% - $article-timeline-image-size/2);

    @include media-breakpoint-down(md) {
        left: calc($article-timeline-image-size-md/2 - $article-timeline-line-width/2);
        height: calc(100% - $article-timeline-image-size-md/2);
    }
    @include media-breakpoint-down(sm) {
        left: calc($article-timeline-image-size-sm/2 - $article-timeline-line-width/2);
        height: calc(100% - $article-timeline-image-size-sm/2);
    }
}
</style>