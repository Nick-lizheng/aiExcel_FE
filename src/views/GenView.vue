<template>
  <el-container class="chat-container">
    <el-header class="chat-footer">
      <!-- 文件上传 -->
      <el-row :gutter="10" class="input-row">
        <el-col :span="4">
          <el-upload
            ref="upload"
            class="wid-100"
            action=""
            :auto-upload="false"
            :on-change="handleFileChange"
            :file-list="fileList"
            list-type="text"
          >
            <el-button type="primary" class="wid-100">Select File</el-button>
          </el-upload>
        </el-col>
        <el-col :span="20">
          <el-input
            type="textarea"
            v-model="userQuestion"
            placeholder="Enter your requirement"
            @keyup.enter="sendQuestion"
            :autosize="{ minRows: 3, maxRows: 5 }"
            class="chat-input"
          />
        </el-col>
      </el-row>

      <!-- 操作按钮 -->
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

      <!-- 可编辑/删除的下拉框 -->
      <el-row>
        <el-col class="send-button-col">
          <el-select
            v-model="selectedTemplate"
            placeholder="Select the template to regenerate"
            class="dropdown"
          >
            <el-option
              v-for="(item, index) in dropdownItems"
              :key="item.id"
              :label="item.compliedClassPath"
              :value="item.id"
            >
              <div class="option-content">
                <span>{{ item.compliedClassPath }}</span>
                <div class="option-actions">
                  <!-- <el-button @click="editOption(index)" size="small">
                    <el-icon :size="20">
                      <Edit />
                    </el-icon>
                  </el-button> -->
                  <el-button @click="deleteOption(index)" size="small">
                    <el-icon :size="20">
                      <Delete />
                    </el-icon>
                  </el-button>
                </div>
              </div>
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row>
        <el-col class="send-button-col">
          <el-button type="primary" @click="regenerate" class="send-button">Regenerate</el-button>
        </el-col>
      </el-row>
    </el-header>

    <!-- 主内容 -->
    <el-main class="chat-main">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <p><strong>Question:</strong> {{ message.question }}</p>
        <p><strong>Answer:</strong>
          <MarkdownRenderer :markdown="message.answer" />
        </p>
      </div>
    </el-main>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="isEditing" title="Edit Option">
      <el-input v-model="editedLabel" placeholder="Enter new label"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">Cancel</el-button>
        <el-button type="primary" @click="saveEdit">Save</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { getTemplateList, reGenerate, statusUpdate, uploadExcelTemplate } from '@/services/api';
import { ElNotification } from 'element-plus';
import { Edit, Delete } from '@element-plus/icons-vue';

// 数据定义
const userQuestion = ref('');
const templateId = ref('');
const downloadUrl = ref('');
const fileList = ref([]);
const messages = ref([]);
const dropdownItems = ref([]);
const selectedTemplate = ref(null);

// 编辑功能
const isEditing = ref(false);
const editedLabel = ref('');
const editIndex = ref(-1);

// 获取下拉框列表
onMounted(() => {
  getGenerateList();
});

// 文件处理
const handleFileChange = (file) => {
  fileList.value = [file.raw];
};

// 提交问题
const sendQuestion = async () => {
  if (!userQuestion.value.trim()) {
    ElNotification.error('Please input your requirement');
    return;
  }

  const file = fileList.value[0];
  if (!file) {
    ElNotification.error('Please upload a source file');
    return;
  }

  messages.value.push({ question: userQuestion.value, answer: 'Loading...' });
  try {
    const response = await uploadExcelTemplate({
      file,
      userId: 'ethan',
      instruction: userQuestion.value,
    });
    messages.value[messages.value.length - 1].answer = response.message;
    downloadUrl.value = response.outputFileUrl;
    templateId.value = response.template_id;
    getGenerateList();
    ElNotification.success('File is ready and downloaded');
  } catch (error) {
    messages.value[messages.value.length - 1].answer = 'Error fetching response.';
  }
};

// 保存模板
const saveTemplate = async () => {
  if (!templateId.value) {
    ElNotification.error('Please generate the template first');
    return;
  }
  try {
    await statusUpdate({ template_id: templateId.value, status: 'save' });
    getGenerateList();
    ElNotification.success('The instruction has been saved');
  } catch {
    ElNotification.error('Please try it later');
  }
};

// 重新生成文件
const regenerate = async () => {
  const file = fileList.value[0];
  if (!file) {
    ElNotification.error('Please upload a source file');
    return;
  }

  if (!selectedTemplate.value) {
    ElNotification.error('Please select a template');
    return;
  }

  try {
    const response = await reGenerate({ file, template_id: selectedTemplate.value });
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'output.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    ElNotification.success('The Excel file has been regenerated');
  } catch {
    ElNotification.error('Failed to regenerate the file');
  }
};

// 下载模板
const downTemplate = () => {
  if (!downloadUrl.value) {
    ElNotification.error('Please generate the file first');
    return;
  }
  const link = document.createElement('a');
  link.href = downloadUrl.value;
  link.setAttribute('download', 'output.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
  ElNotification.success('File downloaded successfully');
};

// 获取生成列表
const getGenerateList = async () => {
  const res = await getTemplateList();
  dropdownItems.value = res;
};

// 编辑功能相关方法
const editOption = (index) => {
  editIndex.value = index;
  editedLabel.value = dropdownItems.value[index].compliedClassPath;
  isEditing.value = true;
};

const saveEdit = async () => {
  if (!editedLabel.value.trim()) {
    ElNotification.error('Label cannot be empty');
    return;
  }

  const item = dropdownItems.value[editIndex.value];
  try {
    await axios.put(`/api/templates/${item.id}`, {
      compliedClassPath: editedLabel.value.trim(),
    });
    dropdownItems.value[editIndex.value].compliedClassPath = editedLabel.value.trim();
    isEditing.value = false;
    ElNotification.success('Template updated successfully');
  } catch {
    ElNotification.error('Failed to update the template');
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  editedLabel.value = '';
  editIndex.value = -1;
};

const deleteOption = async (index) => {
  const item = dropdownItems.value[index];
  try {
    await statusUpdate({
      template_id: item.id,
      status: 'delete'
    })
    dropdownItems.value.splice(index, 1);
    ElNotification.success('Template deleted successfully');
  } catch {
    ElNotification.error('Failed to delete the template');
  }
};
</script>

<style scoped>
.chat-container {
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: aliceblue;
}

.chat-main {
  flex: 1;
  margin-top: 28vh;
  max-height: 72vh;
  color: #333;
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
  margin-bottom: 16px;
}

.option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.option-actions {
  display: flex;
  gap: 8px;
}
</style>
