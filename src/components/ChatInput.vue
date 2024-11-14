<template>
    <div class="chat-input-container">
      <div class="input-wrapper">
        <label for="file-upload" class="upload-icon">
          📎
          <input type="file" id="file-upload" @change="handleFileUpload" hidden />
        </label>
        <label for="web-link" class="web-icon">
          🌐
          <input type="text" id="web-link" placeholder="Web link" v-model="webLink" />
        </label>
        <input
          v-model="userInput"
          @keyup.enter="sendInput"
          placeholder="Message ChatGPT"
          class="chat-input"
        />
        <button @click="sendInput" class="send-button">⤴️</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // 定义响应式变量
  const userInput = ref('');
  const webLink = ref('');
  const uploadedFile = ref(null);
  
  // 处理发送输入
  function sendInput() {
    if (userInput.value.trim()) {
      const message = {
        text: userInput.value,
        file: uploadedFile.value,
        link: webLink.value,
      };
      // 触发发送事件
      emit('send-message', message);
      // 清空输入和上传数据
      userInput.value = '';
      uploadedFile.value = null;
      webLink.value = '';
    }
  }
  
  // 处理文件上传
  function handleFileUpload(event) {
    uploadedFile.value = event.target.files[0];
  }
  </script>
  
  <style scoped>
  .chat-input-container {
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 20px;
    padding: 10px;
  }
  
  .input-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
  }
  
  .upload-icon,
  .web-icon {
    margin-right: 10px;
    cursor: pointer;
  }
  
  .chat-input {
    flex-grow: 1;
    border: none;
    outline: none;
    background-color: transparent;
    padding: 5px;
  }
  
  .send-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
  }
  </style>
  