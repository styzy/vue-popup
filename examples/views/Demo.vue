<template lang="pug">
.demo(:style="{ width: width, height: height }")
	h1 这是一个demo
	br
	button(@click="$emit('close')") close
	br
	button(@click="$emit('resize')") resize
	button(@click="handlerResize") 修改大小
</template>

<script>
export default {
	name: 'Demo',
	data() {
		return {
			width: '300px',
			height: '300px'
		}
	},
	methods: {
		handlerResize() {
			this.height = '500px'
		}
	}
}
</script>

<style lang="stylus" scoped>
.demo
	overflow hidden
	width 300px
	height 300px
	background-color #0183da
	color #FFFFFF
</style>
