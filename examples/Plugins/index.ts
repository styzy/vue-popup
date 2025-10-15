import { definePlugin } from '@/index'

export default definePlugin({
	name: 'Test',
	install(Popup, Vue) {
		// console.log('plugin install ')
		// console.log('Popup: ', Popup)
		// console.log('Vue: ', Vue)
		Popup.prototype.$test = function (message: string) {
			// console.log('this: ', this)
			this.render({
				component: Vue.extend({
					template: `<div>${message}</div>`
				})
			})
		}
	}
})
