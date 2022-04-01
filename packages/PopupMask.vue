<template lang="pug">
transition
	.popup-mask(
		:class="classObject"
		:style="styleObject"
		@click="clickHandler"
		v-if="isShow && !isLeave"
	)
</template>
<script>
import { ANIMATION_TYPES } from '../src/CONSTANTS'

export default {
	name: 'PopupMask',
	inheritAttrs: false,
	props: {
		isLeave: {
			type: Boolean,
			default: false
		},
		zIndex: {
			type: Number
		},
		maskClickClose: {
			type: Boolean
		},
		animations: {
			type: Array
		},
		animationDuration: {
			type: Number
		}
	},
	data() {
		return {
			isShow: false
		}
	},
	computed: {
		classObject() {
			return {
				[`animation-${ANIMATION_TYPES.FADE}`]: this.animations.includes(
					ANIMATION_TYPES.FADE
				),
				[`animation-${ANIMATION_TYPES.SCALE}`]:
					this.animations.includes(ANIMATION_TYPES.SCALE)
			}
		},
		styleObject() {
			return {
				zIndex: this.zIndex,
				animationDuration: `${this.animationDuration / 1000}s`
			}
		}
	},
	created() {
		window.setTimeout(() => {
			this.isShow = true
		}, 0)
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
@import './animation.styl'

.popup-mask
	useAnimation()

	position fixed
	top 0
	right 0
	bottom 0
	left 0
	background-color rgba(0, 0, 0, 0.3)
	animation-timing-function linear
</style>
