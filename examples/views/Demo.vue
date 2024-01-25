<template lang="pug">
.demo
	h1 这是一个demo
	br
	button(@click="$emit('close')") close
	br
	button(@click="$emit('resize')") resize
</template>

<script>
export default {
	name: 'Demo'
}
</script>

<style lang="stylus" scoped>
.demo
	width 300px
	height 300px
	background-color #0183da
	color #FFFFFF
</style>
