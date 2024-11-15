<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      Dropdown List
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item 
          v-for="item in dropdownItems" 
          :key="item.id" 
          :command="item.id"
          :disabled="item.disabled"
          :divided="item.divided"
        >
          {{ item.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

// 定义响应式数据
const dropdownItems = ref<{ id: number; name: string; disabled?: boolean; divided?: boolean }[]>([]);

// 模拟的 API 请求函数
const fetchDropdownItems = async () => {
  // 替换成实际的 API 调用
  return [
    { id: 1, name: 'Action 1' },
    { id: 2, name: 'Action 2' },
    { id: 3, name: 'Action 3' },
    { id: 4, name: 'Action 4', disabled: true },
    { id: 5, name: 'Action 5', divided: true },
  ];
};

// 生命周期钩子
onMounted(async () => {
  try {
    dropdownItems.value = await fetchDropdownItems();
  } catch (error) {
    console.error('Error fetching dropdown items:', error);
  }
});

// 处理选项选择
const handleCommand = (id: number) => {
  ElMessage({
    message: `Selected item ID: ${id}`,
    type: 'success',
  });
  console.log('Selected item ID:', id);
};
</script>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
