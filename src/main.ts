import './assets/main.css'
import 'element-plus/dist/index.css'
import 'normalize.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'

import App from './App.vue'
import router from './router'

// 引入 mock 数据配置
import './mock/mockData'

// 创建 Vue 实例
const app = createApp(App)

// 使用 ElementPlus、Pinia 和 Router
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

// 注册 ElementPlus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 挂载 Vue 应用
app.mount('#app')
