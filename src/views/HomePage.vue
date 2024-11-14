<template>
    <div class="home-page">
      <ChatInput @send-message="handleMessage" />
      <ChatDisplay :messages="chatHistory" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import ChatInput from '@/components/ChatInput.vue';
  import ChatDisplay from '@/components/ChatDisplay.vue';
  
  const chatHistory = ref([]);
  
  function handleMessage(message) {
    chatHistory.value.push(message);
  }
  </script>
  
  <style scoped>
  .home-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  </style>
  