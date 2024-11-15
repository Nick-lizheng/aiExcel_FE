<template>
  <div class="editable-select">
    <!-- 下拉框 -->
    <el-select v-model="selectedValue" placeholder="Select an item" class="dropdown">
      <el-option v-for="(item, index) in options" :key="item.id" :label="item.label" :value="item.id">
        <div class="option-content">
          <span>{{ item.label }}</span>
          <div class="option-actions">
            <el-button type="text" @click="editOption(index)" size="mini">
              <el-icon :size="20">
                <Edit />
              </el-icon>
            </el-button>
            <el-button type="text"  @click="deleteOption(index)" size="mini">
              <el-icon :size="20">
                <Delete />
              </el-icon></el-button>
          </div>
        </div>
      </el-option>
    </el-select>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="isEditing" title="Edit Option">
      <el-input v-model="editedLabel" placeholder="Enter new label"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">Cancel</el-button>
        <el-button type="primary" @click="saveEdit">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';

// 下拉选项数据
const options = ref([
  { id: 1, label: 'Option 1' },
  { id: 2, label: 'Option 2' },
  { id: 3, label: 'Option 3' },
]);

const selectedValue = ref(null); // 当前选中值
const isEditing = ref(false); // 编辑弹窗的状态
const editedLabel = ref(''); // 当前编辑的标签
const editIndex = ref(-1); // 正在编辑的选项索引

// 编辑选项
const editOption = (index) => {
  editIndex.value = index;
  editedLabel.value = options.value[index].label;
  isEditing.value = true;
};

// 保存编辑到后端
const saveEdit = async () => {
  if (!editedLabel.value.trim()) {
    ElMessage.error('Label cannot be empty.');
    return;
  }

  const option = options.value[editIndex.value];
  try {
    await axios.put(`/api/options/${option.id}`, {
      label: editedLabel.value.trim(),
    });
    // 更新本地数据
    option.label = editedLabel.value.trim();
    ElMessage.success('Option updated successfully.');
    isEditing.value = false;
    editIndex.value = -1;
    editedLabel.value = '';
  } catch (error) {
    ElMessage.error('Failed to update option.');
    console.error(error);
  }
};

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false;
  editedLabel.value = '';
  editIndex.value = -1;
};

// 删除选项
const deleteOption = async (index) => {
  const option = options.value[index];
  try {
    await axios.delete(`/api/options/${option.id}`);
    options.value.splice(index, 1); // 更新本地数据
    ElMessage.success('Option deleted successfully.');
  } catch (error) {
    ElMessage.error('Failed to delete option.');
    console.error(error);
  }
};
</script>

<style scoped>

.option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.option-actions {
  display: flex;
  gap: 8px;
}

.el-icon-edit,
.el-icon-delete {
  cursor: pointer;
}
</style>
