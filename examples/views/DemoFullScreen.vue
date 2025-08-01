<template lang="pug">
.demo-full-screen
	h1 这是一个全屏弹框
	br
	button(@click="$emit('close')") 关闭弹框
</template>

<script>
export default {
	name: 'DemoFullScreen'
}
</script>

<style lang="stylus" scoped>
.demo-full-screen
	display flex
	flex-direction column
	align-items center
	overflow hidden
	height 100%
	background-color #0183da
	color #FFFFFF
</style>
