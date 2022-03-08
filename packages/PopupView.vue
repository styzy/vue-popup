<template lang="pug">
.popup-view(:class="{ 'popup-view-leave': leave }" :style="styleObject")
	component(:is="componentConfig" v-bind="componentProps")
</template>
<script>
import { deepClone } from '../src/utils'

export default {
	name: 'PopupView',
	props: {
		Vue: {},
		component: {
			type: [Object, Function]
		},
		componentProps: {
			default: () => {
				return {}
			}
		},
		animationDuration: {
			type: Number,
			default: 100
		},
		zIndex: {
			type: Number
		},
		width: {
			type: [Number, String],
			default: 'auto'
		},
		maxWidth: {
			type: [Number, String],
			default: 'auto'
		},
		minWidth: {
			type: [Number, String],
			default: 'auto'
		},
		height: {
			type: [Number, String],
			default: 'auto'
		},
		maxHeight: {
			type: [Number, String],
			default: 'auto'
		},
		minHeight: {
			type: [Number, String],
			default: 'auto'
		}
	},
	data() {
		return {
			leave: false,
			contentWidth: 0,
			contentHeight: 0,
			componentConfig: null,
			instance: null
		}
	},
	computed: {
		styleObject() {
			return {
				zIndex: this.zIndex + 1,
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
		this.renderComponent()
	},
	methods: {
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
						that.leave = true
						window.setTimeout(() => {
							that.$emit('close', ...args)
						}, that.animationDuration)
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

<style lang="stylus">
.popup-view
	position fixed
	top 0
	right 0
	bottom 0
	left 0
	margin auto
	animation-name enter
	&.popup-view-leave
		opacity 0
		transform scale(0)
		animation-name leave
	&>*
		display inline-block
@keyframes enter
	from
		opacity 0
		transform scale(0)
	to
		opacity 1
		transform scale(1)
@keyframes leave
	from
		opacity 1
		transform scale(1)
	to
		opacity 0
		transform scale(0)
</style>
