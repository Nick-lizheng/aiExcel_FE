<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
<template>
    <div class="aside-content">
        <el-menu>
            <el-menu-item index="1">
                <el-icon><CirclePlusFilled /></el-icon>
                <RouterLink to="/gen">Genview</RouterLink>
            </el-menu-item>
            <el-menu-item index="2">
                <el-icon><Promotion /></el-icon>
                <RouterLink to="/exe">ExeView</RouterLink>
            </el-menu-item>
        </el-menu>
    </div>
</template>
<style scoped>
.aside-content {
    height: 100vh;
    width: 100%;
}

.el-menu {
    height: 100%;
}
</style>