import type Vue from 'vue'
import type { Component, PluginFunction, VueConstructor } from 'vue'
import _Popup from '../packages/Popup.vue'
import { ANIMATION_TYPES, AnimationType } from './CONSTANTS'
import { typeOf, deepClone } from './utils'
import PACKAGE_JSON from '../package.json'

type VuePopupPlugin = {
	/**
	 * 插件名称
	 */
	name: string
	/**
	 * 插件安装函数
	 * - 提供两个参数
	 *   - 第一个参数为 Popup 类
	 *   - 第二个参数为 Vue 构造函数
	 */
	install: VuePopupInstall
}

export function definePlugin<TPlugin extends VuePopupPlugin>(
	plugin: TPlugin
): TPlugin {
	return plugin
}

type VuePopupInstall = (_Popup: typeof Popup, Vue: VueConstructor) => void

type VuePopupOptions = {
	/**
	 * 全局的 z-index 层级，默认值为 1000
	 * - 每个弹框渲染都会自动递增这个值
	 */
	zIndex?: number
}

type VuePopupRenderOptions = {
	/**
	 * 是否显示遮罩层
	 */
	mask?: boolean
	/**
	 * 是否点击遮罩层关闭弹窗
	 */
	maskClickClose?: boolean
	/**
	 * 弹窗组件
	 * - 可以使用组件或异步组件
	 * - 使用示例：
	 * ```
	 * // 同步组件
	 * import MyComponent from './MyComponent.vue'
	 * popup.render({
	 * 	component: MyComponent
	 * })
	 * ```
	 * ```
	 * // 异步组件
	 * popup.render({
	 * 	component: () => import('./MyComponent.vue')
	 * })
	 * ```
	 */
	component: Component
	/**
	 * 弹窗组件的 props
	 * - 可以传递任意 props 给弹窗组件
	 */
	componentProps?: Record<string, any>
	/**
	 * 弹窗遮罩的动画类型
	 * - 默认值为 [ANIMATION_TYPES.FADE]
	 * - 可以设置为 [ANIMATION_TYPES.FADE, ANIMATION_TYPES.SLIDE] 等
	 */
	maskAnimations?: Array<AnimationType>
	/**
	 * 弹窗视图的动画类型
	 * - 默认值为 [ANIMATION_TYPES.FADE]
	 * - 可以设置为 [ANIMATION_TYPES.FADE, ANIMATION_TYPES.SLIDE] 等
	 */
	viewAnimations?: Array<AnimationType>
	/**
	 * 弹窗动画的持续时间，单位为毫秒
	 * - 默认值为 300
	 */
	animationDuration?: number
	/**
	 * 弹窗的宽度
	 * - 默认值为 'auto'
	 */
	width?: string | number
	/**
	 * 弹窗的最大宽度
	 * - 默认值为 'auto'
	 */
	maxWidth?: string | number
	/**
	 * 弹窗的最小宽度
	 * - 默认值为 'auto'
	 */
	minWidth?: string | number
	/**
	 * 弹窗的高度
	 * - 默认值为 'auto'
	 */
	height?: string | number
	/**
	 * 弹窗的最大高度
	 * - 默认值为 'auto'
	 */
	maxHeight?: string | number
	/**
	 * 弹窗的最小高度
	 * - 默认值为 'auto'
	 */
	minHeight?: string | number
	/**
	 * 弹窗挂载完成后的回调函数
	 */
	mounted?: (instance: Vue) => void
	/**
	 * 弹窗销毁后的回调函数
	 */
	destroyed?: (payload?: any) => void
	/**
	 * 弹窗的 z-index 层级
	 * - 默认自动从全局的 z-index 层级递增
	 */
	zIndex?: number
}

declare class VuePopup {
	/**
	 * 版本号
	 */
	static get version(): string
	/**
	 * 安装函数，提供给 Vue.use() 安装插件
	 */
	static install: PluginFunction<void>
	/**
	 * 安装插件
	 * @param plugin 插件对象
	 */
	static usePlugin(plugin: VuePopupPlugin): void
	constructor(options?: VuePopupOptions)
	/**
	 * 渲染弹窗
	 * @param options 弹窗渲染选项
	 * @returns 关闭弹窗的函数
	 * - 调用该函数可以关闭弹窗
	 * - 使用示例：
	 * ```
	 * const close = popup.render({
	 * 	component: MyComponent
	 * })
	 * // 关闭弹窗
	 * close()
	 * ```
	 */
	render(options: VuePopupRenderOptions): () => void
}

type PopupInstance = {
	id: string
	instance?: InstanceType<VueConstructor>
}

let _Vue: VueConstructor, rootVm: Vue

export default class Popup implements VuePopup {
	static get version() {
		return PACKAGE_JSON.version
	}
	static get ANIMATION_TYPES() {
		return deepClone(ANIMATION_TYPES)
	}
	static _usePlugin({ name, install }: VuePopupPlugin) {
		this.plugins[name] = install

		install(Popup, _Vue)
	}
	static install(Vue: VueConstructor) {
		_Vue = Vue

		_Vue.mixin({
			created() {
				if (rootVm) return
				rootVm = (this as any).$root
			}
		})
	}
	static usePlugin(plugin: VuePopupPlugin) {
		if (!plugin) return

		if (!_Vue)
			throw new Error(
				'Popup should be installed by Vue before install plugins'
			)

		if (this.plugins[plugin.name])
			throw new Error(`Popup: exist plugin name: ${plugin.name}`)

		if (typeOf(plugin.install) !== 'Function')
			throw new Error(`Popup: plugin's prop install must be a function`)

		this._usePlugin(plugin)
	}
	static plugins: Record<string, VuePopupInstall> = {}
	private _seed = 0
	private _zIndex: number
	private _popups: Record<string, PopupInstance> = {}
	get seed() {
		return this._seed++
	}
	get zIndex() {
		return this._zIndex++
	}
	get popups() {
		return this._popups
	}
	constructor({ zIndex = 1000 } = {} as VuePopupOptions) {
		if (!_Vue)
			throw new Error(
				'Popup should be installed by Vue before new Popup()'
			)

		this._seed = 0
		this._zIndex = zIndex
		this._popups = {}
	}
	_destroy(popup: PopupInstance) {
		if (!this.popups[popup.id]) return

		const { instance } = popup

		if (!instance) return
		;(instance as any).destroy()
	}
	render(
		{
			zIndex = this.zIndex,
			mask = true,
			maskClickClose = false,
			component,
			componentProps,
			maskAnimations = [ANIMATION_TYPES.FADE],
			viewAnimations = [ANIMATION_TYPES.FADE, ANIMATION_TYPES.SCALE],
			animationDuration = 100,
			width = 'auto',
			maxWidth = 'auto',
			minWidth = 'auto',
			height = 'auto',
			maxHeight = 'auto',
			minHeight = 'auto',
			mounted,
			destroyed
		} = {} as VuePopupRenderOptions
	) {
		const el = document.body.appendChild(document.createElement('div'))
		const Constructor = _Vue.extend(Object.assign({}, _Popup, { rootVm }))
		const instance = new Constructor({
			propsData: {
				mask,
				animationDuration,
				maskProps: {
					zIndex,
					maskClickClose,
					animations: maskAnimations,
					animationDuration
				},
				viewProps: {
					zIndex,
					component,
					componentProps,
					animations: viewAnimations,
					animationDuration,
					width,
					maxWidth,
					minWidth,
					height,
					maxHeight,
					minHeight
				}
			}
		})

		const popup: PopupInstance = {
			id: `styzy-vue-popup-${this.seed}`,
			instance
		}

		this.popups[popup.id] = popup

		instance.$on('mounted', () => {
			mounted?.call(null, instance)
		})

		instance.$on('destroyed', (payload: any) => {
			destroyed?.call(null, payload)

			const parentNode = instance.$el.parentNode

			if (parentNode) {
				parentNode.removeChild(instance.$el)
			}

			delete this.popups[popup.id]
		})

		instance.$mount(el)

		return () => {
			this._destroy(popup)
		}
	}
}
