import Vue from 'vue'
import { definePlugin } from '@/index'

export default definePlugin({
	name: 'Test',
	install(defineProperty) {
		defineProperty('$test1', function () {
			this.render({
				component: Vue.extend({
					template: `<div>test1</div>`
				})
			})
		})
	}
})
