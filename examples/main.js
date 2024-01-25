import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/stylus/index.styl'

Vue.config.productionTip = false

import Popup from '@'
// import Plugin from './Plugins'

Vue.use(Popup)

// Popup.use(Plugin)

Vue.prototype.$popup = new Popup({
	zIndex: 9000
})

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')
