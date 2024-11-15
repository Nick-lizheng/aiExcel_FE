<template>
    <div class="login-page">
      <div class="left-side">
        <!-- 左侧图片 -->
        <img src="@/assets/ai.jpeg" alt="Login Image" class="login-image" />
      </div>
  
      <div class="right-side">
        <!-- 右侧登录表单 -->
        <div class="login-form-container">
          <h2>Login</h2>
          
          <el-form :model="form" ref="form" label-position="top" class="login-form">
            <el-form-item label="Username">
              <el-input v-model="form.username" placeholder="Enter username" />
            </el-form-item>
  
            <el-form-item label="Password">
              <el-input type="password" v-model="form.password" placeholder="Enter password" />
            </el-form-item>
  
            <el-form-item>
              <el-button
                type="primary"
                @click="handleLogin"
                :loading="isLoading"
                class="login-button"
              >
                Login
              </el-button>
            </el-form-item>
          </el-form>
  
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ElMessage } from 'element-plus'; // 如果需要提示信息
  import axios from 'axios';
  
  export default {
    data() {
      return {
        form: {
          username: '',
          password: '',
        },
        isLoggedIn: false,
        errorMessage: '',
        isLoading: false,
      };
    },
    methods: {
      async handleLogin() {
        this.isLoading = true;
        this.errorMessage = '';
        
        try {
          // 模拟登录请求
          const response = await axios.post('/api/login', {
            username: this.form.username,
            password: this.form.password,
          });
  
          if (response.data.status === 200) {
            this.isLoggedIn = true;
            ElMessage.success(response.data.message);
            this.$router.push('/gen');
          } else {
            this.errorMessage = response.data.message;
          }
        } catch (error) {
          this.errorMessage = 'Login failed. Please try again.';
        } finally {
          this.isLoading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* 整个页面 */
  .login-page {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100vh; /* 让页面占满整个浏览器视口 */
  }
  
  /* 左侧图片部分 */
  .left-side {
    flex: 1;
    height: 100%;
    background: #f4f4f4; /* 可以设置一个背景色 */
  }
  
  .login-image {
    width: 100%; /* 图片宽度撑满左侧区域 */
    height: 100%;
    object-fit: cover; /* 确保图片按比例填充整个区域 */
  }
  
  /* 右侧表单部分 */
  .right-side {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: #e2eeef;
  }
  
  .login-form-container {
    width: 100%;
    max-width: 400px; /* 控制登录框最大宽度 */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(28, 23, 140, 0.1);
  }
  
  .login-form {
    width: 100%;
  }
  
  .login-button {
    width: 100%;
  }
  
  .error-message {
    color: red;
    text-align: center;
    margin-top: 10px;
  }

  </style>
  