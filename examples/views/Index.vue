<template lang="pug">
.index
	p 版本：{{ Popup.version }}
</template>

<script>
import Popup from '@'

export default {
	name: 'Index',
	data() {
		return {
			Popup
		}
	},
	async mounted() {
		this.$popup.render({
			mark: false,
			component: () => import('@ex/views/Demo.vue')
		})
	}
}
</script>

<style lang="stylus" scoped></style>
