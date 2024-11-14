<template>
  <div v-html="renderedMarkdown" class="markdown-content"></div>
</template>

<script setup>
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';
import { defineProps } from 'vue';

const props = defineProps({
  markdown: {
    type: String,
    required: true,
  },
});

const md = new MarkdownIt();
const renderedMarkdown = computed(() => md.render(props.markdown));
</script>

<style scoped>
/* Add custom styles here for markdown content */
.markdown-content h1, .markdown-content h2, .markdown-content h3 {
  margin-top: 1em;
}
.markdown-content p {
  margin: 0.5em 0;
}
</style>
