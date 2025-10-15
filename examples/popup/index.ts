import Vue from 'vue'
import Popup from '@/index'
import Plugin from '../Plugins'

Popup.usePlugin(Plugin)

Vue.use(Popup)

export const popup = new Popup({
	zIndex: 9000
})

popup.test()
