<template lang="pug">
transition(name="popup-mask")
	.popup-mask(:style="styleObject" @click="clickHandler" v-if="!leave")
</template>
<script>
export default {
	name: 'PopupMask',
	inheritAttrs: false,
	props: {
		leave: {
			type: Boolean,
			default: false
		},
		zIndex: {
			type: Number
		},
		maskClickClose: {
			type: Boolean
		},
		animationDuration: {
			type: Number
		}
	},
	computed: {
		styleObject() {
			return {
				zIndex: this.zIndex,
				animationDuration: `${this.animationDuration / 1000}s`
			}
		}
	},
	methods: {
		clickHandler() {
			if (this.maskClickClose) {
				this.$emit('close')
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.popup-mask
	position fixed
	top 0
	right 0
	bottom 0
	left 0
	background-color rgba(0, 0, 0, 0.3)
	animation-name enter
.popup-mask-leave-active
	animation-name leave
@keyframes enter
	from
		opacity 0
	to
		opacity 1
@keyframes leave
	from
		opacity 1
	to
		opacity 0
</style>
