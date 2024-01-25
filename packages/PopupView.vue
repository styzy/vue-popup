<template lang="pug">
transition
	.popup-view(
		:class="classObject"
		:style="styleObject"
		v-if="isShow && !isLeave"
	)
		component(
			:is="component"
			:key="`popup-view-component-${popupId}`"
			@close="handleComponentClose"
			@hook:mounted="handleComponentMounted"
			@resize="handleComponentResize"
			ref="component"
			v-bind="componentProps"
		)
</template>
<script>
import { ANIMATION_TYPES } from '../src/CONSTANTS'

export default {
	name: 'PopupView',
	props: {
		popupId: {
			type: String,
			default: ''
		},
		isLeave: {
			type: Boolean,
			default: false
		},
		zIndex: {
			type: Number
		},
		animations: {
			type: Array
		},
		animationDuration: {
			type: Number
		},
		component: {
			default: null
		},
		componentProps: {
			default: () => {
				return {}
			}
		},
		width: {
			type: [Number, String]
		},
		maxWidth: {
			type: [Number, String]
		},
		minWidth: {
			type: [Number, String]
		},
		height: {
			type: [Number, String]
		},
		maxHeight: {
			type: [Number, String]
		},
		minHeight: {
			type: [Number, String]
		}
	},
	data() {
		return {
			isShow: false,
			contentWidth: 0,
			contentHeight: 0,
			instance: null
		}
	},
	computed: {
		classObject() {
			return {
				[`animation-${ANIMATION_TYPES.FADE}`]: this.animations.includes(
					ANIMATION_TYPES.FADE
				),
				[`animation-${ANIMATION_TYPES.SCALE}`]:
					this.animations.includes(ANIMATION_TYPES.SCALE),
				[`animation-${ANIMATION_TYPES.FLY}`]: this.animations.includes(
					ANIMATION_TYPES.FLY
				)
			}
		},
		styleObject() {
			return {
				zIndex: this.zIndex,
				animationDuration: `${this.animationDuration / 1000}s`,
				width: this.formatSize(this.width) || `${this.contentWidth}px`,
				maxWidth: this.formatSize(this.maxWidth) || 'auto',
				minWidth: this.formatSize(this.minWidth) || 'auto',
				height:
					this.formatSize(this.height) || `${this.contentHeight}px`,
				maxHeight: this.formatSize(this.maxHeight) || 'auto',
				minHeight: this.formatSize(this.minHeight) || 'auto'
			}
		}
	},
	created() {
		window.setTimeout(() => {
			this.isShow = true
		}, 0)
	},
	methods: {
		async handleComponentMounted() {
			this.instance = this.$refs.component
			await this.instance.$nextTick()
			this.fixSize()
		},
		handleComponentClose(...args) {
			this.$emit('close', ...args)
		},
		handleComponentResize() {
			this.fixSize()
		},
		async fixSize() {
			await this.$nextTick()

			const { width, height } = this.getComponentSize()
			if (typeof this.width !== 'number') {
				this.contentWidth = width
			}
			if (typeof this.height !== 'number') {
				this.contentHeight = height
			}
		},
		getComponentSize() {
			const el = this.instance.$el,
				styles = window.getComputedStyle(el),
				isBorderBox = styles['boxSizing'] === 'border-box'

			let width = parseFloat(styles['width']),
				height = parseFloat(styles['height'])

			if (!isBorderBox) {
				width +=
					parseFloat(styles['paddingLeft']) +
					parseFloat(styles['paddingRight'])
				height +=
					parseFloat(styles['paddingTop']) +
					parseFloat(styles['paddingBottom'])
			}

			return {
				width,
				height
			}
		},
		formatSize(size) {
			if (typeof size === 'string') {
				if (size === 'auto') return false
				return size
			}

			if (typeof size === 'number') return `${size}px`

			return 'auto'
		}
	}
}
</script>

<style lang="stylus" scoped>
@import './animation.styl'

.popup-view
	useAnimation()

	position fixed
	top 0
	right 0
	bottom 0
	left 0
	margin auto
	animation-timing-function linear
	&>*
		display inline-block
</style>
