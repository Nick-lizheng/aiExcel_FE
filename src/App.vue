<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AsideBar from './components/AsideBar.vue';
</script>
<template>
  <el-container>
    <!-- <el-header><h1>Hackathon UI</h1></el-header> -->
    <el-container>
      <el-aside>
        <AsideBar></AsideBar>
      </el-aside>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-header {
  text-align: center;
  line-height: 60px;
}

.el-aside {
  height: 100%;
  width: 200px;
}
.el-container {
  height: 100%;
}
.el-main {
  height: 100vh;
  overflow: hidden;
  background-color: aliceblue
}
</style>
