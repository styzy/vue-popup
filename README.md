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

### 初始化

```javascript
import Vue from 'vue'
import Popup from '@styzy/vue-popup'

Vue.use(Popup)

const popup = new Popup({
    // 默认值：1000
    zIndex: 5000,
})
```

### 调用

```javascript
// 打开弹出层
const close = popup.render({
    component: () => import('path/Test.vue')
})

// 关闭弹出层
close()
```

## 文档

所有的使用教程和 API 可以通过 [官方文档](http://vue-popup.styzy.cn/#/) 进行查看
