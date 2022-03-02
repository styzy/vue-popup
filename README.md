# vue-popup

> 一款支持 Vue.js 2.x 版本的标签页路由框架

`vue-popup` 是一款适用于 `vue2` 的弹出层插件。

`vue-popup` 具有部署方便、可自由扩展、可针对需求二次开发的优点，内置的API满足大部分的开发需求。

## 安装

### npm

```
npm install -S @styzy/vue-popup
```

### yarn

```bash
yarn add @styzy/vue-popup
```

## 使用

### 引入

在 vue 实例化 `main.js` 中使用它

```javascript
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Popup from '@styzy/vue-popup'

Vue.config.productionTip = false

Vue.use(Popup)

Vue.prototype.$popup = new Popup()

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
```

### 调用

```javascript
// 组件内
this.$popup.open(options)
```

> 具体的 `options` 配置请参考API文档。

## 文档

开发中。。。
<!-- 所有的使用教程和 API 可以通过 [官方文档](http://vue-popup.styzy.cn) 进行查看 -->

## 示例

开发中。。。
<!-- 所有的示例已经集成在了 [官方文档](http://vue-popup.styzy.cn) 中。 -->
