<template lang="pug">
.popup
	PopupMask(:zIndex="zIndex" @click="maskClickHandler" v-if="mask")
	Transition(name="popup-view")
		PopupView(
			:Vue="Vue"
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
	props: {
		Vue: {},
		id: {
			type: String,
			default: ''
		},
		zIndex: {
			type: Number,
			default: 1000
		},
		mask: {
			type: Boolean,
			default: true
		},
		maskClickClose: {
			type: Boolean,
			default: false
		},
		originConfig: {}
	},
	data() {
		return {
			destroyPayload: undefined
		}
	},
	methods: {
		maskClickHandler() {
			if (!this.maskClickClose) return
			this.closeHandler()
		},
		closeHandler(payload) {
			this.destroyPayload = payload
			this.$destroy()
		}
	},
	destroyed() {
		this.$emit('destroyed', this.destroyPayload)
	}
}
</script>

<style lang="stylus" scoped>
.popup-view-enter
	transform translate(0%, 0%)
.popup-view-enter-to
	transform translate(100%, 100%)
.popup-view-leave
	transform translate(100%, 100%)
.popup-view-leave-to
	transform translate(0%, 0%)
</style>
