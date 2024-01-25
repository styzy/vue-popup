import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

let routes = [
	{
		path: '/',
		name: 'Index',
		component: () => import('@ex/views/Index')
	}
]

const router = new VueRouter({
	routes
})

export default router
