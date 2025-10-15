import { definePlugin } from '@/index'

export default definePlugin({
	name: 'Test',
	install(Popup, Vue) {
		// console.log('Vue: ', Vue)
		// console.log('plugin install ')
		// console.log('Popup: ', Popup)
		// console.log('Vue: ', Vue)
		Popup.prototype.render = 1
		Popup.prototype.$test1 = []
		Popup.prototype.$test = function (message: string) {
			// console.log('this: ', this)
			this.render({
				// component: () => import('../views/Demo.vue')
				component: Vue.extend({
					data() {
						return {
							message
						}
					},
					template: `<div>${message}</div>`
				})
			})
		}
	}
})
