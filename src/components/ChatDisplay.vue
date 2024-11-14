<template>
    <div class="chat-display">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <p><strong>User:</strong> {{ message.text }}</p>
        <p v-if="message.file"><strong>File:</strong> {{ message.file.name }}</p>
        <p v-if="message.link"><strong>Link:</strong> <a :href="message.link" target="_blank">{{ message.link }}</a></p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  const props = defineProps({
    messages: {
      type: Array,
      default: () => [],
    },
  });
  </script>
  
  <style scoped>
  .chat-display {
    padding: 10px;
  }
  
  .message {
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
  }
  </style>
  