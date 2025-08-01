<template lang="pug">
.index
	.title.large @styzy/vue-popup
	.title Vue弹出层插件
	.info 版本：{{ Popup.version }}
	.info 作者：styzy
	.info Github：
		a(href="https://github.com/styzy/vue-popup" target="_blank") https://github.com/styzy/vue-popup
	.info 文档：
		a(
			href="https://github.com/styzy/vue-popup/blob/master/README.md"
			target="_blank"
		) https://github.com/styzy/vue-popup/blob/master/README.md
	.title.large 示例
	.title 基础功能
	.title.sub 默认
	button(@click="handlePopup()") 打开弹出层
	.des 通过调用 render() 方法即可打开弹出层。
	.title.sub 无遮罩层
	button(@click="handlePopupWithoutMask()") 打开弹出层
	.des 通过将 mask 属性设置为 false 即可不渲染遮罩层，默认为 true。
	.title.sub 全屏
	button(@click="handlePopupFullScreen()") 打开弹出层
	.des 通过将 width 和 height 属性设置为 100% 即可实现全屏弹出层。
	.title 动画示例
	.des 遮罩层默动画为 淡入淡出，弹出层视图默认动画为 淡入淡出 + 缩放，所有动画参数为数组类型，可以自由组合。
	.title.sub 缩放
	button(@click="handlePopupScale()") 打开弹出层
	.des 通过将 viewAnimations 属性设置为 [Popup.ANIMATION_TYPES.SCALE] 即可实现缩放效果。
	.title.sub 淡入淡出
	button(@click="handlePopupFade()") 打开弹出层
	.des 通过将 viewAnimations 属性设置为 [Popup.ANIMATION_TYPES.FADE] 即可实现淡入淡出效果。
	.title.sub 飞入
	button(@click="handlePopupFly()") 打开弹出层
	.des 通过将 viewAnimations 属性设置为 [Popup.ANIMATION_TYPES.FLY] 即可实现飞入效果。
	.title.sub 设置动画持续时间
	.des 通过 animationDuration 属性即可设置动画持续时间，单位：毫秒，默认为 100 毫秒。
	button(@click="handlePopupDuration()") 打开弹出层
	.title.large API 文档
	.title Popup(options : Object) : popup - 插件实例
	.des 使用弹出层功能前，需要实例化插件，通过实例化参数，可以进行一些基础设置
	.title.sub options.zIndex : Number
	.des 用于设置弹出层的层级起始值，默认为 1000 ，所有弹出层将会从这个值开始往上递增
	.title.sub options.parentVm : VueComponent
	.des 用于设置弹出层默认挂载节点，默认为 document.body
	.title Function() close : popup.render(options : Object) - 打开弹出层
	.des 通过调用该方法，可以打开弹出层，该方法支持传入多个参数，用于自定义弹出层。该方法的返回值是一个函数，执行该函数可以关闭弹出层
	.title.sub options.component : VueComponent || ()=>VueComponent
	.des 用于传入一个用于渲染的组件，或者是一个异步组件的加载函数，默认为 null
	.title.sub options.componentProps : Object
	.des 用于给组件传入 props ，默认为 {}
	.title.sub options.width : String
	.des 用于设置弹出层宽度，默认为 auto
	.title.sub options.minWidth : String
	.des 用于设置弹出层最小宽度，默认为 auto
	.title.sub options.maxWidth : String
	.des 用于设置弹出层最大宽度，默认为 auto
	.title.sub options.height : String
	.des 用于设置弹出层高度，默认为 auto
	.title.sub options.minHeight : String
	.des 用于设置弹出层最小高度，默认为 auto
	.title.sub options.maxHeight : String
	.des 用于设置弹出层最大高度，默认为 auto
	.title.sub options.mask : Boolean
	.des 用于设置是否渲染遮罩层，默认为 true
	.title.sub options.maskClickClose : Boolean
	.des 用于设置遮罩层是否可以点击关闭弹出层，默认为 false
	.title.sub options.viewAnimations : Array
	.des 用于设置弹出层视图动画，默认为 [Popup.ANIMATION_TYPES.FADE, Popup.ANIMATION_TYPES.SCALE]
	.title.sub options.maskAnimations Array
	.des 用于设置遮罩层动画，默认为 [Popup.ANIMATION_TYPES.FADE]
	.title.sub options.animationDuration : Number
	.des 用于设置动画持续时间，单位：毫秒，默认为 100 毫秒
	.title.sub options.zIndex : Number
	.des 用于设置弹出层层级，默认为 Popup 实例所设置的 zIndex 属性值，并且会往上递增
	.title.sub options.mounted : Function
	.des 用于设置弹出层渲染完成后的回调函数
	.title.sub options.destroyed : Function
	.des 用于设置弹出层销毁后的回调函数
</template>

<script>
import Popup from '@'
import { popup } from '@ex/popup'

export default {
	name: 'Index',
	data() {
		return {
			Popup
		}
	},
	methods: {
		handlePopup() {
			popup.render({
				component: () => import('@ex/views/Demo.vue')
			})
		},
		handlePopupWithoutMask() {
			popup.render({
				mask: false,
				component: () => import('@ex/views/Demo.vue')
			})
		},
		handlePopupFullScreen() {
			popup.render({
				width: '100%',
				height: '100%',
				component: () => import('@ex/views/DemoFullScreen.vue')
			})
		},
		handlePopupScale() {
			popup.render({
				viewAnimations: [Popup.ANIMATION_TYPES.SCALE],
				component: () => import('@ex/views/Demo.vue')
			})
		},
		handlePopupFade() {
			popup.render({
				viewAnimations: [Popup.ANIMATION_TYPES.FADE],
				component: () => import('@ex/views/Demo.vue')
			})
		},
		handlePopupFly() {
			popup.render({
				viewAnimations: [Popup.ANIMATION_TYPES.FLY],
				component: () => import('@ex/views/Demo.vue')
			})
		},
		handlePopupDuration() {
			popup.render({
				animationDuration: 1000,
				component: () => import('@ex/views/Demo.vue')
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.index
	display flex
	flex-direction column
	align-items flex-start
	padding 20px
	gap 20px
	.title
		padding 10px 0
		color #424242
		font-weight 700
		font-size 28px
		&.large
			padding 20px 0
			font-size 36px
		&.sub
			padding 0
			font-size 20px
	.info
		font-weight 700
		font-size 16px
	.des
		padding 10px 20px
		border-radius 5px
		background-color #F7F7F7
		color #333333
		&:before
			content '说明：'
</style>
