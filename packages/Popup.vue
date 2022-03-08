<template lang="pug">
.popup(v-if="!destroyed")
	PopupMask(
		:leave="leave"
		:zIndex="zIndex"
		@close="closeHandler"
		v-bind="originConfig"
	)
	PopupView(
		:Vue="Vue"
		:leave="leave"
		:zIndex="zIndex"
		@close="closeHandler"
		v-bind="originConfig"
	)
</template>
<script>
import PopupMask from './PopupMask.vue'
import PopupView from './PopupView.vue'

export default {
	name: 'Popup',
	components: {
		PopupMask: PopupMask,
		PopupView: PopupView
	},
	inheritAttrs: false,
	props: {
		Vue: {},
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
