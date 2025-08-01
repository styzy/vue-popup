import Vue from 'vue'
import Popup from '@/index'
// import Plugin from '../Plugins'

// Popup.use(Plugin)

Vue.use(Popup)

export const popup = new Popup({
	zIndex: 9000
})
