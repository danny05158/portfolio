<template>
    <div class="code-block">
        <span v-if="language"
              class="code-block-language">{{ language }}</span>

        <pre class="m-0"><code v-if="highlighted !== null"
                                class="hljs"
                                v-html="highlighted"/><code v-else
                                class="hljs">{{ source }}</code></pre>
    </div>
</template>

<script setup lang="ts">
import {computed} from "vue"
import hljs from "highlight.js/lib/core"
import python from "highlight.js/lib/languages/python"
import javascript from "highlight.js/lib/languages/javascript"
import typescript from "highlight.js/lib/languages/typescript"
import java from "highlight.js/lib/languages/java"
import cpp from "highlight.js/lib/languages/cpp"
import go from "highlight.js/lib/languages/go"
import sql from "highlight.js/lib/languages/sql"
import "highlight.js/styles/github-dark.css"

// Only the languages registered here are highlighted; anything else renders as plain text.
hljs.registerLanguage("python", python)
hljs.registerLanguage("javascript", javascript)
hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("java", java)
hljs.registerLanguage("cpp", cpp)
hljs.registerLanguage("go", go)
hljs.registerLanguage("sql", sql)

const props = defineProps({
    /** Code as a single string, or as an array of lines. **/
    source: {
        type: [String, Array],
        required: true
    },
    language: {
        type: String,
        required: false
    }
})

const source = computed(() => {
    return Array.isArray(props.source) ? props.source.join("\n") : props.source
})

const highlighted = computed(() => {
    if(!props.language || !hljs.getLanguage(props.language)) return null
    return hljs.highlight(source.value, {language: props.language}).value
})
</script>

<style lang="scss" scoped>
div.code-block {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    font-size: 0.85rem;

    code.hljs {
        display: block;
        padding: 1rem;
        overflow-x: auto;
    }
}

span.code-block-language {
    position: absolute;
    top: 0.4rem;
    right: 0.6rem;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #8b949e;
}
</style>
