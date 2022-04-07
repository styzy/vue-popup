<template lang="pug">
transition
	.popup-view(
		:class="classObject"
		:style="styleObject"
		v-if="isShow && !isLeave"
	)
		component(
			:is="componentConfig"
			:key="`popup-view-component-${popupId}`"
			v-bind="componentProps"
		)
		//- div(ref="component")
</template>
<script>
import Vue from 'vue'
import { ANIMATION_TYPES } from '../src/CONSTANTS'
import { deepClone } from '../src/utils'

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
			type: [Object, Function]
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
			componentConfig: null,
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
				width: this.sizeFormat(this.width) || `${this.contentWidth}px`,
				maxWidth: this.sizeFormat(this.maxWidth) || 'auto',
				minWidth: this.sizeFormat(this.minWidth) || 'auto',
				height:
					this.sizeFormat(this.height) || `${this.contentHeight}px`,
				maxHeight: this.sizeFormat(this.maxHeight) || 'auto',
				minHeight: this.sizeFormat(this.minHeight) || 'auto'
			}
		}
	},
	created() {
		window.setTimeout(() => {
			this.isShow = true
		}, 0)

		this.renderComponent()
	},
	methods: {
		async renderComponent1() {
			const that = this

			let config = this.component
			if (typeof config === 'function') {
				config = (await config()).default
			}

			config = deepClone(config)

			config.mixins = config.mixins || []

			config.mixins.push({
				beforeCreate() {
					that.instance = this

					this.$on('close', (...args) => {
						that.$emit('close', ...args)
					})

					this.$on('resize', () => {
						that.sizeFix()
					})
				},
				async mounted() {
					await this.$nextTick()
					this.$emit('resize')
				}
			})

			this.instance = new Vue(
				Object.assign({}, config, {
					parent: this,
					propsData: Object.assign({}, this.componentProps, {
						key: `popup-view-component-${this.popupId}`
					})
				})
			).$mount(this.$refs.component)
		},
		async renderComponent() {
			const that = this

			let config = this.component
			if (typeof config === 'function') {
				config = (await config()).default
			}

			config = deepClone(config)

			config.mixins = config.mixins || []

			config.mixins.push({
				beforeCreate() {
					that.instance = this

					this.$on('close', (...args) => {
						that.$emit('close', ...args)
					})

					this.$on('resize', () => {
						that.sizeFix()
					})
				},
				async mounted() {
					await this.$nextTick()
					this.$emit('resize')
				}
			})

			this.componentConfig = config
		},
		async sizeFix() {
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
		sizeFormat(size) {
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
