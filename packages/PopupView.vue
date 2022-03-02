<template lang="pug">
.popup-view(:style="styleObject")
	div(ref="content")
</template>
<script>
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
		zIndex: {
			type: Number
		},
		width: {
			type: Number
		},
		maxWidth: {
			type: Number
		},
		minWidth: {
			type: Number
		},
		height: {
			type: Number
		},
		maxHeight: {
			type: Number
		},
		minHeight: {
			type: Number
		}
	},
	data() {
		return {
			contentWidth: 0,
			contentHeight: 0,
			instance: null
		}
	},
	computed: {
		styleObject() {
			return {
				zIndex: this.zIndex + 1,
				width: this.width
					? `${this.width}px`
					: `${this.contentWidth}px`,
				maxWidth: this.maxWidth ? `${this.maxWidth}px` : 'auto',
				minWidth: this.minWidth ? `${this.minWidth}px` : 'auto',
				height: this.height
					? `${this.height}px`
					: `${this.contentHeight}px`,
				maxHeight: this.maxHeight ? `${this.maxHeight}px` : 'auto',
				minHeight: this.minHeight ? `${this.minHeight}px` : 'auto'
			}
		}
	},
	created() {
		this.renderComponent()
	},
	methods: {
		async renderComponent() {
			let config = this.component
			if (typeof config === 'function') {
				config = (await config()).default
			}

			const Constructor = this.Vue.extend(config)

			this.instance = new Constructor({
				propsData: this.componentProps
			})

			this.instance.$on('close', (...args) => {
				this.$emit('close', ...args)
			})

			this.instance.$mount(this.$refs.content)

			await this.$nextTick()

			this.sizeFix()
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
				styles = window.getComputedStyle(el)

			return {
				width: parseFloat(styles['width']),
				height: parseFloat(styles['height'])
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.popup-view
	position fixed
	top 0
	right 0
	bottom 0
	left 0
	margin auto
	box-shadow 1px 1px 50px rgba(0, 0, 0, 0.3)
</style>
