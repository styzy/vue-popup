<template lang="pug">
.popup-mask(:style="{ zIndex: zIndex }" @click="$emit('click')")
</template>
<script>
export default {
	name: 'PopupMask',
	props: {
		zIndex: {
			type: Number
		}
	}
}
</script>

<style lang="stylus">
.popup-mask
	position fixed
	top 0
	right 0
	bottom 0
	left 0
	background-color rgba(0, 0, 0, 0.3)
</style>
