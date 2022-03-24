<template lang="pug">
.popup(v-if="!destroyed")
	PopupMask(
		:leave="leave"
		:zIndex="zIndex"
		@close="closeHandler"
		v-bind="originConfig"
	)
	PopupView(
		:leave="leave"
		:zIndex="zIndex"
		@close="closeHandler"
		v-bind="originConfig"
	)
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
	inheritAttrs: false,
	props: {
		id: {
			type: String,
			default: ''
		},
		zIndex: {
			type: Number
		},
		animationDuration: {
			type: Number
		},
		originConfig: {}
	},
	data() {
		return {
			leave: false,
			destroyed: false,
			destroyPayload: undefined
		}
	},
	methods: {
		destroy() {
			this.closeHandler()
		},
		async closeHandler(payload) {
			this.destroyPayload = payload
			this.leave = true

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
	},
	destroyed() {
		this.$emit('destroyed', this.destroyPayload)
	}
}
</script>
