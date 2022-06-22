<template lang="pug">
.popup(v-if="!destroyed")
	PopupMask(
		:isLeave="isLeave"
		@close="closeHandler"
		v-bind="maskProps"
		v-if="mask"
	)
	PopupView(:isLeave="isLeave" @close="closeHandler" v-bind="viewProps")
</template>
<script>
import PopupMask from './PopupMask'
import PopupView from './PopupView'

export default {
	name: 'Popup',
	components: {
		PopupMask,
		PopupView
	},
	// inheritAttrs: false,
	data() {
		return {
			isLeave: false,
			destroyed: false,
			destroyPayload: undefined,
			mask: null,
			animationDuration: null,
			maskProps: null,
			viewProps: null
		}
	},
	mounted() {
		this.$emit('mounted')
	},
	destroyed() {
		this.$emit('destroyed', this.destroyPayload)
	},
	methods: {
		destroy() {
			this.closeHandler()
		},
		async closeHandler(payload) {
			this.destroyPayload = payload
			this.isLeave = true

			await this.wait(this.animationDuration)

			this.destroyed = true

			await this.$nextTick()

			this.$destroy()
		},
		wait(time) {
			return new Promise(resolve => {
				window.setTimeout(resolve, time)
			})
		}
	}
}
</script>
