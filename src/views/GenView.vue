<template>
  <el-container class="chat-container">
    <el-main class="chat-main">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <p><strong>Question:</strong> {{ message.question }}</p>
        <p><strong>Answer:</strong>
          <MarkdownRenderer :markdown="message.answer" />
        </p>
      </div>
    </el-main>
    <el-footer class="chat-footer">
      <el-row :gutter="10" class="input-row">
        <el-col :span="2">
          <el-upload ref="upload" action="" :auto-upload="false" :on-change="handleFileChange" :file-list="fileList"
            list-type="text">
            <el-button type="primary">Select File</el-button>
          </el-upload>
        </el-col>
        <el-col :span="20">
          <el-input type="textarea" v-model="userQuestion" placeholder="Enter your question" @keyup.enter="sendQuestion"
            :autosize="{ minRows: 2, maxRows: 5 }" class="chat-input" />
        </el-col>
        <el-col :span="2" class="send-button-col">
          <el-button type="primary" @click="sendQuestion" class="send-button">Download</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col  class="send-button-col">
          <el-button type="primary" @click="saveTemplate" class="send-button">Save the template</el-button>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { uploadExcelTemplate } from '@/services/api';
import { ElNotification } from 'element-plus'


const userQuestion = ref('');
const fileList = ref([]);
const messages = ref([]);
const markdownString = ref('');

// 处理文件选择
const handleFileChange = (file) => {
  fileList.value = [file.raw]; // 获取选择的文件
};

// 发送问题和文件到后端
const sendQuestion = async () => {
  if (userQuestion.value.trim()) {
    const question = userQuestion.value;
    messages.value.push({ question, answer: 'Loading...' });

    try {
      const file = fileList.value[0]; // 获取选择的第一个文件
      const response = await uploadExcelTemplate({
        file, // 传递单个文件
        userId: 'ethan',
        instruction: question,
      });
      console.log('res', response);

      messages.value[messages.value.length - 1].answer = response.headers.get("excelResponse");
      // 创建一个下载链接并点击下载
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "output.xlsx");  // 设置文件名
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Show notification on successful download
      ElNotification({
        title: 'Success',
        message: 'File is ready and downloaded',
        type: 'success',
        duration: 30,
      });
    } catch (error) {
      messages.value[messages.value.length - 1].answer = 'Error fetching response.';
    }
    userQuestion.value = '';
  }
};
const saveTemplate =  async () =>{
  ElNotification({
        title: 'Success',
        message: 'The instructment has beed saved',
        type: 'success',
        duration: 30,
      });
}
</script>

<style scoped>
.chat-container {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background-color: aliceblue;
}

.chat-main {
  flex: 1;
}

.chat-footer {
  width: 100%;
}

.input-row {
  align-items: flex-end;
  padding-bottom: 60px;
}

.chat-input {
  width: 100%;
}

.send-button {
  width: 100%;
}

.send-button-col {
  display: flex;
  align-items: flex-end;
}
</style>
