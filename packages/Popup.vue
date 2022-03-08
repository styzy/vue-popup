<template lang="pug">
.popup(v-if="!needDestroy")
	PopupMask(:zIndex="zIndex" @click="maskClickHandler" v-if="mask")
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
			needDestroy: false,
			destroyPayload: undefined
		}
	},
	methods: {
		maskClickHandler() {
			if (!this.maskClickClose) return
			this.closeHandler()
		},
		async closeHandler(payload) {
			this.destroyPayload = payload
			this.needDestroy = true
			await this.$nextTick()
			this.$destroy()
		}
	},
	destroyed() {
		this.$emit('destroyed', this.destroyPayload)
	}
}
</script>
