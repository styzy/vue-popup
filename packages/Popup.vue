<template lang="pug">
.popup
	PopupMask(:zIndex="zIndex" @click="maskClickHandler" v-if="mask")
	PopupView(
		:Vue="Vue"
		:zIndex="zIndex"
		@close="closeHandler"
		v-bind="originConfig"
	)
</template>
<script>
export default {
	name: 'Popup',
	components: {
		PopupMask: () => import('./PopupMask.vue'),
		PopupView: () => import('./PopupView.vue')
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

<style lang="stylus" scoped></style>
