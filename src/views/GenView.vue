<template>
  <el-container class="chat-container">

    <el-header class="chat-footer">
      <el-row :gutter="10" class="input-row">
        <el-col :span="4">
          <el-upload ref="upload" class="wid-100" action="" :auto-upload="false" :on-change="handleFileChange"
            :file-list="fileList" list-type="text">
            <el-button type="primary" class="wid-100">Select File</el-button>
          </el-upload>
        </el-col>
        <el-col :span="20">
          <el-input type="textarea" v-model="userQuestion" placeholder="Enter your requirement"
            @keyup.enter="sendQuestion" :autosize="{ minRows: 3, maxRows: 5 }" class="chat-input" />
        </el-col>
      </el-row>
      <el-row>
        <el-col class="send-button-col">
          <el-button type="primary" @click="sendQuestion" class="send-button">Generate</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12" class="send-button-col">
          <el-button type="primary" @click="saveTemplate" class="send-button">Save</el-button>
        </el-col>
        <el-col :span="12" class="send-button-col">
          <el-button type="primary" @click="downTemplate" class="send-button">Download</el-button>
        </el-col>
      </el-row>

      <!-- Replaced el-dropdown with el-select -->
      <el-row>
        <el-col class="send-button-col">
          <el-select v-model="selectedTemplate" placeholder="Select the template to regenerate" @change="handleCommand">
            <el-option v-for="item in dropdownItems" :key="item.id" :label="item.compliedClassPath" :value="item.id" />
          </el-select>
        </el-col>
      </el-row>

      <el-row>
        <el-col class="send-button-col">
          <el-button type="primary" @click="regenerate" class="send-button">Regenerate</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="chat-main">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <p><strong>Question:</strong> {{ message.question }}</p>
        <p><strong>Answer:</strong>
          <MarkdownRenderer :markdown="message.answer" />
        </p>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { getTemplateList, reGenerate, statusUpdate, uploadExcelTemplate } from '@/services/api';
import { ElNotification } from 'element-plus'

const userQuestion = ref('');
const templateId = ref('');
const downloadUrl = ref('');
const fileList = ref([]);
const messages = ref([]);
const markdownString = ref('');
const dropdownItems = ref([]);
const selectedTemplate = ref(null);

onMounted(() => {
  getGenerateList();
});

const handleFileChange = (file) => {
  fileList.value = [file.raw];
};

const handleCommand = (id) => {
  ElNotification({
    message: `Selected item ID: ${id}`,
    type: 'success',
  });
  console.log('Selected item ID:', id);
};

const sendQuestion = async () => {
  if (!userQuestion.value.trim()) {
    ElNotification({
      title: 'error',
      message: 'Please input your requirement',
      type: 'error',
      duration: 3000,
    });
    return
  }
  if (userQuestion.value.trim()) {
    const file = fileList.value[0];
    if (!file) {
      ElNotification({
        title: 'error',
        message: 'Please upload a source file',
        type: 'error',
        duration: 3000,
      });
      return
    }
    const question = userQuestion.value;
    messages.value.push({ question, answer: 'Loading...' });
    try {

      const response = await uploadExcelTemplate({
        file,
        userId: 'ethan',
        instruction: question,
      });
      console.log('generate res', response);
      console.log('generate res', response.message);
      
      templateId.value = response.template_id;
      messages.value[messages.value.length - 1].answer = response.message;

      downloadUrl.value = response.outputFileUrl;
      let link = document.createElement("a");
      link.href = downloadUrl.value;
      link.setAttribute("download", "output.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      ElNotification({
        title: 'Success',
        message: 'File is ready and downloaded',
        type: 'success',
        duration: 10000,
      });
    } catch (error) {
      console.log('------>',error);
      
      messages.value[messages.value.length - 1].answer = 'Error fetching response.';
    }
    userQuestion.value = '';
  }
};

const saveTemplate = async () => {
  if (!templateId.value) {
    ElNotification({
      title: 'Error',
      message: 'Please generate the template first',
      type: 'error',
      duration: 3000,
    });
    return
  }
  try {
    const res = await statusUpdate({ template_id: templateId.value, status: 'save' })
    ElNotification({
      title: 'Success',
      message: 'The instruction has been saved',
      type: 'success',
      duration: 10000,
    });
  } catch {
    ElNotification({
      title: 'Error',
      message: 'please try it later',
      type: 'error',
      duration: 3000,
    });
  }

}

const regenerate = async () => {
  const file = fileList.value[0];
  console.log('------>', file);

  if (!file) {
    ElNotification({
      title: 'error',
      message: 'Please upload a source file',
      type: 'error',
      duration: 5000,
    });
    return
  }
  console.log(selectedTemplate);
  if (selectedTemplate.value) {
    const response = await reGenerate({ file, template_id: selectedTemplate.value })
    console.log('regenerate', response);
    ElNotification({
      title: 'Generated',
      message: 'The excel has been generated',
      type: 'success',
      duration: 10000,
    });
  } else {
    ElNotification({
      title: 'error',
      message: 'Please select a template',
      type: 'error',
      duration: 5000,
    });
  }




}

const downTemplate = async () => {
  if (!downloadUrl.value) {
    ElNotification({
      title: 'error',
      message: 'Please generate first',
      type: 'error',
      duration: 3000,
    });
    return
  }
  let link = document.createElement("a");
  link.href = downloadUrl.value;
  link.setAttribute("download", "output.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
  ElNotification({
    title: 'Success',
    message: 'File is ready and downloaded',
    type: 'success',
    duration: 10000,
  });
}
const getGenerateList = async () => {
  const res = await getTemplateList();
  dropdownItems.value = res;
}
</script>

<style scoped>
.chat-container {
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: aliceblue;
}

.upload-demo {
  width: 100%;
}

.wid-100 {
  width: 100%;
}

.wid-100 .el-upload {
  color: red;
  background-color: red
}

.el-upload.el-upload--text {
  width: 100%;
}

.chat-main {
  flex: 1;
  margin-top: 20vh;
  max-height: 80vh;
}

.chat-footer {
  width: 100%;
}

.input-row {
  align-items: flex-end;
}

.chat-input {
  width: 100%;
  height: 74px;
}

.send-button {
  width: 100%;
}

.el-row {
  margin-bottom: 16px
}
</style>
